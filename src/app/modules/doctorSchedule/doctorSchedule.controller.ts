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


export const DoctorScheduleController = {
    insertIntoDB
};