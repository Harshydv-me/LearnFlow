import { Router } from "express";
import { createTopic, getTopicsForSkill } from "./topics.controller.js";

const router = Router();

router.get("/skills/:skillId/topics", getTopicsForSkill);
router.post("/topics", createTopic);

export default router;
