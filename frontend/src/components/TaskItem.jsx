const TaskItem = ({ task, locked, onComplete, loading, topicTitle }) => {
  const handleChange = () => {
    if (!task.completed && !locked && !loading) {
      onComplete(task.id);
    }
  };

  return (
    <div
      className={`group flex items-start gap-4 rounded-xl border border-slate-800/60 bg-slate-900/70 p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-700/70 hover:shadow-[0_18px_40px_-30px_rgba(59,130,246,0.45)] ${
        locked ? "opacity-60" : "opacity-100"
      }`}
    >
      <input
        type="checkbox"
        checked={task.completed}
        disabled={locked || loading}
        onChange={handleChange}
        className="mt-1 h-4 w-4 cursor-pointer rounded border-slate-600 bg-slate-950 text-indigo-400 focus:ring-indigo-400 disabled:cursor-not-allowed"
      />
      <div className="flex-1">
        <div
          className={`text-sm font-semibold ${
            task.completed ? "line-through text-slate-400" : "text-slate-100"
          } ${locked ? "text-slate-400" : ""}`}
        >
          {locked && "🔒 "}
          {task.title}
        </div>
        <div className="mt-1 text-xs text-slate-400">{task.description}</div>
      </div>
      {loading ? (
        <div className="text-xs text-slate-400">Saving...</div>
      ) : task.completed ? (
        <div className="text-xs font-medium text-emerald-400">Completed</div>
      ) : locked ? (
        <div className="text-xs font-medium text-slate-500">Locked</div>
      ) : (
        <div className="text-xs font-medium text-indigo-300">Start</div>
      )}
    </div>
  );
};

export default TaskItem;
