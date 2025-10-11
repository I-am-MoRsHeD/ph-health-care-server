import config from "../../../config";
import { fileUploader } from "../../helpers/fileUploader";
import { prisma } from "../../shared/prisma";
import { CreatePatientInterface } from "./user.interface";
import bcrypt from 'bcryptjs';


const createPatient = async (payload: CreatePatientInterface) => {
    // console.log(payload?.patient)
    if (payload.file) {
        const uploadedImage = await fileUploader.uploadToCloudinary(payload.file);
        payload.patient.profilePhoto = uploadedImage?.secure_url;
    };
    console.log(payload.patient);
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


export const UserService = {
    createPatient
};