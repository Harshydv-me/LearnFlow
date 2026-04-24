const navItems = [
  { label: "Dashboard", icon: "◈", active: true },
  { label: "Learning", icon: "◎" },
  { label: "Roadmap", icon: "◴" },
  { label: "Progress", icon: "◐" },
  { label: "Achievements", icon: "✦" },
  { label: "Settings", icon: "⚙" }
];

const Sidebar = () => {
  return (
    <aside className="hidden h-screen w-64 flex-col border-r border-slate-800/60 bg-gradient-to-b from-slate-950 via-slate-900/70 to-slate-950 px-5 py-6 backdrop-blur-xl md:flex">
      <div className="mb-10">
        <div className="text-lg font-semibold tracking-wide text-slate-100">
          LearnFlow
        </div>
        <div className="text-xs text-slate-500">Premium Learning Suite</div>
      </div>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <button
            key={item.label}
            type="button"
            className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-300 ${
              item.active
                ? "border border-indigo-500/20 bg-indigo-500/10 text-indigo-300 shadow-[0_0_24px_rgba(99,102,241,0.2)]"
                : "border border-transparent text-slate-400 hover:bg-slate-900/60 hover:text-slate-200"
            }`}
          >
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-md text-xs ${
                item.active
                  ? "bg-indigo-500/20 text-indigo-300"
                  : "bg-slate-800/60 text-slate-400 group-hover:text-slate-200"
              }`}
            >
              {item.icon}
            </span>
            <span className="tracking-wide">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="mt-auto rounded-xl border border-slate-800/60 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800/60 p-4 text-xs text-slate-400 shadow-[0_0_24px_rgba(15,23,42,0.45)]">
        Upgrade to Pro for advanced insights.
      </div>
    </aside>
  );
};

export default Sidebar;
