import type { MetadataRoute } from "next";
import { getAllCategories, getPublishedPosts } from "@/lib/posts";
import { SITE } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categorias] = await Promise.all([
    getPublishedPosts(),
    getAllCategories(),
  ]);

  const home: MetadataRoute.Sitemap = [
    { url: SITE.url, changeFrequency: "daily", priority: 1 },
  ];

  const rotasPosts: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE.url}/post/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const rotasCategorias: MetadataRoute.Sitemap = categorias.map((c) => ({
    url: `${SITE.url}/categoria/${c.slug}`,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [...home, ...rotasPosts, ...rotasCategorias];
}
