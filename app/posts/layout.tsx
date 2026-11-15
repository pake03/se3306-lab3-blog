// app/posts/layout.tsx
export default function PostsLayout({ children }: { children: React.ReactNode }) {
  return <section className="border-l-2 border-slate-900 pl-4 sm:pl-6">{children}</section>;
}
