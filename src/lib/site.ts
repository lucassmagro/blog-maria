/** Constantes globais da publicação, reutilizadas em metadados e layout. */

// URL pública do site. Em produção/preview vem de NEXT_PUBLIC_SITE_URL
// (configurada na Vercel); cai no domínio final por padrão.
const url = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://catedrapolitica.com.br"
).replace(/\/$/, "");

export const SITE = {
  name: "Cátedra Política",
  description:
    "Blog editorial brasileiro com ensaios sobre política, sociedade, gênero, direito e filosofia.",
  url,
  locale: "pt_BR",
  social: {
    instagram: "https://www.instagram.com/catedrapolitica",
    linktree: "https://linktr.ee/catedrapolitica",
  },
} as const;
