import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import {
  checkTopicVerifiedHandler,
  generateTaskQuizHandler,
  generateTopicQuizHandler,
  submitTaskQuizHandler,
  submitTopicQuizHandler
} from "./quiz.controller.js";

const router = Router();

router.get("/quiz/task/:taskId", requireAuth, generateTaskQuizHandler);
router.get("/quiz/topic/:topicId", requireAuth, generateTopicQuizHandler);
router.post("/quiz/task/:taskId/submit", requireAuth, submitTaskQuizHandler);
router.post("/quiz/topic/:topicId/submit", requireAuth, submitTopicQuizHandler);
router.get("/quiz/topic/:topicId/verified", requireAuth, checkTopicVerifiedHandler);

export default router;
