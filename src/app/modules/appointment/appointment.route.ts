import { Router } from "express";
import { AppointmentController } from "./appointment.controller";
import checkAuth from "../../middleware/checkAuth";
import { UserRole } from "@prisma/client";


const router = Router();

router.post('/',
    checkAuth(UserRole.PATIENT),
    AppointmentController.createAppointment);

export const appointmentRoutes = router;