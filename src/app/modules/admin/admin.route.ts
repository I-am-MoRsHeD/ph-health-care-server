import { Router } from "express";
import { AdminController } from "./admin.controller";


const router = Router();

router.get('/:id', AdminController.getAdmin);
router.get('/', AdminController.getAllFromDB);

router.patch('/:id', AdminController.updateIntoDB);
router.delete('/:id', AdminController.deleteAdmin)

export const adminRoutes = router;