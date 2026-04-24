import pool from "../../db/index.js";

export const findUserByEmail = async (email) => {
  const result = await pool.query(
    "SELECT id, display_name, email, username, password_hash FROM users WHERE email = $1",
    [email]
  );
  return result.rows[0] || null;
};

const slugifyUsername = (displayName) =>
  String(displayName || "")
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, 90) || "user";

const ensureUniqueUsername = async (displayName) => {
  const baseUsername = slugifyUsername(displayName);
  let username = baseUsername;

  const existing = await pool.query("SELECT id FROM users WHERE username = $1", [username]);
  if (existing.rows.length > 0) {
    username = `${baseUsername}${Math.floor(Math.random() * 900 + 100)}`;
    let retry = 0;
    while (retry < 5) {
      const taken = await pool.query("SELECT id FROM users WHERE username = $1", [username]);
      if (taken.rows.length === 0) break;
      username = `${baseUsername}${Math.floor(Math.random() * 900 + 100)}`;
      retry += 1;
    }
  }

  return username;
};

export const createUser = async ({ display_name, email, password_hash }) => {
  const username = await ensureUniqueUsername(display_name);
  const result = await pool.query(
    `INSERT INTO users (display_name, email, password_hash, username)
     VALUES ($1, $2, $3, $4)
     RETURNING id, display_name, email, username`,
    [display_name, email, password_hash, username]
  );
  return result.rows[0];
};

export const createLearningStreak = async (user_id) => {
  await pool.query(
    `INSERT INTO learning_streaks (user_id, current_streak_days, longest_streak_days, last_activity_date)
     VALUES ($1, 0, 0, NULL)
     ON CONFLICT (user_id) DO NOTHING`,
    [user_id]
  );
};
