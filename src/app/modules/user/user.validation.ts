import { UserGender } from "@prisma/client";
import z from "zod";


const createPatientZodSchema = z.object({
    password: z.string().min(6, "Password must be at least 6 characters long"),
    patient: z.object({
        name: z.string({
            error: "Name is required"
        }),
        email: z.email("Invalid email address"),
        address: z.string().optional(),
        contactNumber: z.string({
            error: "Contact number is required"
        }),
    })
});

const createDoctorZodSchema = z.object({
    password: z.string().min(6, "Password must be at least 6 characters long"),
    doctor: z.object({
        name: z.string({
            error: "Name is required"
        }),
        email: z.email("Invalid email address"),
        address: z.string().optional(),
        contactNumber: z.string({
            error: "Contact number is required"
        }),
        registrationNumber: z.string({
            error: "Registration number is required"
        }),
        experience: z.number({
            error: "Experience is required"
        }).min(0, "Experience must be at least 0 years"),
        gender: z.enum(UserGender, {
            error: "Gender is required"
        }),
        appointmentFee: z.number({
            error: "Appointment fee is required"
        }).min(0, "Appointment fee must be at least 0"),
        qualification: z.string({
            error: "Qualification is required"
        }),
        currentWorkingPlace: z.string({
            error: "Current working place is required"
        }),
        designation: z.string({
            error: "Designation is required"
        }),
    })
});


const createAdminZodSchema = z.object({
    password: z.string().min(6, "Password must be at least 6 characters long"),
    admin: z.object({
        name: z.string({
            error: "Name is required"
        }),
        email: z.email("Invalid email address"),
        contactNumber: z.string({
            error: "Contact number is required"
        }),
    })
});

export const UserValidation = {
    createPatientZodSchema,
    createDoctorZodSchema,
    createAdminZodSchema
};