import { Router } from "express";
import { DoctorScheduleController } from "./doctorSchedule.controller";
import checkAuth from "../../middleware/checkAuth";
import { UserRole } from "@prisma/client";

const router = Router();


router.get(
    '/',
    checkAuth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
    DoctorScheduleController.getAllFromDB
);

router.get(
    '/my-schedule',
    checkAuth(UserRole.DOCTOR),
    DoctorScheduleController.getMySchedule
)

router.post('/',
    checkAuth(UserRole.DOCTOR),
    DoctorScheduleController.insertIntoDB);

router.delete(
    '/:id',
    checkAuth(UserRole.DOCTOR),
    DoctorScheduleController.deleteFromDB
);

export const doctorScheduleRoutes = router;