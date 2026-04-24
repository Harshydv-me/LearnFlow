const SkillSelector = ({ skills, selectedSkillId, onSelect }) => {
  const isLoading = !skills || skills.length === 0;

  return (
    <div className="space-y-2">
      <label className="text-xs uppercase tracking-wide text-secondary">
        Select Skill
      </label>
      {isLoading ? (
        <div className="h-10 w-full animate-pulse rounded-lg bg-skeleton" />
      ) : (
        <select
          value={selectedSkillId || ""}
          onChange={(event) => onSelect(Number(event.target.value))}
          className="w-full rounded-lg border border-subtle bg-card px-4 py-2.5 text-sm text-primary transition-all duration-200 hover:border-hover focus:border-[#6366f1] focus:outline-none"
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
