import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  listPlans,
  getPlan,
  createPlan,
  updatePlan,
  deletePlan,
  toggleTask,
} from "../controllers/plan.controller.js";

const router = Router();

router.use(protect);

router.route("/").get(listPlans).post(createPlan);
router.route("/:id").get(getPlan).put(updatePlan).delete(deletePlan);
router.patch("/:id/tasks/:taskId/toggle", toggleTask);

export default router;
