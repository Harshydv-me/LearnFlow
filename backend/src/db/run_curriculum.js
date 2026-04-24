import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import pool from "./index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const run = async () => {
  const curriculumPath = path.join(__dirname, "curriculum.sql");
  const sql = await fs.readFile(curriculumPath, "utf8");
  const sections = sql.split(/^-- SKILL: /m);

  for (const section of sections) {
    const trimmed = section.trim();
    if (!trimmed) continue;

    const [skillLine, ...rest] = trimmed.split("\n");
    const skillName = skillLine.trim();
    const blockSql = rest.join("\n").trim();

    if (!blockSql) continue;

    try {
      await pool.query(blockSql);
      console.log(`Curriculum loaded for skill: ${skillName}`);
    } catch (err) {
      console.error(`Failed to load skill: ${skillName}`);
      console.error(err.message || err);
      if (err?.stack) {
        console.error(err.stack);
      }
    }
  }

  await pool.end();
};

run().catch((err) => {
  console.error("Curriculum load failed", err);
  pool.end();
});
