import { useEffect, useState } from "react";
import { Target, Pencil, Check, X, Loader2 } from "lucide-react";

const DailyGoal = ({ goalTasks, completedTasks, percentage, onGoalUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState(goalTasks);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setInputVal(goalTasks);
  }, [goalTasks]);

  const handleSaveGoal = async () => {
    const num = parseInt(inputVal);
    if (isNaN(num) || num < 1 || num > 20) return;

    setSaving(true);
    try {
      await onGoalUpdate(num);
      setEditing(false);
    } catch (error) {
      console.error("Failed to update goal:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSaveGoal();
    } else if (e.key === "Escape") {
      setEditing(false);
      setInputVal(goalTasks);
    }
  };

  const progressColor = percentage >= 100 ? "bg-green-500" : "bg-[#6366f1]";

  return (
    <div className="bg-card border border-subtle rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-primary">Today's Goal</div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="text-secondary hover:text-primary transition-colors duration-200 p-1"
          >
            <Pencil size={14} />
          </button>
        )}
      </div>

      {/* Goal Display/Edit */}
      <div className="mt-2">
        {!editing ? (
          <div className="flex items-center gap-2">
            <Target size={16} className="text-[#6366f1]" />
            <span className="text-sm text-secondary">
              Complete {goalTasks} tasks today
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-secondary">Complete</span>
            <input
              type="number"
              min="1"
              max="20"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-16 bg-main border border-[#6366f1] rounded-lg px-2 py-1 text-primary text-sm text-center focus:outline-none"
              autoFocus
            />
            <span className="text-sm text-secondary">tasks today</span>

            <button
              onClick={handleSaveGoal}
              disabled={saving}
              className="bg-[#6366f1] hover:bg-indigo-500 text-white px-2 py-1 rounded-lg text-xs transition-all duration-200 disabled:opacity-50"
            >
              {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
            </button>

            <button
              onClick={() => {
                setEditing(false);
                setInputVal(goalTasks);
              }}
              className="text-secondary hover:text-primary hover:bg-skeleton px-2 py-1 rounded-lg transition-all duration-200"
            >
              <X size={12} />
            </button>
          </div>
        )}
      </div>

      {/* Progress Section */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-secondary">
          <span>Progress</span>
          <span>{percentage}%</span>
        </div>
        <div className="mt-2 h-1.5 w-full rounded-full bg-skeleton">
          <div
            className={`h-1.5 rounded-full ${progressColor} transition-all duration-500`}
            style={{ width: `${Math.min(100, percentage)}%` }}
          />
        </div>
      </div>

      <div className="mt-3 text-xs text-secondary">
        {completedTasks} / {goalTasks} tasks completed
      </div>

      {percentage >= 100 && (
        <div className="mt-3 bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-2.5 flex items-center gap-2">
          <span className="text-lg">🎉</span>
          <span className="text-sm text-green-400 font-medium">Goal Completed Today!</span>
        </div>
      )}
    </div>
  );
};

export default DailyGoal;
