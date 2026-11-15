// components/ViewCounter.tsx
// 打开详情页自动计一次浏览量：一次会话只记一次，写到 data/views.json（任务九扩展）
"use client";
import { useEffect, useState } from "react";
import { visitPost } from "@/app/actions";

export default function ViewCounter({ slug, initialCount }: { slug: string; initialCount: number }) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    const key = `viewed:${slug}`;
    if (sessionStorage.getItem(key)) return;   // 同一会话同一篇只计一次
    sessionStorage.setItem(key, "1");
    visitPost(slug).then(setCount);            // 服务端写文件并返回最新浏览量
  }, [slug]);

  return <span className="text-sm text-gray-500">浏览 {count}</span>;
}
