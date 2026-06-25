"use client";

import { formatarDataPtBr, tempoDeLeitura } from "@/lib/format";

export type PreviewData = {
  title: string;
  author: string;
  categoryName: string;
  publishedAt: string; // valor do input datetime-local
  content: string; // HTML do editor
  coverUrl: string | null;
  coverAlt: string;
  coverCredit: string;
};

function textoPuro(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

/**
 * Pré-visualização do post como ele aparecerá publicado. Reproduz o layout do
 * artigo público (masthead, hero, corpo serifado, capitular), a partir dos
 * valores atuais do formulário — sem salvar nem publicar.
 */
export function PostPreview({
  data,
  onClose,
}: {
  data: PreviewData;
  onClose: () => void;
}) {
  const multiplasAutoras = data.author.includes(" e ");
  const rotuloAutoria = multiplasAutoras ? "Autoras" : "Autora";
  const dataISO = data.publishedAt
    ? new Date(data.publishedAt).toISOString()
    : new Date().toISOString();
  const leitura = tempoDeLeitura(textoPuro(data.content));

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-fundo">
      {/* Barra superior da pré-visualização */}
      <div className="sticky top-0 z-10 border-b border-linha bg-fundo/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[var(--container-leitura)] items-center justify-between px-5 py-3">
          <span className="text-[0.75rem] font-bold uppercase tracking-[1px] text-acento">
            Pré-visualização
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-linha px-4 py-1.5 text-[0.85rem] font-bold text-texto-secundario transition-colors hover:border-acento hover:text-acento-hover"
          >
            Fechar
          </button>
        </div>
      </div>

      <article className="mx-auto max-w-[var(--container-leitura)] px-5 py-10">
        <header className="mb-8">
          <div className="text-[0.8rem] font-bold uppercase tracking-[0.5px] text-texto-secundario">
            {data.categoryName || "Sem categoria"}
          </div>
          <h1 className="mt-4 text-[2.1rem] leading-[1.12] sm:text-[3rem]">
            {data.title || "Sem título"}
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-linha pt-4 text-[0.9rem] text-texto-secundario">
            <span className="font-bold text-texto-principal">
              {data.author || "Autoria"}
            </span>
            <span aria-hidden="true">·</span>
            <time dateTime={dataISO.slice(0, 10)}>
              {formatarDataPtBr(dataISO)}
            </time>
            <span aria-hidden="true">·</span>
            <span>{leitura}</span>
          </div>
        </header>

        {data.coverUrl ? (
          <figure className="mb-10">
            <div className="relative aspect-[3/2] w-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.coverUrl}
                alt={data.coverAlt || ""}
                className="h-full w-full object-cover"
              />
            </div>
            {data.coverCredit ? (
              <figcaption className="mt-2 text-[0.8rem] italic text-texto-secundario">
                {data.coverCredit}
              </figcaption>
            ) : null}
          </figure>
        ) : null}

        {textoPuro(data.content) ? (
          <div
            className="conteudo-artigo corpo-serif conteudo-artigo--capitular"
            dangerouslySetInnerHTML={{ __html: data.content }}
          />
        ) : (
          <p className="text-texto-secundario">
            (Sem conteúdo ainda. Escreva no editor para ver aqui.)
          </p>
        )}

        <footer className="mt-12 border-t border-linha pt-6">
          <h2 className="text-[1.3rem]">{rotuloAutoria}</h2>
          <p className="mt-2 text-texto-secundario">
            {data.author || "Autoria"}
          </p>
        </footer>
      </article>
    </div>
  );
}
