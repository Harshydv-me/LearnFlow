import { useEffect, useState } from "react";
import { CheckCircle, Trophy, Unlock } from "lucide-react";

const iconMap = {
  completed: CheckCircle,
  task_completed: CheckCircle,
  unlocked: Unlock,
  milestone: Trophy
};

const getRelativeTime = (timestamp) => {
  const now = new Date()
  const past = new Date(timestamp)
  const diffMs = now - past
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "just now"
  if (diffMins < 60) return `${diffMins} minutes ago`
  if (diffHours < 24) return `${diffHours} hours ago`
  if (diffDays === 1) return "Yesterday"
  return `${diffDays} days ago`
}

const ActivityTimeline = ({ items }) => {
  const [tick, setTick] = useState(0); // eslint-disable-line no-unused-vars

  useEffect(() => {
    // Update every 30 seconds so timestamps stay fresh
    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="mb-4 text-sm font-semibold text-white">Activity</div>
      <div className="relative border-l border-neutral-800 pl-10">
        {items.map((item) => {
          const Icon = iconMap[item.type] || CheckCircle;
          return (
            <div key={item.id} className="relative pb-6 last:pb-0">
              <div className="flex items-start gap-4">
                <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#111] ring-2 ring-[#1f1f1f]">
                  <Icon className="h-4 w-4 text-[#6366f1]" />
                </span>
                <div>
                  <div className="text-sm text-white">{item.title}</div>
                  <div
                    className="text-xs text-[#666]"
                    title={new Date(item.timestamp).toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                      dateStyle: "medium",
                      timeStyle: "short"
                    })}
                  >
                    {getRelativeTime(item.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityTimeline;
