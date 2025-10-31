import { Router } from "express";
import { PatientController } from "./patient.controller";
import checkAuth from "../../middleware/checkAuth";
import { UserRole } from "@prisma/client";


const router = Router();

router.get('/:id', PatientController.getPatient);
router.get('/', PatientController.getAllFromDB);

router.patch('/',
    checkAuth(UserRole.PATIENT),
    PatientController.updateIntoDB);
router.delete('/:id', PatientController.deletePatient)

export const patientRoutes = router;