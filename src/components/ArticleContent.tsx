import { sanitizeArticleHtml } from "@/lib/sanitize";

export type BodyFont = "serif" | "sans";

type ArticleContentProps = {
  /** HTML do corpo (será sanitizado aqui antes de renderizar). */
  html: string;
  /** Família tipográfica do corpo do texto. */
  font?: BodyFont;
  /** Aplica a capitular editorial na primeira letra do primeiro parágrafo. */
  capitular?: boolean;
};

/**
 * Renderiza o corpo do artigo. O HTML SEMPRE passa por sanitizeArticleHtml
 * antes de virar markup, com allowlist estrita. O estilo vem de
 * .conteudo-artigo (globals.css); a fonte do corpo é escolhida via `font`.
 */
export function ArticleContent({
  html,
  font = "serif",
  capitular = false,
}: ArticleContentProps) {
  const clean = sanitizeArticleHtml(html);
  const classes = [
    "conteudo-artigo",
    font === "serif" ? "corpo-serif" : "corpo-sans",
    capitular ? "conteudo-artigo--capitular" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} dangerouslySetInnerHTML={{ __html: clean }} />
  );
}
