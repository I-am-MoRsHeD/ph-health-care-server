import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { pick } from "../../helpers/pick";
import { DoctorScheduleService } from "./doctorSchedule.service";
import { IPayloadProps } from "../../helpers/jwtHelpers";


const insertIntoDB = catchAsync(async (req: Request & { user?: IPayloadProps }, res: Response) => {
    const user = req.user;
    const result = await DoctorScheduleService.insertIntoDB(req.body, user as IPayloadProps);


    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Doctor schedule created successfully',
        data: result
    });
});

const getMySchedule = catchAsync(async (req: Request & { user?: IPayloadProps }, res: Response) => {
    const filters = pick(req.query, ['startDate', 'endDate', 'isBooked']);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const user = req.user;
    const result = await DoctorScheduleService.getMySchedule(filters, options, user as IPayloadProps);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "My Schedule fetched successfully!",
        data: result
    });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, ['searchTerm', 'isBooked', 'doctorId']);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await DoctorScheduleService.getAllFromDB(filters, options);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Doctor Schedule retrieval successfully',
        meta: result.meta,
        data: result.data,
    });
});

const deleteFromDB = catchAsync(async (req: Request & { user?: IPayloadProps }, res: Response) => {

    const user = req.user;
    const { id } = req.params;
    const result = await DoctorScheduleService.deleteFromDB(user as IPayloadProps, id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "My Schedule deleted successfully!",
        data: result
    });
});


export const DoctorScheduleController = {
    insertIntoDB,
    getMySchedule,
    getAllFromDB,
    deleteFromDB
};