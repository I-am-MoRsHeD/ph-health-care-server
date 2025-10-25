import { Router } from "express";
import { ScheduleController } from "./schedule.controller";


const router = Router();

router.get('/', ScheduleController.getSchedules);

router.post('/', ScheduleController.insertIntoDB);

router.delete('/:id', ScheduleController.deleteSchedule);

export const scheduleRoutes = router;