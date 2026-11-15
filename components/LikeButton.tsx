// components/LikeButton.tsx
// 点赞属于每一篇文章：接收 slug，计数存 data/likes.json，点一次 +1
"use client";
import { useState, useTransition } from "react";
import { likePost } from "@/app/actions";

export default function LikeButton({
  slug,
  initialCount,
}: {
  slug: string;
  initialCount: number;
}) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (liked || pending) return;
    setLiked(true);
    setCount(c => c + 1); // 乐观更新，马上看到数字变化
    startTransition(async () => {
      const next = await likePost(slug); // 服务端写文件并返回最新计数
      setCount(next);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={liked || pending}
      aria-label={`给文章 ${slug} 点赞`}
      className="plain-button disabled:cursor-not-allowed disabled:opacity-60"
    >
      {liked ? "已点赞" : "点赞"} {count}
    </button>
  );
}
