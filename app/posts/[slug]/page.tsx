// app/posts/[slug]/page.tsx
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, getPosts } from "@/lib/posts";
import { getLikeCount } from "@/lib/likes";
import { getViewCount } from "@/lib/views";
import { removePost } from "@/app/actions";
import Comments from "@/components/Comments";
import LikeButton from "@/components/LikeButton";
import ViewCounter from "@/components/ViewCounter";

export const instant = false;   // 允许阻塞：详情页要先拿到 slug 才能渲染

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "文章不存在 - 我的博客" };
  return {
    title: `${post.title} - 我的博客`,
    description: post.content.slice(0, 120),
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;   // Next.js 16：params是Promise
  const [post, likes, views] = await Promise.all([
    getPost(slug),
    getLikeCount(slug),
    getViewCount(slug),
  ]);
  if (!post) notFound();
  return (
    <article className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm text-slate-500">文章详情</p>
        <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>
      </div>
      <p className="text-sm text-gray-500">
        <Link
          href={`/?category=${encodeURIComponent(post.category)}`}
          className="text-blue-600 hover:underline"
        >
          #{post.category}
        </Link>
        {" · "}{post.publishedAt}
        {" · "}<ViewCounter slug={post.slug} initialCount={views} />
      </p>
      <p className="whitespace-pre-wrap text-lg leading-8 text-slate-800">{post.content}</p>
      <div className="flex flex-wrap items-center gap-4 border-t border-slate-200 pt-4">
        <LikeButton slug={post.slug} initialCount={likes} />
        <Link href={`/posts/${post.slug}/edit`} className="text-blue-600 hover:underline">编辑本文</Link>
        <form action={removePost}>
          <input type="hidden" name="slug" value={post.slug} />
          <button type="submit" className="danger-link hover:underline">删除本文</button>
        </form>
      </div>
      <Suspense fallback={<p>评论加载中…</p>}>
        <Comments slug={post.slug} />
      </Suspense>
    </article>
  );
}
