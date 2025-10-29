import Stripe from "stripe";
import { prisma } from "../../shared/prisma";
import { PaymentStatus } from "@prisma/client";


const handleStripeWebhook = async (event: Stripe.Event) => {

    switch (event.type) {
        case "checkout.session.completed":
            const session = event.data.object as Stripe.Checkout.Session;

            const appointmentId = session.metadata?.appointmentId;
            const paymentId = session.metadata?.paymentId;

            await prisma.appointemnt.update({
                where: { id: appointmentId },
                data: {
                    paymentStatus: session.payment_status === 'paid' ? PaymentStatus.PAID : PaymentStatus.UNPAID
                },
            });

            await prisma.payment.update({
                where: { id: paymentId },
                data: {
                    status: session.payment_status === 'paid' ? PaymentStatus.PAID : PaymentStatus.UNPAID,
                    paymentGatewayData: session as any
                },
            });
            break;

        case "payment_intent.payment_failed":
            break;
    }


};


export const PaymentService = {
    handleStripeWebhook
};