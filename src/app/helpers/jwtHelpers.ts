import { UserRole } from "@prisma/client";
import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";

export interface IPayloadProps {
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

const verifyToken = (token: string, secret: Secret) => {
    return jwt.verify(token, secret) as JwtPayload
};

export const jwtHelpers = {
    generateToken,
    verifyToken
};