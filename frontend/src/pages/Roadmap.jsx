import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import dashboardApi, { getSkills, getTopics } from "../api/dashboard.js";
import GlowCard from "../components/GlowCard.jsx";
import Navbar from "../components/Navbar.jsx";
import SkillSelector from "../components/roadmap/SkillSelector.jsx";
import RoadmapGraph from "../components/roadmap/RoadmapGraph.jsx";
import TopicDetails from "../components/roadmap/TopicDetails.jsx";
import TaskLearningPanel from "../components/roadmap/TaskLearningPanel.jsx";

const Roadmap = () => {
  const [searchParams] = useSearchParams();
  const [skills, setSkills] = useState([]);
  const [selectedSkillId, setSelectedSkillId] = useState(null);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [completingTaskId, setCompletingTaskId] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isTopicVerified, setIsTopicVerified] = useState(false);
  const [topicVerificationScore, setTopicVerificationScore] = useState(0);

  const selectedSkill = useMemo(
    () => skills.find((skill) => skill.id === selectedSkillId) || null,
    [skills, selectedSkillId]
  );

  const loadVerificationStatus = async (topicId) => {
    if (!topicId) return;
    try {
      const res = await dashboardApi.checkTopicVerified(topicId);
      setIsTopicVerified(Boolean(res?.verified));
      setTopicVerificationScore(Number(res?.score || 0));
    } catch {
      // Fallback to topic object score if set
      const matchingTopic = topics.find(t => t.id === topicId);
      if (matchingTopic?.verificationScore !== undefined) {
        setIsTopicVerified(matchingTopic.verificationScore !== null);
        setTopicVerificationScore(Number(matchingTopic.verificationScore || 0));
      } else {
        setIsTopicVerified(false);
        setTopicVerificationScore(0);
      }
    }
  };

  const loadSkills = async () => {
    setLoadingSkills(true);
    try {
      const data = await getSkills();
      setSkills(data || []);
    } finally {
      setLoadingSkills(false);
    }
  };

  const loadTopics = async (skillId, preserveSelectionId = null) => {
    if (!skillId) {
      setTopics([]);
      setSelectedTopic(null);
      return;
    }
    setLoadingTopics(true);
    try {
      const data = await getTopics(skillId);
      setTopics(data || []);
      
      const topicIdParam = Number.parseInt(searchParams.get("topicId") || "", 10);
      const targetId = preserveSelectionId || topicIdParam;

      const matchingTopic = Number.isFinite(targetId)
        ? data?.find((topic) => topic.id === targetId)
        : null;
      
      const current = data?.find((topic) => topic.isCurrent) || null;
      const fallback = data && data.length > 0 ? data[data.length - 1] : null;
      const nextSelected = matchingTopic || current || fallback || null;
      
      setSelectedTopic(nextSelected);

      if (nextSelected?.id) {
        loadVerificationStatus(nextSelected.id);
      }
      
      if (matchingTopic && !preserveSelectionId) {
        setTimeout(() => {
          document
            .getElementById(`topic-${targetId}`)
            ?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 300);
      }
      return nextSelected;
    } finally {
      setLoadingTopics(false);
    }
  };

  const loadTasks = async (topicId) => {
    if (!topicId) {
      setTasks([]);
      return;
    }
    setLoadingTasks(true);
    try {
      const data = await dashboardApi.getTasks(topicId);
      setTasks(data || []);
    } finally {
      setLoadingTasks(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  useEffect(() => {
    if (!skills.length) return;
    const skillIdParam = Number.parseInt(searchParams.get("skillId") || "", 10);
    const topicIdParam = Number.parseInt(searchParams.get("topicId") || "", 10);

    if (Number.isFinite(skillIdParam)) {
      if (skillIdParam !== selectedSkillId) {
        setSelectedSkillId(skillIdParam);
      }
      return;
    }

    if (Number.isFinite(topicIdParam)) {
      if (topics.some((topic) => topic.id === topicIdParam)) {
        return;
      }
      let isCancelled = false;
      const findTopicSkill = async () => {
        for (const skill of skills) {
          const data = await getTopics(skill.id);
          if (data?.some((topic) => topic.id === topicIdParam)) {
            if (!isCancelled) {
              setSelectedSkillId(skill.id);
            }
            return;
          }
        }
        if (!isCancelled && !selectedSkillId && skills[0]) {
          setSelectedSkillId(skills[0].id);
        }
      };
      findTopicSkill();
      return () => {
        isCancelled = true;
      };
    }

    if (!selectedSkillId && skills[0]) {
      setSelectedSkillId(skills[0].id);
    }
  }, [skills, searchParams, selectedSkillId, topics]);

  useEffect(() => {
    if (selectedSkillId) {
      loadTopics(selectedSkillId);
    }
  }, [selectedSkillId]);

  useEffect(() => {
    if (selectedTopic?.id) {
      loadTasks(selectedTopic.id);
      loadVerificationStatus(selectedTopic.id);
    }
  }, [selectedTopic]);

  const handleTopicSelect = (topic) => {
    if (topic.isLocked) return;
    setSelectedTopic(topic);
  };

  const handleTaskComplete = async (taskId) => {
    if (completingTaskId) return;
    setCompletingTaskId(taskId);
    try {
      await dashboardApi.updateTaskProgress(taskId);
      // Preserve current topic so user can take the quiz
      const currentTopicId = selectedTopic?.id;
      const nextTopic = await loadTopics(selectedSkillId, currentTopicId);
      if (nextTopic?.id) {
        await loadTasks(nextTopic.id);
        await loadVerificationStatus(nextTopic.id);
      }
    } finally {
      setCompletingTaskId(null);
    }
  };

  const handlePanelComplete = async (taskId) => {
    if (completingTaskId) return;
    setCompletingTaskId(taskId);
    try {
      await dashboardApi.updateTaskProgress(taskId);
      // Preserve current topic so user can take the quiz
      const currentTopicId = selectedTopic?.id;
      const nextTopic = await loadTopics(selectedSkillId, currentTopicId);
      if (nextTopic?.id) {
        await loadTasks(nextTopic.id);
        await loadVerificationStatus(nextTopic.id);
      }
      setSelectedTask((prev) =>
        prev && prev.id === taskId ? { ...prev, completed: true } : prev
      );
    } finally {
      setCompletingTaskId(null);
    }
  };

  const handleNextTask = (nextTask) => {
    setSelectedTask(nextTask);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && isPanelOpen) {
        setIsPanelOpen(false);
        setSelectedTask(null);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isPanelOpen]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Roadmap</h1>
          <p className="mt-1 text-sm text-[#666]">
            Follow the learning path and unlock topics as you progress.
          </p>
        </div>

        <div className="mt-6 max-w-md">
          <SkillSelector
            skills={skills}
            selectedSkillId={selectedSkillId}
            onSelect={(id) => {
              setSelectedSkillId(id);
            }}
          />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px]">
          <GlowCard>
            <RoadmapGraph
              topics={topics}
              selectedTopicId={selectedTopic?.id}
              onTopicSelect={handleTopicSelect}
              loading={loadingSkills || loadingTopics}
            />
          </GlowCard>

          <TopicDetails
            topic={selectedTopic}
            tasks={tasks}
            onTaskComplete={handleTaskComplete}
            loading={loadingTasks}
            completingTaskId={completingTaskId}
            isVerified={isTopicVerified}
            verificationScore={topicVerificationScore}
            onVerified={async () => {
              // After quiz is done, refresh everything and it will naturally switch to the next topic
              if (selectedTopic?.id) {
                await loadVerificationStatus(selectedTopic.id);
                // Now allow switching by not passing preserveSelectionId
                await loadTopics(selectedSkillId);
              }
            }}
            onTaskLearn={(task) => {
              setSelectedTask(task);
              setIsPanelOpen(true);
            }}
          />
        </div>
      </main>

      {isPanelOpen && selectedTask && (
        <TaskLearningPanel
          task={selectedTask}
          topic={selectedTopic}
          skillName={selectedSkill?.name || ""}
          onClose={() => {
            setIsPanelOpen(false);
            setSelectedTask(null);
          }}
          onComplete={handlePanelComplete}
          isCompleting={completingTaskId === selectedTask?.id}
          allTasks={tasks}
          onNextTask={handleNextTask}
        />
      )}
    </div>
  );
};

export default Roadmap;
