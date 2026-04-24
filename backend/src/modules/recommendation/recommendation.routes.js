import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { getRecommendationHandler } from "./recommendation.controller.js";

const router = Router();

router.get("/recommendation", requireAuth, getRecommendationHandler);

export default router;
