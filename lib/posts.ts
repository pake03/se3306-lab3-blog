// lib/posts.ts　内存实现
// 页面、Server Action、Route Handler 在 Next.js 里会被打成不同的模块实例，
// 模块级数组彼此不共享，所以挂到 globalThis 上，同一进程内三处读写同一份数据。
import type { Post, PostWithStats, SortKey, SortOrder } from "./types";
import { cacheLife, cacheTag } from "next/cache";
import { getAllLikeCounts } from "./likes";
import { getAllViewCounts } from "./views";

const globalForPosts = globalThis as unknown as { __lab3Posts?: Post[] };

// 初始 6 篇：覆盖 3 个分类、4 个日期，一页 5 篇正好能测出第 2 页
const seedPosts: Post[] = [
  { id: "1700000000001", slug: "hello", title: "我的第一篇博客", content: "从create-vite到create-next-app。", category: "技术", publishedAt: "2026-10-01" },
  { id: "1700000000002", slug: "fullstack", title: "全栈是什么感觉", content: "后厨直接端菜，传菜员少跑一半路。", category: "随笔", publishedAt: "2026-10-02" },
  { id: "1700000000003", slug: "rsc-notes", title: "RSC 学习笔记", content: "服务端组件省掉了多少浏览器JS。", category: "技术", publishedAt: "2026-09-28" },
  { id: "1700000000004", slug: "tailwind-notes", title: "Tailwind 上手记录", content: "原子类写多了，改样式反而更快。", category: "技术", publishedAt: "2026-09-20" },
  { id: "1700000000005", slug: "campus-life", title: "校园生活随笔", content: "图书馆的座位比食堂的饭难抢。", category: "生活", publishedAt: "2026-09-15" },
  { id: "1700000000006", slug: "study-plan", title: "这个学期的学习计划", content: "每周留两个晚上写代码。", category: "随笔", publishedAt: "2026-09-10" },
];

const posts: Post[] = globalForPosts.__lab3Posts ?? (globalForPosts.__lab3Posts = seedPosts);

export async function getPosts() {
  "use cache";              // 这份数据构建期生成并缓存
  cacheLife("minutes");     // 1分钟后在后台重新生成，1小时过期
  cacheTag("posts");        // 打标签，写操作后可精准失效
  return posts;
}

export async function getPost(slug: string) {
  "use cache";              // 这份数据构建期生成并缓存
  cacheLife("minutes");     // 1分钟后在后台重新生成，1小时过期
  cacheTag("posts");        // 打标签，写操作后可精准失效
  return posts.find(p => p.slug === slug);
}

// 分类不写死：从现有文章里取，页面下拉和首页按钮都用它
export async function getCategories() {
  const all = await getPosts();
  return ["全部", ...Array.from(new Set(all.map(p => p.category)))];
}

// 任务九：分页 + 搜索 + 分类 + 排序，一次查询返回这一页的数据与总页数
export async function getPostsPage(
  page = 1,
  size = 5,
  q = "",
  category = "全部",
  sort: SortKey = "publishedAt",
  order: SortOrder = "desc",
) {
  const all = await getPosts();
  const [likeMap, viewMap] = await Promise.all([getAllLikeCounts(), getAllViewCounts()]);

  // 文章 + 点赞数 + 浏览量，列表要显示这三列
  let rows: PostWithStats[] = all.map(p => ({
    ...p,
    likes: likeMap[p.slug] ?? 0,
    views: viewMap[p.slug] ?? 0,
  }));

  if (category && category !== "全部") {
    rows = rows.filter(p => p.category === category);
  }
  const key = q.trim();
  if (key) {
    rows = rows.filter(p => p.title.includes(key) || p.content.includes(key));
  }

  // 排序：发布时间按日期，点赞与浏览按数字；同值时用 id 兜底保证顺序稳定
  const dir = order === "asc" ? 1 : -1;
  rows.sort((a, b) => {
    if (sort === "likes") return (a.likes - b.likes) * dir;
    if (sort === "views") return (a.views - b.views) * dir;
    if (a.publishedAt === b.publishedAt) return a.id.localeCompare(b.id) * dir;
    return (a.publishedAt < b.publishedAt ? -1 : 1) * dir;
  });

  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / size));
  const current = Math.min(Math.max(1, page), totalPages);
  const start = (current - 1) * size;
  return {
    items: rows.slice(start, start + size),
    total,
    page: current,
    size,
    totalPages,
  };
}

export async function addPost(p: Omit<Post, "id" | "slug" | "publishedAt">) {
  const token = crypto.randomUUID();
  const post: Post = {
    ...p,
    id: token,
    slug: "post-" + token.slice(0, 8),
    publishedAt: new Date().toISOString().slice(0, 10),
  };
  posts.unshift(post);
  return post;
}

export async function updatePost(slug: string, patch: Partial<Post>) {
  const i = posts.findIndex(p => p.slug === slug);
  if (i >= 0) posts[i] = { ...posts[i], ...patch };
  return posts[i];
}

export async function deletePost(slug: string) {
  const i = posts.findIndex(p => p.slug === slug);
  if (i >= 0) posts.splice(i, 1);
}
