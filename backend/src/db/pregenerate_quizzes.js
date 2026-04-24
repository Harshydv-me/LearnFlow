import pool from "./index.js";
import { generateTopicQuiz, getTopicContext } from "../modules/quiz/quiz.service.js";

const run = async () => {
  try {
    console.log("🚀 Starting quiz pre-generation...");

    // 1. Get all topics
    const topicsResult = await pool.query("SELECT id, title FROM topics ORDER BY id ASC");
    const topics = topicsResult.rows;

    console.log(`📊 Found ${topics.length} topics to process.`);

    for (const topic of topics) {
      // Check if questions already exist for this topic
      const checkResult = await pool.query(
        "SELECT COUNT(*) FROM topic_quiz_questions WHERE topic_id = $1",
        [topic.id]
      );
      
      if (parseInt(checkResult.rows[0].count) >= 10) {
        console.log(`⏩ Skipping "${topic.title}" (already has questions)`);
        continue;
      }

      console.log(`🤖 Generating questions for "${topic.title}" (ID: ${topic.id})...`);

      try {
        const context = await getTopicContext(topic.id);
        if (!context) {
          console.warn(`⚠️ No context found for topic ID ${topic.id}`);
          continue;
        }

        const quizData = await generateTopicQuiz(
          context.topic_title,
          context.skill_name,
          context.taskTitles
        );

        if (!quizData || !quizData.mcq || quizData.mcq.length !== 10) {
          throw new Error(`Invalid quiz data received for topic ${topic.id}`);
        }

        // 2. Insert into DB
        for (const q of quizData.mcq) {
          await pool.query(
            `INSERT INTO topic_quiz_questions 
             (topic_id, question, options, correct_option, explanation)
             VALUES ($1, $2, $3, $4, $5)`,
            [
              topic.id,
              q.question,
              JSON.stringify(q.options),
              q.correct,
              q.explanation
            ]
          );
        }

        console.log(`✅ Stored 10 questions for "${topic.title}"`);
        
        // Brief delay to avoid rate limiting
        await new Promise(r => setTimeout(r, 1000));

      } catch (err) {
        console.error(`❌ Failed generation for topic "${topic.title}":`, err.message);
      }
    }

    console.log("🏁 Pre-generation complete!");
    process.exit(0);
  } catch (error) {
    console.error("💥 Fatal error during pre-generation:", error);
    process.exit(1);
  }
};

run();
