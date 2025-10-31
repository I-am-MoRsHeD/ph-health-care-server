import { UserStatus } from "@prisma/client";
import { prisma } from "../../shared/prisma";
import bcrypt from 'bcryptjs';
import { jwtHelpers } from "../../helpers/jwtHelpers";
import config from "../../../config";
import ApiError from "../../errorHelpers/ApiError";
import httpStatus from 'http-status';
import { Secret } from "jsonwebtoken";
import emailSender from "../../helpers/emailSender";


const login = async (payload: { email: string, password: string }) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload?.email,
            status: UserStatus.ACTIVE
        },
    });

    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
    };

    const comparePassword = await bcrypt.compare(payload.password, user.password);

    if (!comparePassword) {
        throw new ApiError(400, 'Password is incorrect!');
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

const refreshToken = async (token: string) => {
    let decodedData;
    try {
        decodedData = jwtHelpers.verifyToken(token, config.jwt.jwt_refresh_secret as Secret);
    }
    catch (err) {
        throw new Error("You are not authorized!")
    }

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: decodedData.email,
            status: UserStatus.ACTIVE
        }
    });

    const accessToken = jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role
    },
        config.jwt.jwt_access_secret as Secret,
        config.jwt.jwt_access_expires as string
    );

    return {
        accessToken,
        needPasswordChange: userData.needPasswordChanged
    };

};

const changePassword = async (user: any, payload: any) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: UserStatus.ACTIVE
        }
    });

    const isCorrectPassword: boolean = await bcrypt.compare(payload.oldPassword, userData.password);

    if (!isCorrectPassword) {
        throw new Error("Password incorrect!")
    }

    const hashedPassword: string = await bcrypt.hash(payload.newPassword, Number(config.bcrypt_salt_rounds));

    await prisma.user.update({
        where: {
            email: userData.email
        },
        data: {
            password: hashedPassword,
            needPasswordChanged: false
        }
    })

    return {
        message: "Password changed successfully!"
    }
};

const forgotPassword = async (payload: { email: string }) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    });

    const resetPassToken = jwtHelpers.generateToken(
        { email: userData.email, role: userData.role },
        config.jwt.reset_pass_secret as Secret,
        config.jwt.reset_pass_expires as string
    )

    const resetPassLink = config.frontend_url + `?userId=${userData.id}&token=${resetPassToken}`

    await emailSender(
        userData.email,
        `
        <div>
            <p>Dear User,</p>
            <p>Your password reset link 
                <a href=${resetPassLink}>
                    <button>
                        Reset Password
                    </button>
                </a>
            </p>

        </div>
        `
    )
};

const resetPassword = async (token: string, payload: { id: string, password: string }) => {

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            id: payload.id,
            status: UserStatus.ACTIVE
        }
    });

    const isValidToken = jwtHelpers.verifyToken(token, config.jwt.reset_pass_secret as Secret)

    if (!isValidToken) {
        throw new ApiError(httpStatus.FORBIDDEN, "Forbidden!")
    }

    // hash password
    const password = await bcrypt.hash(payload.password, Number(config.bcrypt_salt_rounds));

    // update into database
    await prisma.user.update({
        where: {
            id: payload.id
        },
        data: {
            password
        }
    })
};

const getMe = async (session: any) => {
    const accessToken = session.accessToken;
    const decodedData = jwtHelpers.verifyToken(accessToken, config.jwt.jwt_access_secret as Secret);

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: decodedData.email,
            status: UserStatus.ACTIVE
        }
    })

    const { id, email, role, needPasswordChanged, status } = userData;

    return {
        id,
        email,
        role,
        needPasswordChanged,
        status
    }

};

export const AuthService = {
    login,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword,
    getMe
};