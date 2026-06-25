"use client";

import { deletePost } from "@/app/admin/actions";

export function DeletePostButton({
  id,
  slug,
  categorySlug,
  title,
}: {
  id: string;
  slug: string;
  categorySlug: string;
  title: string;
}) {
  return (
    <form
      action={deletePost}
      onSubmit={(e) => {
        if (
          !confirm(
            `Excluir a publicação "${title}"? Esta ação não pode ser desfeita.`,
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="categorySlug" value={categorySlug} />
      <button
        type="submit"
        className="font-medium text-texto-secundario transition-colors hover:text-acento-hover"
      >
        Excluir
      </button>
    </form>
  );
}
