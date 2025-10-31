import { Prisma, UserRole, UserStatus } from "@prisma/client";
import config from "../../../config";
import { fileUploader } from "../../helpers/fileUploader";
import { prisma } from "../../shared/prisma";
import { CreateAdminInterface, CreateDoctorInterface, CreatePatientInterface } from "./user.interface";
import bcrypt from 'bcryptjs';
import { pick } from "../../helpers/pick";
import calculatedPagination from "../../helpers/paginationHelpers";
import { userFilterableFields, userOptionItems, userSearchableFields } from "./user.constants";
import { IPayloadProps } from "../../helpers/jwtHelpers";

// create patient
const createPatient = async (payload: CreatePatientInterface) => {

    if (payload.file) {
        const uploadedImage = await fileUploader.uploadToCloudinary(payload.file);
        payload.patient.profilePhoto = uploadedImage?.secure_url;
    };

    const hashedPassword = await bcrypt.hash(payload.password, Number(config.bcrypt_salt_rounds));

    const result = await prisma.$transaction(async (tnx) => {
        await tnx.user.create({
            data: {
                email: payload.patient.email,
                password: hashedPassword
            }
        });

        return await tnx.patient.create({
            data: payload.patient
        });
    });

    return result;
};
// create doctor
const createDoctor = async (payload: CreateDoctorInterface) => {

    if (payload.file) {
        const uploadedImage = await fileUploader.uploadToCloudinary(payload.file);
        payload.doctor.profilePhoto = uploadedImage?.secure_url;
    };

    const hashedPassword = await bcrypt.hash(payload.password, Number(config.bcrypt_salt_rounds));

    const result = await prisma.$transaction(async (tnx) => {
        await tnx.user.create({
            data: {
                email: payload.doctor.email,
                role: UserRole.DOCTOR,
                password: hashedPassword
            }
        });

        return await tnx.doctor.create({
            data: payload.doctor
        });
    });

    return result;
};
// create admin
const createAdmin = async (payload: CreateAdminInterface) => {

    if (payload.file) {
        const uploadedImage = await fileUploader.uploadToCloudinary(payload.file);
        payload.admin.profilePhoto = uploadedImage?.secure_url;
    };

    const hashedPassword = await bcrypt.hash(payload.password, Number(config.bcrypt_salt_rounds));

    const result = await prisma.$transaction(async (tnx) => {
        await tnx.user.create({
            data: {
                email: payload.admin.email,
                role: UserRole.ADMIN,
                password: hashedPassword
            }
        });

        return await tnx.admin.create({
            data: payload.admin
        });
    });

    return result;
};

const getAllUsers = async (query: Record<string, any>) => {
    const options = pick(query, userOptionItems); // pagination and sorting
    const filters = pick(query, userFilterableFields); // filtering and searching

    const { page, limit, skip, sortBy, sortOrder } = calculatedPagination(options);
    const { searchTerm, ...filteredData } = filters;

    const andConditions: Prisma.UserWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: userSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive'
                }
            }))
        })
    };

    if (Object.keys(filteredData.length > 0)) {
        andConditions.push({
            AND: Object.keys(filteredData).map(key => ({
                [key]: {
                    equals: (filteredData as any)[key]
                }
            }))
        })
    };

    const users = await prisma.user.findMany({
        skip,
        take: limit,

        where: {
            AND: andConditions
        },
        orderBy: {
            [sortBy]: sortOrder
        }
    });

    const total = await prisma.user.count({
        where: {
            AND: andConditions
        }
    });

    return {
        meta: {
            page,
            limit,
            total
        },
        data: users
    };

}

const getMyProfile = async (user: IPayloadProps) => {
    const userInfo = await prisma.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: UserStatus.ACTIVE
        },
        select: {
            id: true,
            email: true,
            needPasswordChanged: true,
            role: true,
            status: true
        }
    })

    let profileData;

    if (userInfo.role === UserRole.PATIENT) {
        profileData = await prisma.patient.findUnique({
            where: {
                email: userInfo.email
            }
        })
    }
    else if (userInfo.role === UserRole.DOCTOR) {
        profileData = await prisma.doctor.findUnique({
            where: {
                email: userInfo.email
            }
        })
    }
    else if (userInfo.role === UserRole.ADMIN) {
        profileData = await prisma.admin.findUnique({
            where: {
                email: userInfo.email
            }
        })
    }

    return {
        ...userInfo,
        ...profileData
    };

};

const changeProfileStatus = async (id: string, payload: { status: UserStatus }) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            id
        }
    })

    const updateUserStatus = await prisma.user.update({
        where: {
            id
        },
        data: payload
    })

    return updateUserStatus;
};

export const UserService = {
    createPatient,
    createDoctor,
    createAdmin,
    getAllUsers,
    getMyProfile,
    changeProfileStatus
};