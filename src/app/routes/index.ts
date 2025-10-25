import { Router } from 'express';
import { userRoutes } from '../modules/user/user.route';
import { authRoutes } from '../modules/auth/auth.route';
import { scheduleRoutes } from '../modules/schedule/schedule.route';
import { doctorScheduleRoutes } from '../modules/doctorSchedule/doctorSchedule.route';


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
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;