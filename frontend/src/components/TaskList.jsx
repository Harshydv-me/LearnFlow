import { useEffect, useMemo, useState } from "react";
import { BadgeCheck } from "lucide-react";
import dashboardApi from "../api/dashboard.js";
import TaskItem from "./TaskItem.jsx";
import TopicQuizBanner from "./TopicQuizBanner.jsx";

const TaskList = ({ topicId, items, topicTitle }) => {
  const [tasks, setTasks] = useState(items || []);
  const [loading, setLoading] = useState(!items);
  const [error, setError] = useState("");
  const [submittingId, setSubmittingId] = useState(null);
  const [topicVerified, setTopicVerified] = useState(false);
  const [verificationScore, setVerificationScore] = useState(0);

  useEffect(() => {
    if (!items) return;
    setTasks(items);
    setLoading(false);
  }, [items]);

  const loadTasks = async () => {
    if (!topicId) return;
    setLoading(true);
    setError("");
    try {
      const data = await dashboardApi.getTasks(topicId);
      setTasks(data || []);
      const verification = await dashboardApi.checkTopicVerified(topicId);
      setTopicVerified(Boolean(verification?.verified));
      setVerificationScore(Number(verification?.score || 0));
    } catch (err) {
      setError(err.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!items && topicId) {
      loadTasks();
    }
  }, [items, topicId]);

  const progress = useMemo(() => {
    const completed = tasks.filter((task) => task.completed).length;
    const total = tasks.length;
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  }, [tasks]);

  const handleComplete = async (_taskId) => {
    if (submittingId) return;
    setSubmittingId(_taskId);
    setError("");
    try {
      await loadTasks();
    } catch (err) {
      setError(err.message || "Failed to update task");
    } finally {
      setSubmittingId(null);
    }
  };

  const allCompleted = useMemo(
    () => tasks.length > 0 && tasks.every((task) => task.completed),
    [tasks]
  );

  if (loading) {
    return <p className="text-sm text-slate-400">Loading tasks...</p>;
  }

  if (error) {
    return <p className="text-sm text-rose-400">{error}</p>;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-800/70 bg-slate-900/70 p-4 backdrop-blur-xl shadow-[0_18px_45px_-30px_rgba(15,23,42,0.8)]">
        <div className="mb-3 flex items-center justify-between text-xs text-slate-400">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            locked={task.unlocked === false}
            onComplete={handleComplete}
            loading={submittingId === task.id}
            topicTitle={topicTitle}
          />
        ))}
      </div>

      {allCompleted && !topicVerified && (
        <TopicQuizBanner
          topicId={topicId}
          topicTitle={topicTitle || "Current Topic"}
          onVerified={async () => {
            const verification = await dashboardApi.checkTopicVerified(topicId);
            setTopicVerified(Boolean(verification?.verified));
            setVerificationScore(Number(verification?.score || 0));
            await loadTasks();
          }}
        />
      )}

      {allCompleted && topicVerified && (
        <div className="flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/10 p-4">
          <BadgeCheck size={18} className="text-green-400" />
          <span className="text-sm font-semibold text-green-400">Topic Verified ✓</span>
          <span className="ml-auto text-xs text-[#666]">{verificationScore}% score</span>
        </div>
      )}
    </div>
  );
};

export default TaskList;
