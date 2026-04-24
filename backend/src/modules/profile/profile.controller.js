import {
  getProfileData,
  getPublicProfileByUsername,
  updateDisplayName
} from "./profile.service.js";

export const getProfile = async (req, res) => {
  try {
    const result = await getProfileData(req.user?.id);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: "Failed to load profile" });
  }
};

export const updateName = async (req, res) => {
  try {
    const displayName = typeof req.body?.display_name === "string"
      ? req.body.display_name.trim()
      : "";

    if (!displayName) {
      return res.status(400).json({ error: "Display name cannot be empty" });
    }

    if (displayName.length > 100) {
      return res.status(400).json({ error: "Display name too long" });
    }

    const user = await updateDisplayName(req.user?.id, displayName);
    return res.json({ success: true, user });
  } catch (err) {
    return res.status(500).json({ error: "Failed to update profile" });
  }
};

export const getPublicProfile = async (req, res) => {
  try {
    const username = String(req.params?.username || "").trim();
    if (!username) {
      return res.status(400).json({ error: "username required" });
    }
    const result = await getPublicProfileByUsername(username);
    return res.json(result);
  } catch (err) {
    if (err.message === "User not found") {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(500).json({ error: "Failed to load public profile" });
  }
};
