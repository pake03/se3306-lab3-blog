// lib/db.ts　文件模拟数据库：读写 data/*.json，对外函数与真实数据库一致
import { promises as fs } from "node:fs";
import path from "node:path";

const DB_DIR = path.join(process.cwd(), "data");

export async function readTable<T>(name: string): Promise<T[]> {
  try {
    const txt = await fs.readFile(path.join(DB_DIR, name + ".json"), "utf8");
    return JSON.parse(txt) as T[];
  } catch {
    return [];
  }
}

export async function writeTable<T>(name: string, rows: T[]) {
  await fs.mkdir(DB_DIR, { recursive: true });
  await fs.writeFile(path.join(DB_DIR, name + ".json"), JSON.stringify(rows, null, 2), "utf8");
}
