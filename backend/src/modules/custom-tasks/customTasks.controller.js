import {
  getCustomTasks,
  createCustomTask,
  updateCustomTask,
  toggleCustomTaskComplete,
  deleteCustomTask
} from "./customTasks.service.js";

export const getCustomTasksController = async (req, res) => {
  try {
    const tasks = await getCustomTasks(req.user.id);
    res.json(tasks);
  } catch (error) {
    console.error("Error getting custom tasks:", error);
    res.status(500).json({ error: "Failed to get custom tasks" });
  }
};

export const createCustomTaskController = async (req, res) => {
  try {
    const task = await createCustomTask(req.user.id, req.body);
    res.status(201).json({ success: true, task });
  } catch (error) {
    console.error("Error creating custom task:", error);
    if (error.message.includes("required") || error.message.includes("must be")) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Failed to create custom task" });
    }
  }
};

export const updateCustomTaskController = async (req, res) => {
  try {
    const task = await updateCustomTask(req.user.id, req.params.id, req.body);
    res.json({ success: true, task });
  } catch (error) {
    console.error("Error updating custom task:", error);
    if (error.message === "Task not found") {
      res.status(404).json({ error: error.message });
    } else if (error.message.includes("required") || error.message.includes("must be")) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Failed to update custom task" });
    }
  }
};

export const toggleCompleteController = async (req, res) => {
  try {
    const task = await toggleCustomTaskComplete(req.user.id, req.params.id);
    res.json({ success: true, task });
  } catch (error) {
    console.error("Error toggling custom task completion:", error);
    if (error.message === "Task not found") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Failed to toggle task completion" });
    }
  }
};

export const deleteCustomTaskController = async (req, res) => {
  try {
    await deleteCustomTask(req.user.id, req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting custom task:", error);
    if (error.message === "Task not found") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Failed to delete custom task" });
    }
  }
};