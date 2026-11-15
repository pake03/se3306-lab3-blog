import type { Metadata } from "next";
import Link from "next/link";
import Providers from "./Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "我的博客",
  description: "用 Next.js 构建的全栈博客，记录技术、随笔与生活。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <nav className="site-nav" aria-label="主导航">
          <div className="content-width nav-inner">
            <Link href="/" className="site-name">我的博客</Link>
            <div className="nav-links">
              <Link href="/">首页</Link>
              <Link href="/about">关于</Link>
              <Link href="/new" className="nav-primary">写文章</Link>
            </div>
          </div>
        </nav>
        <Providers>
          <main className="content-width content-shell">{children}</main>
        </Providers>
        <footer className="site-footer">© 2026 我的博客</footer>
      </body>
    </html>
  );
}
