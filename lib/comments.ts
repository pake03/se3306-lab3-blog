// lib/comments.ts　评论数据层：底层换成 SQLite 时只改这个文件
import { readTable, writeTable } from "./db";

export type Comment = { id: string; slug: string; author: string; content: string; createdAt: string };

export async function getComments(slug: string) {
  const rows = await readTable<Comment>("comments");
  return rows.filter(c => c.slug === slug);
}

export async function addComment(c: Omit<Comment, "id" | "createdAt">) {
  const rows = await readTable<Comment>("comments");
  rows.push({ ...c, id: crypto.randomUUID(), createdAt: new Date().toISOString() });
  await writeTable("comments", rows);
}
