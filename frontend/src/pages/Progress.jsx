import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {
  BarChart2,
  Calendar,
  Layers,
  Star,
  Target,
  TrendingUp,
  Zap
} from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import {
  getProgressHistory,
  getProgressInsights,
  getSkillsProgress,
  getWeeklyProgress
} from "../api/dashboard.js";

const Skeleton = ({ className }) => (
  <div className={`animate-pulse rounded-xl bg-skeleton ${className}`} />
);

const Progress = () => {
  const [skills, setSkills] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState("weekly");

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getSkillsProgress(),
      getWeeklyProgress(),
      getProgressHistory(),
      getProgressInsights()
    ])
      .then(([skillsData, weekly, history, insightsData]) => {
        setSkills(skillsData || []);
        setWeeklyData(weekly || []);
        setHistoryData(history || []);
        setInsights(insightsData || null);
      })
      .finally(() => setLoading(false));
  }, []);

  const chartData = activeChart === "weekly" ? weeklyData : historyData;

  const isChartEmpty = useMemo(() => {
    return chartData.every((item) => (item?.count || 0) === 0);
  }, [chartData]);

  const showHighlights = useMemo(() => {
    return Boolean(insights?.strongestSkill || insights?.weakestSkill);
  }, [insights]);

  return (
    <div className="min-h-screen bg-main text-primary">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">Progress</h1>
          <p className="mt-1 text-sm text-secondary">
            Track your learning journey across all skills.
          </p>
        </div>

        {loading ? (
          <div className="mt-8 space-y-6">
            <Skeleton className="h-8 w-32" />
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, idx) => (
                <Skeleton key={idx} className="h-28 w-full" />
              ))}
            </div>
            <Skeleton className="h-80 w-full" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, idx) => (
                <Skeleton key={idx} className="h-20 w-full" />
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
              <div className="rounded-xl border border-subtle bg-card p-5 transition-all duration-200 hover:border-hover">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-secondary">
                  <Zap size={18} className="text-[#6366f1]" />
                  This Week
                </div>
                <div className="mt-2 text-3xl font-bold text-primary">
                  {insights?.totalThisWeek || 0}
                </div>
                <div className="mt-1 text-xs text-secondary">tasks completed</div>
              </div>
              <div className="rounded-xl border border-subtle bg-card p-5 transition-all duration-200 hover:border-hover">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-secondary">
                  <Calendar size={18} className="text-purple-400" />
                  This Month
                </div>
                <div className="mt-2 text-3xl font-bold text-primary">
                  {insights?.totalThisMonth || 0}
                </div>
                <div className="mt-1 text-xs text-secondary">tasks completed</div>
              </div>
              <div className="rounded-xl border border-subtle bg-card p-5 transition-all duration-200 hover:border-hover">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-secondary">
                  <TrendingUp size={18} className="text-green-400" />
                  Daily Avg
                </div>
                <div className="mt-2 text-3xl font-bold text-primary">
                  {insights?.averagePerDay || 0}
                </div>
                <div className="mt-1 text-xs text-secondary">tasks per day (30d)</div>
              </div>
              <div className="rounded-xl border border-subtle bg-card p-5 transition-all duration-200 hover:border-hover">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-secondary">
                  <Star size={18} className="text-yellow-400" />
                  Best Day
                </div>
                <div className="mt-2 text-2xl font-bold text-primary">
                  {insights?.mostProductiveDay?.day?.trim() || "—"}
                </div>
                <div className="mt-1 text-xs text-secondary">
                  {insights?.mostProductiveDay
                    ? `${insights.mostProductiveDay.count} tasks on average`
                    : "No data yet"}
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-subtle bg-card p-6">
              <div className="mb-6 flex items-center justify-between">
                <div className="text-sm font-semibold text-primary">Activity</div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveChart("weekly")}
                    className={`rounded-lg px-3 py-1.5 text-xs transition-all duration-200 ${
                      activeChart === "weekly"
                        ? "bg-[#6366f1] text-white"
                        : "bg-card-hover text-secondary hover:text-primary"
                    }`}
                  >
                    7 days
                  </button>
                  <button
                    onClick={() => setActiveChart("monthly")}
                    className={`rounded-lg px-3 py-1.5 text-xs transition-all duration-200 ${
                      activeChart === "monthly"
                        ? "bg-[#6366f1] text-white"
                        : "bg-card-hover text-secondary hover:text-primary"
                    }`}
                  >
                    30 days
                  </button>
                </div>
              </div>

              <div className="h-64">
                {isChartEmpty ? (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <BarChart2 size={32} className="text-muted" />
                    <div className="mt-2 text-sm text-secondary">No activity yet</div>
                    <div className="mt-1 text-xs text-muted">
                      Complete tasks to see your progress chart
                    </div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    {activeChart === "weekly" ? (
                      <BarChart data={weeklyData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="var(--skeleton)"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 11, fill: "#666" }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fontSize: 11, fill: "#666" }}
                          axisLine={false}
                          tickLine={false}
                          allowDecimals={false}
                          width={30}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#111",
                            border: "1px solid var(--border-subtle)",
                            borderRadius: "8px",
                            color: "#fff",
                            fontSize: "12px"
                          }}
                          cursor={{ fill: "rgba(99,102,241,0.1)" }}
                          labelStyle={{ color: "#666" }}
                        />
                        <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    ) : (
                      <AreaChart data={historyData}>
                        <defs>
                          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="var(--skeleton)"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 11, fill: "#666" }}
                          axisLine={false}
                          tickLine={false}
                          interval={4}
                        />
                        <YAxis
                          tick={{ fontSize: 11, fill: "#666" }}
                          axisLine={false}
                          tickLine={false}
                          allowDecimals={false}
                          width={30}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#111",
                            border: "1px solid var(--border-subtle)",
                            borderRadius: "8px",
                            color: "#fff",
                            fontSize: "12px"
                          }}
                          cursor={{ fill: "rgba(99,102,241,0.1)" }}
                          labelStyle={{ color: "#666" }}
                        />
                        <Area
                          type="monotone"
                          dataKey="count"
                          stroke="#6366f1"
                          fillOpacity={1}
                          fill="url(#colorGradient)"
                        />
                      </AreaChart>
                    )}
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-4 text-sm font-semibold text-primary">Skills Breakdown</div>
              {skills.length === 0 ? (
                <div className="rounded-xl border border-subtle bg-card p-8 text-center">
                  <Layers size={32} className="mx-auto text-muted" />
                  <div className="mt-2 text-sm text-secondary">No skills data yet</div>
                </div>
              ) : (
                skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="mb-3 rounded-xl border border-subtle bg-card p-5 transition-all duration-200 hover:border-hover last:mb-0"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-sm font-semibold text-primary">{skill.name}</div>
                        <span
                          className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                            skill.status === "completed"
                              ? "bg-green-500/10 text-green-400"
                              : skill.status === "in_progress"
                                ? "bg-indigo-500/10 text-indigo-400"
                                : "bg-skeleton text-muted"
                          }`}
                        >
                          {skill.status === "completed"
                            ? "Completed"
                            : skill.status === "in_progress"
                              ? "In Progress"
                              : "Not Started"}
                        </span>
                      </div>
                      <div
                        className={`text-sm font-semibold ${
                          skill.status === "completed" ? "text-green-400" : "text-primary"
                        }`}
                      >
                        {skill.progressPercentage}%
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xs text-secondary">
                      <span>
                        {skill.completedTasks} / {skill.totalTasks} tasks
                      </span>
                      <span>·</span>
                      <span>
                        {skill.completedTopics} / {skill.totalTopics} topics
                      </span>
                    </div>
                    <div className="mt-3 h-1.5 w-full rounded-full bg-skeleton">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          skill.status === "completed"
                            ? "bg-green-500"
                            : skill.status === "in_progress"
                              ? "bg-[#6366f1]"
                              : "bg-skeleton"
                        }`}
                        style={{ width: `${skill.progressPercentage}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>

            {showHighlights && (
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {insights?.strongestSkill && (
                  <div className="rounded-xl border border-subtle bg-card p-5">
                    <div className="flex items-center text-xs uppercase tracking-wide text-secondary">
                      <TrendingUp size={16} className="text-green-400" />
                      <span className="ml-2">Strongest Skill</span>
                    </div>
                    <div className="mt-3 text-lg font-bold text-primary">
                      {insights.strongestSkill.name}
                    </div>
                    <div className="mt-1 text-2xl font-bold text-green-400">
                      {insights.strongestSkill.progressPercentage}% complete
                    </div>
                    <div className="mt-2 text-xs text-secondary">
                      Your best performing skill. Keep it up!
                    </div>
                  </div>
                )}
                {insights?.weakestSkill && (
                  <div className="rounded-xl border border-subtle bg-card p-5">
                    <div className="flex items-center text-xs uppercase tracking-wide text-secondary">
                      <Target size={16} className="text-yellow-400" />
                      <span className="ml-2">Focus Area</span>
                    </div>
                    <div className="mt-3 text-lg font-bold text-primary">
                      {insights.weakestSkill.name}
                    </div>
                    <div className="mt-1 text-2xl font-bold text-yellow-400">
                      {insights.weakestSkill.progressPercentage}% complete
                    </div>
                    <div className="mt-2 text-xs text-secondary">
                      Spend more time here to build momentum.
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Progress;
