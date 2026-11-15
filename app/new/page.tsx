// app/new/page.tsx　服务端页：先从数据里取分类，再交给客户端表单
import { getCategories } from "@/lib/posts";
import NewPostForm from "./NewPostForm";

export default async function NewPostPage() {
  const categories = await getCategories();
  return <NewPostForm categories={categories} />;
}
