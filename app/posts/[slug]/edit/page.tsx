// app/posts/[slug]/edit/page.tsx
import { getPost } from "@/lib/posts";
import { notFound } from "next/navigation";
import { editPost } from "@/app/actions";

export const instant = false;   // 编辑页要先用 slug 回填，允许阻塞

export default async function EditPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  return (
    <form action={editPost} className="max-w-2xl space-y-5">
      <input type="hidden" name="slug" value={post.slug} />
      <div>
        <p className="text-sm text-slate-500">编辑文章</p>
        <h1 className="mt-1 text-2xl font-bold">修改文章</h1>
      </div>
      <div>
        <label htmlFor="edit-title" className="field-label">标题</label>
        <input id="edit-title" name="title" defaultValue={post.title} required maxLength={80} className="field-control" />
      </div>
      <div>
        <label htmlFor="edit-content" className="field-label">正文</label>
        <textarea id="edit-content" name="content" defaultValue={post.content} required rows={10} className="field-control resize-y" />
      </div>
      <button type="submit" className="primary-button">
        保存修改
      </button>
      <p className="text-sm text-gray-500">保存后会自动返回首页。</p>
    </form>
  );
}
