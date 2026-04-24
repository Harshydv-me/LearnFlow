import { useEffect, useState } from "react";
import dashboardApi from "../api/dashboard.js";
import TaskList from "../components/TaskList.jsx";

const TopicPage = () => {
  const [topicId, setTopicId] = useState(null);
  const [topicTitle, setTopicTitle] = useState("");

  useEffect(() => {
    const loadActive = async () => {
      const data = await dashboardApi.getActiveTopic();
      setTopicId(data?.topicId ?? null);
      setTopicTitle(data?.title || "");
    };
    loadActive();
  }, []);

  return (
    <div style={{ marginTop: 24 }}>
      <h2 style={{ marginBottom: 16 }}>Learning Roadmap</h2>
      {topicId ? <TaskList topicId={topicId} topicTitle={topicTitle} /> : <p>No topic found.</p>}
    </div>
  );
};

export default TopicPage;
