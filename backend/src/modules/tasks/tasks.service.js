import pool from "../../db/index.js";

export const getTasksByTopicIdForUser = async (topicId, userId) => {
  // First, check if the topic itself is locked
  const topicResult = await pool.query(
    `SELECT skill_id, order_index FROM topics WHERE id = $1`,
    [topicId]
  );

  if (topicResult.rows.length === 0) {
    return [];
  }

  const { skill_id, order_index } = topicResult.rows[0];

  // Check if any previous topic is not completed or verified
  const prevTopicsResult = await pool.query(
    `SELECT t.id,
            COUNT(ts.id) AS total_tasks,
            COUNT(p.task_id) AS completed_tasks,
            tv.score AS verification_score
     FROM topics t
     LEFT JOIN tasks ts ON ts.topic_id = t.id
     LEFT JOIN progress p ON p.task_id = ts.id AND p.user_id = $2
     LEFT JOIN topic_verifications tv ON tv.topic_id = t.id AND tv.user_id = $2
     WHERE t.skill_id = $1 AND t.order_index < $3
     GROUP BY t.id, tv.score
     ORDER BY t.order_index ASC`,
    [skill_id, userId, order_index]
  );

  const isTopicLocked = prevTopicsResult.rows.some((row) => {
    const total = Number(row.total_tasks || 0);
    const completed = Number(row.completed_tasks || 0);
    const isCompleted = total > 0 && completed === total;
    const isVerified = row.verification_score !== null;
    return !isCompleted || !isVerified;
  });

  const result = await pool.query(
    `SELECT t.id,
            t.title,
            t.description,
            t.order_index,
            p.completed_at
     FROM tasks t
     LEFT JOIN progress p
       ON p.task_id = t.id
      AND p.user_id = $2
     WHERE t.topic_id = $1
     ORDER BY t.order_index ASC`,
    [topicId, userId]
  );

  const tasks = result.rows.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    order_index: row.order_index,
    completed: Boolean(row.completed_at),
    completedAt: row.completed_at
  }));

  if (isTopicLocked) {
    return tasks.map((task) => ({ ...task, unlocked: false }));
  }

  let unlocked = true;
  return tasks.map((task) => {
    const taskUnlocked = unlocked;
    if (!task.completed) {
      unlocked = false;
    }
    return {
      ...task,
      unlocked: taskUnlocked
    };
  });
};

export const createTask = async ({
  topic_id,
  title,
  description,
  order_index
}) => {
  const result = await pool.query(
    `INSERT INTO tasks (topic_id, title, description, order_index)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [topic_id, title, description, order_index || 0]
  );

  return result.rows[0];
};
