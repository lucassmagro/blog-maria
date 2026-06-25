import { notFound } from "next/navigation";
import { getAdminPostById, listCategories } from "@/lib/admin";
import { PostEditor } from "@/components/admin/PostEditor";

export const dynamic = "force-dynamic";

export default async function EditarPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [categories, post] = await Promise.all([
    listCategories(),
    getAdminPostById(id),
  ]);

  if (!post) notFound();

  return <PostEditor categories={categories} post={post} />;
}
