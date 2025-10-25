import { Router } from "express";
import { ScheduleController } from "./schedule.controller";
import checkAuth from "../../middleware/checkAuth";
import { UserRole } from "@prisma/client";


const router = Router();

router.get('/',
    checkAuth(UserRole.DOCTOR, UserRole.ADMIN),
    ScheduleController.getSchedules);

router.post('/', ScheduleController.insertIntoDB);

router.delete('/:id', ScheduleController.deleteSchedule);

export const scheduleRoutes = router;