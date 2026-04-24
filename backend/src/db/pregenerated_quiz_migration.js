import pool from "./index.js";

const createPregeneratedQuizTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS topic_quiz_questions (
      id SERIAL PRIMARY KEY,
      topic_id INTEGER REFERENCES topics(id) ON DELETE CASCADE,
      question TEXT NOT NULL,
      options JSONB NOT NULL,
      correct_option CHAR(1) NOT NULL,
      explanation TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_quiz_questions_topic_id ON topic_quiz_questions(topic_id);
  `;

  try {
    await pool.query(query);
    console.log("✅ topic_quiz_questions table created successfully");
  } catch (error) {
    console.error("❌ Error creating quiz questions table:", error);
    throw error;
  }
};

createPregeneratedQuizTable()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
