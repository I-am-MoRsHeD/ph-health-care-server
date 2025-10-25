import { addHours, addMinutes, format } from 'date-fns';
import { prisma } from '../../shared/prisma';
import calculatedPagination from '../../helpers/paginationHelpers';
import { Prisma } from '@prisma/client';
import { IPayloadProps } from '../../helpers/jwtHelpers';

const insertIntoDB = async (payload: any) => {
    const { startTime, startDate, endTime, endDate } = payload;
    const intervalTime = 30;

    const schedules = [];

    const currentStartDate = new Date(startDate);
    const lastDate = new Date(endDate);

    while (currentStartDate <= lastDate) {
        const startDateTime = new Date(
            addMinutes(
                addHours(
                    `${format(currentStartDate, "yyyy-MM-dd")}`,
                    Number(startTime.split(":")[0])
                ),
                Number(startTime.split(":")[1])
            )
        )

        const endDateTime = new Date(
            addMinutes(
                addHours(
                    `${format(currentStartDate, "yyyy-MM-dd")}`,
                    Number(endTime.split(":")[0])
                ),
                Number(endTime.split(":")[1])
            )
        )

        while (startDateTime < endDateTime) {
            const slotStartDateTime = startDateTime; //10:00
            const slotEndDateTIme = addMinutes(startDateTime, intervalTime); //10:30

            const scheduleData = {
                startDateTime: slotStartDateTime,
                endDateTime: slotEndDateTIme
            };

            const existingSchedule = await prisma.schedule.findFirst({
                where: scheduleData
            });

            if (!existingSchedule) {
                const result = await prisma.schedule.create({
                    data: scheduleData
                });
                schedules.push(result);
            };

            slotStartDateTime.setMinutes(slotStartDateTime.getMinutes() + intervalTime);
        };

        currentStartDate.setDate(currentStartDate.getDate() + 1)
    }

    return schedules;

};

const getSchedules = async (user: IPayloadProps, options: any, filters: any) => {
    const { page, limit, skip, sortBy, sortOrder } = calculatedPagination(options);
    const { startDateTime, endDateTime } = filters;

    const andConditions: Prisma.ScheduleWhereInput[] = [];

    const doctorSchedules = await prisma.doctorSchedule.findMany({
        where: {
            doctor: {
                email: user.email
            }
        }
    });

    const doctorScheduleIds = doctorSchedules?.map(schedule => schedule.scheduleId);

    if (startDateTime && endDateTime) {
        andConditions.push({
            AND: [
                {
                    startDateTime: {
                        gte: startDateTime
                    }
                },
                {
                    endDateTime: {
                        lte: endDateTime
                    }
                }
            ]
        })
    };

    const result = await prisma.schedule.findMany({
        skip,
        take: limit,
        where: {
            ...{
                AND: andConditions
            },
            id: {
                notIn: doctorScheduleIds
            }
        },
        orderBy: {
            [sortBy]: sortOrder
        }
    })

    const total = await prisma.schedule.count({
        where: {
            ...{
                AND: andConditions
            },
            id: {
                notIn: doctorScheduleIds
            }
        }
    });

    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    };

};

const deleteSchedule = async (id: string) => {
    return await prisma.schedule.delete({
        where: {
            id
        }
    });
}

export const ScheduleService = {
    insertIntoDB,
    getSchedules,
    deleteSchedule
};