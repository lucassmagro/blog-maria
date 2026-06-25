import { listCategories } from "@/lib/admin";
import { PostEditor } from "@/components/admin/PostEditor";

export const dynamic = "force-dynamic";

export default async function NovoPostPage() {
  const categories = await listCategories();
  return <PostEditor categories={categories} />;
}
