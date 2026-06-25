import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/PostCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import {
  getAllCategories,
  getCategoriesInUse,
  getCategory,
  getPostsByCategory,
} from "@/lib/posts";

export const revalidate = 3600;

export async function generateStaticParams() {
  const categorias = await getAllCategories();
  return categorias.map((c) => ({ slug: c.slug }));
}

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const categoria = await getCategory(slug);
  if (!categoria) return { title: "Categoria não encontrada" };
  return {
    title: categoria.name,
    description: `Publicações na categoria ${categoria.name}.`,
    alternates: { canonical: `/categoria/${categoria.slug}` },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const categoria = await getCategory(slug);
  if (!categoria) notFound();

  const [posts, categoriasEmUso] = await Promise.all([
    getPostsByCategory(slug),
    getCategoriesInUse(),
  ]);

  return (
    <>
      <CategoryFilter categories={categoriasEmUso} activeSlug={slug} />

      <h2 className="mb-8 text-center text-[1.6rem] text-texto-secundario">
        {categoria.name}
      </h2>

      {posts.length > 0 ? (
        <section
          aria-label={`Publicações em ${categoria.name}`}
          className="grid grid-cols-1 gap-x-10 gap-y-12 min-[600px]:grid-cols-2 min-[992px]:grid-cols-3"
        >
          {posts.map((post, i) => (
            <PostCard key={post.id} post={post} priority={i < 3} />
          ))}
        </section>
      ) : (
        <p className="text-center text-texto-secundario">
          Ainda não há publicações nesta categoria.
        </p>
      )}
    </>
  );
}
