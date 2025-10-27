import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { pick } from "../../helpers/pick";
import { AdminService } from "./admin.service";
import { adminFilterableFields } from "./admin.constant";

const getAdmin = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await AdminService.getAdmin(id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Admin info retrived successfully',
        data: result
    });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    const filters = pick(req.query, adminFilterableFields);

    const result = await AdminService.getAllFromDB(options, filters);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Admins retrieved successfully',
        meta: result.meta,
        data: result.data
    });
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await AdminService.updateIntoDB(id, req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Admin profile updated successfully',
        data: result
    });
});

const deleteAdmin = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await AdminService.deleteAdmin(id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Admin deleted successfully',
        data: result
    });
});

export const AdminController = {
    getAdmin,
    getAllFromDB,
    updateIntoDB,
    deleteAdmin
}

