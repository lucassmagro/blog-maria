/** Utilidades de formatação em pt-BR e geração de slug. */

const MESES = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

/**
 * Formata uma data ISO no padrão editorial brasileiro:
 * "25 de outubro de 2025". Usa UTC para evitar variação por fuso.
 */
export function formatarDataPtBr(iso: string): string {
  const data = new Date(iso);
  const dia = data.getUTCDate();
  const mes = MESES[data.getUTCMonth()];
  const ano = data.getUTCFullYear();
  return `${dia} de ${mes} de ${ano}`;
}

/** Atributo `datetime` para o elemento <time> (apenas a data). */
export function dataAttr(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10);
}

/**
 * Gera um slug amigável: remove acentos, baixa a caixa, troca espaços e
 * caracteres não alfanuméricos por hífens. Usado no admin e no seed.
 */
export function gerarSlug(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "") // remove diacríticos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Deriva um resumo a partir de texto puro quando o excerpt está vazio.
 * Corta no limite de caracteres sem partir palavras.
 */
export function derivarResumo(texto: string, limite = 160): string {
  const limpo = texto.replace(/\s+/g, " ").trim();
  if (limpo.length <= limite) return limpo;
  const cortado = limpo.slice(0, limite);
  const ultimoEspaco = cortado.lastIndexOf(" ");
  return `${cortado.slice(0, ultimoEspaco > 0 ? ultimoEspaco : limite).trim()}…`;
}

/** Tempo estimado de leitura em pt-BR, a partir do texto puro (~200 ppm). */
export function tempoDeLeitura(textoPuro: string): string {
  const palavras = textoPuro.trim().split(/\s+/).filter(Boolean).length;
  const minutos = Math.max(1, Math.round(palavras / 200));
  return `${minutos} min de leitura`;
}
