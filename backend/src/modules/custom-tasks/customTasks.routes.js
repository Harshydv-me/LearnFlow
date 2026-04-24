import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import {
  getCustomTasksController,
  createCustomTaskController,
  updateCustomTaskController,
  toggleCompleteController,
  deleteCustomTaskController
} from "./customTasks.controller.js";

const router = Router();

router.get("/custom-tasks", requireAuth, getCustomTasksController);
router.post("/custom-tasks", requireAuth, createCustomTaskController);
router.patch("/custom-tasks/:id", requireAuth, updateCustomTaskController);
router.patch("/custom-tasks/:id/complete", requireAuth, toggleCompleteController);
router.delete("/custom-tasks/:id", requireAuth, deleteCustomTaskController);

export default router;