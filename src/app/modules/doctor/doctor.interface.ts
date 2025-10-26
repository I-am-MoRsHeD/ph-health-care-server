import { UserGender } from "@prisma/client";


export type TDoctorWhereInput = {
    name: string;
    email: string;
    contactNumber: string;
    address: string | null;
    registrationNumber: string;
    experience: number;
    gender: UserGender;
    appointmentFee: number;
    qualification: string;
    currentWorkingPlace: string;
    designation: string;
    isDeleted: boolean;
    specialties: {
        specialtyId: string;
        isDeleted: boolean;
    }[]
};