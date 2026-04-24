import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Flame, Target, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import dashboardApi, {
  getRecommendedTopics,
  getSkillsProgress,
  getRecommendation
} from "../api/dashboard.js";
import Navbar from "../components/Navbar.jsx";
import ContinueLearning from "../components/learning/ContinueLearning.jsx";
import SkillCard from "../components/learning/SkillCard.jsx";
import RecommendedTopics from "../components/learning/RecommendedTopics.jsx";
import TodayTasks from "../components/learning/TodayTasks.jsx";
import RecommendationCard from "../components/RecommendationCard.jsx";

const LearningHub = () => {
  const navigate = useNavigate();
  const [activeTopic, setActiveTopic] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [streak, setStreak] = useState({ current_streak_days: 0, longest_streak_days: 0 });
  const [skillsProgress, setSkillsProgress] = useState([]);
  const [recommendedTopics, setRecommendedTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completingTaskId, setCompletingTaskId] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [loadingRecommendation, setLoadingRecommendation] = useState(true);
  const [topicVerified, setTopicVerified] = useState(false);
  const [topicVerificationScore, setTopicVerificationScore] = useState(0);

  const loadVerification = async (topicId) => {
    if (!topicId) {
      setTopicVerified(false);
      setTopicVerificationScore(0);
      return;
    }
    try {
      const result = await dashboardApi.checkTopicVerified(topicId);
      setTopicVerified(Boolean(result?.verified));
      setTopicVerificationScore(Number(result?.score || 0));
    } catch {
      setTopicVerified(false);
      setTopicVerificationScore(0);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      try {
        const [topic, streakData, skills, recommended, recommendationData] = await Promise.all([
          dashboardApi.getActiveTopic(),
          dashboardApi.getStreak(),
          getSkillsProgress(),
          getRecommendedTopics(),
          getRecommendation()
        ]);

        if (!isMounted) return;

        setActiveTopic(topic || null);
        setStreak(streakData || { current_streak_days: 0, longest_streak_days: 0 });
        setSkillsProgress(skills || []);
        setRecommendedTopics(recommended || []);
        setRecommendation(recommendationData || null);

        if (topic?.id) {
          loadVerification(topic.id);
          const taskData = await dashboardApi.getTasks(topic.id);
          if (isMounted) {
            setTasks(taskData || []);
          }
        } else {
          setTasks([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          setLoadingRecommendation(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const refreshTopicsAndTasks = async () => {
    const refreshedTopic = await dashboardApi.getActiveTopic();
    setActiveTopic(refreshedTopic || null);

    if (refreshedTopic?.id) {
      loadVerification(refreshedTopic.id);
      const refreshedTasks = await dashboardApi.getTasks(refreshedTopic.id);
      setTasks(refreshedTasks || []);
    } else {
      setTasks([]);
    }
  };

  const handleTopicVerified = async () => {
    if (activeTopic?.id) {
      const verification = await dashboardApi.checkTopicVerified(activeTopic.id);
      setTopicVerified(Boolean(verification?.verified));
      setTopicVerificationScore(Number(verification?.score || 0));
      // Refresh to potentially move to next topic recommendation
      await refreshTopicsAndTasks();
      const refreshedRecommendation = await getRecommendation();
      setRecommendation(refreshedRecommendation || null);
    }
  };

  const handleTaskComplete = async (taskId) => {
    if (completingTaskId) return;
    setCompletingTaskId(taskId);
    try {
      await dashboardApi.updateTaskProgress(taskId);
      await refreshTopicsAndTasks();
      const refreshedRecommended = await getRecommendedTopics();
      setRecommendedTopics(refreshedRecommended || []);
      const refreshedSkills = await getSkillsProgress();
      setSkillsProgress(refreshedSkills || []);
    } finally {
      setCompletingTaskId(null);
    }
  };

  const derivedTopic = useMemo(() => {
    if (!activeTopic) return null;
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.completed).length;
    return {
      ...activeTopic,
      totalTasks,
      completedTasks
    };
  }, [activeTopic, tasks]);

  const firstUnlockedTask = tasks.find((task) => !task.completed && task.unlocked) || null;

  const inProgressCount = skillsProgress.filter(
    (skill) => skill.progressPercentage > 0 && skill.progressPercentage < 100
  ).length;
  const completedCount = skillsProgress.filter(
    (skill) => skill.progressPercentage === 100
  ).length;

  return (
    <div className="min-h-screen bg-main text-primary">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">Learning</h1>
          <p className="mt-1 text-sm text-secondary">
            Continue building your skills step by step.
          </p>
        </div>

        <div className="mt-4 inline-flex items-center gap-6 rounded-xl border border-subtle bg-card px-5 py-3">
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-yellow-400" />
            <span className="text-sm font-semibold text-primary">
              {streak.current_streak_days} day streak
            </span>
          </div>
          <div className="h-4 w-px bg-skeleton" />
          <div className="flex items-center gap-2">
            <Flame size={16} className="text-orange-400" />
            <span className="text-sm text-secondary">
              Longest: {streak.longest_streak_days} days
            </span>
          </div>
        </div>

        <div className="mt-6">
          <RecommendationCard
            recommendation={recommendation}
            loading={loadingRecommendation}
          />
        </div>

        <div className="mt-8">
          <ContinueLearning
            topic={derivedTopic}
            firstUnlockedTask={firstUnlockedTask}
            loading={loading}
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
          <div>
            <div className="mb-4 text-sm font-semibold text-primary">Skills</div>
            {loading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {Array.from({ length: 2 }).map((_, idx) => (
                  <div key={idx} className="h-36 w-full animate-pulse rounded-xl bg-skeleton" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {skillsProgress.map((skill) => (
                  <SkillCard key={skill.id} skill={skill} />
                ))}
              </div>
            )}

            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm font-semibold text-primary">Recommended</div>
              <div
                onClick={() => navigate("/roadmap")}
                className="cursor-pointer text-xs text-[#6366f1] transition-all duration-200 hover:text-indigo-400"
              >
                View all →
              </div>
            </div>
            <div className="mt-4">
              <RecommendedTopics topics={recommendedTopics} loading={loading} />
            </div>
          </div>

          <div className="sticky top-8 space-y-4">
            <TodayTasks
              tasks={tasks}
              onTaskComplete={handleTaskComplete}
              loading={loading}
              completingTaskId={completingTaskId}
              topicId={activeTopic?.id}
              topicTitle={activeTopic?.title}
              topicVerified={topicVerified}
              topicVerificationScore={topicVerificationScore}
              onVerified={handleTopicVerified}
            />

            <div className="rounded-xl border border-subtle bg-card p-5">
              <div className="mb-4 text-sm font-semibold text-primary">Quick Stats</div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-secondary">
                    <Target size={16} className="text-[#6366f1]" />
                    Skills in progress
                  </div>
                  <div className="text-sm font-semibold text-primary">{inProgressCount}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-secondary">
                    <CheckCircle2 size={16} className="text-green-400" />
                    Skills completed
                  </div>
                  <div className="text-sm font-semibold text-primary">{completedCount}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LearningHub;
