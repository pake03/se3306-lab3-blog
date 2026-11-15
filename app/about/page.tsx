// app/about/page.tsx
export default function AboutPage() {
  return (
    <article className="space-y-4">
      <p className="text-sm text-slate-500">关于这个项目</p>
      <h1 className="text-3xl font-bold tracking-tight">我的博客</h1>
      <p className="max-w-xl text-slate-700">
        这是一个使用 Next.js App Router、TypeScript 和 Tailwind CSS 构建的全栈博客。
        文章列表由服务端渲染，发布、编辑、删除、评论和点赞通过 Server Actions 完成。
      </p>
      <p className="max-w-xl text-slate-700">
        数据层目前使用内存文章和 JSON 文件模拟数据库，后续可以在不改变页面调用方式的情况下替换为 Prisma 与 SQLite。
      </p>
    </article>
  );
}
