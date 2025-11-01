import express from 'express';
import { MetaController } from './meta.controller';
import { UserRole } from '@prisma/client';
import checkAuth from '../../middleware/checkAuth';

const router = express.Router();

router.get(
    '/',
    checkAuth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
    MetaController.fetchDashboardMetaData
)


export const MetaRoutes = router;