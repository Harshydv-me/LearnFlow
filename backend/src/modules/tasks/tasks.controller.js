import { createTask, getTasksByTopicIdForUser } from "./tasks.service.js";

const parseId = (value) => {
  const id = Number.parseInt(String(value), 10);
  return Number.isNaN(id) ? null : id;
};

export const getTasks = async (req, res) => {
  try {
    const topicId = parseId(req.params.topicId);
    const userId = parseId(req.user?.id);

    if (topicId === null || userId === null) {
      return res.status(400).json({ error: "topicId and userId required" });
    }

    const tasks = await getTasksByTopicIdForUser(topicId, userId);

    return res.json(tasks);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const addTask = async (req, res) => {
  try {
    const { topic_id, title, description, order_index } = req.body;

    if (!topic_id || !title) {
      return res.status(400).json({ error: "topic_id and title required" });
    }

    const task = await createTask({
      topic_id,
      title,
      description,
      order_index
    });

    return res.status(201).json(task);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
