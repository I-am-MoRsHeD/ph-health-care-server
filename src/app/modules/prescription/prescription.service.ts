import { AppointemntStatus, PaymentStatus, Prescription, UserRole } from "@prisma/client";
import { IPayloadProps } from "../../helpers/jwtHelpers";
import { prisma } from "../../shared/prisma";
import httpStatus from "http-status";
import ApiError from "../../errorHelpers/ApiError";
import calculatedPagination from "../../helpers/paginationHelpers";



const createPrescription = async (user: IPayloadProps, payload: Partial<Prescription>) => {
    const appointemntData = await prisma.appointemnt.findUniqueOrThrow({
        where: {
            id: payload.appointmentId,
            status: AppointemntStatus.COMPLETED,
            paymentStatus: PaymentStatus.PAID
        },
        include: {
            doctor: true
        }
    });

    if (user.role === UserRole.DOCTOR) {
        if (!(user.email === appointemntData.doctor.email)) {
            throw new ApiError(httpStatus.BAD_REQUEST, "This is not your appointment");
        };
    };

    const result = await prisma.prescription.create({
        data: {
            appointmentId: appointemntData.id,
            doctorId: appointemntData.doctorId,
            patientId: appointemntData.patientId,
            instructions: payload.instructions as string,
            followUpDate: payload.followUpDate
        },
        include: {
            patient: true
        }
    });

    return result;

};

const patientPrescription = async (user: IPayloadProps, options: any) => {
    const { page, limit, skip, sortBy, sortOrder } = calculatedPagination(options);

    const result = await prisma.prescription.findMany({
        where: {
            patient: {
                email: user.email
            }
        },
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder
        },
        include: {
            doctor: true,
            patient: true,
            appointment: true
        }
    })

    const total = await prisma.prescription.count({
        where: {
            patient: {
                email: user.email
            }
        }
    })

    return {
        meta: {
            total,
            page,
            limit
        },
        data: result
    }

};

export const PrescriptionService = {
    createPrescription,
    patientPrescription
};