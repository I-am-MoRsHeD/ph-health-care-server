import { Router } from "express";
import { DoctorScheduleController } from "./doctorSchedule.controller";
import checkAuth from "../../middleware/checkAuth";
import { UserRole } from "@prisma/client";

const router = Router();


router.get('/', DoctorScheduleController.getDoctorSchedules);

router.post('/',
    checkAuth(UserRole.DOCTOR),
    DoctorScheduleController.insertIntoDB);


export const doctorScheduleRoutes = router;