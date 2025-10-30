import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { ReviewService } from "./review.service";
import { IPayloadProps } from "../../helpers/jwtHelpers";


const insertIntoDB = catchAsync(async (req: Request & { user?: IPayloadProps }, res: Response) => {
    const user = req.user;

    const result = await ReviewService.insertIntoDB(user as IPayloadProps, req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Review created successfully',
        data: result
    });
});


export const ReviewController = {
    insertIntoDB
};