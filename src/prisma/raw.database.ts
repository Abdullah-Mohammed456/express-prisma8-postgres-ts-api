import "dotenv/config";
import { Pool } from "pg";

const connectionString = process.env["DATABASE_URL"];

export const rawPool = new Pool({ connectionString });

export const queryRaw = async (text: string, params?: any[]) => {
  const start = Date.now();
  const res = await rawPool.query(text, params);
  const duration = Date.now() - start;

  console.log("SQL Execution: ", { text, duration, rows: res.rowCount });

  return res;
};
