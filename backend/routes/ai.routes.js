import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { generatePlan } from "../controllers/ai.controller.js";

const router = Router();

router.post("/generate-plan", protect, generatePlan);

export default router;
