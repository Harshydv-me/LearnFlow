import { insertProgress, updateStreakForUser } from "../progress/progress.service.js";
import {
  checkLockout,
  evaluateWrittenAnswer,
  generateTaskQuiz,
  generateTopicQuiz,
  getTaskContext,
  getTopicContext,
  getTopicVerification,
  saveAttempt,
  saveTopicVerification
} from "./quiz.service.js";

const parseId = (value) => {
  const id = Number.parseInt(String(value), 10);
  return Number.isNaN(id) ? null : id;
};

const normalizeAnswerMap = (obj) => {
  const out = {};
  for (const [k, v] of Object.entries(obj || {})) {
    out[String(k)] = String(v || "").toUpperCase();
  }
  return out;
};

export const generateTaskQuizHandler = async (req, res) => {
  try {
    const userId = parseId(req.user?.id);
    const taskId = parseId(req.params.taskId);
    if (!userId || !taskId) {
      return res.status(400).json({ error: "Invalid user or task id" });
    }

    const lockState = await checkLockout(userId, taskId, "task", null);
    if (lockState.alreadyAttempted) {
      return res.status(200).json({
        alreadyAttempted: true,
        alreadyPassed: Boolean(lockState.alreadyPassed),
        result: {
          passed: Boolean(lockState.latestAttempt?.passed),
          totalScore: Number(lockState.latestAttempt?.score || 0),
          maxScore: Number(lockState.latestAttempt?.max_score || 0),
          submittedAt: lockState.latestAttempt?.created_at || null
        }
      });
    }

    const context = await getTaskContext(taskId);
    if (!context) {
      return res.status(404).json({ error: "Task not found" });
    }

    const quiz = await generateTaskQuiz(
      context.task_title,
      context.task_description,
      context.topic_title,
      context.skill_name
    );

    return res.json({
      quiz,
      attemptNumber: 1
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const generateTopicQuizHandler = async (req, res) => {
  try {
    const userId = parseId(req.user?.id);
    const topicId = parseId(req.params.topicId);
    if (!userId || !topicId) {
      return res.status(400).json({ error: "Invalid user or topic id" });
    }

    const lockState = await checkLockout(userId, null, "topic", topicId);
    if (lockState.alreadyAttempted) {
      return res.status(200).json({
        alreadyAttempted: true,
        alreadyPassed: Boolean(lockState.alreadyPassed),
        result: {
          passed: Boolean(lockState.latestAttempt?.passed),
          totalScore: Number(lockState.latestAttempt?.score || 0),
          maxScore: Number(lockState.latestAttempt?.max_score || 0),
          submittedAt: lockState.latestAttempt?.created_at || null
        }
      });
    }

    const context = await getTopicContext(topicId);
    if (!context) {
      return res.status(404).json({ error: "Topic not found" });
    }

    const quiz = await generateTopicQuiz(
      context.topic_title,
      context.skill_name,
      context.taskTitles,
      topicId
    );

    return res.json({
      quiz,
      attemptNumber: 1
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const submitTaskQuizHandler = async (req, res) => {
  try {
    const userId = parseId(req.user?.id);
    const taskId = parseId(req.params.taskId);
    if (!userId || !taskId) {
      return res.status(400).json({ error: "Invalid user or task id" });
    }

    const { mcqAnswers, writtenAnswer, correctAnswers, writtenQuestion } = req.body || {};

    const lockState = await checkLockout(userId, taskId, "task", null);
    if (lockState.alreadyAttempted) {
      return res.status(409).json({
        error: "Quiz already submitted for this task",
        alreadyAttempted: true,
        alreadyPassed: Boolean(lockState.alreadyPassed),
        result: {
          passed: Boolean(lockState.latestAttempt?.passed),
          totalScore: Number(lockState.latestAttempt?.score || 0),
          maxScore: Number(lockState.latestAttempt?.max_score || 0)
        }
      });
    }

    const context = await getTaskContext(taskId);
    if (!context) {
      return res.status(404).json({ error: "Task not found" });
    }

    const normalizedCorrect = normalizeAnswerMap(correctAnswers || {});
    const normalizedGiven = normalizeAnswerMap(mcqAnswers || {});

    let mcqScore = 0;
    for (const [questionId, expected] of Object.entries(normalizedCorrect)) {
      if (normalizedGiven[questionId] === expected) {
        mcqScore += 1;
      }
    }
    const mcqPassed = mcqScore === 3;

    const writtenResult = await evaluateWrittenAnswer(
      writtenQuestion,
      writtenAnswer,
      context.task_title,
      context.skill_name
    );

    const passed = mcqPassed && Boolean(writtenResult.passed);
    const totalScore = passed ? 4 : 0;
    const maxScore = 4;

    await saveAttempt(
      userId,
      taskId,
      context.topic_id,
      "task",
      totalScore,
      maxScore,
      passed,
      1
    );

    if (passed) {
      await insertProgress(userId, taskId);
      await updateStreakForUser(userId);
    }

    return res.json({
      passed,
      mcqScore,
      mcqMax: 3,
      writtenPassed: Boolean(writtenResult.passed),
      writtenFeedback: writtenResult.feedback,
      totalScore,
      maxScore,
      attemptNumber: 1,
      lockedUntil: null,
      correctAnswers: normalizedCorrect
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const submitTopicQuizHandler = async (req, res) => {
  try {
    const userId = parseId(req.user?.id);
    const topicId = parseId(req.params.topicId);
    if (!userId || !topicId) {
      return res.status(400).json({ error: "Invalid user or topic id" });
    }

    const { mcqAnswers, correctAnswers } = req.body || {};

    const lockState = await checkLockout(userId, null, "topic", topicId);
    if (lockState.alreadyAttempted) {
      return res.status(409).json({
        error: "Quiz already submitted for this topic",
        alreadyAttempted: true,
        alreadyPassed: Boolean(lockState.alreadyPassed),
        result: {
          passed: Boolean(lockState.latestAttempt?.passed),
          totalScore: Number(lockState.latestAttempt?.score || 0),
          maxScore: Number(lockState.latestAttempt?.max_score || 0)
        }
      });
    }

    const context = await getTopicContext(topicId);
    if (!context) {
      return res.status(404).json({ error: "Topic not found" });
    }

    const normalizedCorrect = normalizeAnswerMap(correctAnswers || {});
    const normalizedGiven = normalizeAnswerMap(mcqAnswers || {});
    let mcqScore = 0;
    for (const [questionId, expected] of Object.entries(normalizedCorrect)) {
      if (normalizedGiven[questionId] === expected) {
        mcqScore += 1;
      }
    }

    const maxScore = 10;
    const totalScore = mcqScore;
    const passed = true; // Any score completes the topic now

    await saveAttempt(
      userId,
      null,
      topicId,
      "topic",
      totalScore,
      maxScore,
      passed,
      1
    );

    await saveTopicVerification(userId, topicId, totalScore);

    return res.json({
      passed,
      mcqScore,
      mcqMax: 10,
      totalScore,
      maxScore,
      attemptNumber: 1,
      lockedUntil: null,
      correctAnswers: normalizedCorrect
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const checkTopicVerifiedHandler = async (req, res) => {
  try {
    const userId = parseId(req.user?.id);
    const topicId = parseId(req.params.topicId);
    if (!userId || !topicId) {
      return res.status(400).json({ error: "Invalid user or topic id" });
    }
    const row = await getTopicVerification(userId, topicId);
    return res.json({
      verified: Boolean(row),
      score: Number(row?.score || 0)
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const checkTopicVerified = checkTopicVerifiedHandler;
