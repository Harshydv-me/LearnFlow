import { Router } from "express";
import { getPublicProfile } from "./profile.controller.js";

const router = Router();

router.get("/profile/:username", getPublicProfile);

export default router;
