import type { Metadata } from "next";
import { BlogIndex } from "@/components/BlogIndex";
import {
  getAuthors,
  getCategoriesInUse,
  getPublishedPosts,
} from "@/lib/posts";

// ISR: a home é revalidada periodicamente. O admin dispara revalidação sob
// demanda ao publicar, para refletir mudanças na hora.
export const revalidate = 3600;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [posts, categorias, autores] = await Promise.all([
    getPublishedPosts(),
    getCategoriesInUse(),
    getAuthors(),
  ]);

  return <BlogIndex posts={posts} categories={categorias} authors={autores} />;
}
