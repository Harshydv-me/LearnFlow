import { createTopicRecord, getTopicsBySkillId } from "./topics.service.js";

const parseSkillId = (value) => {
  const id = Number.parseInt(String(value), 10);
  return Number.isNaN(id) ? null : id;
};

export const getTopicsForSkill = async (req, res) => {
  try {
    const skillId = parseSkillId(req.params?.skillId);
    if (!skillId) {
      return res.status(400).json({ error: "skillId is required" });
    }

    const topics = await getTopicsBySkillId(skillId);
    return res.json(topics);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const createTopic = async (req, res) => {
  try {
    const skillId = parseSkillId(req.body?.skill_id);
    const title = String(req.body?.title ?? "").trim();
    const description = String(req.body?.description ?? "").trim();
    const orderIndexValue = req.body?.order_index;
    const orderIndex = Number.isInteger(orderIndexValue)
      ? orderIndexValue
      : Number.parseInt(String(orderIndexValue ?? "0"), 10);
    const normalizedOrderIndex = Number.isNaN(orderIndex) ? 0 : orderIndex;

    if (!skillId || !title) {
      return res.status(400).json({ error: "skill_id and title are required" });
    }

    const topic = await createTopicRecord({
      skillId,
      title,
      description: description || null,
      orderIndex: normalizedOrderIndex
    });

    return res.status(201).json(topic);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
