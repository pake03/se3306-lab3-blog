// app/posts/[slug]/error.tsx
"use client";
export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="space-y-3" role="alert">
      <p className="font-bold">加载失败，请重试</p>
      <button onClick={reset} className="text-blue-600 hover:underline">重试</button>
    </div>
  );
}
