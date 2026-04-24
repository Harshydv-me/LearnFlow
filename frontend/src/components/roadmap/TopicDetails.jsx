import { BookOpen, CheckCircle2, ChevronLeft, Circle, Loader2, Lock, Trophy } from "lucide-react";
import TopicQuizBanner from "../TopicQuizBanner.jsx";

const TopicDetails = ({
  topic,
  tasks,
  onTaskComplete,
  loading,
  completingTaskId,
  onTaskLearn,
  isVerified,
  verificationScore,
  onVerified
}) => {
  if (!topic) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-xl border border-[#1f1f1f] bg-[#111] p-10 text-center text-[#666]">
        <ChevronLeft size={48} className="text-[#333]" />
        <div className="mt-4 text-sm text-white">Select a topic from the roadmap</div>
        <div className="mt-1 text-xs text-[#666]">
          Click any unlocked topic to view its tasks
        </div>
      </div>
    );
  }

  const progress = topic.totalTasks > 0
    ? Math.round((topic.completedTasks / topic.totalTasks) * 100)
    : 0;

  const allTasksDone = tasks.length > 0 && tasks.every(t => t.completed);

  const hasScore = isVerified || (topic.verificationScore !== null && topic.verificationScore !== undefined);
  const displayScore = verificationScore ?? topic.verificationScore;

  const statusLabel = hasScore
    ? "Verified"
    : topic.isCompleted || allTasksDone
      ? "Tasks Complete"
      : topic.isCurrent
        ? "Current"
        : "Locked";
  const statusStyles = hasScore || topic.isCompleted || allTasksDone
    ? "bg-green-500/10 text-green-400"
    : topic.isCurrent
      ? "bg-indigo-500/10 text-indigo-400"
      : "bg-[#1f1f1f] text-[#444]";

  return (
    <div
      className="max-h-[calc(100vh-200px)] overflow-y-auto pr-2 [scrollbar-width:thin] [scrollbar-color:#333_transparent] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#333]"
    >
      <div className="rounded-xl border border-[#1f1f1f] bg-[#111] p-6">
        <div className="text-xl font-bold text-white">{topic.title}</div>
        <div className="mt-1 text-sm text-[#666]">{topic.description}</div>

        <div className="mt-4 flex items-center justify-between text-xs text-[#666]">
          <span>
            {topic.completedTasks} / {topic.totalTasks} tasks
          </span>
          <span>{progress}%</span>
        </div>
        <div className="mt-2 h-1.5 w-full rounded-full bg-[#1f1f1f]">
          <div
            className={`h-1.5 rounded-full ${
              topic.isCompleted || allTasksDone ? "bg-green-500" : "bg-[#6366f1]"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {hasScore && (
          <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-green-500/10 px-3 py-2 border border-green-500/20">
            <Trophy size={14} className="text-green-400" />
            <span className="text-xs font-bold text-green-400 uppercase tracking-wider">
              Quiz Score: {displayScore}/10
            </span>
          </div>
        )}

        <div className="mt-3 flex justify-end">
          <span className={`rounded-full px-2 py-0.5 text-xs ${statusStyles}`}>
            {statusLabel}
          </span>
        </div>
      </div>

      <div className="mt-4">
        {allTasksDone && !hasScore && (
          <div className="mb-4">
            <TopicQuizBanner 
              topicId={topic.id} 
              topicTitle={topic.title} 
              onVerified={onVerified} 
            />
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="h-20 w-full animate-pulse rounded-xl bg-[#1f1f1f]"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => {
              const isCompleted = task.completed;
              const isUnlocked = task.unlocked;
              const isLocked = !task.unlocked;
              const isLoading = completingTaskId === task.id;

              return (
                <div
                  key={task.id}
                  className="flex items-start gap-4 rounded-xl border border-[#1f1f1f] bg-[#111] p-4 transition-all duration-200 hover:border-[#333]"
                >
                  <div className="pt-0.5">
                    {isCompleted ? (
                      <button
                        type="button"
                        onClick={() => !isVerified && onTaskComplete(task.id)}
                        className={`text-green-400 transition-all duration-200 ${isVerified ? 'cursor-default' : 'hover:text-green-300'}`}
                        disabled={isLoading || isVerified}
                      >
                        {isLoading ? (
                          <Loader2 size={20} className="animate-spin" />
                        ) : (
                          <CheckCircle2 size={20} />
                        )}
                      </button>
                    ) : isUnlocked ? (
                      <button
                        type="button"
                        onClick={() => onTaskComplete(task.id)}
                        className="text-[#6366f1] transition-all duration-200 hover:text-indigo-300"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 size={20} className="animate-spin" />
                        ) : (
                          <Circle size={20} />
                        )}
                      </button>
                    ) : (
                      <Lock size={16} className="text-[#333]" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div
                      className={`text-sm font-medium ${
                        isCompleted
                          ? "text-[#666] line-through"
                          : isUnlocked
                            ? "text-white"
                            : "text-[#444]"
                      }`}
                    >
                      {task.title}
                    </div>
                    <div className="mt-0.5 text-xs text-[#666]">
                      {task.description}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {isCompleted ? (
                      <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs text-green-400">
                        Completed
                      </span>
                    ) : isUnlocked ? (
                      <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-xs text-indigo-400">
                        Start
                      </span>
                    ) : (
                      <span className="rounded-full bg-[#1f1f1f] px-2 py-0.5 text-xs text-[#444]">
                        Locked
                      </span>
                    )}
                    {!isLocked && (
                      <button
                        type="button"
                        onClick={() => onTaskLearn?.(task)}
                        className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition-all duration-200 ${
                          isCompleted
                            ? "border-[#1f1f1f] bg-[#1a1a1f] text-[#444]"
                            : "border-[#1f1f1f] bg-[#1a1a1f] text-[#666] hover:border-[#6366f1] hover:bg-indigo-500/10 hover:text-[#6366f1]"
                        }`}
                      >
                        <BookOpen size={14} />
                        Learn
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicDetails;
