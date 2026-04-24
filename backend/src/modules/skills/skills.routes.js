import { Router } from "express";
import { getSkills, addSkill } from "./skills.controller.js";

const router = Router();

router.get("/", getSkills);
router.post("/", addSkill);

export default router;