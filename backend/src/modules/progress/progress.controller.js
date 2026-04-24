import {
  getProgressHistoryByUser,
  getProgressInsightsByUser,
  getSkillsProgressByUser,
  getWeeklyProgressByUser,
  getPreviousTask,
  getTaskById,
  insertProgress,
  isTaskCompleted,
  isTopicVerified,
  removeProgress,
  recomputeStreakForUser,
  updateStreakForUser
} from "./progress.service.js";

const parseId = (value) => {
  const id = Number.parseInt(String(value), 10);
  return Number.isNaN(id) ? null : id;
};

export const updateProgress = async (req, res) => {
  try {
    const user_id = parseId(req.user?.id);
    const task_id = parseId(req.body?.taskId);

    if (user_id === null || task_id === null) {
      return res.status(400).json({ error: "user_id and taskId are required" });
    }

    const task = await getTaskById(task_id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    const alreadyCompleted = await isTaskCompleted(user_id, task_id);
    if (alreadyCompleted) {
      // If topic is verified, we CANNOT unmark tasks
      const verified = await isTopicVerified(user_id, task.topic_id);
      if (verified) {
        return res.json({
          success: true,
          taskId: task_id,
          completed: true,
          message: "Topic verified, progress is permanent"
        });
      }

      const removed = await removeProgress(user_id, task_id);
      await recomputeStreakForUser(user_id);
      return res.json({
        success: true,
        taskId: task_id,
        completed: false,
        removedAt: removed?.completed_at || null
      });
    }

    const previous = await getPreviousTask(task.topic_id, task.order_index);
    if (previous) {
      const previousDone = await isTaskCompleted(user_id, previous.id);
      if (!previousDone) {
        return res.status(400).json({ error: "Complete previous task first" });
      }
    }

    const inserted = await insertProgress(user_id, task_id);

    await updateStreakForUser(user_id);

    if (inserted) {
      return res.json({ success: true, taskId: task_id, completedAt: inserted.completed_at });
    }
    return res.json({ success: true, taskId: task_id });
  } catch (error) {
    console.error("PROGRESS ERROR:", error.message, error.stack);
    return res.status(500).json({ error: error.message });
  }
};

export const getSkillsProgress = async (req, res) => {
  try {
    const user_id = parseId(req.user?.id);
    if (user_id === null) {
      return res.status(400).json({ error: "user_id required" });
    }
    const data = await getSkillsProgressByUser(user_id);
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getWeeklyData = async (req, res) => {
  try {
    const user_id = parseId(req.user?.id);
    if (user_id === null) {
      return res.status(400).json({ error: "user_id required" });
    }
    const data = await getWeeklyProgressByUser(user_id);
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getHistoryData = async (req, res) => {
  try {
    const user_id = parseId(req.user?.id);
    if (user_id === null) {
      return res.status(400).json({ error: "user_id required" });
    }
    const data = await getProgressHistoryByUser(user_id);
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getInsights = async (req, res) => {
  try {
    const user_id = parseId(req.user?.id);
    if (user_id === null) {
      return res.status(400).json({ error: "user_id required" });
    }
    const data = await getProgressInsightsByUser(user_id);
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
