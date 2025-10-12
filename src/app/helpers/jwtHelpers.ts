import { UserRole } from "@prisma/client";
import jwt, { Secret, SignOptions } from "jsonwebtoken";

interface IPayloadProps {
    email: string,
    role: UserRole
};

const generateToken = (payload: IPayloadProps, secret: Secret, expiresIn: string) => {
    const token = jwt.sign(payload, secret, {
        algorithm: 'HS256',
        expiresIn
    } as SignOptions
    );

    return token;
};

export const jwtHelpers = {
    generateToken
};