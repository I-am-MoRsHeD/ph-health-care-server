import { Admin, Patient, Prisma } from "@prisma/client";
import calculatedPagination from "../../helpers/paginationHelpers";
import { prisma } from "../../shared/prisma";
import ApiError from "../../errorHelpers/ApiError";
import { adminSearchableFields } from "./admin.constant";


const getAdmin = async (id: string) => {
    const existingAdmin = await prisma.admin.findFirstOrThrow({
        where: {
            id
        }
    });

    if (!existingAdmin) {
        throw new ApiError(404, "Admin doesn't exist!");
    };

    return existingAdmin;
};

const getAllFromDB = async (options: any, filters: any) => {
    const { page, limit, skip, sortBy, sortOrder } = calculatedPagination(options);
    const { searchTerm } = filters;

    const andConditions: Prisma.AdminWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: adminSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive'
                }
            }))
        })
    };


    const result = await prisma.admin.findMany({
        where: {
            AND: andConditions
        },
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder
        }
    });

    const total = await prisma.admin.count({
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

const updateIntoDB = async (id: string, payload: Partial<Admin>) => {
    const existingAdmin = await prisma.admin.findFirstOrThrow({
        where: {
            id
        }
    });

    if (!existingAdmin) {
        throw new ApiError(404, "Admin doesn't exist!");
    };

    const updatedData = await prisma.admin.update({
        where: {
            id
        },
        data: payload,

    });

    return updatedData;
};

const deleteAdmin = async (id: string) => {
    const existingAdmin = await prisma.admin.findFirstOrThrow({
        where: {
            id
        }
    });

    if (!existingAdmin) {
        throw new ApiError(404, "Admin doesn't exist!");
    };

    const result = await prisma.admin.delete({
        where: {
            id
        }
    });

    return result;
};

export const AdminService = {
    getAdmin,
    getAllFromDB,
    updateIntoDB,
    deleteAdmin
}