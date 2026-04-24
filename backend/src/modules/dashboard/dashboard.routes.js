import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import {
  getActivityController,
  getAchievementsController,
  getActiveTopicController,
  getDailyGoalController,
  getDashboardController,
  getHeatmapController,
  getMeController,
  getRecommendedTopicsController,
  getSkillsController,
  getSkillsProgressController,
  getStatsController,
  getStreakController,
  getTopicsController,
  updateDailyGoalController
} from "./dashboard.controller.js";

const router = Router();

router.get("/dashboard", requireAuth, getDashboardController);
router.get("/skills", requireAuth, getSkillsController);
router.get("/skills-progress", requireAuth, getSkillsProgressController);
router.get("/topics/:skillId", requireAuth, getTopicsController);
router.get("/recommended-topics", requireAuth, getRecommendedTopicsController);
router.get("/streak", requireAuth, getStreakController);
router.get("/stats", requireAuth, getStatsController);
router.get("/activity", requireAuth, getActivityController);
router.get("/daily-goal", requireAuth, getDailyGoalController);
router.patch("/daily-goal", requireAuth, updateDailyGoalController);
router.get("/achievements", requireAuth, getAchievementsController);
router.get("/heatmap", requireAuth, getHeatmapController);
router.get("/active-topic", requireAuth, getActiveTopicController);
router.get("/me", requireAuth, getMeController);

export default router;
