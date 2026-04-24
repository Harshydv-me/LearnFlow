-- LearnFlow schema (reset)

DROP TABLE IF EXISTS progress CASCADE;
DROP TABLE IF EXISTS learning_streaks CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS topics CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- USERS
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  display_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- SKILLS
CREATE TABLE IF NOT EXISTS skills (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT
);

-- TOPICS
CREATE TABLE IF NOT EXISTS topics (
  id SERIAL PRIMARY KEY,
  skill_id INTEGER REFERENCES skills(id),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  UNIQUE (skill_id, title)
);

-- TASKS
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  topic_id INTEGER REFERENCES topics(id),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  UNIQUE (topic_id, title, order_index)
);

-- PROGRESS (one row per user per task when completed)
CREATE TABLE IF NOT EXISTS progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  task_id INTEGER REFERENCES tasks(id),
  completed_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, task_id)
);

-- LEARNING STREAKS (one row per user)
CREATE TABLE IF NOT EXISTS learning_streaks (
  user_id INTEGER PRIMARY KEY REFERENCES users(id),
  current_streak_days INTEGER DEFAULT 0,
  longest_streak_days INTEGER DEFAULT 0,
  last_activity_date DATE
);
