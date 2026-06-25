import { Suspense } from "react";
import Link from "next/link";
import { listAllPosts } from "@/lib/admin";
import { togglePublish } from "@/app/admin/actions";
import { DeletePostButton } from "@/components/admin/DeletePostButton";
import { DashboardToasts } from "@/components/admin/DashboardToasts";
import { formatarDataPtBr } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const posts = await listAllPosts();
  const publicados = posts.filter((p) => p.published).length;

  return (
    <div>
      <Suspense fallback={null}>
        <DashboardToasts />
      </Suspense>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-[1.8rem] font-bold text-texto-principal">
            Publicações
          </h1>
          <p className="mt-1 text-[0.9rem] text-texto-secundario">
            {posts.length} no total · {publicados} publicadas ·{" "}
            {posts.length - publicados} rascunhos
          </p>
        </div>
        <Link
          href="/admin/posts/novo"
          className="rounded-full bg-acento-hover px-4 py-2 text-[0.9rem] font-bold text-fundo transition-colors hover:bg-texto-principal"
        >
          Nova publicação
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="mt-12 text-center text-texto-secundario">
          Nenhuma publicação ainda. Crie a primeira.
        </p>
      ) : (
        <ul className="mt-8 divide-y divide-linha border-y border-linha">
          {posts.map((post) => (
            <li
              key={post.id}
              className="flex flex-wrap items-center gap-x-4 gap-y-2 py-4"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-[0.68rem] font-bold uppercase tracking-[0.5px] ${
                      post.published
                        ? "bg-acento-hover text-fundo"
                        : "border border-linha text-texto-secundario"
                    }`}
                  >
                    {post.published ? "Publicado" : "Rascunho"}
                  </span>
                  <span className="text-[0.78rem] text-texto-secundario">
                    {post.categoryName}
                    {post.publishedAt
                      ? ` · ${formatarDataPtBr(post.publishedAt)}`
                      : ""}
                  </span>
                </div>
                <Link
                  href={`/admin/posts/${post.id}/editar`}
                  className="mt-1 block truncate font-serif text-[1.15rem] font-bold text-texto-principal transition-colors hover:text-acento-hover"
                >
                  {post.title}
                </Link>
              </div>

              <div className="flex items-center gap-4 text-[0.85rem]">
                {post.published ? (
                  <Link
                    href={`/post/${post.slug}`}
                    target="_blank"
                    className="font-medium text-texto-secundario transition-colors hover:text-acento-hover"
                  >
                    Ver
                  </Link>
                ) : null}

                <form action={togglePublish}>
                  <input type="hidden" name="id" value={post.id} />
                  <input type="hidden" name="slug" value={post.slug} />
                  <input
                    type="hidden"
                    name="categorySlug"
                    value={post.categorySlug}
                  />
                  <input
                    type="hidden"
                    name="publicar"
                    value={(!post.published).toString()}
                  />
                  <button
                    type="submit"
                    className="font-medium text-texto-secundario transition-colors hover:text-acento-hover"
                  >
                    {post.published ? "Despublicar" : "Publicar"}
                  </button>
                </form>

                <Link
                  href={`/admin/posts/${post.id}/editar`}
                  className="font-medium text-texto-secundario transition-colors hover:text-acento-hover"
                >
                  Editar
                </Link>

                <DeletePostButton
                  id={post.id}
                  slug={post.slug}
                  categorySlug={post.categorySlug}
                  title={post.title}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
