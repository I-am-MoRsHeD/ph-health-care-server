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

export const UserValidation = {
    createPatientZodSchema
};