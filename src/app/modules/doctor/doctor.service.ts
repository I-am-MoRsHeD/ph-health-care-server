import { Prisma } from "@prisma/client";
import calculatedPagination from "../../helpers/paginationHelpers";
import { doctorSearchableFields } from "./doctor.constant";
import { prisma } from "../../shared/prisma";
import ApiError from "../../errorHelpers/ApiError";
import { TDoctorWhereInput } from "./doctor.interface";
import httpsCode from 'http-status';
import { openai } from "../../helpers/open-router";
import { parseAIResponse } from "../../helpers/parseAIResponse";


const getDoctor = async (id: string) => {
    const existingDoctor = await prisma.doctor.findFirstOrThrow({
        where: {
            id
        }
    });

    if (!existingDoctor) {
        throw new ApiError(404, "Doctor doesn't exist!");
    };

    return existingDoctor;
};

const getAllFromDB = async (options: any, filters: any) => {
    const { page, limit, skip, sortBy, sortOrder } = calculatedPagination(options);
    const { searchTerm, specialties, ...filterData } = filters;

    const andConditions: Prisma.DoctorWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: doctorSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive'
                }
            }))
        })
    };

    if (specialties && specialties.length > 0) {
        andConditions.push({
            doctorSpecialties: {
                some: {
                    specialities: {
                        title: {
                            contains: specialties,
                            mode: 'insensitive'
                        }
                    }
                }
            }
        })
    }

    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.keys(filterData).map((key) => ({
            [key]: {
                equals: (filterData)[key]
            }
        }));

        andConditions.push(...filterConditions);
    };


    const result = await prisma.doctor.findMany({
        where: {
            AND: andConditions
        },
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder
        },
        include: {
            doctorSpecialties: {
                include: {
                    specialities: true
                }
            }
        }
    });

    const total = await prisma.doctor.count({
        where: {
            AND: andConditions
        }
    });

    return {
        meta: {
            total,
            limit,
            page,
        },
        data: result
    }
};

const getAISuggesstion = async (payload: { symptoms: string }) => {
    if (!(payload && payload.symptoms)) {
        throw new ApiError(httpsCode.BAD_REQUEST, "Symptoms is required!")
    };

    const doctors = await prisma.doctor.findMany({
        where: { isDeleted: false },
        include: {
            doctorSpecialties: {
                include: {
                    specialities: true
                }
            }
        }
    });

    // 3. Build the AI prompt
    const prompt = `
You are an AI medical assistant that suggests doctors based on patient symptoms,suggest the top 3 most suitable doctors.
Each doctor has specialties and years of experience.
Only suggest doctors who are relevant to the given symptoms.

Symptoms: ${payload.symptoms}

Here is a list of doctors with their specialties and experience:
${JSON.stringify(doctors, null, 2)}

Return your response in JSON format with full individual doctor data.
`;

    const completion = await openai.chat.completions.create({
        model: 'z-ai/glm-4.5-air:free',
        messages: [
            {
                role: "system",
                content: "You are an AI that recommends doctors based on symptoms.",
            },
            {
                role: 'user',
                content: prompt,
            },

        ],
    });

    const data = completion?.choices?.[0]?.message?.content;
    const result = await parseAIResponse(data as string);
    return result;
};

const updateIntoDB = async (id: string, payload: Partial<TDoctorWhereInput>) => {
    const existingDoctor = await prisma.doctor.findFirstOrThrow({
        where: {
            id
        }
    });

    if (!existingDoctor) {
        throw new ApiError(404, "Doctor doesn't exist!");
    };

    const { specialties, ...restUpdatedData } = payload;

    if (specialties && specialties.length > 0) {

        const deleteSpecialtyIds = specialties.filter(specialty => specialty.isDeleted);
        for (const specialty of deleteSpecialtyIds) {
            await prisma.doctorSpecialties.deleteMany({ // ekta ekta kore delete hobe,tobuo deleteMany use korte hobe unique er error er jonno
                where: {
                    doctorId: id,
                    specialitiesId: specialty.specialtyId
                }
            })
        };

        const createSpecialtyIds = specialties.filter(specialty => !specialty.isDeleted);
        for (const specialty of createSpecialtyIds) {
            await prisma.doctorSpecialties.create({
                data: {
                    doctorId: id,
                    specialitiesId: specialty.specialtyId
                }
            })
        };
    };

    const updatedData = await prisma.doctor.update({
        where: {
            id
        },
        data: restUpdatedData,
        include: {
            doctorSpecialties: {
                include: {
                    specialities: true
                }
            }
        }
    });

    return updatedData;
};

const deleteDoctor = async (id: string) => {
    const existingDoctor = await prisma.doctor.findFirstOrThrow({
        where: {
            id
        }
    });

    if (!existingDoctor) {
        throw new ApiError(404, "Doctor doesn't exist!");
    };

    const result = await prisma.doctor.delete({
        where: {
            id
        }
    });

    return result;
};

export const DoctorService = {
    getDoctor,
    getAllFromDB,
    getAISuggesstion,
    updateIntoDB,
    deleteDoctor
}