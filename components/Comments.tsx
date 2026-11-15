// components/Comments.tsx
// 评论：服务端读文件数据库，表单提交走 Server Action（任务十）
import { getComments } from "@/lib/comments";
import { createComment } from "@/app/actions";

export default async function Comments({ slug }: { slug: string }) {
  const comments = await getComments(slug);
  return (
    <section className="space-y-4 border-t border-slate-200 pt-5" aria-labelledby="comments-heading">
      <div>
        <h2 id="comments-heading" className="font-bold">评论</h2>
        <p className="text-sm text-slate-500">留下你的想法。</p>
      </div>
      {comments.length === 0 ? (
        <p className="text-sm text-gray-500">还没有评论，来写第一条。</p>
      ) : (
        <ul className="space-y-3">
          {comments.map(c => (
            <li key={c.id} className="border-b border-slate-100 pb-3">
              <p><strong>{c.author}</strong>：{c.content}</p>
              <time className="text-xs text-slate-400" dateTime={c.createdAt}>
                {new Date(c.createdAt).toLocaleString("zh-CN")}
              </time>
            </li>
          ))}
        </ul>
      )}
      <form action={createComment} className="space-y-3">
        <input type="hidden" name="slug" value={slug} />
        <label className="sr-only" htmlFor="comment-author">昵称</label>
        <input id="comment-author" name="author" placeholder="昵称" required maxLength={30} className="field-control" />
        <label className="sr-only" htmlFor="comment-content">评论内容</label>
        <textarea id="comment-content" name="content" placeholder="写点评论" required rows={4} className="field-control resize-y" />
        <button type="submit" className="primary-button">
          提交评论
        </button>
      </form>
    </section>
  );
}
