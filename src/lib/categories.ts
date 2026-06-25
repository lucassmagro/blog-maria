import type { Category } from "./types";

/**
 * Categorias existentes na publicação. Os slugs são estáveis e usados nas
 * rotas /categoria/[slug]. Em Fase 2 isto passa a vir da tabela `categories`.
 */
export const CATEGORIES: Category[] = [
  { id: "cat-sociedade", name: "Sociedade", slug: "sociedade" },
  { id: "cat-pornografia", name: "Pornografia", slug: "pornografia" },
  { id: "cat-genero", name: "Gênero", slug: "genero" },
  { id: "cat-feminilidade", name: "Feminilidade", slug: "feminilidade" },
  { id: "cat-direito", name: "Direito", slug: "direito" },
  { id: "cat-imigracao", name: "Imigração", slug: "imigracao" },
  { id: "cat-violencia", name: "Violência", slug: "violencia" },
  { id: "cat-progressismo", name: "Progressismo", slug: "progressismo" },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
