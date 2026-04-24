import pool from "../../db/index.js";
import { generateTaskContent } from "./ai.service.js";

export const generateContent = async (req, res) => {
  try {
    const { taskId } = req.params;

    const result = await pool.query(
      `SELECT t.id,
              t.title,
              t.description,
              tp.title AS topic_title,
              sk.name AS skill_name
       FROM tasks t
       JOIN topics tp ON tp.id = t.topic_id
       JOIN skills sk ON sk.id = tp.skill_id
       WHERE t.id = $1`,
      [taskId]
    );

    const task = result.rows[0];
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    const content = await generateTaskContent(
      task.title,
      task.description,
      task.topic_title,
      task.skill_name
    );

    return res.json({ success: true, content });
  } catch (error) {
    if (String(error.message || "").toLowerCase().includes("parse")) {
      return res.status(500).json({ error: "AI response format error" });
    }
    return res.status(500).json({ error: "Failed to generate content" });
  }
};
