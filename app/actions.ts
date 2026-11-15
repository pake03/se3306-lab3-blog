// app/actions.ts
"use server";
import { addPost, getPost, updatePost, deletePost } from "@/lib/posts";
import { addComment } from "@/lib/comments";
import { incrementLike } from "@/lib/likes";
import { incrementView } from "@/lib/views";
import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";

// app/actions.ts 里把 createPost 改成状态版
export type CreateState = { ok?: boolean; error?: string };

export async function createPost(
  prevState: CreateState,
  formData: FormData,
): Promise<CreateState> {
  const title = String(formData.get("title") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const category = String(formData.get("category") || "技术").trim() || "技术";
  if (!title || !content) return { error: "标题和正文不能为空" };
  if (title.length > 80) return { error: "标题不能超过80个字" };
  if (content.length > 20000) return { error: "正文不能超过20000个字" };
  await addPost({ title, content, category });
  revalidatePath("/");
  updateTag("posts");
  return { ok: true };
}

export async function editPost(formData: FormData) {
  const slug = String(formData.get("slug"));
  const title = String(formData.get("title") || "").trim();
  const content = String(formData.get("content") || "").trim();
  if (!slug || !title || !content || title.length > 80 || content.length > 20000) return;
  await updatePost(slug, { title, content });
  revalidatePath("/");
  revalidatePath(`/posts/${slug}`);
  updateTag("posts");
  redirect("/");   // 保存后自动回首页
}

export async function removePost(formData: FormData) {
  const slug = String(formData.get("slug"));
  if (!slug) return;
  await deletePost(slug);
  revalidatePath("/");
  updateTag("posts");
  redirect("/");   // 删除后自动回首页
}

// 任务十：评论写入文件数据库，写完回详情页
export async function createComment(formData: FormData) {
  const slug = String(formData.get("slug"));
  const author = String(formData.get("author") || "").trim();
  const content = String(formData.get("content") || "").trim();
  if (!slug || !author || !content || author.length > 30 || content.length > 1000) return;
  if (!(await getPost(slug))) return;
  await addComment({ slug, author, content });
  revalidatePath(`/posts/${slug}`);
  redirect(`/posts/${slug}`);
}

// 点赞计数：每篇文章一行，存 data/likes.json，返回最新计数
export async function likePost(slug: string) {
  const count = await incrementLike(slug);
  revalidatePath(`/posts/${slug}`);
  revalidatePath("/");        // 列表里的点赞数也要刷新
  return count;
}

// 任务九扩展：打开详情页自动 +1，存 data/views.json，返回最新浏览量
export async function visitPost(slug: string) {
  const count = await incrementView(slug);
  revalidatePath(`/posts/${slug}`);
  revalidatePath("/");        // 列表里的浏览量也要刷新
  return count;
}
