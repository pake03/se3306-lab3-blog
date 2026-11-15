// app/new/NewPostForm.tsx　客户端表单：下拉来自数据，发布成功后让浏览器缓存失效
"use client";

import { useActionState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createPost } from "../actions";

const initialState = { ok: false, error: "" };

export default function NewPostForm({ categories }: { categories: string[] }) {
  const [state, formAction, isPending] = useActionState(createPost, initialState);
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    if (state.ok) {
      queryClient.invalidateQueries({ queryKey: ["posts"], refetchType: "all" });
      router.push("/");
    }
  }, [state, queryClient, router]);

  const options = categories.filter(c => c !== "全部");

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <div>
        <p className="text-sm text-slate-500">发布文章</p>
        <h1 className="mt-1 text-2xl font-bold">写下新文章</h1>
      </div>
      <div>
        <label htmlFor="post-title" className="field-label">标题</label>
        <input id="post-title" name="title" placeholder="请输入文章标题" required maxLength={80} className="field-control" />
      </div>
      <div>
        <label htmlFor="post-content" className="field-label">正文</label>
        <textarea id="post-content" name="content" placeholder="请输入文章正文" required rows={10} className="field-control resize-y" />
      </div>
      <div>
        <label htmlFor="post-category" className="field-label">分类</label>
        <select id="post-category" name="category" defaultValue={options[0] ?? "技术"} className="field-control">
        {options.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      {state.error && <p role="alert" className="text-red-600">{state.error}</p>}
      <button type="submit" disabled={isPending} className="primary-button disabled:cursor-not-allowed disabled:opacity-50">
        {isPending ? "发布中..." : "发布"}
      </button>
    </form>
  );
}
