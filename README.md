# 实验三：Next.js 全栈博客站

本项目按实验指导书任务一至任务十完成，保留源码示例中的 App Router、Server Components、Client Components、Server Actions、TanStack Query 和文件模拟数据库结构，并针对移动端和异常状态做了必要完善。

## 技术栈

- Next.js 16.4 App Router + TypeScript + Tailwind CSS 4
- React 19
- 数据层：文章存内存，评论、点赞、浏览量存 `data/*.json` 文件模拟数据库

## 本地运行

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build
pnpm start      # 生产模式
```

打开 `http://localhost:3000`，可以验证首页、关于页、发布、详情、编辑、删除和不存在文章等页面。

## 功能对照

| 任务 | 实现位置 |
|---|---|
| 任务一 建项目 | `package.json`、`next.config.ts` |
| 任务二 结构约定 | `app/` 路由、`app/not-found.tsx` |
| 任务三 布局外壳 | `app/layout.tsx` |
| 任务四 渲染模式 | 静态页 `app/about`、动态首页、详情页部分预渲染 |
| 任务五 数据获取 | `lib/posts.ts`、`app/posts/[slug]/page.tsx` |
| 任务六 表单写入 | `app/actions.ts`、`app/new`、`app/posts/[slug]/edit` |
| 任务七 体验优化 | `loading.tsx`、`error.tsx`、`Suspense` |
| 任务八 部署上线 | `edgeone.json` |
| 任务九 分页搜索标签排序 | `lib/posts.ts` 的 `getPostsPage`、`app/api/posts` |
| 任务十 评论与文件数据库 | `lib/db.ts`、`lib/comments.ts`、`lib/likes.ts`、`lib/views.ts` |

## 功能验收

- 首页服务端输出文章内容，客户端 Query 支持搜索、分类、分页和排序，条件会同步到 URL。
- 详情页支持点赞、浏览量、评论、编辑和删除；不存在的文章返回 404 页面。
- 发布表单使用 `useActionState` 展示提交状态，写操作在服务端再次校验。
- 详情页包含加载骨架和错误边界，移动端列表会自动换行，不产生横向滚动。
- `data/` 目录用于本地运行时保存评论、点赞和浏览量，已加入 `.gitignore`。

## 部署

本项目按 Node.js 全栈方式部署，`edgeone.json` 保留了示例构建参数：

```json
{
  "installCommand": "npm install",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "nodeVersion": "22.11.0"
}
```

使用支持 Node.js 运行时的平台部署。由于项目包含 Server Actions 和文件写入，纯静态导出只能用于只读演示。

### 数据持久化说明

部署环境没有持久磁盘，`data/*.json` 写在临时文件系统里，冷启动或换实例后会回到初始状态。课堂演示可以接受；要长期保存评论与点赞，需要换成 EdgeOne KV/Blob 或数据库，即任务十一的范围。
