import pool from "../../db/index.js";
import { getStreakByUserId } from "../streak/streak.service.js";

const formatMemberSince = (dateValue) => {
  if (!dateValue) return "";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("en-US", { month: "long", year: "numeric" });
};

export const getProfileData = async (userId) => {
  const userResult = await pool.query(
    `SELECT id, display_name, email, username, created_at
     FROM users
     WHERE id = $1`,
    [userId]
  );

  const userRow = userResult.rows[0] || null;

  const totalTasksResult = await pool.query(
    "SELECT COUNT(*) AS total FROM progress WHERE user_id = $1",
    [userId]
  );

  const totalTopicsResult = await pool.query(
    `SELECT COUNT(DISTINCT t.topic_id) AS total
     FROM progress p
     JOIN tasks t ON t.id = p.task_id
     WHERE p.user_id = $1
       AND (
         SELECT COUNT(*) FROM tasks t2 WHERE t2.topic_id = t.topic_id
       ) = (
         SELECT COUNT(*) FROM progress p2
         JOIN tasks t3 ON t3.id = p2.task_id
         WHERE p2.user_id = $1 AND t3.topic_id = t.topic_id
       )`,
    [userId]
  );

  const totalSkillsResult = await pool.query(
    `SELECT COUNT(DISTINCT tp.skill_id) AS total
     FROM progress p
     JOIN tasks t ON t.id = p.task_id
     JOIN topics tp ON tp.id = t.topic_id
     WHERE p.user_id = $1`,
    [userId]
  );

  const streakResult = await getStreakByUserId(userId);

  const currentStreak = Number(streakResult?.current_streak_days || 0);
  const longestStreak = Number(streakResult?.longest_streak_days || 0);

  return {
    user: {
      id: userRow?.id ?? userId,
      display_name: userRow?.display_name || "",
      email: userRow?.email || "",
      username: userRow?.username || "",
      member_since: formatMemberSince(userRow?.created_at)
    },
    stats: {
      totalTasksCompleted: Number(totalTasksResult.rows[0]?.total || 0),
      totalTopicsCompleted: Number(totalTopicsResult.rows[0]?.total || 0),
      totalSkillsStarted: Number(totalSkillsResult.rows[0]?.total || 0),
      longestStreak,
      currentStreak
    }
  };
};

export const updateDisplayName = async (userId, displayName) => {
  const result = await pool.query(
    `UPDATE users
     SET display_name = $1
     WHERE id = $2
     RETURNING id, display_name, email`,
    [displayName, userId]
  );

  return result.rows[0] || null;
};

export const getPublicProfileByUsername = async (username) => {
  const userResult = await pool.query(
    `SELECT id, display_name, username, created_at
     FROM users
     WHERE LOWER(username) = LOWER($1)`,
    [username]
  );

  const user = userResult.rows[0];
  if (!user) {
    throw new Error("User not found");
  }

  const skillsResult = await pool.query(
    `SELECT
       s.id,
       s.name,
       s.description,
       COUNT(DISTINCT t.id) AS total_tasks,
       COUNT(DISTINCT p.task_id) AS completed_tasks
     FROM skills s
     LEFT JOIN topics tp ON tp.skill_id = s.id
     LEFT JOIN tasks t ON t.topic_id = tp.id
     LEFT JOIN progress p ON p.task_id = t.id AND p.user_id = $1
     GROUP BY s.id, s.name, s.description
     ORDER BY s.id ASC`,
    [user.id]
  );

  const topicsResult = await pool.query(
    `SELECT
       tp.skill_id,
       tp.id AS topic_id,
       tp.title,
       tv.score,
       tv.verified_at
     FROM topics tp
     LEFT JOIN topic_verifications tv ON tv.topic_id = tp.id AND tv.user_id = $1
     ORDER BY tp.order_index ASC`,
    [user.id]
  );

  const topicsBySkill = topicsResult.rows.reduce((acc, row) => {
    if (!acc[row.skill_id]) acc[row.skill_id] = [];
    acc[row.skill_id].push({
      id: row.topic_id,
      title: row.title,
      score: row.score !== null ? Number(row.score) : null,
      verifiedAt: row.verified_at
    });
    return acc;
  }, {});

  const skills = skillsResult.rows.map((row) => {
    const totalTasks = Number(row.total_tasks || 0);
    const completedTasks = Number(row.completed_tasks || 0);
    const progressPercentage =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    const skillTopics = topicsBySkill[row.id] || [];
    const verifiedTopics = skillTopics.filter(t => t.score !== null);
    
    const totalCorrect = verifiedTopics.reduce((sum, t) => sum + (t.score || 0), 0);
    const maxSkillScore = skillTopics.length * 10;

    return {
      id: row.id,
      name: row.name,
      description: row.description,
      totalTasks,
      completedTasks,
      progressPercentage,
      topics: skillTopics,
      isVerified: verifiedTopics.length > 0 && verifiedTopics.length === skillTopics.length,
      totalCorrect,
      maxSkillScore
    };
  });

  const totalTasksCompletedResult = await pool.query(
    `SELECT COUNT(*) as total_tasks_completed
     FROM progress
     WHERE user_id = $1`,
    [user.id]
  );

  const streakResult = await pool.query(
    `SELECT current_streak_days, longest_streak_days
     FROM learning_streaks
     WHERE user_id = $1`,
    [user.id]
  );

  const verifiedTopicsResult = await pool.query(
    `SELECT COUNT(*) as verified_topics
     FROM topic_verifications
     WHERE user_id = $1`,
    [user.id]
  );

  const memberDate = new Date(user.created_at);
  const memberSince = Number.isNaN(memberDate.getTime())
    ? ""
    : memberDate.toLocaleString("en-US", { month: "long", year: "numeric" });

  return {
    user: {
      display_name: user.display_name,
      username: user.username,
      memberSince
    },
    skills,
    stats: {
      totalTasksCompleted: Number(totalTasksCompletedResult.rows[0]?.total_tasks_completed || 0),
      verifiedTopics: Number(verifiedTopicsResult.rows[0]?.verified_topics || 0),
      currentStreak: Number(streakResult.rows[0]?.current_streak_days || 0),
      longestStreak: Number(streakResult.rows[0]?.longest_streak_days || 0)
    }
  };
};
