import { ChevronRight, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ContinueLearning = ({ topic, firstUnlockedTask, loading }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="rounded-xl border border-subtle bg-card p-6">
        <div className="h-4 w-32 animate-pulse rounded bg-skeleton" />
        <div className="mt-4 h-6 w-64 animate-pulse rounded bg-skeleton" />
        <div className="mt-2 h-4 w-80 animate-pulse rounded bg-skeleton" />
        <div className="mt-4 h-2 w-full animate-pulse rounded bg-skeleton" />
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="rounded-xl border border-subtle bg-card p-6 text-center">
        <Trophy className="mx-auto h-8 w-8 text-[#6366f1]" />
        <div className="mt-3 text-lg font-semibold text-primary">All caught up!</div>
        <div className="mt-1 text-sm text-secondary">
          You have completed all available topics.
        </div>
      </div>
    );
  }

  const totalTasks = topic.totalTasks ?? 0;
  const completedTasks = topic.completedTasks ?? 0;
  const progress = totalTasks > 0
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  return (
    <div className="rounded-xl border border-subtle bg-card p-6">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-indigo-500/10 px-2 py-1 text-xs font-medium uppercase tracking-wide text-[#6366f1]">
          Continue Learning
        </span>
        <span className="text-xs text-secondary">
          {completedTasks} / {totalTasks} tasks
        </span>
      </div>

      <div className="mt-3 text-2xl font-bold text-primary">{topic.title}</div>
      <div className="mt-1 text-sm text-secondary">{topic.description}</div>

      <div className="mt-4 h-1.5 w-full rounded-full bg-skeleton">
        <div
          className="h-1.5 rounded-full bg-[#6366f1]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {firstUnlockedTask && (
        <div className="mt-4 flex items-center gap-2 text-sm text-secondary">
          <ChevronRight size={16} className="text-[#6366f1]" />
          <span>Next: {firstUnlockedTask.title}</span>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={() => navigate("/roadmap")}
          className="rounded-lg bg-[#6366f1] px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-indigo-500"
        >
          Resume Learning
        </button>
        <button
          onClick={() => navigate("/roadmap")}
          className="rounded-lg border border-subtle px-5 py-2.5 text-sm text-secondary transition-all duration-200 hover:border-hover hover:text-primary"
        >
          View Roadmap
        </button>
      </div>
    </div>
  );
};

export default ContinueLearning;
