import { Router } from 'express';
import { userRoutes } from '../modules/user/user.route';
import { authRoutes } from '../modules/auth/auth.route';
import { scheduleRoutes } from '../modules/schedule/schedule.route';
import { doctorScheduleRoutes } from '../modules/doctorSchedule/doctorSchedule.route';
import { specialtiesRoutes } from '../modules/specialties/specialties.route';
import { doctorRoutes } from '../modules/doctor/doctor.route';
import { patientRoutes } from '../modules/patient/patient.route';
import { adminRoutes } from '../modules/admin/admin.route';
import { appointmentRoutes } from '../modules/appointment/appointment.route';


const router = Router();

const moduleRoutes = [
    {
        path: '/user',
        route: userRoutes
    },
    {
        path: '/auth',
        route: authRoutes
    },
    {
        path: '/schedule',
        route: scheduleRoutes
    },
    {
        path: '/doctor-schedule',
        route: doctorScheduleRoutes
    },
    {
        path: '/specialties',
        route: specialtiesRoutes
    },
    {
        path: '/doctor',
        route: doctorRoutes
    },
    {
        path: '/patient',
        route: patientRoutes
    },
    {
        path: '/admin',
        route: adminRoutes
    },
    {
        path: '/appointment',
        route: appointmentRoutes
    },
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;