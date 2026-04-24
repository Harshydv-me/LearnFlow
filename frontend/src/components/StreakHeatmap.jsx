import { useMemo, useState } from "react";

const colors = {
  0: "var(--bg-card-hover)",
  1: "#a5b4fc", // indigo-300
  2: "#818cf8", // indigo-400
  3: "#6366f1", // indigo-500
  4: "#4f46e5"  // indigo-600
};

const formatDate = (date) =>
  date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

const toIsoDate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const buildDateMap = (data) =>
  data.reduce((acc, entry) => {
    acc[entry.date] = entry.count;
    return acc;
  }, {});

const createEmptyData = (year) => {
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);
  const result = [];
  const date = new Date(start);
  while (date <= end) {
    const iso = toIsoDate(date);
    result.push({ date: iso, count: 0 });
    date.setDate(date.getDate() + 1);
  }
  return result;
};

const StreakHeatmap = ({ data }) => {
  const [hover, setHover] = useState(null);

  const { weeks, dateMap, maxCount } = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const source = data && data.length > 0 ? data : createEmptyData(currentYear);
    const map = buildDateMap(source);
    const max = source.reduce((acc, item) => Math.max(acc, Number(item.count || 0)), 0);

    const start = new Date(currentYear, 0, 1);
    const end = new Date(currentYear, 11, 31);

    const alignedStart = new Date(start);
    alignedStart.setDate(start.getDate() - start.getDay());

    const alignedEnd = new Date(end);
    alignedEnd.setDate(end.getDate() + (6 - end.getDay()));

    const allDays = [];
    const cursor = new Date(alignedStart);
    while (cursor <= alignedEnd) {
      allDays.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }

    const columns = [];
    for (let i = 0; i < allDays.length; i += 7) {
      const weekDates = allDays.slice(i, i + 7);
      const monthStart = weekDates.find(
        (date) =>
          date >= start &&
          date <= end &&
          date.getDate() === 1
      );
      columns.push({
        month: monthStart
          ? monthStart.toLocaleDateString("en-US", { month: "short" })
          : "",
        days: weekDates.map((date) => ({
          date,
          iso: toIsoDate(date),
          inRange: date >= start && date <= end
        }))
      });
    }

    return {
      weeks: columns,
      dateMap: map,
      maxCount: Math.max(max, 1)
    };
  }, [data]);

  const getColor = (count, inRange) => {
    if (!inRange) {
      return "transparent";
    }
    if (count <= 0) {
      return colors[0];
    }

    const level = Math.min(4, Math.max(1, Math.ceil((count / maxCount) * 4)));
    return colors[level];
  };

  return (
    <div>
      <div className="mb-1 text-sm font-semibold text-primary">Learning Consistency</div>
      <div className="text-xs text-secondary">
        Track your daily learning momentum.
      </div>

      <div className="relative mt-6">
        {hover && (
          <div className="pointer-events-none absolute -top-10 left-0 z-10 rounded-md border border-subtle bg-card px-3 py-2 text-xs text-primary shadow-lg">
            {hover.count} tasks completed on {hover.label}
          </div>
        )}

        <div className="overflow-x-auto pb-1">
          <div className="flex gap-[3px] pr-2">
            {weeks.map((week, weekIndex) => (
              <div key={`week-${weekIndex}`} className="flex flex-col gap-[3px]">
                <div className="mb-1 h-3 text-[10px] text-[#555]">
                  {week.month}
                </div>
                {week.days.map((day) => {
                  const count = day.inRange ? dateMap[day.iso] ?? 0 : 0;
                  const color = getColor(count, day.inRange);
                  return (
                    <div
                      key={day.iso}
                      onMouseEnter={() =>
                        day.inRange && setHover({ count, label: formatDate(day.date) })
                      }
                      onMouseLeave={() => setHover(null)}
                      className="h-[11px] w-[11px] rounded-[3px] transition-all duration-200"
                      style={{ backgroundColor: color }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreakHeatmap;
