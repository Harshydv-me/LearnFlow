const ProgressCard = ({ title, progress }) => {
  return (
    <div className="rounded-2xl border border-slate-800/60 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/50 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_60px_-35px_rgba(56,189,248,0.45)]">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-slate-200">{title}</div>
        <div className="text-xs text-slate-400">{progress}%</div>
      </div>
      <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-400 transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-3 text-xs text-slate-500">
        Keep it up — you are making consistent progress.
      </div>
    </div>
  );
};

export default ProgressCard;
