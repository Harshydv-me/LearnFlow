import { Router } from "express";
import {
  getHistoryData,
  getInsights,
  getSkillsProgress,
  getWeeklyData,
  updateProgress
} from "./progress.controller.js";
import { requireAuth } from "../../middleware/auth.js";

const router = Router();

router.get("/progress/skills", requireAuth, getSkillsProgress);
router.get("/progress/weekly", requireAuth, getWeeklyData);
router.get("/progress/history", requireAuth, getHistoryData);
router.get("/progress/insights", requireAuth, getInsights);
router.post("/progress", requireAuth, updateProgress);

export default router;
