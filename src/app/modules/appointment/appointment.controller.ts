import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AppointmentService } from "./appointment.service";
import { IPayloadProps } from "../../helpers/jwtHelpers";
import { pick } from "../../helpers/pick";



const getMyAppointments = catchAsync(async (req: Request & { user?: IPayloadProps }, res: Response) => {
    const user = req.user;
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    const filters = pick(req.query, ["status", "paymentStatus"]);

    const result = await AppointmentService.getMyAppointments(user as IPayloadProps, options, filters);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Appointments retrived successfully',
        meta: result.meta,
        data: result.data
    });
});


const getAppointmentsFromDB = catchAsync(async (req: Request, res: Response) => {
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    const filters = pick(req.query, ["status", "paymentStatus", "searchTerm"]);

    const result = await AppointmentService.getAppointmentsFromDB(options, filters);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'All appointments retrieved successfully',
        meta: result.meta,
        data: result.data
    });
});

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


const updateAppointmentStatus = catchAsync(async (req: Request & { user?: IPayloadProps }, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const user = req.user;

    const result = await AppointmentService.updateAppointmentStatus(id, status, user as IPayloadProps);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Appointment updated successfully',
        data: result
    });
});

export const AppointmentController = {
    createAppointment,
    getMyAppointments,
    getAppointmentsFromDB,
    updateAppointmentStatus
}