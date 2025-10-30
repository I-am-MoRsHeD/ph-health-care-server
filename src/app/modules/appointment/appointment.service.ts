import { AppointemntStatus, Prisma, UserRole } from "@prisma/client";
import { IPayloadProps } from "../../helpers/jwtHelpers";
import calculatedPagination from "../../helpers/paginationHelpers";
import { stripe } from "../../helpers/stripe";
import { prisma } from "../../shared/prisma";
import { v4 as uuidv4 } from 'uuid';
import config from "../../../config";
import { appointemntSearchableFields } from "./appointment.constant";
import ApiError from "../../errorHelpers/ApiError";
import httpStatus from 'http-status';

interface IPayload {
    doctorId: string;
    scheduleId: string;
};

const getMyAppointments = async (user: IPayloadProps, options: any, filters: any) => {
    const { page, limit, skip, sortBy, sortOrder } = calculatedPagination(options);
    const { ...filterData } = filters;

    const andConditions: Prisma.AppointemntWhereInput[] = [];

    if (user.role === UserRole.PATIENT) {
        andConditions.push({
            patient: {
                email: user.email
            }
        })
    }
    else if (user.role === UserRole.DOCTOR) {
        andConditions.push({
            doctor: {
                email: user.email
            }
        })
    };

    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.keys(filterData).map((key) => ({
            [key]: {
                equals: (filterData)[key]
            }
        }));

        andConditions.push(...filterConditions)
    };

    const result = await prisma.appointemnt.findMany({
        where: {
            AND: andConditions
        },
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder
        },
        include: user.role === UserRole.DOCTOR ?
            { patient: true } : { doctor: true }
    });

    const total = await prisma.appointemnt.count({
        where: {
            AND: andConditions
        }
    })

    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result
    }
};

const getAppointmentsFromDB = async (options: any, filters: any) => {
    const { page, limit, skip, sortBy, sortOrder } = calculatedPagination(options);
    const { searchTerm, ...filterData } = filters;

    const andConditions: Prisma.AppointemntWhereInput[] = [];


    if (searchTerm) {
        andConditions.push({
            OR: appointemntSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive'
                }
            }))
        })
    };

    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.keys(filterData).map((key) => ({
            [key]: {
                equals: (filterData)[key]
            }
        }));

        andConditions.push(...filterConditions);
    };

    const result = await prisma.appointemnt.findMany({
        where: {
            AND: andConditions
        },
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder
        },
        include: {
            doctor: {
                select: {
                    email: true,
                    name: true,
                    registrationNumber: true
                }
            },
            patient: {
                select: {
                    email: true,
                    name: true
                }
            }
        }
    });

    const total = await prisma.appointemnt.count({
        where: {
            AND: andConditions
        }
    })

    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result
    }

}

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
            success_url: `${config.frontend_url}/success`,
            cancel_url: `${config.frontend_url}/cancel`
        });

        return {
            paymentUrl: session?.url
        };
    });

    return result;

};

const updateAppointmentStatus = async (appointmentId: string, status: AppointemntStatus, user: IPayloadProps) => {
    const appointemntData = await prisma.appointemnt.findUniqueOrThrow({
        where: {
            id: appointmentId
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

    const result = await prisma.appointemnt.update({
        where: {
            id: appointmentId
        },
        data: {
            status
        }
    });

    return result;
};

export const AppointmentService = {
    createAppointment,
    getMyAppointments,
    getAppointmentsFromDB,
    updateAppointmentStatus
};