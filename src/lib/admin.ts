import "server-only";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./supabase/server";
import type { Category } from "./types";

/**
 * Acesso a dados da área administrativa (servidor, sessão por cookies).
 * O RLS garante que só usuários autenticados leem rascunhos e escrevem.
 */

export type AdminPost = {
  id: string;
  title: string;
  slug: string;
  categoryId: string | null;
  categorySlug: string;
  categoryName: string;
  author: string;
  coverImageUrl: string;
  coverImageAlt: string;
  coverImageCredit: string;
  excerpt: string;
  content: string;
  published: boolean;
  publishedAt: string | null;
};

const ADMIN_SELECT =
  "id, title, slug, category_id, author, cover_image_url, cover_image_alt, cover_image_credit, excerpt, content, published, published_at, created_at, categories ( slug, name )";

type AdminRow = {
  id: string;
  title: string;
  slug: string;
  category_id: string | null;
  author: string;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  cover_image_credit: string | null;
  excerpt: string | null;
  content: string;
  published: boolean;
  published_at: string | null;
  categories: { slug: string; name: string } | { slug: string; name: string }[] | null;
};

function mapAdmin(row: AdminRow): AdminPost {
  const cat = Array.isArray(row.categories) ? row.categories[0] : row.categories;
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    categoryId: row.category_id,
    categorySlug: cat?.slug ?? "",
    categoryName: cat?.name ?? "",
    author: row.author,
    coverImageUrl: row.cover_image_url ?? "",
    coverImageAlt: row.cover_image_alt ?? "",
    coverImageCredit: row.cover_image_credit ?? "",
    excerpt: row.excerpt ?? "",
    content: row.content,
    published: row.published,
    publishedAt: row.published_at,
  };
}

/** Garante que há sessão; caso contrário redireciona ao login. */
export async function requireUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return user;
}

export async function listAllPosts(): Promise<AdminPost[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("posts")
    .select(ADMIN_SELECT)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data as AdminRow[]).map(mapAdmin);
}

export async function getAdminPostById(id: string): Promise<AdminPost | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("posts")
    .select(ADMIN_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapAdmin(data as AdminRow) : null;
}

export async function listCategories(): Promise<Category[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name", { ascending: true });
  if (error) throw new Error(error.message);
  return data as Category[];
}
