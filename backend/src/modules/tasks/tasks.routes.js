import { Router } from "express";
import { getTasks, addTask } from "./tasks.controller.js";
import { requireAuth } from "../../middleware/auth.js";

const router = Router();

router.get("/:topicId", requireAuth, getTasks);
router.post("/", requireAuth, addTask);

export default router;
