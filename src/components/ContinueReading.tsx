import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/lib/types";

/**
 * Bloco "continuar lendo" ao fim do artigo: 2 a 3 posts relacionados em cards
 * compactos e calmos, mais um link discreto de volta para a home.
 */
export function ContinueReading({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;

  return (
    <section
      aria-label="Continuar lendo"
      className="mx-auto mt-16 max-w-[var(--container-leitura)] border-t border-linha pt-10"
    >
      <h2 className="text-[1.4rem]">Continuar lendo</h2>

      <ul className="mt-6 grid grid-cols-1 gap-8 min-[600px]:grid-cols-3">
        {posts.map((post) => (
          <li key={post.id}>
            <article className="flex flex-col">
              <Link
                href={`/post/${post.slug}`}
                className="group block overflow-hidden"
                tabIndex={-1}
                aria-hidden="true"
              >
                <div className="relative aspect-[3/2] w-full">
                  <Image
                    src={post.coverImageUrl}
                    alt={post.coverImageAlt}
                    fill
                    sizes="(max-width: 600px) 100vw, 220px"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                  />
                </div>
              </Link>
              <div className="mt-3 text-[0.72rem]">
                <span className="font-bold uppercase tracking-[0.5px] text-texto-secundario">
                  {post.categoryName}
                </span>
              </div>
              <h3 className="mt-1.5 text-[1.1rem] leading-snug">
                <Link
                  href={`/post/${post.slug}`}
                  className="text-texto-principal transition-colors hover:text-acento-hover"
                >
                  {post.title}
                </Link>
              </h3>
            </article>
          </li>
        ))}
      </ul>

      <div className="mt-10 text-center">
        <Link
          href="/"
          className="text-[0.8rem] font-bold uppercase tracking-[0.5px] text-texto-secundario underline decoration-borda-titulo underline-offset-4 transition-colors hover:text-acento-hover"
        >
          Ver todas as publicações
        </Link>
      </div>
    </section>
  );
}
