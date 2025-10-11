import config from "../../../config";
import { prisma } from "../../shared/prisma";
import { CreatePatientInterface } from "./user.interface";
import bcrypt from 'bcryptjs';


const createPatient = async (payload: CreatePatientInterface) => {
    const hashedPassword = await bcrypt.hash(payload.password, Number(config.bcrypt_salt_rounds));

    const result = await prisma.$transaction(async (tnx) => {
        await tnx.user.create({
            data: {
                email: payload.email,
                password: hashedPassword
            }
        });

        return await tnx.patient.create({
            data: {
                name: payload.name,
                email: payload.email,
                contactNumber: payload.contactNumber,
            }
        });
    });

    return result;
};


export const UserService = {
    createPatient
};