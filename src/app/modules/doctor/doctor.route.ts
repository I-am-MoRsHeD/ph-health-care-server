import { Router } from "express";
import { DoctorController } from "./doctor.controller";


const router = Router();

router.get('/:id', DoctorController.getDoctor);
router.get('/', DoctorController.getAllFromDB);

router.post('/suggesstion', DoctorController.getAISuggesstion);
router.patch('/:id', DoctorController.updateIntoDB);
router.delete('/:id', DoctorController.deleteDoctor)

export const doctorRoutes = router;