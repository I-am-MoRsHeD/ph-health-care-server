import { Prisma } from "@prisma/client";
import calculatedPagination from "../../helpers/paginationHelpers";
import { doctorSearchableFields } from "./doctor.constant";
import { prisma } from "../../shared/prisma";


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


export const DoctorService = {
    getAllFromDB
}