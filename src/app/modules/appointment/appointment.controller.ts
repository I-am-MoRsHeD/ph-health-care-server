import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AppointmentService } from "./appointment.service";
import { IPayloadProps } from "../../helpers/jwtHelpers";


const createAppointment = catchAsync(async (req: Request & { user?: IPayloadProps }, res: Response) => {
    const user = req.user;

    const result = await AppointmentService.createAppointment(user as IPayloadProps, req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Appoinment booked successfully',
        data: result
    });
});


export const AppointmentController = {
    createAppointment
}