

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