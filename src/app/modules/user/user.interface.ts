import { UserGender } from "@prisma/client";

export interface CreatePatientInterface {
    password: string;
    patient: {
        name: string;
        email: string;
        contactNumber: string;
        profilePhoto?: string;
    };
    file?: Express.Multer.File;
}

export interface CreateDoctorInterface {
    password: string;
    doctor: {
        name: string;
        email: string;
        contactNumber: string;
        profilePhoto?: string;
        address?: string;
        registrationNumber: string;
        experience: number;
        gender: UserGender
        appointmentFee: number;
        qualification: string;
        currentWorkingPlace: string;
        designation: string;
    };
    file?: Express.Multer.File;
};

export interface CreateAdminInterface {
    password: string;
    admin: {
        name: string;
        email: string;
        contactNumber: string;
        profilePhoto?: string;
    };
    file?: Express.Multer.File;
};