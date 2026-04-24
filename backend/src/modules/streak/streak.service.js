import pool from "../../db/index.js";

export const getStreakByUserId = async (user_id) => {
  const result = await pool.query(
    `SELECT current_streak_days, longest_streak_days, last_activity_date
     FROM learning_streaks
     WHERE user_id = $1`,
    [user_id]
  );

  return (
    result.rows[0] || {
      current_streak_days: 0,
      longest_streak_days: 0,
      last_activity_date: null
    }
  );
};
