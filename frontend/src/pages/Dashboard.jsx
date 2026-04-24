import { useEffect, useMemo, useState, useCallback } from "react";
import {
  CheckSquare,
  TrendingUp,
  Zap,
  Trophy,
  Plus,
  ClipboardList
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import dashboardApi from "../api/dashboard.js";
import ProgressRing from "../components/ProgressRing.jsx";
import ActivityTimeline from "../components/ActivityTimeline.jsx";
import DailyGoal from "../components/DailyGoal.jsx";
import Achievements from "../components/Achievements.jsx";
import GlowCard from "../components/GlowCard.jsx";
import RecommendationCard from "../components/RecommendationCard.jsx";
import QuizModal from "../components/QuizModal.jsx";
import TopicQuizBanner from "../components/TopicQuizBanner.jsx";
import { getRecommendation } from "../api/dashboard.js";
import Navbar from "../components/Navbar.jsx";
import AddTaskModal from "../components/AddTaskModal.jsx";
import CustomTaskList from "../components/CustomTaskList.jsx";
import {
  getCustomTasks, createCustomTask,
  updateCustomTask, toggleCustomTaskComplete,
  deleteCustomTask, updateDailyGoal, checkTopicVerified
} from "../api/dashboard.js";

const Skeleton = ({ className }) => (
  <div className={`animate-pulse rounded bg-[#1f1f1f] ${className}`} />
);

const Dashboard = ({ token }) => {
  const navigate = useNavigate();
  const [overview, setOverview] = useState(null);
  const [streak, setStreak] = useState(null);
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [dailyGoal, setDailyGoal] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [activeTopicId, setActiveTopicId] = useState(null);
  const [activeTopicInfo, setActiveTopicInfo] = useState(null);
  const [topicVerified, setTopicVerified] = useState(false);
  const [topicVerificationScore, setTopicVerificationScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [roadmapTasks, setRoadmapTasks] = useState([]);
  const [roadmapLoading, setRoadmapLoading] = useState(true);
  const [recommendation, setRecommendation] = useState(null);
  const [loadingRecommendation, setLoadingRecommendation] = useState(true);
  const [customTasks, setCustomTasks] = useState([]);
  const [loadingCustomTasks, setLoadingCustomTasks] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const loadDashboard = async () => {
    setLoading(true);
    setLoadingCustomTasks(true);
    try {
      const [
        dashboardData,
        streakData,
        statsData,
        activityData,
        dailyGoalData,
        achievementsData,
        activeTopicData,
        recommendationData,
        customTasksData
      ] = await Promise.all([
        dashboardApi.getDashboard(),
        dashboardApi.getStreak(),
        dashboardApi.getStats(),
        dashboardApi.getActivity(),
        dashboardApi.getDailyGoal(),
        dashboardApi.getAchievements(),
        dashboardApi.getActiveTopic(),
        getRecommendation(),
        getCustomTasks()
      ]);

      setOverview(dashboardData || null);
      setStreak(streakData || null);
      setStats(statsData || null);
      setActivity(activityData || []);
      setDailyGoal(dailyGoalData || null);
      setAchievements(achievementsData || []);
      setActiveTopicId(activeTopicData?.topicId ?? null);
      setActiveTopicInfo(activeTopicData || null);

      if (activeTopicData?.topicId) {
        const totalTasks = Number(activeTopicData.totalTasks || 0);
        const completedTasks = Number(activeTopicData.completedTasks || 0);
        const tasksLeft = Math.max(totalTasks - completedTasks, 0);
        const dynamicRecommendation = {
          type: "task",
          skill: activeTopicData.skillName || "Learning Path",
          topic: activeTopicData.title || "Continue Learning",
          topicId: activeTopicData.topicId,
          task: activeTopicData.nextTaskTitle || null,
          message:
            tasksLeft > 0
              ? `Continue your progress in ${activeTopicData.title}.`
              : `You completed ${activeTopicData.title}. Keep the momentum going.`,
          tasksLeft,
          isNew: false
        };
        setRecommendation(dynamicRecommendation);
      } else {
        setRecommendation(recommendationData || null);
      }

      setCustomTasks(customTasksData || []);
    } finally {
      setLoading(false);
      setLoadingRecommendation(false);
      setLoadingCustomTasks(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadDashboard();
    }
  }, [token]);

  // Refresh daily goal every 30 seconds to update completed tasks count
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(async () => {
      try {
        const dailyGoalData = await dashboardApi.getDailyGoal();
        setDailyGoal(dailyGoalData || null);
      } catch (error) {
        console.error("Failed to refresh daily goal:", error);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [token]);

  const loadTasks = useCallback(async () => {
    if (!activeTopicId) {
      setRoadmapTasks([]);
      setRoadmapLoading(false);
      return;
    }
    setRoadmapLoading(true);
    try {
      const tasks = await dashboardApi.getTasks(activeTopicId);
      setRoadmapTasks(tasks || []);
    } finally {
      setRoadmapLoading(false);
    }
  }, [activeTopicId]);

  useEffect(() => {
    if (token) {
      loadTasks();
    }
  }, [token, activeTopicId, loadTasks]);

  useEffect(() => {
    const loadVerification = async () => {
      if (!activeTopicId) {
        setTopicVerified(false);
        setTopicVerificationScore(0);
        return;
      }
      try {
        const result = await checkTopicVerified(activeTopicId);
        setTopicVerified(Boolean(result?.verified));
        setTopicVerificationScore(Number(result?.score || 0));
      } catch {
        setTopicVerified(false);
        setTopicVerificationScore(0);
      }
    };
    loadVerification();
  }, [activeTopicId]);

  const progressValue = useMemo(() => overview?.overallProgress ?? 0, [overview]);

  const handleComplete = async (taskId) => {
    try {
      await dashboardApi.updateTaskProgress(taskId);
      // After task completion, refresh dashboard to update counts, but we don't change activeTopicId manually
      await loadDashboard();
      await loadTasks();
      
      // Immediately refresh daily goal after task completion for instant feedback
      const updatedDailyGoal = await dashboardApi.getDailyGoal();
      setDailyGoal(updatedDailyGoal || null);
    } catch {
      // errors handled in API layer
    }
  };

  const handleTopicVerified = async () => {
    if (activeTopicId) {
      const verification = await checkTopicVerified(activeTopicId);
      setTopicVerified(Boolean(verification?.verified));
      setTopicVerificationScore(Number(verification?.score || 0));
      // Refresh dashboard to switch to the NEXT topic automatically via backend logic
      await loadDashboard();
    }
  };

  const handleSaveTask = async (data) => {
    if (editingTask) {
      const result = await updateCustomTask(editingTask.id, data);
      setCustomTasks(prev => prev.map(t =>
        t.id === editingTask.id ? result.task : t
      ));
    } else {
      const result = await createCustomTask(data);
      setCustomTasks(prev => [result.task, ...prev]);
    }
    setEditingTask(null);
  };

  const handleToggleTask = async (id) => {
    const result = await toggleCustomTaskComplete(id);
    setCustomTasks(prev => prev.map(t =>
      t.id === id ? result.task : t
    ));
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (id) => {
    await deleteCustomTask(id);
    setCustomTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleGoalUpdate = async (newGoal) => {
    const result = await updateDailyGoal(newGoal);
    if (result?.success) {
      setDailyGoal(prev => ({
        ...prev,
        goalTasks: result.goalTasks,
        percentage: Math.min(100, Math.round(
          (prev.completedTasks / result.goalTasks) * 100
        ))
      }));
    }
  };

  const activityItems = activity.map((item, index) => ({
    id: index,
    type: "completed",
    title: item.title,
    timestamp: item.timestamp
  }));

  const streakCurrent = streak?.current_streak_days ?? 0;
  const streakLongest = streak?.longest_streak_days ?? 0;

  const totalTasksCompleted = stats?.totalTasksCompleted ?? 0;
  const weeklyCompleted = stats?.weeklyCompleted ?? 0;

  const taskProgress = useMemo(() => {
    const total = roadmapTasks.length;
    const completed = roadmapTasks.filter((task) => task.completed).length;
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  }, [roadmapTasks]);

  const allTopicTasksCompleted = useMemo(
    () => roadmapTasks.length > 0 && roadmapTasks.every((task) => task.completed),
    [roadmapTasks]
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 py-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="mt-2 text-sm text-[#666]">
          Build momentum with daily practice and smart tracking.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={() => navigate("/roadmap")}
            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition-all duration-200 hover:bg-gray-200"
          >
            Start Learning
          </button>
          <button
            onClick={() => navigate("/roadmap")}
            className="rounded-lg border border-[#1f1f1f] px-4 py-2 text-sm text-white transition-all duration-200 hover:bg-[#1f1f1f]"
          >
            View Roadmap
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-[#1f1f1f] bg-[#111] p-5 transition-all duration-200 hover:border-[#333]">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-[#666]">
              <CheckSquare size={18} className="text-[#666]" />
              Tasks Completed
            </div>
            <div className="mt-2 text-3xl font-bold text-white">
              {loading ? <Skeleton className="h-8 w-16" /> : totalTasksCompleted}
            </div>
            <span className="mt-1 inline-block rounded-full bg-green-400/10 px-2 py-0.5 text-xs text-green-400">
              +{weeklyCompleted || 0} this week
            </span>
          </div>
          <div className="rounded-xl border border-[#1f1f1f] bg-[#111] p-5 transition-all duration-200 hover:border-[#333]">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-[#666]">
              <TrendingUp size={18} className="text-[#666]" />
              Learning Progress
            </div>
            <div className="mt-2 text-3xl font-bold text-white">
              {loading ? <Skeleton className="h-8 w-16" /> : `${progressValue}%`}
            </div>
            <span className="mt-1 inline-block text-xs text-[#666]">Across all skills</span>
          </div>
          <div className="rounded-xl border border-[#1f1f1f] bg-[#111] p-5 transition-all duration-200 hover:border-[#333]">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-[#666]">
              <Zap size={18} className="text-[#666]" />
              Current Streak
            </div>
            <div className="mt-2 text-3xl font-bold text-white">
              {loading ? <Skeleton className="h-8 w-16" /> : `${streakCurrent} days`}
            </div>
            <span className="mt-1 inline-block text-xs text-[#666]">Keep the streak alive</span>
          </div>
          <div className="rounded-xl border border-[#1f1f1f] bg-[#111] p-5 transition-all duration-200 hover:border-[#333]">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-[#666]">
              <Trophy size={18} className="text-[#666]" />
              Longest Streak
            </div>
            <div className="mt-2 text-3xl font-bold text-white">
              {loading ? <Skeleton className="h-8 w-16" /> : `${streakLongest} days`}
            </div>
            <span className="mt-1 inline-block text-xs text-[#666]">Your personal best</span>
          </div>
        </div>

        <div className="mt-4">
          <RecommendationCard
            recommendation={recommendation}
            loading={loadingRecommendation}
          />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <GlowCard>
            <ProgressRing progress={progressValue} label="Roadmap Completion" />
          </GlowCard>
          <GlowCard>
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-3 w-32" />
              </div>
            ) : (
              <DailyGoal
                goalTasks={dailyGoal?.goalTasks ?? 0}
                completedTasks={dailyGoal?.completedTasks ?? 0}
                percentage={dailyGoal?.percentage ?? 0}
                onGoalUpdate={handleGoalUpdate}
              />
            )}
          </GlowCard>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <GlowCard>
            <div className="text-sm font-semibold text-white">Activity</div>
            <div className="mt-4">
              {activityItems.length === 0 ? (
                <div className="text-xs text-[#666]">No activity yet.</div>
              ) : (
                <ActivityTimeline items={activityItems} />
              )}
            </div>
          </GlowCard>

          <GlowCard>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-white">Learning Tasks</div>
                <div className="mt-1 text-xs text-[#666]">
                  Complete in sequence to unlock the next step.
                </div>
                {activeTopicInfo?.title && (
                  <div className="mt-2">
                    <div className="text-[10px] uppercase tracking-wide text-[#666]">
                      {activeTopicInfo.skillName || "Current Topic"}
                    </div>
                    <div className="text-sm font-medium text-white">
                      {activeTopicInfo.title}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-[#666]">
                <span>Progress</span>
                <span>{taskProgress}%</span>
              </div>
              <div className="mt-2 h-1 w-full rounded-full bg-[#1f1f1f]">
                <div
                  className="h-1 rounded-full bg-[#6366f1] transition-all duration-200"
                  style={{ width: `${taskProgress}%` }}
                />
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {roadmapLoading ? (
                <div className="text-xs text-[#666]">Loading tasks...</div>
              ) : (
                roadmapTasks.map((task) => {
                  const isCompleted = task.completed;
                  const isUnlocked = task.unlocked;
                  const statusLabel = isCompleted
                    ? "Completed"
                    : isUnlocked
                      ? "In Progress"
                      : "Locked";
                  const statusClass = isCompleted
                    ? "bg-green-500/10 text-green-400"
                    : isUnlocked
                      ? "bg-yellow-500/10 text-yellow-400"
                      : "bg-[#1f1f1f] text-[#444]";

                  return (
                    <div
                      key={task.id}
                      className="flex items-start gap-3 rounded-xl border border-[#1f1f1f] bg-[#111] p-3 transition-all duration-200 hover:border-[#333]"
                    >
                      <input
                        type="checkbox"
                        checked={isCompleted}
                        disabled={!isUnlocked || (isCompleted && topicVerified)}
                        onChange={() => {
                          if (isUnlocked && !(isCompleted && topicVerified)) {
                            handleComplete(task.id);
                          }
                        }}
                        className="mt-1 h-4 w-4 rounded border-[#333] bg-[#0a0a0a] text-[#6366f1]"
                      />                      <div className="flex-1">
                        <div
                          className={`text-sm font-medium ${
                            isCompleted ? "text-[#666] line-through" : "text-white"
                          }`}
                        >
                          {task.title}
                        </div>
                        <div className="mt-0.5 text-xs text-[#666]">
                          {task.description}
                        </div>
                      </div>
                      <span className={`rounded-full px-2 py-0.5 text-xs ${statusClass}`}>
                        {statusLabel}
                      </span>
                    </div>
                  );
                  })
                  )}
                  </div>

                  {allTopicTasksCompleted && !topicVerified && activeTopicId && (
                    <div className="mt-4">
                      <TopicQuizBanner
                        topicId={activeTopicId}
                        topicTitle={activeTopicInfo?.title || "Current Topic"}
                        onVerified={handleTopicVerified}
                      />
                    </div>
                  )}
                  {allTopicTasksCompleted && topicVerified && (
                  <div className="mt-4 flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/10 p-4">
                  <span className="text-sm font-semibold text-green-400">Topic Verified ✓</span>
                  <span className="ml-auto text-xs text-[#666]">{topicVerificationScore}/10 score</span>
                  </div>
                  )}
                  </GlowCard>
                  </div>

                  {/* Custom Tasks Section */}        <div className="mt-6 pt-6 border-t border-[#1f1f1f]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ClipboardList size={14} className="text-[#6366f1]" />
              <span className="text-xs font-semibold text-white uppercase tracking-wide">
                My Tasks
              </span>
              {customTasks.length > 0 && (
                <span className="text-xs bg-[#1f1f1f] text-[#666] px-1.5 py-0.5 rounded-full">
                  {customTasks.filter(t => !t.completed).length}
                </span>
              )}
            </div>
            <button
              onClick={() => { setEditingTask(null); setIsModalOpen(true); }}
              className="flex items-center gap-2 rounded-lg border border-[#1f1f1f] px-3 py-1 text-xs text-[#666] transition-all duration-200 hover:border-[#333] hover:text-white"
            >
              <Plus size={14} />
              Add Task
            </button>
          </div>
          <CustomTaskList
            tasks={customTasks}
            onToggle={handleToggleTask}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            loading={loadingCustomTasks}
          />
        </div>

        <div className="mt-4">
          <GlowCard>
            {loading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <Skeleton key={idx} className="h-24 w-full" />
                ))}
              </div>
            ) : (
              <Achievements achievements={achievements} />
            )}
          </GlowCard>
        </div>
      </main>

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        editingTask={editingTask}
      />
    </div>
  );
};

export default Dashboard;
