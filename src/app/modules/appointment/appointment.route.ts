import { Router } from "express";
import { AppointmentController } from "./appointment.controller";
import checkAuth from "../../middleware/checkAuth";
import { UserRole } from "@prisma/client";


const router = Router();

router.get('/',
    checkAuth(UserRole.ADMIN),
    AppointmentController.getAppointmentsFromDB);

router.get('/my-appointments',
    checkAuth(UserRole.PATIENT, UserRole.DOCTOR),
    AppointmentController.getMyAppointments);

router.post('/',
    checkAuth(UserRole.PATIENT),
    AppointmentController.createAppointment);

router.patch('/status/:id',
    checkAuth(UserRole.DOCTOR, UserRole.ADMIN),
    AppointmentController.updateAppointmentStatus)

export const appointmentRoutes = router;