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


export const DoctorScheduleService = {
    insertIntoDB
};