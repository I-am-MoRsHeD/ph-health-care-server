import { Doctor, Prisma } from "@prisma/client";
import calculatedPagination from "../../helpers/paginationHelpers";
import { doctorSearchableFields } from "./doctor.constant";
import { prisma } from "../../shared/prisma";
import ApiError from "../../errorHelpers/ApiError";
import { TDoctorWhereInput } from "./doctor.interface";


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

export const DoctorService = {
    getAllFromDB,
    updateIntoDB
}