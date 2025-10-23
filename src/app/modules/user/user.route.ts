import { NextFunction, Request, Response, Router } from "express";
import { UserController } from "./user.controller";
import { fileUploader } from "../../helpers/fileUploader";
import { UserValidation } from "./user.validation";

const router = Router();

router.get('/all-users', UserController.getAllUsers);

router.post(
    '/create-patient',
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = UserValidation.createPatientZodSchema.parse(JSON.parse(req.body.data));
        return UserController.createPatient(req, res, next);
    });

router.post(
    '/create-doctor',
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = UserValidation.createDoctorZodSchema.parse(JSON.parse(req.body.data));
        return UserController.createDoctor(req, res, next);
    });

router.post(
    '/create-admin',
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = UserValidation.createAdminZodSchema.parse(JSON.parse(req.body.data));
        return UserController.createAdmin(req, res, next);
    });

export const userRoutes = router;