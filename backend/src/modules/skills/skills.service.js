import pool from "../../config/db.js";

export const getAllSkills = async () => {
  const result = await pool.query(
    "SELECT id, name, description FROM skills ORDER BY id"
  );
  return result.rows;
};

export const createSkill = async ({ name, description }) => {
  const result = await pool.query(
    `INSERT INTO skills (name, description)
     VALUES ($1, $2)
     RETURNING id, name, description`,
    [name, description]
  );

  return result.rows[0];
};