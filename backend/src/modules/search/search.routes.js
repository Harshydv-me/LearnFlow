import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { searchHandler } from "./search.controller.js";

const router = Router();

router.get("/search", requireAuth, searchHandler);

export default router;
