import { Patient, Prisma } from "@prisma/client";
import calculatedPagination from "../../helpers/paginationHelpers";
import { prisma } from "../../shared/prisma";
import ApiError from "../../errorHelpers/ApiError";
import { patientSearchableFields } from "./patient.constant";


const getPatient = async (id: string) => {
    const existingPatient = await prisma.patient.findFirstOrThrow({
        where: {
            id
        }
    });

    if (!existingPatient) {
        throw new ApiError(404, "Patient doesn't exist!");
    };

    return existingPatient;
};

const getAllFromDB = async (options: any, filters: any) => {
    const { page, limit, skip, sortBy, sortOrder } = calculatedPagination(options);
    const { searchTerm, ...filterData } = filters;

    const andConditions: Prisma.PatientWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: patientSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive'
                }
            }))
        })
    };


    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.keys(filterData).map((key) => ({
            [key]: {
                equals: (filterData)[key]
            }
        }));

        andConditions.push(...filterConditions);
    };


    const result = await prisma.patient.findMany({
        where: {
            AND: andConditions
        },
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder
        }
    });

    const total = await prisma.patient.count({
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

const updateIntoDB = async (id: string, payload: Partial<Patient>) => {
    const existingPatient = await prisma.patient.findFirstOrThrow({
        where: {
            id
        }
    });

    if (!existingPatient) {
        throw new ApiError(404, "Patient doesn't exist!");
    };

    const updatedData = await prisma.patient.update({
        where: {
            id
        },
        data: payload,

    });

    return updatedData;
};

const deletePatient = async (id: string) => {
    const existingPatient = await prisma.patient.findFirstOrThrow({
        where: {
            id
        }
    });

    if (!existingPatient) {
        throw new ApiError(404, "Patient doesn't exist!");
    };

    const result = await prisma.patient.delete({
        where: {
            id
        }
    });

    return result;
};

export const PatientService = {
    getPatient,
    getAllFromDB,
    updateIntoDB,
    deletePatient
}