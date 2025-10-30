import { Router } from "express";
import { ReviewController } from "./review.controller";
import checkAuth from "../../middleware/checkAuth";
import { UserRole } from "@prisma/client";


const router = Router();


router.post('/',
    checkAuth(UserRole.PATIENT),
    ReviewController.insertIntoDB);


export const reviewRoutes = router;