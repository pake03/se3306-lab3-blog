import Link from "next/link";

export default function PostNotFound() {
  return (
    <section className="space-y-4">
      <p className="text-sm text-slate-500">404</p>
      <h1 className="text-2xl font-bold">文章不存在</h1>
      <p className="text-slate-600">这篇文章可能已经被删除。</p>
      <Link href="/" className="text-blue-600 hover:underline">回到文章列表</Link>
    </section>
  );
}
