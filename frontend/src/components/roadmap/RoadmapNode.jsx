import { CheckCircle2, Circle, Lock, Trophy } from "lucide-react";

const RoadmapNode = ({ topic, isSelected, onClick }) => {
  const {
    title,
    description,
    totalTasks,
    completedTasks,
    isCompleted,
    isCurrent,
    isLocked,
    verificationScore
  } = topic;

  const progress = totalTasks > 0
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  const statusLabel = verificationScore !== null 
    ? "Verified" 
    : isCompleted 
      ? "Completed" 
      : isCurrent 
        ? "Current" 
        : "Locked";
  const statusStyles = (verificationScore !== null || isCompleted)
    ? "bg-green-500/10 text-green-400"
    : isCurrent
      ? "bg-indigo-500/10 text-indigo-400"
      : "bg-[#1f1f1f] text-[#444]";

  const barColor = (verificationScore !== null || isCompleted)
    ? "bg-green-500"
    : isCurrent
      ? "bg-[#6366f1]"
      : "bg-[#333]";

  return (
    <div id={`topic-${topic.id}`} className="relative flex w-full flex-col items-start">
      <div className="flex items-center">
        <div
          onClick={isLocked ? undefined : onClick}
          className={`relative flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-200 ${
            (verificationScore !== null || isCompleted)
              ? "border-green-500 bg-green-500/20 text-green-400"
              : isCurrent
                ? "border-[#6366f1] bg-indigo-500/20 text-indigo-400"
                : "border-[#2a2a2a] bg-[#1a1a1a] text-[#444]"
          } ${isLocked ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:scale-105"}`}
        >
          {isCurrent && (
            <span className="absolute inset-0 rounded-full border-2 border-[#6366f1] opacity-30 animate-ping-slow" />
          )}
          {(verificationScore !== null || isCompleted) ? (
            <CheckCircle2 size={20} />
          ) : isCurrent ? (
            <Circle size={20} fill="#6366f1" />
          ) : (
            <Lock size={16} />
          )}
        </div>

        <div
          className={`ml-4 w-64 rounded-xl border p-4 transition-all duration-200 sm:w-72 ${
            isSelected
              ? "border-[#6366f1] bg-[#1a1a1f] shadow-lg shadow-indigo-500/10"
              : "border-[#1f1f1f] bg-[#111] hover:border-[#333]"
          }`}
        >
          <div className="text-sm font-semibold text-white">{title}</div>
          <div className="mt-1 text-xs text-[#666]">{description}</div>
          <div className="mt-2 text-xs text-[#666]">
            {completedTasks} / {totalTasks} tasks completed
          </div>
          <div className="mt-2 h-1 w-full rounded-full bg-[#1f1f1f]">
            <div
              className={`h-1 rounded-full ${barColor} transition-all duration-200`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between">
            {verificationScore !== null && (
              <div className="flex items-center gap-1 text-[10px] font-bold text-green-400 uppercase">
                <Trophy size={12} />
                {verificationScore}/10
              </div>
            )}
            <span className={`rounded-full px-2 py-0.5 text-xs ${statusStyles}`}>
              {statusLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapNode;
