"use client";

import { useMemo, useState, useId } from "react";
import type { Category, Post } from "@/lib/types";
import { PostCard } from "@/components/PostCard";
import { PostListRow } from "@/components/PostListRow";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  ChevronDownIcon,
  GridIcon,
  ListIcon,
  SearchIcon,
} from "@/components/icons";

type SortKey = "recentes" | "antigos" | "az";
type View = "grade" | "lista";

type BlogIndexProps = {
  posts: Post[];
  categories: Category[];
  authors: string[];
};

function normalizar(s: string): string {
  return s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

/** Seção recolhível da barra lateral de filtros. */
function FilterSection({
  titulo,
  children,
  defaultOpen = true,
}: {
  titulo: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [aberta, setAberta] = useState(defaultOpen);
  const id = useId();
  return (
    <div className="border-t border-linha py-3.5">
      <button
        type="button"
        onClick={() => setAberta((v) => !v)}
        aria-expanded={aberta}
        aria-controls={id}
        className="flex w-full items-center justify-between text-left text-[0.9rem] font-medium text-texto-principal transition-colors hover:text-acento-hover"
      >
        {titulo}
        <ChevronDownIcon
          width={16}
          height={16}
          className={`text-acento transition-transform duration-200 ${
            aberta ? "rotate-180" : ""
          }`}
        />
      </button>
      {aberta ? (
        <div id={id} className="mt-2.5">
          {children}
        </div>
      ) : null}
    </div>
  );
}

const opcaoBase =
  "block w-full rounded px-2 py-1 text-left text-[0.85rem] transition-colors";

function Opcao({
  ativo,
  onClick,
  children,
}: {
  ativo: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={ativo}
      className={`${opcaoBase} ${
        ativo
          ? "bg-linha/70 font-semibold text-texto-principal"
          : "text-texto-secundario hover:text-acento-hover"
      }`}
    >
      {children}
    </button>
  );
}

const toggleBase =
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.8rem] font-bold transition-colors";

export function BlogIndex({ posts, categories, authors }: BlogIndexProps) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("recentes");
  const [categoria, setCategoria] = useState<string>("");
  const [autor, setAutor] = useState<string>("");
  const [view, setView] = useState<View>("grade");
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);

  const resultados = useMemo(() => {
    const q = normalizar(query.trim());
    const lista = posts.filter((p) => {
      if (categoria && p.categorySlug !== categoria) return false;
      if (autor && p.author !== autor) return false;
      if (q) {
        const alvo = normalizar(
          `${p.title} ${p.excerpt} ${p.author} ${p.categoryName}`,
        );
        if (!alvo.includes(q)) return false;
      }
      return true;
    });

    return [...lista].sort((a, b) => {
      if (sort === "az") return a.title.localeCompare(b.title, "pt-BR");
      const da = new Date(a.publishedAt).getTime();
      const db = new Date(b.publishedAt).getTime();
      return sort === "antigos" ? da - db : db - da;
    });
  }, [posts, query, sort, categoria, autor]);

  const temFiltro = Boolean(query || categoria || autor || sort !== "recentes");

  function limpar() {
    setQuery("");
    setSort("recentes");
    setCategoria("");
    setAutor("");
  }

  const sidebar = (
    <div>
      <FilterSection titulo="Ordenar por">
        <div className="space-y-0.5">
          <Opcao ativo={sort === "recentes"} onClick={() => setSort("recentes")}>
            Mais recentes
          </Opcao>
          <Opcao ativo={sort === "antigos"} onClick={() => setSort("antigos")}>
            Mais antigos
          </Opcao>
          <Opcao ativo={sort === "az"} onClick={() => setSort("az")}>
            Título (A–Z)
          </Opcao>
        </div>
      </FilterSection>

      <FilterSection titulo="Categoria">
        <div className="space-y-0.5">
          <Opcao ativo={categoria === ""} onClick={() => setCategoria("")}>
            Todas
          </Opcao>
          {categories.map((c) => (
            <Opcao
              key={c.slug}
              ativo={categoria === c.slug}
              onClick={() => setCategoria(c.slug)}
            >
              {c.name}
            </Opcao>
          ))}
        </div>
      </FilterSection>

      <FilterSection titulo="Autoria" defaultOpen={false}>
        <div className="space-y-0.5">
          <Opcao ativo={autor === ""} onClick={() => setAutor("")}>
            Todas
          </Opcao>
          {authors.map((a) => (
            <Opcao key={a} ativo={autor === a} onClick={() => setAutor(a)}>
              {a}
            </Opcao>
          ))}
        </div>
      </FilterSection>

      {temFiltro ? (
        <button
          type="button"
          onClick={limpar}
          className="mt-3 text-[0.78rem] font-bold uppercase tracking-[0.5px] text-texto-secundario underline decoration-borda-titulo underline-offset-4 transition-colors hover:text-acento-hover"
        >
          Limpar filtros
        </button>
      ) : null}
    </div>
  );

  return (
    <div className="grid grid-cols-1 gap-8 min-[900px]:grid-cols-[220px_1fr] min-[900px]:gap-12">
      {/* Barra lateral (desktop) */}
      <aside className="hidden min-[900px]:block min-[900px]:sticky min-[900px]:top-6 min-[900px]:self-start min-[900px]:max-h-[calc(100vh-3rem)] min-[900px]:overflow-y-auto">
        <h2 className="mb-1 pb-1 text-[0.95rem] font-semibold text-texto-principal">
          Filtrar e ordenar
        </h2>
        {sidebar}
      </aside>

      {/* Conteúdo principal */}
      <div>
        <div className="flex flex-col gap-3 min-[560px]:flex-row min-[560px]:items-center">
          <div className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-texto-secundario" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar publicações"
              aria-label="Buscar publicações"
              className="w-full rounded-full border border-linha bg-transparent py-2.5 pl-10 pr-4 text-[0.95rem] text-texto-principal placeholder:text-texto-secundario focus:border-acento focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between gap-2 min-[560px]:justify-end">
          <div
            className="flex shrink-0 items-center gap-1 rounded-full border border-linha p-1"
            role="group"
            aria-label="Visualização"
          >
            <button
              type="button"
              onClick={() => setView("grade")}
              aria-pressed={view === "grade"}
              className={`${toggleBase} ${
                view === "grade"
                  ? "bg-acento-hover text-fundo"
                  : "text-texto-secundario hover:text-acento-hover"
              }`}
            >
              <GridIcon width={16} height={16} /> Grade
            </button>
            <button
              type="button"
              onClick={() => setView("lista")}
              aria-pressed={view === "lista"}
              className={`${toggleBase} ${
                view === "lista"
                  ? "bg-acento-hover text-fundo"
                  : "text-texto-secundario hover:text-acento-hover"
              }`}
            >
              <ListIcon width={16} height={16} /> Lista
            </button>
          </div>

          {/* Botão de filtros (só mobile), entre Grade/Lista e o tema */}
          <button
            type="button"
            onClick={() => setFiltrosAbertos((v) => !v)}
            aria-expanded={filtrosAbertos}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-linha px-3 py-2 text-[0.8rem] font-bold text-texto-secundario min-[900px]:hidden"
          >
            Filtros
            <ChevronDownIcon
              width={16}
              height={16}
              className={`transition-transform duration-200 ${
                filtrosAbertos ? "rotate-180" : ""
              }`}
            />
          </button>

          <ThemeToggle />
          </div>
        </div>

        {/* Painel de filtros (mobile), aberto pelo botão acima */}
        {filtrosAbertos ? (
          <div className="mt-4 border-t border-linha pt-2 min-[900px]:hidden">
            {sidebar}
          </div>
        ) : null}

        <p
          className="mt-6 text-[0.85rem] text-texto-secundario"
          aria-live="polite"
        >
          {resultados.length}{" "}
          {resultados.length === 1 ? "publicação" : "publicações"}
        </p>

        {resultados.length === 0 ? (
          <p className="mt-10 text-center text-texto-secundario">
            Nenhuma publicação encontrada com esses filtros.
          </p>
        ) : view === "grade" ? (
          <section
            aria-label="Publicações"
            className="mt-5 grid grid-cols-1 gap-x-7 gap-y-12 min-[560px]:grid-cols-2 min-[1100px]:grid-cols-3"
          >
            {resultados.map((post, i) => (
              <PostCard key={post.id} post={post} priority={i < 3} />
            ))}
          </section>
        ) : (
          <section aria-label="Publicações" className="mt-5">
            {resultados.map((post) => (
              <PostListRow key={post.id} post={post} />
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
