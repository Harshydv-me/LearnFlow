import pool from "../../db/index.js";

export const getTasksByTopicIdForUser = async (topicId, userId) => {
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
