import pool from "../../db/index.js";

const parseCount = (value) => Number.parseInt(String(value || 0), 10) || 0;

export const getRecommendation = async (userId) => {
  const progressResult = await pool.query(
    "SELECT COUNT(*) AS count FROM progress WHERE user_id = $1",
    [userId]
  );

  const progressCount = parseCount(progressResult.rows[0]?.count);

  if (progressCount === 0) {
    const firstTaskResult = await pool.query(
      `SELECT sk.name AS skill_name,
              tp.id AS topic_id,
              tp.title AS topic_title,
              t.id AS task_id,
              t.title AS task_title
       FROM skills sk
       JOIN topics tp ON tp.skill_id = sk.id
       JOIN tasks t ON t.topic_id = tp.id
       ORDER BY sk.id ASC, tp.order_index ASC, t.order_index ASC
       LIMIT 1`
    );

    const firstTask = firstTaskResult.rows[0];
    if (!firstTask) {
      return {
        type: "complete",
        skill: null,
        topic: null,
        topicId: null,
        task: null,
        taskId: null,
        message: "You have completed all available content. Amazing work!",
        isNew: true
      };
    }

    return {
      type: "new",
      skill: firstTask.skill_name,
      topic: firstTask.topic_title,
      topicId: firstTask.topic_id,
      task: firstTask.task_title,
      taskId: firstTask.task_id,
      message: `Welcome! Start your learning journey with ${firstTask.topic_title}.`,
      isNew: true
    };
  }

  const lastTaskResult = await pool.query(
    `SELECT p.task_id,
            p.completed_at,
            t.order_index AS task_order,
            t.topic_id,
            tp.order_index AS topic_order,
            tp.skill_id,
            tp.title AS topic_title,
            sk.name AS skill_name,
            tp.id AS topic_id_val
     FROM progress p
     JOIN tasks t ON t.id = p.task_id
     JOIN topics tp ON tp.id = t.topic_id
     JOIN skills sk ON sk.id = tp.skill_id
     WHERE p.user_id = $1
     ORDER BY p.completed_at DESC
     LIMIT 1`,
    [userId]
  );

  const lastTask = lastTaskResult.rows[0];

  if (!lastTask) {
    return {
      type: "complete",
      skill: null,
      topic: null,
      topicId: null,
      task: null,
      taskId: null,
      message: "You have completed all available content. Amazing work!",
      isNew: false
    };
  }

  const nextTaskResult = await pool.query(
    `SELECT t.id, t.title, t.order_index
     FROM tasks t
     WHERE t.topic_id = $1
       AND t.order_index > $2
       AND t.id NOT IN (
         SELECT task_id FROM progress WHERE user_id = $3
       )
     ORDER BY t.order_index ASC
     LIMIT 1`,
    [lastTask.topic_id, lastTask.task_order, userId]
  );

  const nextTask = nextTaskResult.rows[0];

  if (nextTask) {
    const totalResult = await pool.query(
      "SELECT COUNT(*) AS total FROM tasks WHERE topic_id = $1",
      [lastTask.topic_id]
    );
    const doneResult = await pool.query(
      `SELECT COUNT(*) AS done
       FROM progress p
       JOIN tasks t ON t.id = p.task_id
       WHERE t.topic_id = $1 AND p.user_id = $2`,
      [lastTask.topic_id, userId]
    );

    const total = parseCount(totalResult.rows[0]?.total);
    const done = parseCount(doneResult.rows[0]?.done);
    const tasksLeft = Math.max(total - done, 0);

    let message = `Continue your progress in ${lastTask.topic_title}.`;
    if (tasksLeft === 1) {
      message = `You are close to finishing ${lastTask.topic_title}!`;
    } else if (tasksLeft <= 3) {
      message = `Keep going — only ${tasksLeft} tasks left in ${lastTask.topic_title}.`;
    }

    return {
      type: "task",
      skill: lastTask.skill_name,
      topic: lastTask.topic_title,
      topicId: lastTask.topic_id_val,
      task: nextTask.title,
      taskId: nextTask.id,
      message,
      tasksLeft,
      isNew: false
    };
  }

  // Current topic might be finished, check if it's verified
  const currentVerificationResult = await pool.query(
    `SELECT 1 FROM topic_verifications WHERE user_id = $1 AND topic_id = $2`,
    [userId, lastTask.topic_id]
  );
  const currentTopicVerified = currentVerificationResult.rows.length > 0;

  if (!currentTopicVerified) {
    return {
      type: "quiz",
      skill: lastTask.skill_name,
      topic: lastTask.topic_title,
      topicId: lastTask.topic_id_val,
      task: null,
      taskId: null,
      message: `All tasks done in ${lastTask.topic_title}! Take the quiz to verify your skill.`,
      isNew: false
    };
  }

  const topicProgressResult = await pool.query(
    `SELECT tp.id,
            tp.title,
            tp.order_index,
            COUNT(t.id) AS total_tasks,
            COUNT(p.id) AS completed_tasks
     FROM topics tp
     LEFT JOIN tasks t ON t.topic_id = tp.id
     LEFT JOIN progress p
       ON p.task_id = t.id
      AND p.user_id = $2
     WHERE tp.skill_id = $1
     GROUP BY tp.id
     ORDER BY tp.order_index ASC`,
    [lastTask.skill_id, userId]
  );

  const nextTopic = topicProgressResult.rows
    .map((row) => {
      const totalTasks = parseCount(row.total_tasks);
      const completedTasks = parseCount(row.completed_tasks);
      return {
        id: row.id,
        title: row.title,
        order_index: row.order_index,
        isCompleted: totalTasks > 0 && completedTasks === totalTasks
      };
    })
    .filter((topic) => topic.order_index > lastTask.topic_order)
    .find((topic) => !topic.isCompleted);

  if (nextTopic) {
    return {
      type: "topic",
      skill: lastTask.skill_name,
      topic: nextTopic.title,
      topicId: nextTopic.id,
      task: null,
      taskId: null,
      message: `You are ready to start ${nextTopic.title}.`,
      isNew: false
    };
  }

  const nextSkillResult = await pool.query(
    `SELECT sk.id,
            sk.name,
            tp.id AS topic_id,
            tp.title AS topic_title
     FROM skills sk
     JOIN topics tp ON tp.skill_id = sk.id
     WHERE sk.id NOT IN (
       SELECT DISTINCT tp2.skill_id
       FROM progress p
       JOIN tasks t ON t.id = p.task_id
       JOIN topics tp2 ON tp2.id = t.topic_id
       WHERE p.user_id = $1
     )
     ORDER BY sk.id ASC, tp.order_index ASC
     LIMIT 1`,
    [userId]
  );

  const nextSkill = nextSkillResult.rows[0];

  if (nextSkill) {
    return {
      type: "skill",
      skill: nextSkill.name,
      topic: nextSkill.topic_title,
      topicId: nextSkill.topic_id,
      task: null,
      taskId: null,
      message: `Starting ${nextSkill.name} will unlock powerful new concepts.`,
      isNew: false
    };
  }

  return {
    type: "complete",
    skill: null,
    topic: null,
    topicId: null,
    task: null,
    taskId: null,
    message: "You have completed all available content. Amazing work!",
    isNew: false
  };
};
