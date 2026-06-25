/**
 * Tipos de domínio. O formato espelha o futuro esquema do Supabase
 * (tabelas `categories` e `posts`), para que a troca da fonte de dados local
 * pelo banco em Fase 2 seja transparente para as páginas.
 */

export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type Post = {
  id: string;
  title: string;
  slug: string;
  categorySlug: string;
  /** Nome legível da categoria (vem do join no banco ou do seed). */
  categoryName: string;
  author: string;
  coverImageUrl: string;
  coverImageAlt: string;
  /** Crédito opcional da imagem (ex.: "Imagem/Reprodução: ..."). */
  coverImageCredit?: string;
  excerpt: string;
  /** Corpo em HTML (gerado pelo editor Tiptap). Renderizado de forma sanitizada. */
  content: string;
  published: boolean;
  /** ISO 8601 (timestamptz). */
  publishedAt: string;
};

/**
 * Forma do post no seed local. O `categoryName` não é armazenado: a camada de
 * dados o deriva das categorias ao carregar (e o banco, via join).
 */
export type SeedPost = Omit<Post, "categoryName">;
