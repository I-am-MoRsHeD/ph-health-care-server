import { IPayloadProps } from "../../helpers/jwtHelpers";
import { stripe } from "../../helpers/stripe";
import { prisma } from "../../shared/prisma";
import { v4 as uuidv4 } from 'uuid';

interface IPayload {
    doctorId: string;
    scheduleId: string;
};

const createAppointment = async (user: IPayloadProps, payload: IPayload) => {
    const existingPatient = await prisma.patient.findUniqueOrThrow({
        where: {
            email: user?.email,
            isDeleted: false
        }
    });

    const existingDoctor = await prisma.doctor.findUniqueOrThrow({
        where: {
            id: payload.doctorId,
            isDeleted: false
        }
    });

    const scheduleBooked = await prisma.doctorSchedule.findFirstOrThrow({
        where: {
            doctorId: payload.doctorId,
            scheduleId: payload.scheduleId,
            isBooked: false
        }
    });

    const videoCallingId = uuidv4();

    const result = await prisma.$transaction(async (tnx) => {

        const appointmentPayload = {
            patientId: existingPatient.id,
            doctorId: payload.doctorId,
            scheduleId: payload.scheduleId,
            videoCallingId,
        };

        const appointemnt = await tnx.appointemnt.create({
            data: appointmentPayload
        });

        await tnx.doctorSchedule.update({
            where: {
                doctorId_scheduleId: {
                    doctorId: existingDoctor?.id,
                    scheduleId: payload?.scheduleId
                }
            },
            data: {
                isBooked: true
            }
        });

        const transactionId = uuidv4();

        const paymentData = await tnx.payment.create({
            data: {
                appointmentId: appointemnt.id,
                amount: existingDoctor?.appointmentFee,
                transactionId,
            }
        });



        const session = await stripe.checkout.sessions.create({
            customer_email: user.email,
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: 'bdt',
                        product_data: {
                            name: `Doctor Appointment ${existingDoctor?.name}`,
                        },
                        unit_amount: existingDoctor.appointmentFee * 100,
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                appointmentId: appointemnt?.id,
                paymentId: paymentData?.id
            },
            success_url: 'http://localhost:3000/success',
            cancel_url: 'http://localhost:3000/cancel',
        });

        return {
            paymentUrl: session?.url
        };
    });

    return result;

};


export const AppointmentService = {
    createAppointment
};