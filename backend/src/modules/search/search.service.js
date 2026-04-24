import pool from "../../db/index.js";

const toNumber = (value) => Number.parseInt(String(value || 0), 10) || 0;

export const search = async (query, userId) => {
  const trimmed = query.trim().slice(0, 100);
  const like = `%${trimmed}%`;
  const startsWith = `${trimmed}%`;

  const skillsResult = await pool.query(
    `SELECT id, name, description
     FROM skills
     WHERE LOWER(name) LIKE LOWER($1)
        OR LOWER(description) LIKE LOWER($1)
     ORDER BY
       CASE WHEN LOWER(name) LIKE LOWER($2) THEN 0 ELSE 1 END,
       name ASC
     LIMIT 5`,
    [like, startsWith]
  );

  const topicsResult = await pool.query(
    `SELECT
       tp.id,
       tp.title,
       tp.description,
       tp.skill_id,
       sk.name AS skill_name,
       COUNT(t.id) AS total_tasks,
       COUNT(p.task_id) AS completed_tasks
     FROM topics tp
     JOIN skills sk ON sk.id = tp.skill_id
     LEFT JOIN tasks t ON t.topic_id = tp.id
     LEFT JOIN progress p ON p.task_id = t.id AND p.user_id = $3
     WHERE LOWER(tp.title) LIKE LOWER($1)
        OR LOWER(tp.description) LIKE LOWER($1)
     GROUP BY tp.id, tp.title, tp.description, tp.skill_id, sk.name
     ORDER BY
       CASE WHEN LOWER(tp.title) LIKE LOWER($2) THEN 0 ELSE 1 END,
       tp.title ASC
     LIMIT 8`,
    [like, startsWith, userId]
  );

  const topics = topicsResult.rows.map((row) => {
    const totalTasks = toNumber(row.total_tasks);
    const completedTasks = toNumber(row.completed_tasks);
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
      title: row.title,
      description: row.description,
      skillId: row.skill_id,
      skillName: row.skill_name,
      totalTasks,
      completedTasks,
      progressPercentage,
      status
    };
  });

  return {
    query: trimmed,
    skills: skillsResult.rows,
    topics
  };
};
