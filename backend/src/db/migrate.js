import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import pool from "./index.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const runSql = async (filename) => {
  const sqlPath = path.join(__dirname, filename);
  const sql = await fs.readFile(sqlPath, "utf8");
  await pool.query(sql);
  console.log(`Loaded ${filename}`);
};

const main = async () => {
  try {
    await runSql("schema.sql");
    await runSql("seed.sql");
    console.log("Migration complete");
  } catch (err) {
    console.error("Migration failed:", err);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
};

main();
