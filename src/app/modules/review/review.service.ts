import { AppointemntStatus, Review } from "@prisma/client";
import ApiError from "../../errorHelpers/ApiError";
import { IPayloadProps } from "../../helpers/jwtHelpers";
import { prisma } from "../../shared/prisma";
import httpStatus from 'http-status';


const insertIntoDB = async (user: IPayloadProps, payload: any) => {
    const patientData = await prisma.patient.findUniqueOrThrow({
        where: {
            email: user.email
        }
    });

    const appointmentData = await prisma.appointemnt.findUniqueOrThrow({
        where: {
            id: payload.appointmentId,
            status: AppointemntStatus.COMPLETED
        }
    });

    if (patientData.id !== appointmentData.patientId) {
        throw new ApiError(httpStatus.BAD_REQUEST, "This is not your appointment")
    };

    return await prisma.$transaction(async (tnx) => {
        const result = await tnx.review.create({
            data: {
                patientId: appointmentData.patientId,
                doctorId: appointmentData.doctorId,
                appointmentId: appointmentData.id,
                rating: payload.rating,
                comment: payload.comment
            }
        });

        const avgRating = await tnx.review.aggregate({
            _avg: {
                rating: true
            },
            where: {
                doctorId: appointmentData.doctorId
            }
        });

        await tnx.doctor.update({
            where: {
                id: appointmentData.doctorId
            },
            data: {
                avgRating: avgRating._avg.rating as number
            }
        });

        return result;
    })

};


export const ReviewService = {
    insertIntoDB
};