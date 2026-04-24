import { getAllSkills, createSkill } from "./skills.service.js";

export const getSkills = async (req, res) => {
  try {
    const skills = await getAllSkills();
    return res.json(skills);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const addSkill = async (req, res) => {
  try {
    const name = String(req.body?.name ?? "").trim();
    const description = String(req.body?.description ?? "").trim();

    if (!name) {
      return res.status(400).json({ error: "Skill name is required" });
    }

    const skill = await createSkill({ name, description });

    return res.status(201).json(skill);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};