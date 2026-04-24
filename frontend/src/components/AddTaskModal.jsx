import { useState, useEffect } from "react";
import { X, Loader2, AlertCircle } from "lucide-react";

const AddTaskModal = ({ isOpen, onClose, onSave, editingTask }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || "");
      setDescription(editingTask.description || "");
      setPriority(editingTask.priority || "medium");
    } else {
      setTitle("");
      setDescription("");
      setPriority("medium");
    }
    setError("");
  }, [editingTask, isOpen]);

  const handleSave = async () => {
    if (title.trim() === "") {
      setError("Title is required");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSave({ title: title.trim(), description, priority });
      setTitle("");
      setDescription("");
      setPriority("medium");
    } catch (err) {
      setError(err.message || "Failed to save task");
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 bg-[#111] p-6 shadow-2xl shadow-black/50" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            {editingTask ? "Edit Task" : "Add Custom Task"}
          </h2>
          <button
            onClick={onClose}
            className="text-[#666] hover:text-white hover:bg-[#1f1f1f] p-1.5 rounded-lg transition-all duration-200"
          >
            <X size={18} />
          </button>
        </div>

        {/* Title Field */}
        <div className="mb-4">
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[#666]">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What do you want to learn or do?"
            className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg px-4 py-2.5 text-white text-sm placeholder-[#444] focus:border-[#6366f1] focus:outline-none transition-all duration-200"
            autoFocus
          />
          {error && (
            <div className="mt-1 flex items-center gap-1 text-xs text-red-400">
              <AlertCircle size={12} />
              {error}
            </div>
          )}
        </div>

        {/* Description Field */}
        <div className="mb-4">
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[#666]">
            Notes
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add any notes or details..."
            rows={3}
            className="w-full resize-none bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg px-4 py-2.5 text-white text-sm placeholder-[#444] focus:border-[#6366f1] focus:outline-none transition-all duration-200"
          />
        </div>

        {/* Priority Field */}
        <div className="mb-6">
          <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-[#666]">
            Priority
          </label>
          <div className="flex gap-2">
            {[
              { value: "low", label: "Low", color: "blue" },
              { value: "medium", label: "Medium", color: "yellow" },
              { value: "high", label: "High", color: "red" }
            ].map(({ value, label, color }) => (
              <button
                key={value}
                onClick={() => setPriority(value)}
                className={`flex-1 rounded-lg border py-2 text-xs font-medium transition-all duration-200 ${
                  priority === value
                    ? `bg-${color}-500/10 border-${color}-500/40 text-${color}-400`
                    : "bg-[#0a0a0a] border-[#1f1f1f] text-[#444] hover:border-[#333] hover:text-[#666]"
                }`}
              >
                <div className={`mb-1 inline-block h-1.5 w-1.5 rounded-full bg-${color}-400`} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-[#1f1f1f] py-2.5 text-sm text-[#666] hover:border-[#333] hover:text-white rounded-lg transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-[#6366f1] py-2.5 text-sm font-medium text-white hover:bg-indigo-500 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <Loader2 size={16} className="mx-auto animate-spin" />
            ) : (
              editingTask ? "Save Changes" : "Add Task"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;