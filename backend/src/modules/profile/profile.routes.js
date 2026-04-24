import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { getProfile, updateName } from "./profile.controller.js";

const router = Router();

router.get("/profile", requireAuth, getProfile);
router.patch("/profile/name", requireAuth, updateName);

export default router;
