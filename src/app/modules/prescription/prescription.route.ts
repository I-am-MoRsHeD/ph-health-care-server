import { Router } from "express";
import { PrescriptionController } from "./prescription.controller";
import checkAuth from "../../middleware/checkAuth";
import { UserRole } from "@prisma/client";

const router = Router();

router.get("/my-prescription",
    checkAuth(UserRole.PATIENT),
    PrescriptionController.patientPrescription);

router.post('/',
    checkAuth(UserRole.DOCTOR),
    PrescriptionController.createPrescription);

export const prescriptionRoutes = router;