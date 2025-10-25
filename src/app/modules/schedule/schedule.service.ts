import { addHours, addMinutes, format } from 'date-fns';
import { prisma } from '../../shared/prisma';

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


export const ScheduleService = {
    insertIntoDB
};