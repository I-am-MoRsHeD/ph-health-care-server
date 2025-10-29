import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { IPayloadProps } from "../../helpers/jwtHelpers";
import { stripe } from "../../helpers/stripe";
import { PaymentService } from "./payment.service";
import config from "../../../config";



const handleStripeWebhook = catchAsync(async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig!,
            config.stripe_webhook_secret!
        );
    } catch (err: any) {
        console.error("Webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }


    const result = await PaymentService.handleStripeWebhook(event);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Appoinment booked successfully',
        data: result
    });
});


export const PaymentController = {
    handleStripeWebhook
}
