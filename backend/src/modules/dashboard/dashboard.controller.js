import {
  getActivityByUser,
  getAchievementsByUser,
  getActiveTopicByUser,
  getDailyGoalByUser,
  getDashboardOverview,
  getHeatmapByUser,
  getMeByUser,
  getRecommendedTopicsByUser,
  getSkillsList,
  getSkillsProgressByUser,
  getStatsByUser,
  getStreakByUser,
  getTopicsBySkillForUser,
  updateDailyGoalByUser
} from "./dashboard.service.js";

const parseId = (value) => {
  const id = Number.parseInt(String(value), 10);
  return Number.isNaN(id) ? null : id;
};

export const getDashboardController = async (req, res) => {
  try {
    const user_id = parseId(req.user?.id);
    if (user_id === null) {
      return res.status(400).json({ error: "user_id required" });
    }

    const data = await getDashboardOverview(user_id);
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getSkillsController = async (_req, res) => {
  try {
    const data = await getSkillsList();
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getSkillsProgressController = async (req, res) => {
  try {
    const user_id = parseId(req.user?.id);
    if (user_id === null) {
      return res.status(400).json({ error: "user_id required" });
    }

    const data = await getSkillsProgressByUser(user_id);
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getTopicsController = async (req, res) => {
  try {
    const user_id = parseId(req.user?.id);
    const skillId = parseId(req.params?.skillId);
    if (user_id === null || skillId === null) {
      return res.status(400).json({ error: "skillId required" });
    }

    const data = await getTopicsBySkillForUser(skillId, user_id);
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getRecommendedTopicsController = async (req, res) => {
  try {
    const user_id = parseId(req.user?.id);
    if (user_id === null) {
      return res.status(400).json({ error: "user_id required" });
    }

    const data = await getRecommendedTopicsByUser(user_id);
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getStreakController = async (req, res) => {
  try {
    const user_id = parseId(req.user?.id);
    if (user_id === null) {
      return res.status(400).json({ error: "user_id required" });
    }

    const data = await getStreakByUser(user_id);
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getStatsController = async (req, res) => {
  try {
    const user_id = parseId(req.user?.id);
    if (user_id === null) {
      return res.status(400).json({ error: "user_id required" });
    }

    const data = await getStatsByUser(user_id);
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getActivityController = async (req, res) => {
  try {
    const user_id = parseId(req.user?.id);
    if (user_id === null) {
      return res.status(400).json({ error: "user_id required" });
    }

    const data = await getActivityByUser(user_id);
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getDailyGoalController = async (req, res) => {
  try {
    const user_id = parseId(req.user?.id);
    if (user_id === null) {
      return res.status(400).json({ error: "user_id required" });
    }

    const data = await getDailyGoalByUser(user_id);
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getAchievementsController = async (req, res) => {
  try {
    const user_id = parseId(req.user?.id);
    if (user_id === null) {
      return res.status(400).json({ error: "user_id required" });
    }

    const data = await getAchievementsByUser(user_id);
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getHeatmapController = async (req, res) => {
  try {
    const user_id = parseId(req.user?.id);
    if (user_id === null) {
      return res.status(400).json({ error: "user_id required" });
    }

    const data = await getHeatmapByUser(user_id);
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getActiveTopicController = async (req, res) => {
  try {
    const user_id = parseId(req.user?.id);
    if (user_id === null) {
      return res.status(400).json({ error: "user_id required" });
    }

    const data = await getActiveTopicByUser(user_id);
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getMeController = async (req, res) => {
  try {
    const user_id = parseId(req.user?.id);
    if (user_id === null) {
      return res.status(400).json({ error: "user_id required" });
    }

    const data = await getMeByUser(user_id);
    return res.json(data || { id: user_id, display_name: "", email: "" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const updateDailyGoalController = async (req, res) => {
  try {
    const user_id = parseId(req.user?.id);
    if (user_id === null) {
      return res.status(400).json({ error: "user_id required" });
    }

    const { goal } = req.body;
    if (goal === undefined) {
      return res.status(400).json({ error: "goal is required" });
    }

    const updatedGoal = await updateDailyGoalByUser(user_id, goal);
    return res.json({ success: true, goalTasks: updatedGoal });
  } catch (err) {
    if (err.message === "Goal must be between 1 and 20") {
      return res.status(400).json({ error: err.message });
    }
    return res.status(500).json({ error: err.message });
  }
};
