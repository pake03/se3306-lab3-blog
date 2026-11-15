// lib/types.ts
export type Post = {
  id: string;
  slug: string;
  title: string;
  content: string;
  category: string;
  publishedAt: string;
};

// 列表展示用：文章 + 统计数字
export type PostWithStats = Post & {
  likes: number;
  views: number;
};

export type SortKey = "publishedAt" | "likes" | "views";
export type SortOrder = "asc" | "desc";
