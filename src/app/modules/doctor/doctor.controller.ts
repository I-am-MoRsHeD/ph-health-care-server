import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { pick } from "../../helpers/pick";
import { IPayloadProps } from "../../helpers/jwtHelpers";
import { DoctorService } from "./doctor.service";
import { doctorFilterableFields } from "./doctor.constant";


const getAllFromDB = catchAsync(async (req: Request & { user?: IPayloadProps }, res: Response) => {
    const user = req.user;
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    const filters = pick(req.query, doctorFilterableFields);

    const result = await DoctorService.getAllFromDB(options, filters);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Doctor retrieved successfully',
        meta: result.meta,
        data: result.data
    });
});

export const DoctorController = {
    getAllFromDB
}