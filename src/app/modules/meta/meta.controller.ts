import { Request, Response } from "express";
import { MetaService } from "./meta.service";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { IPayloadProps } from "../../helpers/jwtHelpers";


const fetchDashboardMetaData = catchAsync(async (req: Request & { user?: IPayloadProps }, res: Response) => {

    const user = req.user;
    const result = await MetaService.fetchDashboardMetaData(user as IPayloadProps);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Meta data retrival successfully!",
        data: result
    })
});

export const MetaController = {
    fetchDashboardMetaData
}