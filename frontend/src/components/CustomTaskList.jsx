import { CheckSquare, Square, Pencil, Trash2, ClipboardList } from "lucide-react";

const CustomTaskList = ({ tasks, onToggle, onEdit, onDelete, loading }) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="flex items-start gap-3 rounded-xl border border-[#1f1f1f] bg-[#111] p-3">
            <div className="mt-1 h-4 w-4 animate-pulse rounded bg-[#1f1f1f]" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 animate-pulse rounded bg-[#1f1f1f]" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-[#1f1f1f]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="py-6 text-center">
        <ClipboardList size={24} className="mx-auto text-[#333]" />
        <p className="mt-2 text-sm text-[#666]">No custom tasks yet</p>
        <p className="mt-1 text-xs text-[#444]">Click Add Task to create one</p>
      </div>
    );
  }

  const formatRelativeTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
  };

  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const priorityColors = {
          high: "bg-red-400",
          medium: "bg-yellow-400",
          low: "bg-blue-400"
        };

        return (
          <div
            key={task.id}
            className="group flex items-start gap-3 rounded-xl border border-[#1f1f1f] bg-[#111] p-3 transition-all duration-200 hover:border-[#333]"
          >
            {/* Checkbox */}
            <button
              onClick={() => onToggle(task.id)}
              className="mt-1 cursor-pointer transition-colors duration-200"
            >
              {task.completed ? (
                <CheckSquare size={18} className="text-green-400" />
              ) : (
                <Square size={18} className="text-[#444] hover:text-[#6366f1]" />
              )}
            </button>

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${priorityColors[task.priority]}`} />
                <span
                  className={`text-sm font-medium ${
                    task.completed ? "text-[#444] line-through" : "text-white"
                  }`}
                >
                  {task.title}
                </span>
              </div>
              {task.description && (
                <p className="mt-0.5 text-xs text-[#666] line-clamp-1">
                  {task.description}
                </p>
              )}
              {task.completed && task.completed_at && (
                <p className="mt-0.5 text-xs text-[#444]">
                  Completed {formatRelativeTime(task.completed_at)}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <button
                onClick={() => onEdit(task)}
                className="text-[#666] hover:text-white hover:bg-[#1f1f1f] rounded-lg p-1.5 transition-all duration-200"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="text-[#666] hover:text-red-400 hover:bg-red-500/10 rounded-lg p-1.5 transition-all duration-200"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CustomTaskList;
