// app/not-found.tsx
export default function NotFound() {
  return (
    <section className="space-y-4">
      <p className="text-sm text-slate-500">404</p>
      <h1 className="text-2xl font-bold">页面不存在</h1>
      <p className="text-slate-600">你访问的页面可能已经被删除，或者地址输入有误。</p>
      <a href="/" className="text-blue-600 hover:underline">回首页看看</a>
    </section>
  );
}
