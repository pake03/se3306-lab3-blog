// lib/likes.ts　点赞数据层：每篇文章一行，计数存 data/likes.json
import { readTable, writeTable } from "./db";

export type LikeRow = { slug: string; count: number };

export async function getLikeCount(slug: string) {
  const rows = await readTable<LikeRow>("likes");
  return rows.find(r => r.slug === slug)?.count ?? 0;
}

// 列表排序用：一次取全部文章的点赞数
export async function getAllLikeCounts() {
  const rows = await readTable<LikeRow>("likes");
  const map: Record<string, number> = {};
  for (const r of rows) map[r.slug] = r.count;
  return map;
}

export async function incrementLike(slug: string) {
  const rows = await readTable<LikeRow>("likes");
  const row = rows.find(r => r.slug === slug);
  if (row) row.count += 1;
  else rows.push({ slug, count: 1 });
  await writeTable("likes", rows);
  return rows.find(r => r.slug === slug)!.count;
}
