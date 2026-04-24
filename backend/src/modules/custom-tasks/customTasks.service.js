import pool from "../../db/index.js";

export const getCustomTasks = async (userId) => {
  const result = await pool.query(
    `SELECT id, title, description, priority, completed, completed_at, created_at
     FROM custom_tasks
     WHERE user_id = $1
     ORDER BY
       completed ASC,
       CASE priority
         WHEN 'high' THEN 1
         WHEN 'medium' THEN 2
         WHEN 'low' THEN 3
       END ASC,
       created_at DESC`,
    [userId]
  );
  return result.rows;
};

export const createCustomTask = async (userId, taskData) => {
  const { title, description, priority = 'medium' } = taskData;

  if (!title || title.trim().length === 0) {
    throw new Error("Title is required");
  }

  if (title.length > 200) {
    throw new Error("Title must be 200 characters or less");
  }

  if (description && description.length > 1000) {
    throw new Error("Description must be 1000 characters or less");
  }

  if (!['low', 'medium', 'high'].includes(priority)) {
    throw new Error("Priority must be 'low', 'medium', or 'high'");
  }

  const result = await pool.query(
    `INSERT INTO custom_tasks (user_id, title, description, priority)
     VALUES ($1, $2, $3, $4)
     RETURNING id, title, description, priority, completed, completed_at, created_at`,
    [userId, title.trim(), description, priority]
  );

  return result.rows[0];
};

export const updateCustomTask = async (userId, taskId, updates) => {
  // First verify ownership
  const existing = await pool.query(
    `SELECT id FROM custom_tasks WHERE id = $1 AND user_id = $2`,
    [taskId, userId]
  );

  if (existing.rows.length === 0) {
    throw new Error("Task not found");
  }

  const { title, description, priority } = updates;
  const fields = [];
  const values = [];
  let paramCount = 1;

  if (title !== undefined) {
    if (!title || title.trim().length === 0) {
      throw new Error("Title is required");
    }
    if (title.length > 200) {
      throw new Error("Title must be 200 characters or less");
    }
    fields.push(`title = $${paramCount++}`);
    values.push(title.trim());
  }

  if (description !== undefined) {
    if (description && description.length > 1000) {
      throw new Error("Description must be 1000 characters or less");
    }
    fields.push(`description = $${paramCount++}`);
    values.push(description);
  }

  if (priority !== undefined) {
    if (!['low', 'medium', 'high'].includes(priority)) {
      throw new Error("Priority must be 'low', 'medium', or 'high'");
    }
    fields.push(`priority = $${paramCount++}`);
    values.push(priority);
  }

  if (fields.length === 0) {
    throw new Error("No valid fields to update");
  }

  fields.push(`updated_at = NOW()`);
  values.push(taskId, userId);

  const result = await pool.query(
    `UPDATE custom_tasks
     SET ${fields.join(', ')}
     WHERE id = $${paramCount} AND user_id = $${paramCount + 1}
     RETURNING id, title, description, priority, completed, completed_at, created_at`,
    values
  );

  return result.rows[0];
};

export const toggleCustomTaskComplete = async (userId, taskId) => {
  // First verify ownership
  const existing = await pool.query(
    `SELECT id, completed FROM custom_tasks WHERE id = $1 AND user_id = $2`,
    [taskId, userId]
  );

  if (existing.rows.length === 0) {
    throw new Error("Task not found");
  }

  const currentlyCompleted = existing.rows[0].completed;
  const newCompleted = !currentlyCompleted;
  const completedAt = newCompleted ? "NOW()" : "NULL";

  const result = await pool.query(
    `UPDATE custom_tasks
     SET completed = $1, completed_at = ${completedAt}, updated_at = NOW()
     WHERE id = $2 AND user_id = $3
     RETURNING id, title, description, priority, completed, completed_at, created_at`,
    [newCompleted, taskId, userId]
  );

  return result.rows[0];
};

export const deleteCustomTask = async (userId, taskId) => {
  const result = await pool.query(
    `DELETE FROM custom_tasks WHERE id = $1 AND user_id = $2`,
    [taskId, userId]
  );

  if (result.rowCount === 0) {
    throw new Error("Task not found");
  }

  return { success: true };
};
