import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { IPayloadProps } from "../../helpers/jwtHelpers";
import { PrescriptionService } from "./prescription.service";
import { pick } from "../../helpers/pick";



const createPrescription = catchAsync(async (req: Request & { user?: IPayloadProps }, res: Response) => {
    const user = req.user;

    const result = await PrescriptionService.createPrescription(user as IPayloadProps, req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Prescription created successfully',
        data: result
    });
});

const patientPrescription = catchAsync(async (req: Request & { user?: IPayloadProps }, res: Response) => {
    const user = req.user;
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const result = await PrescriptionService.patientPrescription(user as IPayloadProps, options);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Prescription fetched successfully',
        meta: result.meta,
        data: result.data
    });
});


export const PrescriptionController = {
    createPrescription,
    patientPrescription
}