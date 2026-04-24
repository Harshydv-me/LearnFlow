import { BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SkillCard = ({ skill }) => {
  const navigate = useNavigate();
  const progress = skill.progressPercentage ?? 0;
  const isComplete = progress === 100;
  const barColor = isComplete
    ? "bg-green-500"
    : progress > 0
      ? "bg-[#6366f1]"
      : "bg-skeleton";

  return (
    <div
      onClick={() => navigate(`/roadmap?skillId=${skill.id}`)}
      className="cursor-pointer rounded-xl border border-subtle bg-card p-5 transition-all duration-200 hover:border-hover"
    >
      <div className="flex items-center justify-between">
        <BookOpen size={18} className="text-[#6366f1]" />
        <span className={`text-xs ${isComplete ? "text-green-400" : "text-secondary"}`}>
          {isComplete ? "Complete ✓" : `${progress}%`}
        </span>
      </div>
      <div className="mt-3 text-base font-semibold text-primary">{skill.name}</div>
      <div className="mt-1 text-xs text-secondary">
        {skill.description}
      </div>
      <div className="mt-4 h-1 w-full rounded-full bg-skeleton">
        <div
          className={`h-1 rounded-full ${barColor}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-2 text-xs text-secondary">
        {skill.completedTasks} of {skill.totalTasks} tasks completed
      </div>
    </div>
  );
};

export default SkillCard;
