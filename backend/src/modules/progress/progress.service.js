import pool from "../../db/index.js";

export const getTaskById = async (task_id) => {
  const result = await pool.query(
    `SELECT id, topic_id, order_index
     FROM tasks
     WHERE id = $1`,
    [task_id]
  );
  return result.rows[0] || null;
};

export const getPreviousTask = async (topic_id, order_index) => {
  const result = await pool.query(
    `SELECT id
     FROM tasks
     WHERE topic_id = $1 AND order_index < $2
     ORDER BY order_index DESC
     LIMIT 1`,
    [topic_id, order_index]
  );
  return result.rows[0] || null;
};

export const isTaskCompleted = async (user_id, task_id) => {
  const result = await pool.query(
    `SELECT 1
     FROM progress
     WHERE user_id = $1 AND task_id = $2`,
    [user_id, task_id]
  );
  return result.rows.length > 0;
};

export const insertProgress = async (user_id, task_id) => {
  const result = await pool.query(
    `INSERT INTO progress (user_id, task_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id, task_id) DO NOTHING
     RETURNING completed_at`,
    [user_id, task_id]
  );
  return result.rows[0] || null;
};

export const removeProgress = async (user_id, task_id) => {
  const result = await pool.query(
    `DELETE FROM progress
     WHERE user_id = $1 AND task_id = $2
     RETURNING completed_at`,
    [user_id, task_id]
  );
  return result.rows[0] || null;
};

export const isTopicVerified = async (user_id, topic_id) => {
  const result = await pool.query(
    `SELECT 1 FROM topic_verifications WHERE user_id = $1 AND topic_id = $2`,
    [user_id, topic_id]
  );
  return result.rows.length > 0;
};

const parseDate = (dateStr) => {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};

const toDateLabel = (dateObj) => {
  const y = dateObj.getUTCFullYear();
  const m = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
  const d = String(dateObj.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export const recomputeStreakForUser = async (user_id) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const todayResult = await client.query(
      `SELECT (NOW() AT TIME ZONE 'Asia/Kolkata')::date::text AS today`
    );
    const today = todayResult.rows[0]?.today;

    const activityResult = await client.query(
      `SELECT TO_CHAR(
          ((completed_at AT TIME ZONE 'UTC') AT TIME ZONE 'Asia/Kolkata')::date,
          'YYYY-MM-DD'
        ) AS activity_date
       FROM progress
       WHERE user_id = $1
       GROUP BY 1
       ORDER BY 1 ASC`,
      [user_id]
    );

    const activityDates = activityResult.rows.map((row) => row.activity_date);
    const dateSet = new Set(activityDates);
    const lastActivityDate = activityDates.length
      ? activityDates[activityDates.length - 1]
      : null;

    let currentStreak = 0;
    if (today && dateSet.has(today)) {
      let cursor = parseDate(today);
      while (dateSet.has(toDateLabel(cursor))) {
        currentStreak += 1;
        cursor.setUTCDate(cursor.getUTCDate() - 1);
      }
    }

    let longestStreak = 0;
    let run = 0;
    let prev = null;
    for (const dateStr of activityDates) {
      const date = parseDate(dateStr);
      if (!prev) {
        run = 1;
      } else {
        const diffDays = Math.round((date.getTime() - prev.getTime()) / (24 * 60 * 60 * 1000));
        run = diffDays === 1 ? run + 1 : 1;
      }
      if (run > longestStreak) {
        longestStreak = run;
      }
      prev = date;
    }

    await client.query(
      `INSERT INTO learning_streaks
        (user_id, current_streak_days, longest_streak_days, last_activity_date)
       VALUES ($1, $2, $3, $4::date)
       ON CONFLICT (user_id) DO UPDATE
       SET current_streak_days = EXCLUDED.current_streak_days,
           longest_streak_days = EXCLUDED.longest_streak_days,
           last_activity_date = EXCLUDED.last_activity_date`,
      [user_id, currentStreak, longestStreak, lastActivityDate]
    );

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export const updateStreakForUser = async (user_id) => {
  await recomputeStreakForUser(user_id);
};

const toNumber = (value) => Number.parseInt(String(value || 0), 10) || 0;

export const getSkillsProgressByUser = async (user_id) => {
  const result = await pool.query(
    `SELECT
       s.id,
       s.name,
       s.description,
       COUNT(DISTINCT tp.id) AS total_topics,
       COUNT(DISTINCT t.id) AS total_tasks,
       COUNT(DISTINCT p.task_id) AS completed_tasks
     FROM skills s
     LEFT JOIN topics tp ON tp.skill_id = s.id
     LEFT JOIN tasks t ON t.topic_id = tp.id
     LEFT JOIN progress p ON p.task_id = t.id AND p.user_id = $1
     GROUP BY s.id, s.name, s.description
     ORDER BY s.id ASC`,
    [user_id]
  );

  const topicResult = await pool.query(
    `SELECT tp.id,
            tp.skill_id,
            COUNT(t.id) AS total_tasks,
            COUNT(p.id) AS completed_tasks
     FROM topics tp
     LEFT JOIN tasks t ON t.topic_id = tp.id
     LEFT JOIN progress p ON p.task_id = t.id AND p.user_id = $1
     GROUP BY tp.id, tp.skill_id`,
    [user_id]
  );

  const completedTopicsBySkill = topicResult.rows.reduce((acc, row) => {
    const total = toNumber(row.total_tasks);
    const completed = toNumber(row.completed_tasks);
    if (total > 0 && completed === total) {
      acc[row.skill_id] = (acc[row.skill_id] || 0) + 1;
    }
    return acc;
  }, {});

  return result.rows.map((row) => {
    const totalTasks = toNumber(row.total_tasks);
    const completedTasks = toNumber(row.completed_tasks);
    const totalTopics = toNumber(row.total_topics);
    const completedTopics = completedTopicsBySkill[row.id] || 0;
    const progressPercentage =
      totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    let status = "not_started";
    if (completedTasks === totalTasks && totalTasks > 0) {
      status = "completed";
    } else if (completedTasks > 0) {
      status = "in_progress";
    }

    return {
      id: row.id,
      name: row.name,
      description: row.description,
      totalTopics,
      completedTopics,
      totalTasks,
      completedTasks,
      progressPercentage,
      status
    };
  });
};

const getUTCDateLabel = (dateStr) => {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    timeZone: "Asia/Kolkata"
  });
};

const buildDateSeries = (days, rows, labelType) => {
  const map = rows.reduce((acc, row) => {
    const rowDate = row.date instanceof Date ? row.date.toISOString().split("T")[0] : String(row.date);
    acc[rowDate] = toNumber(row.count);
    return acc;
  }, {});

  const result = [];
  const now = new Date();
  const base = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

  for (let i = days - 1; i >= 0; i -= 1) {
    const date = new Date(base);
    date.setUTCDate(base.getUTCDate() - i);

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const iso = `${year}-${month}-${day}`;

    const label =
      labelType === "weekday"
        ? getUTCDateLabel(iso)
        : new Date(Date.UTC(year, date.getUTCMonth(), date.getUTCDate())).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            timeZone: "Asia/Kolkata"
          });

    result.push({
      date: label,
      fullDate: iso,
      count: map[iso] || 0
    });
  }
  return result;
};

export const getWeeklyProgressByUser = async (user_id) => {
  // Get last 7 days activity from DB using IST timezone
  const result = await pool.query(
    `SELECT 
       TO_CHAR(
         completed_at AT TIME ZONE 'Asia/Kolkata', 
         'YYYY-MM-DD'
       ) AS date,
       COUNT(*) AS count
     FROM progress
     WHERE user_id = $1
       AND completed_at >= NOW() - INTERVAL '7 days'
     GROUP BY TO_CHAR(
       completed_at AT TIME ZONE 'Asia/Kolkata', 
       'YYYY-MM-DD'
     )
     ORDER BY date ASC`,
    [user_id]
  );

  // Build a map of date -> count from DB results
  const dbMap = {};
  result.rows.forEach((row) => {
    dbMap[row.date] = Number(row.count);
  });

  // Generate last 7 days in IST
  const days = [];
  for (let i = 6; i >= 0; i -= 1) {
    const utcNow = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istNow = new Date(utcNow.getTime() + istOffset);

    const d = new Date(istNow);
    d.setUTCDate(d.getUTCDate() - i);

    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;

    const label = new Date(
      Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
    ).toLocaleDateString("en-US", {
      weekday: "short",
      timeZone: "Asia/Kolkata"
    });

    days.push({
      date: label,
      fullDate: dateStr,
      count: dbMap[dateStr] || 0
    });
  }

  return days;
};

export const getProgressHistoryByUser = async (user_id) => {
  const result = await pool.query(
    `SELECT DATE(completed_at AT TIME ZONE 'Asia/Kolkata') AS date, COUNT(*) AS count
     FROM progress
     WHERE user_id = $1
       AND completed_at >= NOW() - INTERVAL '30 days'
     GROUP BY DATE(completed_at AT TIME ZONE 'Asia/Kolkata')
     ORDER BY date ASC`,
    [user_id]
  );

  return buildDateSeries(30, result.rows, "monthday");
};

export const getProgressInsightsByUser = async (user_id) => {
  const skills = await getSkillsProgressByUser(user_id);
  const strongest = skills
    .filter((skill) => skill.progressPercentage > 0)
    .sort((a, b) => b.progressPercentage - a.progressPercentage)[0];
  const weakest = skills
    .filter(
      (skill) =>
        skill.progressPercentage > 0 && skill.progressPercentage < 100
    )
    .sort((a, b) => a.progressPercentage - b.progressPercentage)[0];

  const mostDayResult = await pool.query(
    `SELECT TRIM(TO_CHAR(completed_at, 'Day')) AS day_name, COUNT(*) AS count
     FROM progress
     WHERE user_id = $1
     GROUP BY day_name
     ORDER BY count DESC
     LIMIT 1`,
    [user_id]
  );

  const weekResult = await pool.query(
    `SELECT COUNT(*) AS total
     FROM progress
     WHERE user_id = $1
       AND completed_at >= date_trunc('week', NOW())`,
    [user_id]
  );

  const monthResult = await pool.query(
    `SELECT COUNT(*) AS total
     FROM progress
     WHERE user_id = $1
       AND completed_at >= date_trunc('month', NOW())`,
    [user_id]
  );

  const total30Result = await pool.query(
    `SELECT COUNT(*) AS total
     FROM progress
     WHERE user_id = $1
       AND completed_at >= NOW() - INTERVAL '30 days'`,
    [user_id]
  );

  const topicsResult = await pool.query(
    `SELECT tp.id AS topic_id,
            tp.order_index,
            COUNT(t.id) AS total_tasks,
            COUNT(p.id) AS completed_tasks
     FROM topics tp
     LEFT JOIN tasks t ON t.topic_id = tp.id
     LEFT JOIN progress p
       ON p.task_id = t.id
      AND p.user_id = $1
     GROUP BY tp.id, tp.order_index
     ORDER BY tp.order_index ASC`,
    [user_id]
  );

  const topics = topicsResult.rows.reduce((acc, row) => {
    acc[row.topic_id] = {
      totalTasks: toNumber(row.total_tasks),
      completedTasks: toNumber(row.completed_tasks),
      orderIndex: row.order_index
    };
    return acc;
  }, {});

  const topicList = Object.entries(topics)
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => a.orderIndex - b.orderIndex);

  let unlockedTasks = 0;
  const firstIncomplete = topicList.find(
    (topic) => topic.totalTasks > 0 && topic.completedTasks < topic.totalTasks
  );

  if (!firstIncomplete) {
    unlockedTasks = topicList.reduce((sum, topic) => sum + topic.totalTasks, 0);
  } else {
    for (const topic of topicList) {
      if (topic.id === firstIncomplete.id) {
        unlockedTasks += Math.min(
          topic.completedTasks + 1,
          topic.totalTasks
        );
        break;
      }
      unlockedTasks += topic.totalTasks;
    }
  }

  const totalCompletedLast30 = toNumber(total30Result.rows[0]?.total || 0);
  const totalCompletedAllResult = await pool.query(
    `SELECT COUNT(*) AS total
     FROM progress
     WHERE user_id = $1`,
    [user_id]
  );
  const totalCompletedAll = toNumber(totalCompletedAllResult.rows[0]?.total || 0);
  const averagePerDay = Math.round((totalCompletedLast30 / 30) * 10) / 10;
  const completionRate =
    unlockedTasks === 0
      ? 0
      : Math.round((totalCompletedAll / unlockedTasks) * 100);

  return {
    strongestSkill: strongest
      ? { name: strongest.name, progressPercentage: strongest.progressPercentage }
      : null,
    weakestSkill: weakest
      ? { name: weakest.name, progressPercentage: weakest.progressPercentage }
      : null,
    mostProductiveDay: mostDayResult.rows[0]
      ? {
          day: mostDayResult.rows[0].day_name,
          count: toNumber(mostDayResult.rows[0].count)
        }
      : null,
    totalThisWeek: toNumber(weekResult.rows[0]?.total || 0),
    totalThisMonth: toNumber(monthResult.rows[0]?.total || 0),
    averagePerDay,
    completionRate
  };
};
