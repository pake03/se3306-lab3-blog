// app/page.tsx
// 首页只保留一个列表：分页、搜索、分类、排序都在这个列表里，条件放在 URL，刷新与分享都不丢。
import { getPostsPage, getCategories } from "@/lib/posts";
import type { SortKey, SortOrder } from "@/lib/types";
import RemotePosts from "../components/RemotePosts";

export const instant = false;   // 首页要读 searchParams（分页/搜索/分类/排序），允许阻塞

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; category?: string; sort?: string; order?: string }>;
}) {
  const sp = await searchParams;
  const page = Number(sp.page || "1") || 1;
  const q = sp.q || "";
  const category = sp.category || "全部";
  const sortRaw = sp.sort || "publishedAt";
  const sort: SortKey = sortRaw === "likes" || sortRaw === "views" ? sortRaw : "publishedAt";
  const order: SortOrder = sp.order === "asc" ? "asc" : "desc";

  const { items, total, totalPages, page: currentPage } = await getPostsPage(
    page, 5, q, category, sort, order,
  );
  const categories = await getCategories();
  // key 跟着条件与数据变化：分页/搜索/分类/排序切换，或发布编辑删除后，列表都会重新挂载
  const listKey = [category, q, currentPage, sort, order, items.map(p => p.id).join("-")].join("|");
  return (
    <div className="space-y-6">
      <RemotePosts
        key={listKey}
        categories={categories}
        initialPosts={items}
        initialPage={currentPage}
        initialQ={q}
        initialCategory={category}
        initialSort={sort}
        initialOrder={order}
        initialTotalPages={totalPages}
        initialTotal={total}
      />
    </div>
  );
}
