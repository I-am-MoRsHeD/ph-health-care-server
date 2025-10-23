import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { UserService } from "./user.service";
import sendResponse from "../../shared/sendResponse";


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

export const UserController = {
    createPatient,
    createDoctor,
    createAdmin,
    getAllUsers
};