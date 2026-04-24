import { Award, Flame, Rocket, ShieldCheck, Star, Trophy } from "lucide-react";

const iconMap = {
  "First Step": Award,
  "Getting Started": Star,
  "On a Roll": Rocket,
  "Streak Starter": Flame,
  "Week Warrior": Trophy,
  "Topic Master": ShieldCheck,
  "First Task Completed": Award,
  "7 Day Streak": Flame,
  "10 Tasks Completed": Rocket,
  "50 Tasks Completed": ShieldCheck
};

const Achievements = ({ achievements = [] }) => {
  const items = achievements.length > 0 ? achievements : [];
  return (
    <div>
      <div className="mb-4 text-sm font-semibold text-white">Achievements</div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((achievement) => {
          const Icon = iconMap[achievement.title] || Award;
          return (
            <div
              key={achievement.id}
              className={`rounded-xl border border-[#1f1f1f] bg-[#111] p-4 transition-all hover:scale-105 ${
                achievement.unlocked ? "" : "opacity-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <Icon
                  className={`h-6 w-6 ${
                    achievement.unlocked ? "text-indigo-400" : "text-gray-500"
                  }`}
                />
                {!achievement.unlocked && (
                  <span className="rounded-full bg-[#1f1f1f] px-2 py-0.5 text-xs text-gray-400">
                    Locked
                  </span>
                )}
              </div>
              <div className="mt-3 text-sm font-semibold text-white">
                {achievement.title}
              </div>
              <div className="mt-1 text-xs text-[#666]">
                {achievement.description}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Achievements;
