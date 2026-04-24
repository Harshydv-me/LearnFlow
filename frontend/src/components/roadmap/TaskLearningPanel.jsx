import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Circle,
  Code,
  Lightbulb,
  Loader2,
  Lock,
  Sparkles,
  X
} from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { getTaskContent } from "../../api/dashboard.js";

const TaskLearningPanel = ({
  task,
  topic,
  skillName,
  onClose,
  onComplete,
  isCompleting,
  allTasks,
  onNextTask
}) => {
  const [content, setContent] = useState(null);
  const [loadingContent, setLoadingContent] = useState(true);
  const [contentError, setContentError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!task?.id) return;
    setLoadingContent(true);
    setContentError(null);
    setContent(null);

    getTaskContent(task.id)
      .then((res) => {
        if (res?.success) {
          setContent(res.content);
        } else {
          setContentError("Failed to load content");
        }
      })
      .catch(() => setContentError("Failed to load content"))
      .finally(() => setLoadingContent(false));
  }, [task?.id, retryCount]);

  const nextTask = useMemo(() => {
    const currentIndex = allTasks.findIndex((item) => item.id === task.id);
    return allTasks[currentIndex + 1] || null;
  }, [allTasks, task.id]);

  const explanationBlocks = useMemo(() => {
    return content?.explanation?.split("\n\n") || [];
  }, [content]);

  const isLocked = !task.unlocked;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full w-full animate-slide-in border-l border-subtle bg-[#0f0f0f] shadow-2xl shadow-black/50 sm:w-[600px] lg:w-[680px]">
        <div className="flex h-full flex-col">
          <div className="flex-shrink-0 border-b border-subtle bg-[#0f0f0f] px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-xs text-secondary">
                <span>{skillName}</span>
                <ChevronRight size={12} className="mx-1 text-muted" />
                <span>{topic?.title}</span>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-secondary transition-all duration-200 hover:bg-skeleton hover:text-primary"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-2 text-xl font-bold text-primary">{task.title}</div>
            <div className="mt-1 text-sm text-secondary">{task.description}</div>

            <div className="mt-3 flex items-center gap-2">
              {task.completed ? (
                <>
                  <CheckCircle2 size={14} className="text-green-400" />
                  <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs text-green-400">
                    Completed
                  </span>
                </>
              ) : task.unlocked ? (
                <>
                  <Circle size={14} className="text-[#6366f1]" />
                  <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-xs text-indigo-400">
                    In Progress
                  </span>
                </>
              ) : (
                <>
                  <Lock size={14} className="text-muted" />
                  <span className="rounded-full bg-skeleton px-2 py-0.5 text-xs text-muted">
                    Locked
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6 [scrollbar-width:thin] [scrollbar-color:var(--border-hover)_transparent] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted">
            {loadingContent ? (
              <div>
                <div className="mb-6 flex items-center gap-2">
                  <Sparkles size={16} className="text-[#6366f1]" />
                  <span className="text-sm text-secondary">Generating your lesson...</span>
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#6366f1]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#6366f1] [animation-delay:0.1s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#6366f1] [animation-delay:0.2s]" />
                  </div>
                </div>
                <div className="mt-4 h-4 w-full animate-pulse rounded bg-skeleton" />
                <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-skeleton" />
                <div className="mt-2 h-4 w-4/6 animate-pulse rounded bg-skeleton" />
                <div className="mt-6 h-32 w-full animate-pulse rounded-xl bg-skeleton" />
                <div className="mt-6 h-4 w-full animate-pulse rounded bg-skeleton" />
                <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-skeleton" />
              </div>
            ) : contentError ? (
              <div className="rounded-xl border border-red-500/20 bg-card-hover p-6 text-center">
                <AlertCircle size={24} className="mx-auto text-red-400" />
                <div className="mt-2 text-sm text-primary">Failed to generate content</div>
                <div className="mt-1 text-xs text-secondary">
                  Check your API key or try again
                </div>
                <button
                  onClick={() => setRetryCount((count) => count + 1)}
                  className="mt-4 rounded-lg bg-skeleton px-4 py-2 text-sm text-primary transition-all duration-200 hover:bg-[#2a2a2a]"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div>
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <BookOpen size={16} className="text-[#6366f1]" />
                    <div className="text-sm font-semibold text-primary">Explanation</div>
                  </div>
                  <div className="text-sm leading-relaxed text-[#999]">
                    {explanationBlocks.map((paragraph, index) => (
                      <p key={index} className="mb-3">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <div className="mb-4 flex items-center gap-2">
                    <Code size={16} className="text-purple-400" />
                    <div className="text-sm font-semibold text-primary">Code Examples</div>
                  </div>

                  {content?.codeExamples?.map((example, index) => (
                    <div
                      key={`${example.title}-${index}`}
                      className="mb-4 overflow-hidden rounded-xl border border-subtle bg-main"
                    >
                      <div className="flex items-center justify-between bg-card px-4 py-2.5">
                        <div className="flex items-center">
                          <div className="flex items-center gap-1">
                            <span className="h-3 w-3 rounded-full bg-red-500/60" />
                            <span className="h-3 w-3 rounded-full bg-yellow-500/60" />
                            <span className="h-3 w-3 rounded-full bg-green-500/60" />
                          </div>
                          <span className="ml-3 font-mono text-xs text-secondary">
                            {example.language}
                          </span>
                        </div>
                        <span className="text-xs text-secondary">{example.title}</span>
                      </div>
                      <SyntaxHighlighter
                        language={example.language}
                        style={oneDark}
                        customStyle={{
                          margin: 0,
                          padding: "1rem",
                          background: "#0a0a0a",
                          fontSize: "13px",
                          lineHeight: "1.6"
                        }}
                        showLineNumbers
                        lineNumberStyle={{ color: "var(--border-hover)", fontSize: "11px" }}
                      >
                        {example.code}
                      </SyntaxHighlighter>
                      <div className="border-t border-subtle px-4 py-3 text-xs italic text-secondary">
                        {example.explanation}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <div className="mb-3 flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-green-400" />
                    <div className="text-sm font-semibold text-primary">Key Takeaways</div>
                  </div>
                  <div className="space-y-2">
                    {content?.keyTakeaways?.map((item, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#6366f1]" />
                        <span className="text-sm text-[#999]">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">
                  <div className="flex items-start gap-3">
                    <Lightbulb
                      size={16}
                      className="mt-0.5 flex-shrink-0 text-[#6366f1]"
                    />
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-[#6366f1]">
                        Pro Tip
                      </div>
                      <div className="mt-1 text-sm text-[#999]">{content?.proTip}</div>
                    </div>
                  </div>
                </div>
                <div className="pb-8" />
              </div>
            )}
          </div>

          <div className="flex-shrink-0 border-t border-subtle bg-[#0f0f0f] px-6 py-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                {task.completed ? (
                  <div className="flex items-center gap-2 text-sm font-medium text-green-400">
                    <CheckCircle2 size={16} />
                    Task completed
                  </div>
                ) : task.unlocked ? (
                  <button
                    onClick={() => onComplete(task.id)}
                    disabled={isCompleting}
                    className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-primary transition-all duration-200 ${
                      isCompleting
                        ? "cursor-not-allowed bg-[#4f46e5] opacity-70"
                        : "bg-[#6366f1] hover:bg-indigo-500"
                    }`}
                  >
                    {isCompleting ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <CheckCircle2 size={16} />
                    )}
                    {isCompleting ? "Completing..." : "Mark as Complete"}
                  </button>
                ) : (
                  <div className="text-xs text-muted">Complete previous tasks first</div>
                )}
              </div>

              <div>
                {nextTask ? (
                  <button
                    onClick={() =>
                      nextTask.unlocked || task.completed ? onNextTask(nextTask) : undefined
                    }
                    className={`rounded-lg px-4 py-2.5 text-sm transition-all duration-200 ${
                      nextTask.unlocked || task.completed
                        ? "border border-[#6366f1] text-[#6366f1] hover:bg-indigo-500/10"
                        : "cursor-not-allowed border border-subtle text-muted opacity-50"
                    }`}
                  >
                    Next Task →
                  </button>
                ) : task.completed ? (
                  <div className="text-sm font-medium text-green-400">Topic Complete! 🎉</div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskLearningPanel;
