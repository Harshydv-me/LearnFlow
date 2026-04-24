import { getRecommendation } from "./recommendation.service.js";

export const getRecommendationHandler = async (req, res) => {
  try {
    const result = await getRecommendation(req.user?.id);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: "Failed to get recommendation" });
  }
};
