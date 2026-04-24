import "dotenv/config";
import cors from "cors";
import express from "express";
import "./db/index.js";
import authRoutes from "./modules/auth/auth.routes.js";
import skillsRoutes from "./modules/skills/skills.routes.js";
import topicsRoutes from "./modules/topics/topics.routes.js";
import tasksRoutes from "./modules/tasks/tasks.routes.js";
import progressRoutes from "./modules/progress/progress.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";
import recommendationRoutes from "./modules/recommendation/recommendation.routes.js";
import profileRoutes from "./modules/profile/profile.routes.js";
import publicProfileRoutes from "./modules/profile/publicProfile.routes.js";
import aiRoutes from "./modules/ai/ai.routes.js";
import searchRoutes from "./modules/search/search.routes.js";
import customTasksRoutes from "./modules/custom-tasks/customTasks.routes.js";
import quizRoutes from "./modules/quiz/quiz.routes.js";
import { requireAuth } from "./middleware/auth.js";

if (!process.env.ANTHROPIC_API_KEY) {
  console.warn("WARNING: ANTHROPIC_API_KEY is not set in .env");
}

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/public", publicProfileRoutes);

// Protect all other API routes
app.use("/api", requireAuth);

app.use("/api", dashboardRoutes);
app.use("/api", recommendationRoutes);
app.use("/api", profileRoutes);
app.use("/api", aiRoutes);
app.use("/api", searchRoutes);
app.use("/api", customTasksRoutes);
app.use("/api", quizRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api", topicsRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/api", progressRoutes);

if (!process.env.GEMINI_API_KEY) {
  console.warn("⚠️  WARNING: GEMINI_API_KEY is not set in .env");
  console.warn("   Get your free key at: aistudio.google.com");
} else {
  console.log("✅ Gemini AI ready");
}

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
