import pool from "../../db/index.js";

export const getTopicsBySkillId = async (skillId) => {
  const result = await pool.query(
    `SELECT id, skill_id, title, description, order_index
     FROM topics
     WHERE skill_id = $1
     ORDER BY order_index, id`,
    [skillId]
  );

  return result.rows;
};

export const createTopicRecord = async ({ skillId, title, description, orderIndex }) => {
  const result = await pool.query(
    `INSERT INTO topics (skill_id, title, description, order_index)
     VALUES ($1, $2, $3, $4)
     RETURNING id, skill_id, title, description, order_index`,
    [skillId, title, description, orderIndex]
  );

  return result.rows[0];
};
