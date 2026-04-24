import GlowCard from "./GlowCard.jsx";

const StatsCard = ({ label, value, helper, icon }) => {
  return (
    <GlowCard className="transition-all duration-300 hover:-translate-y-[3px] hover:shadow-lg">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-800 p-2 text-white">
          <span className="text-base">{icon}</span>
        </div>
        <div className="text-sm text-gray-400">{label}</div>
      </div>
      <div className="mt-4 text-2xl font-semibold text-primary">{value}</div>
      {helper && <div className="mt-2 text-xs text-gray-500">{helper}</div>}
    </GlowCard>
  );
};

export default StatsCard;
