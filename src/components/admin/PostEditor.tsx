"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import type { Category } from "@/lib/types";
import type { AdminPost } from "@/lib/admin";
import {
  createCategory,
  savePost,
  type FormState,
} from "@/app/admin/actions";
import { gerarSlug } from "@/lib/format";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { PostPreview, type PreviewData } from "@/components/admin/PostPreview";

const initial: FormState = {};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/** Converte uma data para o formato do <input type="datetime-local">. */
function toLocalInput(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const labelCls = "text-[0.85rem] font-medium text-texto-secundario";
const inputCls =
  "rounded-md border border-linha bg-transparent px-3 py-2.5 text-texto-principal focus:border-acento focus:outline-none";

export function PostEditor({
  categories,
  post,
}: {
  categories: Category[];
  post?: AdminPost;
}) {
  const [state, formAction, pending] = useActionState(savePost, initial);
  const formRef = useRef<HTMLFormElement>(null);

  // Ao receber um erro do servidor, mostra um toast e rola até o topo.
  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [state]);

  const [cats, setCats] = useState<Category[]>(categories);
  const [categoriaId, setCategoriaId] = useState(post?.categoryId ?? "");
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTocado, setSlugTocado] = useState(Boolean(post));
  const [content, setContent] = useState(post?.content ?? "");
  const [coverPreview, setCoverPreview] = useState<string | null>(
    post?.coverImageUrl || null,
  );

  const [novaCat, setNovaCat] = useState("");
  const [criandoCat, setCriandoCat] = useState(false);
  const [preview, setPreview] = useState<PreviewData | null>(null);

  const erro = (campo: string) => state.fieldErrors?.[campo];

  function abrirPreview() {
    const form = formRef.current;
    if (!form) return;
    const fd = new FormData(form);
    const catId = String(fd.get("categoryId") ?? "");
    setPreview({
      title: String(fd.get("title") ?? ""),
      author: String(fd.get("author") ?? ""),
      categoryName: cats.find((c) => c.id === catId)?.name ?? "",
      publishedAt: String(fd.get("publishedAt") ?? ""),
      coverUrl: coverPreview,
      coverAlt: String(fd.get("coverImageAlt") ?? ""),
      coverCredit: String(fd.get("coverImageCredit") ?? ""),
    });
  }

  function onTitleChange(v: string) {
    setTitle(v);
    if (!slugTocado) setSlug(gerarSlug(v));
  }

  async function adicionarCategoria() {
    const nome = novaCat.trim();
    if (!nome) return;
    setCriandoCat(true);
    const fd = new FormData();
    fd.set("name", nome);
    const res = await createCategory({}, fd);
    setCriandoCat(false);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    if (res.category) {
      const nova = res.category;
      setCats((prev) =>
        [...prev, nova].sort((a, b) => a.name.localeCompare(b.name, "pt-BR")),
      );
      setCategoriaId(nova.id);
      setNovaCat("");
      toast.success("Categoria criada.");
    }
  }

  const dataPadrao = post?.publishedAt
    ? toLocalInput(new Date(post.publishedAt))
    : toLocalInput(new Date());

  return (
    <>
    <form ref={formRef} action={formAction} className="max-w-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-[1.8rem] font-bold text-texto-principal">
          {post ? "Editar publicação" : "Nova publicação"}
        </h1>
        <Link
          href="/admin"
          className="text-[0.85rem] font-medium text-texto-secundario transition-colors hover:text-acento-hover"
        >
          Cancelar
        </Link>
      </div>

      {post ? <input type="hidden" name="id" value={post.id} /> : null}
      <input type="hidden" name="content" value={content} />
      <input
        type="hidden"
        name="existingCoverUrl"
        value={post?.coverImageUrl ?? ""}
      />

      <div className="mt-6 flex flex-col gap-5">
        {/* Título */}
        <label className="flex flex-col gap-1.5">
          <span className={labelCls}>Título</span>
          <input
            name="title"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            required
            className={inputCls}
          />
          {erro("title") ? (
            <span className="text-[0.8rem] text-acento-hover">
              {erro("title")}
            </span>
          ) : null}
        </label>

        {/* Slug */}
        <label className="flex flex-col gap-1.5">
          <span className={labelCls}>
            Slug (endereço){" "}
            <span className="font-normal">— gerado do título, editável</span>
          </span>
          <input
            name="slug"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugTocado(true);
            }}
            required
            className={inputCls}
          />
          <span className="text-[0.78rem] text-texto-secundario">
            /post/{slug || "..."}
          </span>
          {erro("slug") ? (
            <span className="text-[0.8rem] text-acento-hover">
              {erro("slug")}
            </span>
          ) : null}
        </label>

        {/* Categoria */}
        <div className="flex flex-col gap-1.5">
          <span className={labelCls}>Categoria</span>
          <select
            name="categoryId"
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            required
            className={inputCls}
          >
            <option value="" disabled>
              Selecione...
            </option>
            {cats.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {erro("categoryId") ? (
            <span className="text-[0.8rem] text-acento-hover">
              {erro("categoryId")}
            </span>
          ) : null}

          {/* Adicionar categoria (fora do form principal de submissão) */}
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={novaCat}
              onChange={(e) => setNovaCat(e.target.value)}
              placeholder="Nova categoria"
              className="flex-1 rounded-md border border-linha bg-transparent px-3 py-1.5 text-[0.85rem] text-texto-principal focus:border-acento focus:outline-none"
            />
            <button
              type="button"
              onClick={adicionarCategoria}
              disabled={criandoCat || !novaCat.trim()}
              className="rounded-full border border-linha px-3 py-1.5 text-[0.8rem] font-bold text-texto-secundario transition-colors hover:border-acento hover:text-acento-hover disabled:opacity-50"
            >
              {criandoCat ? "Adicionando..." : "Adicionar"}
            </button>
          </div>
        </div>

        {/* Autoria */}
        <label className="flex flex-col gap-1.5">
          <span className={labelCls}>Autoria</span>
          <input
            name="author"
            defaultValue={post?.author ?? ""}
            required
            placeholder="Ex.: Maria Dreher e Kelma Morgana"
            className={inputCls}
          />
          {erro("author") ? (
            <span className="text-[0.8rem] text-acento-hover">
              {erro("author")}
            </span>
          ) : null}
        </label>

        {/* Imagem de capa */}
        <div className="flex flex-col gap-1.5">
          <span className={labelCls}>Imagem de capa</span>
          {coverPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverPreview}
              alt="Prévia da capa"
              className="mb-2 aspect-[16/10] w-full max-w-sm rounded-md object-cover"
            />
          ) : null}
          <input
            type="file"
            name="cover"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => {
              const f = e.target.files?.[0];
              setCoverPreview(f ? URL.createObjectURL(f) : post?.coverImageUrl || null);
            }}
            className="text-[0.85rem] text-texto-secundario file:mr-3 file:rounded-full file:border file:border-linha file:bg-transparent file:px-3 file:py-1.5 file:text-[0.8rem] file:font-bold file:text-texto-secundario"
          />
          <span className="text-[0.78rem] text-texto-secundario">
            JPG, PNG ou WEBP, até 5 MB.{post ? " Deixe vazio para manter a atual." : ""}
          </span>
          {erro("cover") ? (
            <span className="text-[0.8rem] text-acento-hover">
              {erro("cover")}
            </span>
          ) : null}
        </div>

        {/* Texto alternativo da capa */}
        <label className="flex flex-col gap-1.5">
          <span className={labelCls}>
            Texto alternativo da capa{" "}
            <span className="font-normal">— descreve a imagem (acessibilidade)</span>
          </span>
          <input
            name="coverImageAlt"
            defaultValue={post?.coverImageAlt ?? ""}
            className={inputCls}
          />
          {erro("coverImageAlt") ? (
            <span className="text-[0.8rem] text-acento-hover">
              {erro("coverImageAlt")}
            </span>
          ) : null}
        </label>

        {/* Crédito da capa */}
        <label className="flex flex-col gap-1.5">
          <span className={labelCls}>
            Crédito da imagem <span className="font-normal">— opcional</span>
          </span>
          <input
            name="coverImageCredit"
            defaultValue={post?.coverImageCredit ?? ""}
            placeholder="Ex.: Imagem/Reprodução: ..."
            className={inputCls}
          />
        </label>

        {/* Resumo */}
        <label className="flex flex-col gap-1.5">
          <span className={labelCls}>
            Resumo <span className="font-normal">— opcional, usado nos cards e no compartilhamento</span>
          </span>
          <textarea
            name="excerpt"
            defaultValue={post?.excerpt ?? ""}
            rows={3}
            maxLength={300}
            className={inputCls}
          />
          {erro("excerpt") ? (
            <span className="text-[0.8rem] text-acento-hover">
              {erro("excerpt")}
            </span>
          ) : null}
        </label>

        {/* Conteúdo */}
        <div className="flex flex-col gap-1.5">
          <span className={labelCls}>Conteúdo</span>
          <RichTextEditor value={content} onChange={setContent} />
          {erro("content") ? (
            <span className="text-[0.8rem] text-acento-hover">
              {erro("content")}
            </span>
          ) : null}
        </div>

        {/* Data de publicação */}
        <label className="flex flex-col gap-1.5">
          <span className={labelCls}>Data de publicação</span>
          <input
            type="datetime-local"
            name="publishedAt"
            defaultValue={dataPadrao}
            required
            className={`${inputCls} max-w-xs`}
          />
          {erro("publishedAt") ? (
            <span className="text-[0.8rem] text-acento-hover">
              {erro("publishedAt")}
            </span>
          ) : null}
        </label>

        {/* Publicado */}
        <label className="flex items-center gap-2.5">
          <input
            type="checkbox"
            name="published"
            defaultChecked={post?.published ?? false}
            className="h-4 w-4 accent-[var(--color-acento-hover)]"
          />
          <span className="text-[0.9rem] text-texto-principal">
            Publicado <span className="text-texto-secundario">(visível no site)</span>
          </span>
        </label>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-acento-hover px-5 py-2.5 font-bold text-fundo transition-colors hover:bg-texto-principal disabled:opacity-60"
        >
          {pending ? "Salvando..." : "Salvar"}
        </button>
        <button
          type="button"
          onClick={abrirPreview}
          className="rounded-full border border-linha px-5 py-2.5 font-bold text-texto-secundario transition-colors hover:border-acento hover:text-acento-hover"
        >
          Visualizar
        </button>
        <Link
          href="/admin"
          className="text-[0.9rem] font-medium text-texto-secundario transition-colors hover:text-acento-hover"
        >
          Cancelar
        </Link>
      </div>
    </form>

      {preview ? (
        <PostPreview
          data={preview}
          content={content}
          onContentChange={setContent}
          onClose={() => setPreview(null)}
        />
      ) : null}
    </>
  );
}
