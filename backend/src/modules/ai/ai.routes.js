import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { generateContent } from "./ai.controller.js";

const router = Router();

router.get("/ai/task/:taskId", requireAuth, generateContent);

export default router;
