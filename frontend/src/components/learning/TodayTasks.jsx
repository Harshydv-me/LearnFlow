import { CheckCircle2, Circle, Loader2, Lock, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import TopicQuizBanner from "../TopicQuizBanner.jsx";

const TodayTasks = ({
  tasks,
  onTaskComplete,
  loading,
  completingTaskId,
  topicId,
  topicTitle,
  topicVerified,
  topicVerificationScore,
  onVerified
}) => {
  const navigate = useNavigate();

  const allTopicTasksCompleted = useMemo(
    () => tasks.length > 0 && tasks.every((task) => task.completed),
    [tasks]
  );

  if (loading) {
    return (
      <div className="rounded-xl border border-subtle bg-card p-6">
        <div className="mb-4 text-sm font-semibold text-primary">Today&apos;s Tasks</div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="h-16 w-full animate-pulse rounded-xl bg-skeleton" />
          ))}
        </div>
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="rounded-xl border border-subtle bg-card p-6 text-center">
        <CheckCircle2 className="mx-auto h-6 w-6 text-green-400" />
        <div className="mt-3 text-sm text-secondary">No tasks for today</div>
        <div className="mt-1 text-xs text-muted">You are all caught up!</div>
      </div>
    );
  }

  const displayTasks = tasks.slice(0, 5);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-subtle bg-card p-6">
        <div className="mb-4 text-sm font-semibold text-primary">Today&apos;s Tasks</div>
        <div className="space-y-3">
          {displayTasks.map((task) => {
            const isCompleted = task.completed;
            const isUnlocked = task.unlocked;
            const isLocked = !task.unlocked;
            const isLoading = completingTaskId === task.id;

            return (
              <div
                key={task.id}
                className="flex items-start gap-3 border-b border-[#0a0a0a] py-3 last:border-0"
              >
                <div className="pt-0.5">
                  {isCompleted ? (
                    <button
                      type="button"
                      onClick={() => !topicVerified && onTaskComplete(task.id)}
                      className={`text-green-400 transition-all duration-200 ${topicVerified ? 'cursor-default' : 'hover:text-green-300'}`}
                      disabled={isLoading || topicVerified}
                    >
                      <CheckCircle2 size={18} />
                    </button>
                  ) : isLoading ? (                    <Loader2 size={18} className="animate-spin text-[#6366f1]" />
                  ) : isUnlocked ? (
                    <button
                      type="button"
                      onClick={() => onTaskComplete(task.id)}
                      className="text-[#6366f1]"
                    >
                      <Circle size={18} />
                    </button>
                  ) : (
                    <Lock size={14} className="text-muted" />
                  )}
                </div>
                <div className="flex-1">
                  <div
                    className={`text-sm ${
                      isCompleted
                        ? "text-muted line-through"
                        : isUnlocked
                          ? "text-primary"
                          : "text-muted"
                    }`}
                  >
                    {task.title}
                  </div>
                  <div className="mt-0.5 text-xs text-secondary">{task.description}</div>
                </div>
                <div>
                  {isCompleted ? (
                    <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs text-green-400">
                      Done
                    </span>
                  ) : isUnlocked ? (
                    <span className="cursor-pointer rounded-full bg-indigo-500/10 px-2 py-0.5 text-xs text-indigo-400">
                      Start
                    </span>
                  ) : (
                    <span className="rounded-full bg-skeleton px-2 py-0.5 text-xs text-muted">
                      Locked
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {tasks.length > 5 && (
          <div
            onClick={() => navigate("/roadmap")}
            className="mt-3 cursor-pointer text-right text-xs text-[#6366f1] transition-all duration-200 hover:text-indigo-400"
          >
            View all tasks →
          </div>
        )}
      </div>

      {allTopicTasksCompleted && !topicVerified && topicId && (
        <TopicQuizBanner
          topicId={topicId}
          topicTitle={topicTitle}
          onVerified={onVerified}
        />
      )}

      {allTopicTasksCompleted && topicVerified && (
        <div className="flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/10 p-4">
          <Trophy size={16} className="text-green-400" />
          <span className="text-sm font-semibold text-green-400">Topic Verified ✓</span>
          <span className="ml-auto text-xs text-secondary">{topicVerificationScore}/10 score</span>
        </div>
      )}
    </div>
  );
};

export default TodayTasks;
