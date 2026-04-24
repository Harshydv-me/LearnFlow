const GlowCard = ({ children, className = "" }) => {
  return (
    <div className={`relative group h-full overflow-hidden ${className}`}>
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-transparent opacity-0 blur-md transition duration-500 group-hover:opacity-100" />
      <div className="relative h-full rounded-xl border border-subtle bg-card p-6">
        {children}
      </div>
    </div>
  );
};

export default GlowCard;
