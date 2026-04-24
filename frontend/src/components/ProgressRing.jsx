const ProgressRing = ({ progress, label }) => {
  const radius = 42;
  const stroke = 6;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const clamped = Math.min(100, Math.max(0, progress));
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg height={radius * 2} width={radius * 2} className="mb-4">
        <circle
          stroke="var(--skeleton)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="#6366f1"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          style={{ transition: "stroke-dashoffset 500ms ease" }}
        />
      </svg>
      <div className="text-3xl font-bold text-primary">{clamped}%</div>
      <div className="mt-1 text-xs text-secondary">{label}</div>
      <div className="mt-3 text-xs text-secondary">
        Keep it up — you are making consistent progress.
      </div>
    </div>
  );
};

export default ProgressRing;
