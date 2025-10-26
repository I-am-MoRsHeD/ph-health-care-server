import express, { NextFunction, Request, Response } from 'express';
import { SpecialtiesController } from './specialties.controller';
import { UserRole } from '@prisma/client';
import { fileUploader } from '../../helpers/fileUploader';
import checkAuth from '../../middleware/checkAuth';
import { SpecialtiesValidtaion } from './specialties.validation';

const router = express.Router();


router.get(
    '/',
    SpecialtiesController.getAllFromDB
);

router.post(
    '/',
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = SpecialtiesValidtaion.create.parse(JSON.parse(req.body.data))
        return SpecialtiesController.inserIntoDB(req, res, next)
    }
);

router.delete(
    '/:id',
    checkAuth(UserRole.ADMIN, UserRole.ADMIN),
    SpecialtiesController.deleteFromDB
);

export const specialtiesRoutes = router;