import {
  ChevronRight,
  Rocket,
  Sparkles,
  Star,
  Target,
  Trophy
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const badgeStyles = {
  new: "bg-indigo-500/10 text-[#6366f1]",
  task: "bg-indigo-500/10 text-[#6366f1]",
  topic: "bg-purple-500/10 text-purple-400",
  skill: "bg-orange-500/10 text-orange-400",
  quiz: "bg-green-500/10 text-green-400"
};

const RecommendationCard = ({ recommendation, loading }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="animate-pulse rounded-xl border border-subtle bg-card p-6">
        <div className="h-4 w-48 rounded bg-skeleton" />
        <div className="mt-3 h-3 w-32 rounded bg-skeleton" />
      </div>
    );
  }

  if (!recommendation) {
    return null;
  }

  if (recommendation.type === "complete") {
    return (
      <div className="rounded-xl border border-subtle bg-card p-6">
        <Trophy size={24} className="text-yellow-400" />
        <div className="mt-3 text-lg font-semibold text-primary">
          All content completed!
        </div>
        <div className="mt-1 text-sm text-secondary">
          {recommendation.message}
        </div>
      </div>
    );
  }

  const badgeClass = badgeStyles[recommendation.type] || badgeStyles.task;

  const iconByType = {
    task: <Sparkles size={16} className="text-[#6366f1]" />,
    topic: <Target size={16} className="text-purple-400" />,
    skill: <Rocket size={16} className="text-orange-400" />,
    new: <Star size={16} className="text-[#6366f1]" />,
    quiz: <Trophy size={16} className="text-green-400" />
  };

  const buttonLabel =
    recommendation.type === "topic"
      ? "Start Topic →"
      : recommendation.type === "skill"
        ? "Explore Skill →"
        : recommendation.type === "quiz"
          ? "Take Topic Quiz →"
          : "Continue Learning →";

  const badgeLabel = {
    new: "Get Started",
    task: "Continue",
    topic: "New Topic",
    skill: "New Skill",
    quiz: "Final Step"
  };

  return (
    <div className="rounded-xl border border-subtle bg-card p-6 transition-all duration-200 hover:border-hover">
      <div className="flex items-center justify-between">
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium uppercase tracking-wide ${badgeClass}`}
        >
          {badgeLabel[recommendation.type] || "Continue"}
        </span>
        {iconByType[recommendation.type]}
      </div>

      <div className="mt-4">
        <div className="text-xs uppercase tracking-wide text-secondary">
          {recommendation.skill}
        </div>
        <div className="mt-1 text-xl font-bold text-primary">
          {recommendation.topic}
        </div>
        {recommendation.type === "task" && recommendation.task && (
          <div className="mt-1.5 flex items-center gap-1 text-sm text-secondary">
            <ChevronRight size={14} className="text-[#6366f1]" />
            Next: {recommendation.task}
          </div>
        )}
        {recommendation.tasksLeft !== undefined && recommendation.tasksLeft <= 3 && (
          <div className="mt-2 inline-flex rounded-full bg-yellow-500/10 px-2 py-0.5 text-xs text-yellow-400">
            {recommendation.tasksLeft} tasks left
          </div>
        )}
        <div className="mt-3 text-sm italic text-secondary">
          {recommendation.message}
        </div>
      </div>

      <div className="mt-5">
        <button
          onClick={() => navigate("/roadmap")}
          className="rounded-lg bg-[#6366f1] px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-indigo-500"
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
};

export default RecommendationCard;
