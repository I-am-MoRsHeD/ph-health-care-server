import { IPayloadProps } from "../../helpers/jwtHelpers";
import { prisma } from "../../shared/prisma";


const insertIntoDB = async (payload: { scheduleIds: string[] }, user: IPayloadProps) => {
    const doctor = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: user.email
        }
    });

    const scheduleData = payload.scheduleIds?.map(scheduleId => ({
        doctorId: doctor.id,
        scheduleId
    }));

    return await prisma.doctorSchedule.createMany({
        data: scheduleData
    });
};

const getDoctorSchedules = async (user: IPayloadProps) => {

    const schedules = await prisma.doctorSchedule.findMany({
        where: {
            doctor: {
                email: user.email
            }
        }
    });

    return schedules;
};

export const DoctorScheduleService = {
    insertIntoDB,
    getDoctorSchedules
};