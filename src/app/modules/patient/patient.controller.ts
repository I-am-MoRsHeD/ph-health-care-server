import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { pick } from "../../helpers/pick";
import { PatientService } from "./patient.service";
import { patientFilterableFields } from "./patient.constant";

const getPatient = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await PatientService.getPatient(id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Patient info retrived successfully',
        data: result
    });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    const filters = pick(req.query, patientFilterableFields);

    const result = await PatientService.getAllFromDB(options, filters);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Patient retrieved successfully',
        meta: result.meta,
        data: result.data
    });
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await PatientService.updateIntoDB(id, req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Patient profile updated successfully',
        data: result
    });
});

const deletePatient = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await PatientService.deletePatient(id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Patient deleted successfully',
        data: result
    });
});

export const PatientController = {
    getPatient,
    getAllFromDB,
    updateIntoDB,
    deletePatient
}

