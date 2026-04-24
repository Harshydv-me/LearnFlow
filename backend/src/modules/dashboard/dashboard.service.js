import pool from "../../db/index.js";
import { getStreakByUserId } from "../streak/streak.service.js";

export const getSkillsList = async () => {
  const result = await pool.query(
    `SELECT id, name, description
     FROM skills
     ORDER BY id`
  );
  return result.rows;
};

export const getSkillsProgressByUser = async (user_id) => {
  const result = await pool.query(
    `SELECT s.id,
            s.name,
            s.description,
            COUNT(DISTINCT t.id) AS total_tasks,
            COUNT(DISTINCT p.task_id) AS completed_tasks,
            COUNT(DISTINCT tp.id) AS total_topics,
            SUM(tv.score) AS total_correct
     FROM skills s
     LEFT JOIN topics tp ON tp.skill_id = s.id
     LEFT JOIN tasks t ON t.topic_id = tp.id
     LEFT JOIN progress p ON p.task_id = t.id AND p.user_id = $1
     LEFT JOIN topic_verifications tv ON tv.topic_id = tp.id AND tv.user_id = $1
     GROUP BY s.id, s.name, s.description
     ORDER BY s.id`,
    [user_id]
  );

  return result.rows.map((row) => {
    const totalTasks = Number(row.total_tasks || 0);
    const completedTasks = Number(row.completed_tasks || 0);
    const totalTopics = Number(row.total_topics || 0);
    const totalCorrect = Number(row.total_correct || 0);
    
    const progressPercentage =
      totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    const maxSkillScore = totalTopics * 10;
    const skillScore = totalTopics > 0 ? totalCorrect : null;

    return {
      id: row.id,
      name: row.name,
      description: row.description,
      totalTasks,
      completedTasks,
      totalTopics,
      totalCorrect,
      maxSkillScore,
      skillScore,
      progressPercentage
    };
  });
};

export const getTopicsBySkillForUser = async (skillId, user_id) => {
  const result = await pool.query(
    `SELECT t.id,
            t.title,
            t.description,
            t.order_index,
            COUNT(ts.id) AS total_tasks,
            COUNT(p.task_id) AS completed_tasks,
            tv.score AS verification_score
     FROM topics t
     LEFT JOIN tasks ts ON ts.topic_id = t.id
     LEFT JOIN progress p
       ON p.task_id = ts.id
      AND p.user_id = $2
     LEFT JOIN topic_verifications tv
       ON tv.topic_id = t.id
      AND tv.user_id = $2
     WHERE t.skill_id = $1
     GROUP BY t.id, tv.score
     ORDER BY t.order_index ASC`,
    [skillId, user_id]
  );

  const topics = result.rows.map((row) => {
    const total = Number(row.total_tasks || 0);
    const completed = Number(row.completed_tasks || 0);
    const verificationScore = row.verification_score !== null ? Number(row.verification_score) : null;

    return {
      id: row.id,
      title: row.title,
      description: row.description,
      order_index: row.order_index,
      totalTasks: total,
      completedTasks: completed,
      isCompleted: total > 0 && completed === total,
      verificationScore,
      isVerified: verificationScore !== null,
      isCurrent: false,
      isLocked: false
    };
  });

  const currentIndex = topics.findIndex((topic) => !topic.isCompleted);
  if (currentIndex !== -1) {
    topics.forEach((topic, index) => {
      topic.isCurrent = index === currentIndex;
      topic.isLocked = index > currentIndex;
    });
  }

  return topics;
};

export const getDashboardOverview = async (user_id) => {
  const topicsResult = await pool.query(
    `SELECT t.id,
            t.title,
            t.description,
            t.order_index,
            s.id AS skill_id,
            s.name AS skill_name
     FROM topics t
     JOIN skills s ON s.id = t.skill_id
     ORDER BY s.id ASC, t.order_index ASC, t.id ASC`
  );

  const topics = topicsResult.rows;
  if (topics.length === 0) {
    return {
      skill: null,
      totalTopics: 0,
      completedTopics: 0,
      overallProgress: 0
    };
  }

  const progressResult = await pool.query(
    `SELECT t.id AS topic_id,
            COUNT(ts.id) AS total_tasks,
            COUNT(p.task_id) AS completed_tasks
     FROM topics t
     LEFT JOIN tasks ts ON ts.topic_id = t.id
     LEFT JOIN progress p
       ON p.task_id = ts.id
      AND p.user_id = $1
     GROUP BY t.id`,
    [user_id]
  );

  const progressByTopicId = new Map(
    progressResult.rows.map((row) => [
      Number(row.topic_id),
      {
        total: Number(row.total_tasks || 0),
        completed: Number(row.completed_tasks || 0)
      }
    ])
  );

  const totalTopics = topics.filter((topic) => {
    const stat = progressByTopicId.get(Number(topic.id));
    return (stat?.total || 0) > 0;
  }).length;

  const completedTopics = progressResult.rows.filter((row) => {
    const total = Number(row.total_tasks || 0);
    const completed = Number(row.completed_tasks || 0);
    return total > 0 && completed === total;
  }).length;

  const overallProgress = totalTopics === 0
    ? 0
    : Math.round((completedTopics / totalTopics) * 100);

  const firstTopic = topics[0] || null;

  return {
    skill: firstTopic
      ? {
          id: firstTopic.skill_id,
          name: firstTopic.skill_name,
          description: null
        }
      : null,
    totalTopics,
    completedTopics,
    overallProgress
  };
};

export const getStreakByUser = async (user_id) => {
  return await getStreakByUserId(user_id);
};

export const getStatsByUser = async (user_id) => {
  const result = await pool.query(
    `SELECT
       COUNT(*) AS total_completed,
       COUNT(*) FILTER (WHERE completed_at >= NOW() - INTERVAL '7 days') AS weekly_completed
     FROM progress
     WHERE user_id = $1`,
    [user_id]
  );

  const total = Number(result.rows[0]?.total_completed || 0);
  const weekly = Number(result.rows[0]?.weekly_completed || 0);

  return {
    totalTasksCompleted: total,
    weeklyCompleted: Math.min(weekly, total)
  };
};

export const getActivityByUser = async (user_id) => {
  const result = await pool.query(
    `SELECT 
       TO_CHAR(p.completed_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as completed_at,
       t.title
     FROM progress p
     JOIN tasks t ON t.id = p.task_id
     WHERE p.user_id = $1
     ORDER BY p.completed_at DESC
     LIMIT 10`,
    [user_id]
  );

  return result.rows.map((row) => ({
    type: "task_completed",
    title: row.title,
    timestamp: row.completed_at
  }));
};

export const getDailyGoalByUser = async (user_id) => {
  // Get user's daily goal from database
  const goalResult = await pool.query(
    `SELECT daily_goal FROM users WHERE id = $1`,
    [user_id]
  );

  const goalTasks = Number(goalResult.rows[0]?.daily_goal || 3);

  // completed_at is stored as UTC-like timestamp (without timezone), so
  // convert UTC -> Asia/Kolkata before comparing calendar dates.
  const result = await pool.query(
    `SELECT COUNT(*) AS completed_today
     FROM progress
     WHERE user_id = $1
       AND ((completed_at AT TIME ZONE 'UTC') AT TIME ZONE 'Asia/Kolkata')::date =
           (NOW() AT TIME ZONE 'Asia/Kolkata')::date`,
    [user_id]
  );

  const completedTasks = Number(result.rows[0]?.completed_today || 0);
  const percentage = goalTasks === 0
    ? 0
    : Math.min(100, Math.round((completedTasks / goalTasks) * 100));

  return { goalTasks, completedTasks, percentage };
};

export const updateDailyGoalByUser = async (user_id, goal) => {
  const numGoal = Number(goal);
  if (isNaN(numGoal) || numGoal < 1 || numGoal > 20) {
    throw new Error("Goal must be between 1 and 20");
  }

  const result = await pool.query(
    `UPDATE users SET daily_goal = $1 WHERE id = $2 RETURNING daily_goal`,
    [numGoal, user_id]
  );

  return result.rows[0].daily_goal;
};

export const getAchievementsByUser = async (user_id) => {
  const stats = await getStatsByUser(user_id);
  const streak = await getStreakByUser(user_id);
  const dashboard = await getDashboardOverview(user_id);

  const hasCompletedTopic = dashboard.completedTopics > 0;

  return [
    {
      id: 1,
      title: "First Step",
      description: "Complete your first task.",
      unlocked: stats.totalTasksCompleted >= 1
    },
    {
      id: 2,
      title: "Getting Started",
      description: "Complete 5 tasks.",
      unlocked: stats.totalTasksCompleted >= 5
    },
    {
      id: 3,
      title: "On a Roll",
      description: "Complete 10 tasks.",
      unlocked: stats.totalTasksCompleted >= 10
    },
    {
      id: 4,
      title: "Streak Starter",
      description: "Reach a 3 day streak.",
      unlocked: streak.current_streak_days >= 3
    },
    {
      id: 5,
      title: "Week Warrior",
      description: "Reach a 7 day streak.",
      unlocked: streak.current_streak_days >= 7
    },
    {
      id: 6,
      title: "Topic Master",
      description: "Complete a full topic.",
      unlocked: hasCompletedTopic
    }
  ];
};

export const getHeatmapByUser = async (user_id) => {
  const result = await pool.query(
    `WITH bounds AS (
       SELECT
         MAKE_DATE(EXTRACT(YEAR FROM CURRENT_DATE)::int, 1, 1) AS start_day,
         MAKE_DATE(EXTRACT(YEAR FROM CURRENT_DATE)::int, 12, 31) AS end_day
     ),
     day_series AS (
       SELECT d::date AS day
       FROM bounds b,
            generate_series(b.start_day, b.end_day, INTERVAL '1 day') AS d
     ),
     activity AS (
       SELECT completed_at::date AS day,
              COUNT(*)::int AS count
       FROM progress
       WHERE user_id = $1
       GROUP BY 1
     )
     SELECT TO_CHAR(ds.day, 'YYYY-MM-DD') AS date,
            COALESCE(a.count, 0)::int AS count
     FROM day_series ds
     LEFT JOIN activity a ON a.day = ds.day
     ORDER BY ds.day`,
    [user_id]
  );

  return result.rows.map((row) => ({
    date: row.date,
    count: Number(row.count || 0)
  }));
};

export const getActiveTopicByUser = async (user_id) => {
  const lastWorkedResult = await pool.query(
    `SELECT tp.id AS topic_id,
            tp.title,
            tp.description,
            tp.order_index,
            sk.name AS skill_name
     FROM progress p
     JOIN tasks t ON t.id = p.task_id
     JOIN topics tp ON tp.id = t.topic_id
     JOIN skills sk ON sk.id = tp.skill_id
     WHERE p.user_id = $1
     ORDER BY p.completed_at DESC
     LIMIT 1`,
    [user_id]
  );

  const topicBase = lastWorkedResult.rows[0];

  // Fallback for brand-new users with no progress yet.
  if (!topicBase) {
    const firstTopicResult = await pool.query(
      `SELECT tp.id AS topic_id,
              tp.title,
              tp.description,
              tp.order_index,
              sk.name AS skill_name
       FROM topics tp
       JOIN skills sk ON sk.id = tp.skill_id
       ORDER BY sk.id ASC, tp.order_index ASC, tp.id ASC
       LIMIT 1`
    );
    const firstTopic = firstTopicResult.rows[0];
    if (!firstTopic) {
      return null;
    }
    return {
      id: firstTopic.topic_id,
      topicId: firstTopic.topic_id,
      title: firstTopic.title,
      description: firstTopic.description,
      order_index: firstTopic.order_index,
      skillName: firstTopic.skill_name,
      totalTasks: 0,
      completedTasks: 0,
      nextTaskTitle: null
    };
  }

  const countsResult = await pool.query(
    `SELECT COUNT(t.id) AS total_tasks,
            COUNT(p.id) AS completed_tasks
     FROM tasks t
     LEFT JOIN progress p
       ON p.task_id = t.id
      AND p.user_id = $2
     WHERE t.topic_id = $1`,
    [topicBase.topic_id, user_id]
  );

  const nextTaskResult = await pool.query(
    `SELECT t.title
     FROM tasks t
     LEFT JOIN progress p
       ON p.task_id = t.id
      AND p.user_id = $2
     WHERE t.topic_id = $1
       AND p.id IS NULL
     ORDER BY t.order_index ASC, t.id ASC
     LIMIT 1`,
    [topicBase.topic_id, user_id]
  );

  const totalTasks = Number(countsResult.rows[0]?.total_tasks || 0);
  const completedTasks = Number(countsResult.rows[0]?.completed_tasks || 0);
  const topicCompleted = totalTasks > 0 && completedTasks === totalTasks;

  // Check if current topic is verified
  const verificationResult = await pool.query(
    `SELECT 1 FROM topic_verifications WHERE user_id = $1 AND topic_id = $2`,
    [user_id, topicBase.topic_id]
  );
  const topicVerified = verificationResult.rows.length > 0;

  if (topicCompleted && topicVerified) {
    const nextTopicResult = await pool.query(
      `SELECT tp.id AS topic_id,
              tp.title,
              tp.description,
              tp.order_index,
              sk.name AS skill_name
       FROM topics tp
       JOIN skills sk ON sk.id = tp.skill_id
       WHERE tp.skill_id = (
         SELECT tp2.skill_id
         FROM topics tp2
         WHERE tp2.id = $1
       )
         AND tp.order_index > $2
       ORDER BY tp.order_index ASC, tp.id ASC
       LIMIT 1`,
      [topicBase.topic_id, topicBase.order_index]
    );

    const nextTopic = nextTopicResult.rows[0];
    if (nextTopic) {
      const nextTopicCounts = await pool.query(
        `SELECT COUNT(t.id) AS total_tasks,
                COUNT(p.id) AS completed_tasks
         FROM tasks t
         LEFT JOIN progress p
           ON p.task_id = t.id
          AND p.user_id = $2
         WHERE t.topic_id = $1`,
        [nextTopic.topic_id, user_id]
      );

      const nextTopicTask = await pool.query(
        `SELECT t.title
         FROM tasks t
         LEFT JOIN progress p
           ON p.task_id = t.id
          AND p.user_id = $2
         WHERE t.topic_id = $1
           AND p.id IS NULL
         ORDER BY t.order_index ASC, t.id ASC
         LIMIT 1`,
        [nextTopic.topic_id, user_id]
      );

      return {
        id: nextTopic.topic_id,
        topicId: nextTopic.topic_id,
        title: nextTopic.title,
        description: nextTopic.description,
        order_index: nextTopic.order_index,
        skillName: nextTopic.skill_name,
        totalTasks: Number(nextTopicCounts.rows[0]?.total_tasks || 0),
        completedTasks: Number(nextTopicCounts.rows[0]?.completed_tasks || 0),
        nextTaskTitle: nextTopicTask.rows[0]?.title || null
      };
    }
  }

  return {
    id: topicBase.topic_id,
    topicId: topicBase.topic_id,
    title: topicBase.title,
    description: topicBase.description,
    order_index: topicBase.order_index,
    skillName: topicBase.skill_name,
    totalTasks,
    completedTasks,
    nextTaskTitle: nextTaskResult.rows[0]?.title || null
  };
};

export const getMeByUser = async (user_id) => {
  const result = await pool.query(
    `SELECT id, display_name, email
     FROM users
     WHERE id = $1`,
    [user_id]
  );

  return result.rows[0] || null;
};

export const getRecommendedTopicsByUser = async (user_id) => {
  const result = await pool.query(
    `SELECT t.id,
            t.title,
            t.description,
            t.order_index,
            s.name AS skill_name,
            COUNT(ts.id) AS total_tasks,
            COUNT(p.id) AS completed_tasks
     FROM topics t
     JOIN skills s ON s.id = t.skill_id
     LEFT JOIN tasks ts ON ts.topic_id = t.id
     LEFT JOIN progress p ON p.task_id = ts.id AND p.user_id = $1
     GROUP BY t.id, s.name
     ORDER BY t.order_index ASC`,
    [user_id]
  );

  const topics = result.rows.map((row) => {
    const totalTasks = Number(row.total_tasks || 0);
    const completedTasks = Number(row.completed_tasks || 0);
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      skillName: row.skill_name,
      totalTasks,
      completedTasks,
      isCompleted: totalTasks > 0 && completedTasks === totalTasks
    };
  });

  const currentIndex = topics.findIndex((topic) => !topic.isCompleted);
  const currentTopic = currentIndex !== -1 ? topics[currentIndex] : null;

  const filtered = topics.filter((topic) => {
    if (topic.isCompleted) return false;
    if (topic.completedTasks > 0 && topic.completedTasks < topic.totalTasks) {
      return true;
    }
    if (currentTopic && topic.id === currentTopic.id && topic.completedTasks === 0) {
      return true;
    }
    return false;
  });

  return filtered.slice(0, 4);
};
