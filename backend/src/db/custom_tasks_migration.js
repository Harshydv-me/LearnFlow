import pool from "./index.js";

const createCustomTasksTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS custom_tasks (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(200) NOT NULL,
      description TEXT,
      priority VARCHAR(10) DEFAULT 'medium'
        CHECK (priority IN ('low', 'medium', 'high')),
      completed BOOLEAN DEFAULT false,
      completed_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_custom_tasks_user_id
      ON custom_tasks(user_id);
  `;

  try {
    await pool.query(query);
    console.log("✅ Custom tasks table created successfully");
  } catch (error) {
    console.error("❌ Error creating custom tasks table:", error);
    throw error;
  }
};

createCustomTasksTable()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));