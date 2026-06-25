import { SEED_POSTS } from "./seed-posts";
import { CATEGORIES, getCategoryBySlug } from "./categories";
import type { Category, Post, SeedPost } from "./types";
import { isSupabaseConfigured } from "./supabase/config";
import { createPublicClient } from "./supabase/public";

/**
 * Camada de acesso a dados do blog público — modo duplo:
 *   • Se o Supabase estiver configurado (variáveis NEXT_PUBLIC_*), lê do banco.
 *   • Caso contrário, usa o seed local (transição antes de configurar o banco).
 * Apenas posts publicados são expostos; o RLS garante isso também no banco.
 */

const POST_SELECT =
  "id, title, slug, author, cover_image_url, cover_image_alt, cover_image_credit, excerpt, content, published, published_at, categories ( slug, name )";

type DbRow = {
  id: string;
  title: string;
  slug: string;
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

function mapRow(row: DbRow): Post {
  const cat = Array.isArray(row.categories) ? row.categories[0] : row.categories;
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    categorySlug: cat?.slug ?? "",
    categoryName: cat?.name ?? "",
    author: row.author,
    coverImageUrl: row.cover_image_url ?? "",
    coverImageAlt: row.cover_image_alt ?? "",
    coverImageCredit: row.cover_image_credit ?? undefined,
    excerpt: row.excerpt ?? "",
    content: row.content,
    published: row.published,
    publishedAt: row.published_at ?? new Date().toISOString(),
  };
}

/** Enriquece um post do seed com o nome legível da categoria. */
function enrichSeed(p: SeedPost): Post {
  return {
    ...p,
    categoryName: getCategoryBySlug(p.categorySlug)?.name ?? p.categorySlug,
  };
}

function seedPublishedOrdered(): Post[] {
  return SEED_POSTS.filter((p) => p.published)
    .map(enrichSeed)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
}

export async function getPublishedPosts(): Promise<Post[]> {
  if (!isSupabaseConfigured) return seedPublishedOrdered();

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_SELECT)
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (error) throw new Error(`Falha ao listar posts: ${error.message}`);
  return (data as DbRow[]).map(mapRow);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!isSupabaseConfigured) {
    const p = SEED_POSTS.find((x) => x.slug === slug && x.published);
    return p ? enrichSeed(p) : null;
  }

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_SELECT)
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) throw new Error(`Falha ao buscar post: ${error.message}`);
  return data ? mapRow(data as DbRow) : null;
}

export async function getPostsByCategory(
  categorySlug: string,
): Promise<Post[]> {
  if (!isSupabaseConfigured) {
    return seedPublishedOrdered().filter((p) => p.categorySlug === categorySlug);
  }

  const categoria = await getCategory(categorySlug);
  if (!categoria) return [];

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_SELECT)
    .eq("published", true)
    .eq("category_id", categoria.id)
    .order("published_at", { ascending: false });

  if (error) throw new Error(`Falha ao listar categoria: ${error.message}`);
  return (data as DbRow[]).map(mapRow);
}

export async function getAllCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured) return CATEGORIES;

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name", { ascending: true });

  if (error) throw new Error(`Falha ao listar categorias: ${error.message}`);
  return data as Category[];
}

export async function getCategory(slug: string): Promise<Category | null> {
  const categorias = await getAllCategories();
  return categorias.find((c) => c.slug === slug) ?? null;
}

/** Categorias que possuem ao menos um post publicado (para chips/filtros). */
export async function getCategoriesInUse(): Promise<Category[]> {
  const [categorias, posts] = await Promise.all([
    getAllCategories(),
    getPublishedPosts(),
  ]);
  const usados = new Set(posts.map((p) => p.categorySlug));
  return categorias.filter((c) => usados.has(c.slug));
}

/** Autores distintos com posts publicados, em ordem alfabética (pt-BR). */
export async function getAuthors(): Promise<string[]> {
  const posts = await getPublishedPosts();
  const set = new Set(posts.map((p) => p.author));
  return [...set].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

/**
 * Posts para o bloco "continuar lendo": prioriza a mesma categoria, completa
 * com os mais recentes, exclui o post atual. Retorna até `limite` itens.
 */
export async function getRelatedPosts(
  slug: string,
  categorySlug: string,
  limite = 3,
): Promise<Post[]> {
  const publicados = await getPublishedPosts();
  const mesmaCategoria = publicados.filter(
    (p) => p.slug !== slug && p.categorySlug === categorySlug,
  );
  const outros = publicados.filter(
    (p) => p.slug !== slug && p.categorySlug !== categorySlug,
  );
  return [...mesmaCategoria, ...outros].slice(0, limite);
}

/** Todos os slugs publicados, para generateStaticParams. */
export async function getAllPublishedSlugs(): Promise<string[]> {
  const posts = await getPublishedPosts();
  return posts.map((p) => p.slug);
}
