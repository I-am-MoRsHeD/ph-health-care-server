import { NextFunction, Request, Response, Router } from "express";
import { UserController } from "./user.controller";
import { fileUploader } from "../../helpers/fileUploader";
import { UserValidation } from "./user.validation";
import checkAuth from "../../middleware/checkAuth";
import { UserRole } from "@prisma/client";

const router = Router();

router.get('/all-users',
    checkAuth(UserRole.ADMIN),
    UserController.getAllUsers);

router.get(
    '/me',
    checkAuth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
    UserController.getMyProfile
)

router.post(
    '/create-patient',
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = UserValidation.createPatientZodSchema.parse(JSON.parse(req.body.data));
        return UserController.createPatient(req, res, next);
    });

router.post(
    '/create-doctor',
    checkAuth(UserRole.ADMIN),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = UserValidation.createDoctorZodSchema.parse(JSON.parse(req.body.data));
        return UserController.createDoctor(req, res, next);
    });

router.post(
    '/create-admin',
    checkAuth(UserRole.ADMIN),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = UserValidation.createAdminZodSchema.parse(JSON.parse(req.body.data));
        return UserController.createAdmin(req, res, next);
    });

router.patch(
    '/:id/status',
    checkAuth(UserRole.ADMIN),
    UserController.changeProfileStatus
);

export const userRoutes = router;