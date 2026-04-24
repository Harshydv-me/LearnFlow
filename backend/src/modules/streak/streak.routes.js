import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { getStreak } from "./streak.controller.js";

const router = Router();

router.get("/", requireAuth, getStreak);

export default router;
