const SkillSelector = ({ skills, selectedSkillId, onSelect }) => {
  const isLoading = !skills || skills.length === 0;

  return (
    <div className="space-y-2">
      <label className="text-xs uppercase tracking-wide text-[#666]">
        Select Skill
      </label>
      {isLoading ? (
        <div className="h-10 w-full animate-pulse rounded-lg bg-[#1f1f1f]" />
      ) : (
        <select
          value={selectedSkillId || ""}
          onChange={(event) => onSelect(Number(event.target.value))}
          className="w-full rounded-lg border border-[#1f1f1f] bg-[#111] px-4 py-2.5 text-sm text-white transition-all duration-200 hover:border-[#333] focus:border-[#6366f1] focus:outline-none"
        >
          {skills.map((skill) => (
            <option key={skill.id} value={skill.id}>
              {skill.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default SkillSelector;
