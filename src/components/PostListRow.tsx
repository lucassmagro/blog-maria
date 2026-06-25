import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/lib/types";
import { dataAttr, formatarDataPtBr } from "@/lib/format";
import { TagIcon } from "@/components/icons";

/** Item da visualização em lista: miniatura + data, título, resumo e categoria. */
export function PostListRow({ post }: { post: Post }) {
  return (
    <article className="flex gap-5 border-b border-linha py-6 first:pt-0">
      <Link
        href={`/post/${post.slug}`}
        className="group hidden shrink-0 overflow-hidden min-[520px]:block"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="relative aspect-[16/10] w-[200px]">
          <Image
            src={post.coverImageUrl}
            alt={post.coverImageAlt}
            fill
            sizes="200px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        </div>
      </Link>

      <div className="flex flex-col">
        <time
          dateTime={dataAttr(post.publishedAt)}
          className="text-[0.8rem] text-texto-secundario"
        >
          {formatarDataPtBr(post.publishedAt)}
        </time>
        <h2 className="mt-1.5 text-[1.3rem] leading-tight">
          <Link
            href={`/post/${post.slug}`}
            className="text-texto-principal transition-colors hover:text-acento-hover"
          >
            {post.title}
          </Link>
        </h2>
        <p className="mt-2 line-clamp-2 text-[0.95rem] text-texto-secundario">
          {post.excerpt}
        </p>
        <div className="mt-3">
          <Link
            href={`/categoria/${post.categorySlug}`}
            className="inline-flex items-center gap-1.5 text-[0.75rem] font-bold uppercase tracking-[0.5px] text-texto-secundario transition-colors hover:text-acento-hover"
          >
            <TagIcon />
            {post.categoryName}
          </Link>
        </div>
      </div>
    </article>
  );
}
