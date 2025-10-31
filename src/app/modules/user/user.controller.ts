import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { UserService } from "./user.service";
import sendResponse from "../../shared/sendResponse";
import { IPayloadProps } from "../../helpers/jwtHelpers";


const createPatient = catchAsync(async (req: Request, res: Response) => {
    const payload = {
        ...req.body,
        file: req.file
    };
    const result = await UserService.createPatient(payload);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Patient created successfully',
        data: result
    });
});

const createDoctor = catchAsync(async (req: Request, res: Response) => {
    const payload = {
        ...req.body,
        file: req.file
    };
    const result = await UserService.createDoctor(payload);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Doctor created successfully',
        data: result
    });
});

const createAdmin = catchAsync(async (req: Request, res: Response) => {
    const payload = {
        ...req.body,
        file: req.file
    };
    const result = await UserService.createAdmin(payload);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Admin created successfully',
        data: result
    });
});
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.getAllUsers(req.query as Record<string, string>);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'All users retrived successfully',
        meta: result.meta,
        data: result.data
    });
});

const getMyProfile = catchAsync(async (req: Request & { user?: IPayloadProps }, res: Response) => {

    const user = req.user;

    const result = await UserService.getMyProfile(user as IPayloadProps);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "My profile data fetched!",
        data: result
    })
});

const changeProfileStatus = catchAsync(async (req: Request, res: Response) => {

    const { id } = req.params;
    const result = await UserService.changeProfileStatus(id, req.body)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Users profile status changed!",
        data: result
    })
});

export const UserController = {
    createPatient,
    createDoctor,
    createAdmin,
    getAllUsers,
    getMyProfile,
    changeProfileStatus
};