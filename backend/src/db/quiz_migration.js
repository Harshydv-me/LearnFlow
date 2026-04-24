import dotenv from "dotenv";
import pool from "./index.js";

dotenv.config();

const run = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS quiz_attempts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
        attempt_type VARCHAR(10) NOT NULL CHECK (attempt_type IN ('task', 'topic')),
        topic_id INTEGER REFERENCES topics(id) ON DELETE CASCADE,
        score INTEGER NOT NULL DEFAULT 0,
        max_score INTEGER NOT NULL DEFAULT 0,
        passed BOOLEAN NOT NULL DEFAULT false,
        attempt_number INTEGER NOT NULL DEFAULT 1,
        locked_until TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS topic_verifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        topic_id INTEGER REFERENCES topics(id) ON DELETE CASCADE,
        verified_at TIMESTAMP DEFAULT NOW(),
        score INTEGER NOT NULL DEFAULT 0,
        UNIQUE(user_id, topic_id)
      );
    `);

    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(100);
    `);

    await pool.query(`
      UPDATE users
      SET username = LOWER(REGEXP_REPLACE(display_name, '\\s+', '', 'g'))
      WHERE username IS NULL;
    `);

    // Guard against collisions before creating unique index.
    await pool.query(`
      WITH ranked AS (
        SELECT id,
               username,
               ROW_NUMBER() OVER (PARTITION BY username ORDER BY id) AS rn
        FROM users
        WHERE username IS NOT NULL
      )
      UPDATE users u
      SET username = CONCAT(r.username, u.id)
      FROM ranked r
      WHERE u.id = r.id
        AND r.rn > 1;
    `);

    await pool.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON users(username);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_task
        ON quiz_attempts(user_id, task_id);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_topic
        ON quiz_attempts(user_id, topic_id);
    `);

    console.log("Quiz migration complete");
  } catch (error) {
    console.error("Quiz migration failed:", error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
};

run();
