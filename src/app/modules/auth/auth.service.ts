import { UserStatus } from "@prisma/client";
import { prisma } from "../../shared/prisma";
import bcrypt from 'bcryptjs';
import { jwtHelpers } from "../../helpers/jwtHelpers";
import config from "../../../config";


const login = async (payload: { email: string, password: string }) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload?.email,
            status: UserStatus.ACTIVE
        },
    });

    if (!user) {
        throw new Error('User not found!');
    };

    const comparePassword = await bcrypt.compare(payload.password, user.password);

    if (!comparePassword) {
        throw new Error('Password is incorrect!');
    };

    const jwtPayload = {
        email: user.email,
        role: user.role
    };

    const accessToken = jwtHelpers.generateToken(jwtPayload, config.jwt.jwt_access_secret, config.jwt.jwt_access_expires);
    const refreshToken = jwtHelpers.generateToken(jwtPayload, config.jwt.jwt_refresh_secret, config.jwt.jwt_refresh_expires);

    return {
        accessToken,
        refreshToken,
        needPasswordChanged: user.needPasswordChanged as boolean
    };
};

export const AuthService = {
    login
};