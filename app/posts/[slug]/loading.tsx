export default function Loading() {
  return (
    <div className="animate-pulse space-y-4" aria-live="polite">
      <div className="h-4 w-24 rounded bg-slate-200" />
      <div className="h-9 w-2/3 rounded bg-slate-200" />
      <div className="h-5 w-full rounded bg-slate-100" />
      <div className="h-5 w-4/5 rounded bg-slate-100" />
      <p className="text-sm text-slate-500">文章加载中…</p>
    </div>
  );
}
