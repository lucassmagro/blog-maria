import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/lib/types";
import { dataAttr, formatarDataPtBr } from "@/lib/format";

type PostCardProps = {
  post: Post;
  /** Prioriza o carregamento das primeiras imagens (acima da dobra). */
  priority?: boolean;
};

/**
 * Card do índice em formato de caixa: imagem no topo, depois data · categoria,
 * título grande em Playfair, resumo e autoria fixada no rodapé. Altura
 * uniforme, borda fina e discreta (sem sombra), com leve realce no hover.
 */
export function PostCard({ post, priority = false }: PostCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden border border-linha transition-colors hover:border-acento">
      <Link
        href={`/post/${post.slug}`}
        className="block overflow-hidden"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="relative aspect-[16/10] w-full">
          <Image
            src={post.coverImageUrl}
            alt={post.coverImageAlt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw"
            priority={priority}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.78rem] text-texto-secundario">
          <time dateTime={dataAttr(post.publishedAt)}>
            {formatarDataPtBr(post.publishedAt)}
          </time>
          <span aria-hidden="true" className="text-borda-titulo">
            ·
          </span>
          <Link
            href={`/categoria/${post.categorySlug}`}
            className="font-bold uppercase tracking-[0.5px] transition-colors hover:text-acento-hover"
          >
            {post.categoryName}
          </Link>
        </div>

        <h2 className="mt-3 text-[1.4rem] leading-[1.2]">
          <Link
            href={`/post/${post.slug}`}
            className="text-texto-principal transition-colors hover:text-acento-hover"
          >
            {post.title}
          </Link>
        </h2>

        <p className="mt-3 line-clamp-3 text-[0.95rem] leading-relaxed text-texto-secundario">
          {post.excerpt}
        </p>

        <p className="mt-auto pt-5 text-[0.85rem] text-texto-secundario">
          <span className="text-acento">por</span>{" "}
          <span className="font-bold text-texto-principal">{post.author}</span>
        </p>
      </div>
    </article>
  );
}
