import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Loader2, X, XCircle } from "lucide-react";
import {
  generateTaskQuiz,
  generateTopicQuiz,
  submitTaskQuiz,
  submitTopicQuiz
} from "../api/dashboard.js";

const QuizModal = ({
  isOpen,
  onClose,
  taskId,
  topicId,
  quizType,
  taskTitle,
  topicTitle,
  onPassed
}) => {
  const onCloseRef = useRef(onClose);
  const onPassedRef = useRef(onPassed);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    onPassedRef.current = onPassed;
  }, [onPassed]);

  const [phase, setPhase] = useState("loading");
  const [quiz, setQuiz] = useState(null);
  const [mcqAnswers, setMcqAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  const resetInputs = () => {
    setMcqAnswers({});
    setResults(null);
    setError("");
  };

  const loadQuiz = useCallback(async () => {
    if (!isOpen) return;
    setPhase("loading");
    setError("");
    resetInputs();

    try {
      const response = await generateTopicQuiz(topicId);

      if (response?.alreadyPassed) {
        onPassedRef.current?.();
        onCloseRef.current?.();
        return;
      }

      if (response?.alreadyAttempted) {
        const attemptResult = response?.result || {};
        setError(
          `You already submitted this quiz once. Final score: ${Number(
            attemptResult.totalScore || 0
          )}/${Number(attemptResult.maxScore || 0)}.`
        );
        setPhase("error");
        return;
      }

      setQuiz(response.quiz);
      setPhase("quiz");
    } catch (err) {
      setError(err.message || "Failed to load quiz");
      setPhase("error");
    }
  }, [isOpen, topicId]);

  useEffect(() => {
    if (isOpen) {
      loadQuiz();
    }
  }, [isOpen, loadQuiz]);

  const totalQuestions = useMemo(() => {
    return quiz?.mcq?.length || 10;
  }, [quiz]);

  const answeredCount = useMemo(() => {
    return Object.keys(mcqAnswers).length;
  }, [mcqAnswers]);

  const canSubmit = useMemo(() => {
    if (!quiz?.mcq?.length) return false;
    return quiz.mcq.every((q) => Boolean(mcqAnswers[String(q.id)]));
  }, [mcqAnswers, quiz]);

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setPhase("submitting");
    setError("");

    try {
      const correctAnswers = {};
      (quiz?.mcq || []).forEach((q) => {
        correctAnswers[q.id] = q.correct;
      });

      const response = await submitTopicQuiz(topicId, {
        mcqAnswers,
        correctAnswers
      });

      setResults(response);
      setPhase("results");
    } catch (err) {
      setError(err.message || "Failed to submit quiz");
      setPhase("error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-subtle bg-card shadow-2xl">
          {(phase === "loading" || phase === "submitting") && (
            <div className="flex flex-col items-center justify-center p-10 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#6366f1]" />
              <div className="mt-3 text-sm text-secondary">
                {phase === "loading" ? "Generating your quiz..." : "Submitting your answers..."}
              </div>
              <div className="mt-1 text-xs text-muted">
                {phase === "loading"
                  ? "Powered by Gemini AI"
                  : "Updating your profile"}
              </div>
            </div>
          )}

          {phase === "error" && (
            <div className="p-8 text-center">
              <XCircle className="mx-auto h-8 w-8 text-red-400" />
              <div className="mt-3 text-sm text-red-300">{error || "Something went wrong"}</div>
              <div className="mt-6 flex justify-center gap-3">
                <button
                  onClick={loadQuiz}
                  className="rounded-lg bg-skeleton px-5 py-2.5 text-sm text-primary hover:bg-[#2a2a2a]"
                >
                  Retry
                </button>
                <button
                  onClick={onClose}
                  className="rounded-lg border border-subtle px-5 py-2.5 text-sm text-[#999] hover:text-primary"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {phase === "quiz" && quiz && (
            <>
              <div className="flex items-center justify-between border-b border-subtle px-6 py-4">
                <div className="flex items-center gap-2">
                  <span
                    className="rounded-full bg-purple-500/10 px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-purple-400"
                  >
                    Topic Verification
                  </span>
                  <div className="text-sm font-semibold text-primary">
                    {topicTitle}
                  </div>
                </div>
                <div className="rounded bg-card-hover px-2 py-1 text-xs text-secondary">One-time quiz</div>
              </div>

              <div className="space-y-6 px-6 py-6">
                {quiz.mcq.map((question, index) => (
                  <div key={question.id} className="rounded-xl border border-subtle bg-main p-5">
                    <div className="text-xs font-medium uppercase text-[#6366f1]">Q{index + 1}</div>
                    <div className="mt-1 text-sm font-medium text-primary">{question.question}</div>
                    <div className="mt-3 space-y-2">
                      {["A", "B", "C", "D"].map((optKey) => {
                        const selected = mcqAnswers[String(question.id)] === optKey;
                        return (
                          <button
                            key={optKey}
                            type="button"
                            onClick={() =>
                              setMcqAnswers((prev) => ({ ...prev, [String(question.id)]: optKey }))
                            }
                            className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-all duration-200 ${
                              selected
                                ? "border-[#6366f1] bg-indigo-500/10 text-primary"
                                : "border-subtle bg-card text-secondary hover:border-hover hover:text-primary"
                            }`}
                          >
                            <span
                              className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                selected ? "bg-[#6366f1] text-white" : "bg-card-hover text-secondary"
                              }`}
                            >
                              {optKey}
                            </span>
                            {question.options[optKey]}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-subtle px-6 py-4">
                <div className="text-xs text-muted">
                  {answeredCount}/{totalQuestions} answered
                </div>
                <button
                  type="button"
                  disabled={!canSubmit}
                  onClick={handleSubmit}
                  className="rounded-lg bg-[#6366f1] px-6 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Submit Quiz
                </button>
              </div>
            </>
          )}

          {phase === "results" && results && (
            <>
              <div className="flex items-center gap-2 border-b border-subtle px-6 py-4">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                <div className="text-sm font-semibold text-green-400">Topic Completed!</div>
              </div>

              <div className="mx-6 mt-6 rounded-xl border border-subtle bg-main p-5 text-center">
                <div className="text-4xl font-bold text-primary">
                  {results.totalScore} / {results.maxScore}
                </div>
                <div className="mt-1 text-sm text-secondary">Your Score</div>
                <p className="mt-4 text-xs text-muted">
                  This score is now saved to your public profile.
                </p>
              </div>

              <div className="mx-6 mt-6">
                <div className="mb-3 text-sm font-semibold text-primary">Review Answers</div>
                {(quiz?.mcq || []).map((q) => {
                  const userAnswer = mcqAnswers[String(q.id)];
                  const correctAnswer = results.correctAnswers?.[String(q.id)] || q.correct;
                  const isCorrect = userAnswer === correctAnswer;
                  return (
                    <div key={q.id} className="mb-3 rounded-xl border border-subtle bg-main p-4">
                      <div className="text-xs text-secondary">{q.question}</div>
                      <div className="mt-2 flex items-center gap-2 text-sm text-primary">
                        {isCorrect ? (
                          <CheckCircle2 className="h-4 w-4 text-green-400" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-400" />
                        )}
                        Your answer: {q.options[userAnswer]}
                      </div>
                      {!isCorrect && (
                        <>
                          <div className="mt-1 flex items-center gap-2 text-sm text-green-400">
                            <CheckCircle2 className="h-4 w-4 text-green-400" />
                            Correct: {q.options[correctAnswer]}
                          </div>
                          <div className="mt-1 text-xs italic text-secondary">{q.explanation}</div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex items-center justify-end border-t border-subtle px-6 py-4">
                <button
                  type="button"
                  onClick={() => {
                    onPassed?.();
                    onClose?.();
                  }}
                  className="rounded-lg bg-[#6366f1] px-8 py-2.5 text-sm font-medium text-white hover:bg-indigo-500"
                >
                  Continue
                </button>
              </div>
            </>
          )}

          <button
            type="button"
            onClick={onClose}
            className="absolute right-6 top-6 text-secondary hover:text-primary"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizModal;
