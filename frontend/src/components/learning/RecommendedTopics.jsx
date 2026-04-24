import { Layers, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RecommendedTopics = ({ topics, loading }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, idx) => (
          <div key={idx} className="h-24 w-full animate-pulse rounded-xl bg-[#1f1f1f]" />
        ))}
      </div>
    );
  }

  if (!topics || topics.length === 0) {
    return (
      <div className="rounded-xl border border-[#1f1f1f] bg-[#111] p-6 text-center">
        <Sparkles className="mx-auto h-6 w-6 text-[#6366f1]" />
        <div className="mt-3 text-sm text-[#666]">No recommendations yet</div>
        <div className="mt-1 text-xs text-[#444]">
          Complete more tasks to unlock recommendations
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {topics.map((topic) => (
        <div
          key={topic.id}
          onClick={() => navigate("/roadmap")}
          className="cursor-pointer rounded-xl border border-[#1f1f1f] bg-[#111] p-5 transition-all duration-200 hover:border-[#333]"
        >
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-[#6366f1]" />
            <span className="rounded-full bg-[#1a1a1a] px-2 py-0.5 text-xs text-[#666]">
              {topic.skillName}
            </span>
          </div>
          <div className="mt-3 text-sm font-semibold text-white">{topic.title}</div>
          <div className="mt-1 text-xs text-[#666]">{topic.description}</div>
          <div className="mt-4 flex items-center justify-between text-xs text-[#666]">
            <span>
              {topic.completedTasks} / {topic.totalTasks} tasks
            </span>
            <span className="text-[#6366f1]">Continue →</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecommendedTopics;
