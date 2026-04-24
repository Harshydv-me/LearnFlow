const ActivityFeed = ({ items }) => {
  return (
    <div className="rounded-2xl border border-slate-800/60 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/50 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_60px_-35px_rgba(99,102,241,0.45)]">
      <div className="mb-4 text-sm font-semibold text-slate-200">Activity</div>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-3">
            <div className="mt-1 h-2 w-2 rounded-full bg-indigo-400" />
            <div>
              <div className="text-sm text-slate-200">{item.title}</div>
              <div className="text-xs text-slate-500">{item.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
