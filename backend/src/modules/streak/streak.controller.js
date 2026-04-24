import { getStreakByUserId } from "./streak.service.js";

export const getStreak = async (req, res) => {
  try {
    const user_id = Number.parseInt(String(req.user?.id), 10);
    if (Number.isNaN(user_id)) {
      return res.status(400).json({ error: "user_id required" });
    }

    const streak = await getStreakByUserId(user_id);
    return res.json({
      current_streak_days: streak.current_streak_days ?? 0,
      longest_streak_days: streak.longest_streak_days ?? 0
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
