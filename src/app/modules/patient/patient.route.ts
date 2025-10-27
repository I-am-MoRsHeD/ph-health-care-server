import { Router } from "express";
import { PatientController } from "./patient.controller";


const router = Router();

router.get('/:id', PatientController.getPatient);
router.get('/', PatientController.getAllFromDB);

router.patch('/:id', PatientController.updateIntoDB);
router.delete('/:id', PatientController.deletePatient)

export const patientRoutes = router;