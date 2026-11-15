// lib/views.ts　浏览量数据层：打开详情页自动 +1，计数存 data/views.json
import { readTable, writeTable } from "./db";

export type ViewRow = { slug: string; count: number };

export async function getViewCount(slug: string) {
  const rows = await readTable<ViewRow>("views");
  return rows.find(r => r.slug === slug)?.count ?? 0;
}

// 列表排序用：一次取全部文章的浏览量
export async function getAllViewCounts() {
  const rows = await readTable<ViewRow>("views");
  const map: Record<string, number> = {};
  for (const r of rows) map[r.slug] = r.count;
  return map;
}

export async function incrementView(slug: string) {
  const rows = await readTable<ViewRow>("views");
  const row = rows.find(r => r.slug === slug);
  if (row) row.count += 1;
  else rows.push({ slug, count: 1 });
  await writeTable("views", rows);
  return rows.find(r => r.slug === slug)!.count;
}
