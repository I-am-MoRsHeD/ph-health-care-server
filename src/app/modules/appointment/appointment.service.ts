import { IPayloadProps } from "../../helpers/jwtHelpers";
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

        await tnx.payment.create({
            data: {
                appointmentId: appointemnt.id,
                amount: existingDoctor?.appointmentFee,
                transactionId,
            }
        })

        return appointemnt;
    });

    return result;

};


export const AppointmentService = {
    createAppointment
};