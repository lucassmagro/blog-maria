import Link from "next/link";
import type { Category } from "@/lib/types";

type CategoryFilterProps = {
  categories: Category[];
  /** Slug ativo, ou "todos" na home. */
  activeSlug?: string;
};

const baseChip =
  "rounded-full border px-3.5 py-1.5 text-[0.78rem] font-bold uppercase tracking-[0.5px] transition-colors";

export function CategoryFilter({
  categories,
  activeSlug = "todos",
}: CategoryFilterProps) {
  const ativoTodos = activeSlug === "todos";

  return (
    <nav aria-label="Filtrar por categoria" className="mb-10">
      <ul className="flex flex-wrap justify-center gap-2.5">
        <li>
          <Link
            href="/"
            aria-current={ativoTodos ? "page" : undefined}
            className={`${baseChip} ${
              ativoTodos
                ? "border-acento-hover bg-acento-hover text-fundo"
                : "border-linha text-texto-secundario hover:border-acento hover:text-acento-hover"
            }`}
          >
            Todos
          </Link>
        </li>
        {categories.map((c) => {
          const ativo = c.slug === activeSlug;
          return (
            <li key={c.slug}>
              <Link
                href={`/categoria/${c.slug}`}
                aria-current={ativo ? "page" : undefined}
                className={`${baseChip} ${
                  ativo
                    ? "border-acento-hover bg-acento-hover text-fundo"
                    : "border-linha text-texto-secundario hover:border-acento hover:text-acento-hover"
                }`}
              >
                {c.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
