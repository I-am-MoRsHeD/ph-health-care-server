import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { pick } from "../../helpers/pick";
import { DoctorService } from "./doctor.service";
import { doctorFilterableFields } from "./doctor.constant";


const getDoctor = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await DoctorService.getDoctor(id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Doctor info retrived successfully',
        data: result
    });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    const filters = pick(req.query, doctorFilterableFields);

    const result = await DoctorService.getAllFromDB(options, filters);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Doctors retrieved successfully',
        meta: result.meta,
        data: result.data
    });
});

const getAISuggesstion = catchAsync(async (req: Request, res: Response) => {
    const result = await DoctorService.getAISuggesstion(req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'AI suggesstions retrived successfully',
        data: result
    });
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await DoctorService.updateIntoDB(id, req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Doctor profile updated successfully',
        data: result
    });
});

const deleteDoctor = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await DoctorService.deleteDoctor(id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Doctor deleted successfully',
        data: result
    });
});

export const DoctorController = {
    getDoctor,
    getAllFromDB,
    getAISuggesstion,
    updateIntoDB,
    deleteDoctor
}