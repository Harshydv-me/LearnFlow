import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createLearningStreak, createUser, findUserByEmail } from "./auth.service.js";

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }
  return secret;
};

const signToken = (user) =>
  jwt.sign(
    {
      id: user.id,
      email: user.email,
      display_name: user.display_name,
      username: user.username
    },
    getJwtSecret(),
    { expiresIn: "7d" }
  );

export const register = async (req, res) => {
  try {
    const display_name = String(req.body?.display_name ?? "").trim();
    const email = String(req.body?.email ?? "").trim().toLowerCase();
    const password = String(req.body?.password ?? "");

    if (!display_name || !email || !password) {
      return res.status(400).json({ error: "display_name, email, password required" });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const user = await createUser({ display_name, email, password_hash });
    await createLearningStreak(user.id);

    const token = signToken(user);

    return res.status(201).json({
      token,
      user
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const email = String(req.body?.email ?? "").trim().toLowerCase();
    const password = String(req.body?.password ?? "");

    if (!email || !password) {
      return res.status(400).json({ error: "email and password required" });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = signToken(user);

    return res.json({
      token,
      user: {
        id: user.id,
        display_name: user.display_name,
        email: user.email,
        username: user.username
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
