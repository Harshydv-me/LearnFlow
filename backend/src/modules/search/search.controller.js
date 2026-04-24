import { search } from "./search.service.js";

export const searchHandler = async (req, res) => {
  try {
    const q = String(req.query.q || "");
    if (q.trim().length < 2) {
      return res.json({ skills: [], topics: [], query: q });
    }

    const results = await search(q.trim(), req.user.id);
    return res.json(results);
  } catch (error) {
    return res.status(500).json({ error: "Failed to search" });
  }
};
