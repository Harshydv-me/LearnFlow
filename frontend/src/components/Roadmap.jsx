import { Check, Lock } from "lucide-react";

const RoadmapNode = ({ title, description, status, onClick }) => {
  const isCompleted = status === "completed";
  const isCurrent = status === "current";
  const isLocked = status === "locked";

  return (
    <button
      type="button"
      disabled={isLocked}
      onClick={onClick}
      className={`group flex w-full items-start justify-between gap-4 rounded-xl border border-subtle bg-card p-4 text-left transition-all duration-200 ${
        isLocked
          ? "cursor-not-allowed opacity-60"
          : "hover:-translate-y-0.5 hover:border-hover hover:shadow-lg"
      } ${isCurrent ? "ring-1 ring-[#6366f1]/40" : ""}`}
    >
      <div>
        <div
          className={`text-sm font-semibold ${
            isCompleted ? "line-through text-secondary" : "text-primary"
          }`}
        >
          {title}
        </div>
        <div className="mt-1 text-xs text-secondary">{description}</div>
      </div>
      <div className="mt-1">
        {isCompleted && <Check className="h-4 w-4 text-green-400" />}
        {isLocked && <Lock className="h-4 w-4 text-neutral-500" />}
      </div>
    </button>
  );
};

const Roadmap = ({ tasks, onComplete }) => {
  return (
    <div className="space-y-4">
      {tasks.map((task, index) => {
        const isCompleted = task.completed;
        const isLocked = task.unlocked === false;
        const isCurrent = !isCompleted && !isLocked;
        const status = isCompleted ? "completed" : isCurrent ? "current" : "locked";

        return (
          <div key={task.id} className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  isCompleted
                    ? "bg-green-500 text-white"
                    : isCurrent
                      ? "bg-[#6366f1] text-white ring-2 ring-[#6366f1]/70 animate-pulse"
                      : "bg-neutral-700 text-neutral-400"
                }`}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : isLocked ? (
                  <Lock className="h-4 w-4" />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-white" />
                )}
              </div>
              {index < tasks.length - 1 && (
                <div className="mt-2 h-full w-px flex-1 bg-skeleton" />
              )}
            </div>
            <div className="flex-1">
              <RoadmapNode
                title={task.title}
                description={task.description}
                status={status}
                onClick={() => {
                  if (!isLocked && !isCompleted) {
                    onComplete(task.id);
                  }
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Roadmap;
