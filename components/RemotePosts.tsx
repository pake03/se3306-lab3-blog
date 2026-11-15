// components/RemotePosts.tsx
// 首页唯一的文章列表：搜索、分类、分页、排序都在这里，条件同步到 URL
"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import type { PostWithStats, SortKey, SortOrder } from "@/lib/types";

type PageData = { items: PostWithStats[]; total: number; page: number; totalPages: number };

const SORT_LABELS: { key: SortKey; label: string }[] = [
  { key: "publishedAt", label: "时间" },
  { key: "likes", label: "点赞" },
  { key: "views", label: "浏览" },
];

export default function RemotePosts({
  categories,
  initialPosts,
  initialPage,
  initialQ,
  initialCategory,
  initialSort,
  initialOrder,
  initialTotalPages,
  initialTotal,
}: {
  categories: string[];
  initialPosts: PostWithStats[];
  initialPage: number;
  initialQ: string;
  initialCategory: string;
  initialSort: SortKey;
  initialOrder: SortOrder;
  initialTotalPages: number;
  initialTotal: number;
}) {
  const router = useRouter();
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState<SortKey>(initialSort);
  const [order, setOrder] = useState<SortOrder>(initialOrder);
  const [page, setPage] = useState(initialPage);
  const [q, setQ] = useState(initialQ);
  const [draftQ, setDraftQ] = useState(initialQ);

  const isDefault =
    category === "全部" && q === "" && page === 1 && sort === "publishedAt" && order === "desc";
  const serverView: PageData = {
    items: initialPosts,
    total: initialTotal,
    page: initialPage,
    totalPages: initialTotalPages,
  };

  const { data, isError, isPending } = useQuery<PageData>({
    queryKey: ["posts", { category, q, page, sort, order }],
    queryFn: async () => {
      const response = await fetch(
        `/api/posts?category=${encodeURIComponent(category)}&q=${encodeURIComponent(q)}` +
          `&page=${page}&size=5&sort=${sort}&order=${order}`,
      );
      if (!response.ok) throw new Error("文章列表请求失败");
      return response.json() as Promise<PageData>;
    },
    enabled: !isDefault,
  });

  const view: PageData | undefined = isDefault ? serverView : data;
  const totalPages = view?.totalPages ?? initialTotalPages;
  const total = view?.total ?? initialTotal;

  // 把当前条件写进 URL：刷新、分享、后退都不丢
  function syncUrl(next: { category: string; q: string; page: number; sort: SortKey; order: SortOrder }) {
    const params = new URLSearchParams();
    if (next.category !== "全部") params.set("category", next.category);
    if (next.q) params.set("q", next.q);
    if (next.page > 1) params.set("page", String(next.page));
    if (next.sort !== "publishedAt") params.set("sort", next.sort);
    if (next.order !== "desc") params.set("order", next.order);
    const qs = params.toString();
    router.replace(qs ? `/?${qs}` : "/");
  }

  function go(next: Partial<{ category: string; q: string; page: number; sort: SortKey; order: SortOrder }>) {
    const merged = { category, q, page, sort, order, ...next };
    // 换条件（分类/搜索/排序）时回到第一页
    if (next.category !== undefined || next.q !== undefined || next.sort !== undefined || next.order !== undefined) {
      merged.page = 1;
    }
    setCategory(merged.category);
    setQ(merged.q);
    setPage(merged.page);
    setSort(merged.sort);
    setOrder(merged.order);
    syncUrl(merged);
  }

  return (
    <div className="space-y-4">
      <form
        onSubmit={e => {
          e.preventDefault();
          go({ q: draftQ.trim() });
        }}
        className="flex gap-2"
      >
        <input
          aria-label="搜索标题或正文"
          value={draftQ}
          onChange={e => setDraftQ(e.target.value)}
          placeholder="搜索标题或正文"
          className="border p-2 flex-1"
        />
        <button type="submit" className="primary-button">搜索</button>
      </form>

      <div className="flex gap-2 flex-wrap">
        {categories.map(c => (
          <button
            type="button"
            key={c}
            aria-pressed={c === category}
            onClick={() => go({ category: c })}
            className="plain-button"
          >
            {c}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 flex-wrap text-sm">
        <span className="text-gray-500">排序：</span>
        {SORT_LABELS.map(item => (
          <button
            type="button"
            key={item.key}
            aria-pressed={sort === item.key}
            onClick={() => go({ sort: item.key })}
            className="plain-button"
          >
            {item.label}
          </button>
        ))}
        <button
          type="button"
          aria-pressed={order === "asc"}
          onClick={() => go({ order: order === "asc" ? "desc" : "asc" })}
          className="plain-button"
        >
          {order === "asc" ? "升序 ↑" : "降序 ↓"}
        </button>
      </div>

      {!isDefault && isError ? (
        <p role="alert" className="text-red-600">文章列表加载失败，请稍后重试。</p>
      ) : !isDefault && isPending && !view ? (
        <div className="space-y-3" aria-live="polite">
          <div className="h-10 animate-pulse rounded bg-slate-100" />
          <div className="h-10 animate-pulse rounded bg-slate-100" />
          <p className="text-sm text-slate-500">文章加载中...</p>
        </div>
      ) : !view || view.items.length === 0 ? (
        <p>没有匹配的文章。</p>
      ) : (
        <ul>
          {view.items.map((p: PostWithStats) => (
            <li key={p.id} className="post-row flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <Link href={`/posts/${p.slug}`} className="post-title-link break-words">
                {p.title}
              </Link>
              <span className="post-meta break-words">
                {p.publishedAt} · 浏览 {p.views} · 赞 {p.likes} ·{" "}
                <Link href={`/posts/${p.slug}/edit`} className="hover:underline">
                  编辑
                </Link>
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => go({ page: page - 1 })}
          disabled={page <= 1}
          className="plain-button disabled:cursor-not-allowed disabled:opacity-40"
        >
          上一页
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
          <button
            type="button"
            key={n}
            aria-pressed={n === page}
            onClick={() => go({ page: n })}
            className="plain-button"
          >
            {n}
          </button>
        ))}
        <button
          type="button"
          onClick={() => go({ page: page + 1 })}
          disabled={page >= totalPages}
          className="plain-button disabled:cursor-not-allowed disabled:opacity-40"
        >
          下一页
        </button>
        <span className="text-sm text-gray-500">
          共 {total} 篇 · 每页 5 篇 · 第 {page}/{totalPages} 页
        </span>
      </div>
    </div>
  );
}
