// app/api/posts/route.ts
import { getPostsPage } from "@/lib/posts";
import type { SortKey, SortOrder } from "@/lib/types";

export async function GET(request: Request) {
  const sp = new URL(request.url).searchParams;
  const page = Number(sp.get("page") || "1") || 1;
  const size = Number(sp.get("size") || "5") || 5;
  const q = sp.get("q") || "";
  const category = sp.get("category") || "全部";
  const sortRaw = sp.get("sort") || "publishedAt";
  const sort: SortKey = sortRaw === "likes" || sortRaw === "views" ? sortRaw : "publishedAt";
  const order: SortOrder = sp.get("order") === "asc" ? "asc" : "desc";
  const data = await getPostsPage(page, size, q, category, sort, order);
  return Response.json(data);
}
