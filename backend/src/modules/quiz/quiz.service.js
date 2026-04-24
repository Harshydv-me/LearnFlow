import { GoogleGenerativeAI } from "@google/generative-ai";
import pool from "../../db/index.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getModel = () => {
  const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
  return genAI.getGenerativeModel({ model: modelName });
};

const cleanJson = (text) =>
  String(text || "")
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

const parseJson = (text) => JSON.parse(cleanJson(text));

const validateTaskQuiz = (quiz) => {
  if (!quiz || !Array.isArray(quiz.mcq) || quiz.mcq.length !== 3 || !quiz.written) {
    throw new Error("Invalid quiz format from AI");
  }
  const validOption = new Set(["A", "B", "C", "D"]);
  for (const q of quiz.mcq) {
    if (!q?.question || !q?.options || !validOption.has(q.correct)) {
      throw new Error("Invalid MCQ format from AI");
    }
    const keys = Object.keys(q.options || {});
    if (keys.length !== 4 || !["A", "B", "C", "D"].every((k) => keys.includes(k))) {
      throw new Error("Invalid MCQ options from AI");
    }
  }
  return quiz;
};

const validateTopicQuiz = (quiz) => {
  if (
    !quiz ||
    !Array.isArray(quiz.mcq) ||
    quiz.mcq.length !== 10
  ) {
    throw new Error("Invalid topic quiz format from AI: expected 10 MCQs");
  }
  const validOption = new Set(["A", "B", "C", "D"]);
  for (const q of quiz.mcq) {
    if (!q?.question || !q?.options || !validOption.has(q.correct)) {
      throw new Error("Invalid topic MCQ format from AI");
    }
    const keys = Object.keys(q.options || {});
    if (keys.length !== 4 || !["A", "B", "C", "D"].every((k) => keys.includes(k))) {
      throw new Error("Invalid topic MCQ options from AI");
    }
  }
  return quiz;
};

export const getTaskContext = async (taskId) => {
  const result = await pool.query(
    `SELECT t.id,
            t.title AS task_title,
            t.description AS task_description,
            t.topic_id,
            t.order_index,
            tp.title AS topic_title,
            s.name AS skill_name
     FROM tasks t
     JOIN topics tp ON tp.id = t.topic_id
     JOIN skills s ON s.id = tp.skill_id
     WHERE t.id = $1`,
    [taskId]
  );
  return result.rows[0] || null;
};

export const getTopicContext = async (topicId) => {
  const topicResult = await pool.query(
    `SELECT tp.id,
            tp.title AS topic_title,
            s.name AS skill_name
     FROM topics tp
     JOIN skills s ON s.id = tp.skill_id
     WHERE tp.id = $1`,
    [topicId]
  );

  const topic = topicResult.rows[0];
  if (!topic) {
    return null;
  }

  const tasksResult = await pool.query(
    `SELECT title
     FROM tasks
     WHERE topic_id = $1
     ORDER BY order_index ASC, id ASC`,
    [topicId]
  );

  return {
    ...topic,
    taskTitles: tasksResult.rows.map((row) => row.title)
  };
};

export const generateTaskQuiz = async (
  taskTitle,
  taskDescription,
  topicTitle,
  skillName
) => {
  const model = getModel();
  const prompt = `
You are creating a quiz to verify understanding of a programming concept.

Skill: ${skillName}
Topic: ${topicTitle}
Task: ${taskTitle}
Task Description: ${taskDescription}

Generate a quiz with exactly 3 MCQ questions and 1 short answer question.

Respond in this EXACT JSON format only, no markdown:
{
  "mcq": [
    {
      "id": 1,
      "question": "Clear specific question about this task",
      "options": {
        "A": "First option",
        "B": "Second option",
        "C": "Third option",
        "D": "Fourth option"
      },
      "correct": "A",
      "explanation": "Why A is correct"
    }
  ],
  "written": {
    "id": 4,
    "question": "Explain in your own words: [specific concept from this task]"
  }
}

Rules:
- MCQ must have exactly 3 questions
- Each MCQ must have exactly 4 options A B C D
- Questions must be specific to this exact task not general
- Difficulty: beginner to intermediate
- correct field must be exactly "A" "B" "C" or "D"
- Respond ONLY with raw JSON no backticks no extra text
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return validateTaskQuiz(parseJson(response.text()));
};

export const getStoredTopicQuiz = async (topicId) => {
  const result = await pool.query(
    `SELECT id, question, options, correct_option, explanation
     FROM topic_quiz_questions
     WHERE topic_id = $1
     ORDER BY id ASC
     LIMIT 10`,
    [topicId]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return {
    mcq: result.rows.map((row) => ({
      id: row.id,
      question: row.question,
      options: row.options,
      correct: row.correct_option,
      explanation: row.explanation
    }))
  };
};

export const generateTopicQuiz = async (topicTitle, skillName, taskTitles, topicId) => {
  // Try to get from DB first
  if (topicId) {
    const stored = await getStoredTopicQuiz(topicId);
    if (stored) {
      console.log(`📡 Serving pre-generated quiz for topic ${topicId}`);
      return stored;
    }
  }

  console.log(`🤖 Generating LIVE quiz for topic ${topicTitle} (Fallback)`);
  const model = getModel();
  const prompt = `
You are creating a comprehensive topic verification quiz.

Skill: ${skillName}
Topic: ${topicTitle}
Tasks covered: ${taskTitles.join(", ")}

Generate a quiz with exactly 10 MCQ questions covering ALL the tasks listed above.

Respond in this EXACT JSON format only, no markdown:
{
  "mcq": [
    {
      "id": 1,
      "question": "Question text",
      "options": {
        "A": "Option A",
        "B": "Option B",
        "C": "Option C",
        "D": "Option D"
      },
      "correct": "B",
      "explanation": "Why B is correct"
    }
  ]
}

Rules:
- Exactly 10 MCQ questions covering all tasks proportionally
- No written or short answer questions
- No duplicate questions
- Respond ONLY with raw JSON
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return validateTopicQuiz(parseJson(response.text()));
};

export const evaluateWrittenAnswer = async (
  question,
  answer,
  taskTitle,
  skillName
) => {
  const model = getModel();
  const prompt = `
You are evaluating a student's written answer for a programming quiz.

Skill: ${skillName}
Task: ${taskTitle}
Question: ${question}
Student Answer: ${answer}

Evaluate if the student demonstrates understanding of the concept.

Respond in this EXACT JSON format only:
{
  "passed": true,
  "score": 1,
  "maxScore": 1,
  "feedback": "Brief feedback explaining the evaluation"
}

Rules:
- passed is true if answer shows basic understanding false otherwise
- score is 1 if passed 0 if not
- maxScore is always 1
- Be lenient — reward effort and partial understanding
- If answer is blank or completely wrong passed is false
- feedback must be 1-2 sentences maximum
- Respond ONLY with raw JSON
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const parsed = parseJson(response.text());
  return {
    passed: Boolean(parsed?.passed),
    score: Number(parsed?.score || 0) > 0 ? 1 : 0,
    maxScore: 1,
    feedback: parsed?.feedback || "Review the concept and try again."
  };
};

export const checkLockout = async (userId, taskId, attemptType, topicId) => {
  const result = await pool.query(
    `SELECT attempt_number, locked_until, passed, score, max_score, created_at
     FROM quiz_attempts
     WHERE user_id = $1
       AND (
         (attempt_type = 'task' AND task_id = $2)
         OR
         (attempt_type = 'topic' AND topic_id = $4)
       )
       AND attempt_type = $3
     ORDER BY created_at DESC
     LIMIT 1`,
    [userId, taskId, attemptType, topicId]
  );

  const latest = result.rows[0];
  if (!latest) {
    return { locked: false, attemptNumber: 1, alreadyAttempted: false };
  }

  return {
    locked: false,
    attemptNumber: Number(latest.attempt_number || 1),
    alreadyAttempted: true,
    alreadyPassed: Boolean(latest.passed),
    latestAttempt: latest
  };
};

export const saveAttempt = async (
  userId,
  taskId,
  topicId,
  attemptType,
  score,
  maxScore,
  passed,
  attemptNumber
) => {
  const lockedUntil = null;

  const result = await pool.query(
    `INSERT INTO quiz_attempts
      (user_id, task_id, topic_id, attempt_type, score, max_score,
       passed, attempt_number, locked_until)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     RETURNING *`,
    [userId, taskId, topicId, attemptType, score, maxScore, passed, attemptNumber, lockedUntil]
  );
  return result.rows[0];
};

export const saveTopicVerification = async (userId, topicId, score) => {
  const result = await pool.query(
    `INSERT INTO topic_verifications (user_id, topic_id, score)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, topic_id) DO UPDATE SET
       score = EXCLUDED.score,
       verified_at = NOW()
     RETURNING *`,
    [userId, topicId, score]
  );
  return result.rows[0];
};

export const getTopicVerification = async (userId, topicId) => {
  const result = await pool.query(
    `SELECT score
     FROM topic_verifications
     WHERE user_id = $1 AND topic_id = $2`,
    [userId, topicId]
  );
  return result.rows[0] || null;
};
