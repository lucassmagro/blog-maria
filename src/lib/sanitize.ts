import sanitizeHtml from "sanitize-html";

/**
 * Sanitização do corpo dos artigos. O conteúdo é armazenado como HTML
 * (produzido pelo editor visual Tiptap na área administrativa) e SEMPRE passa
 * por aqui antes de ser renderizado. A allowlist é estrita e propositalmente
 * pequena: só o que o editor pode gerar.
 */
const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p",
    "br",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "s",
    "h2",
    "h3",
    "blockquote",
    "ul",
    "ol",
    "li",
    "a",
    "img",
    "figure",
    "figcaption",
    "hr",
  ],
  allowedAttributes: {
    a: ["href", "title", "target", "rel"],
    img: ["src", "alt", "title"],
  },
  // Apenas http(s), e-mail e caminhos relativos; bloqueia javascript:, data:, etc.
  allowedSchemes: ["http", "https", "mailto"],
  allowedSchemesByTag: { img: ["http", "https"] },
  // Toda âncora externa recebe rel seguro; abre em nova aba.
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", {
      rel: "noopener noreferrer",
      target: "_blank",
    }),
  },
  // Remove o conteúdo de tags perigosas por completo.
  nonTextTags: ["style", "script", "textarea", "option", "noscript"],
};

export function sanitizeArticleHtml(html: string): string {
  return sanitizeHtml(html, OPTIONS);
}

/** Texto puro a partir do HTML, para resumo, contagem de palavras e meta. */
export function htmlToPlainText(html: string): string {
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })
    .replace(/\s+/g, " ")
    .trim();
}
