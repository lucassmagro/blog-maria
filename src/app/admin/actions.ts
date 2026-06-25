"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/admin";
import {
  COVER_MAX_BYTES,
  COVER_TYPES,
  categorySchema,
  postSchema,
} from "@/lib/schemas";
import { gerarSlug } from "@/lib/format";
import { htmlToPlainText, sanitizeArticleHtml } from "@/lib/sanitize";

export type FormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  ok?: boolean;
};

export type CategoryState = FormState & {
  category?: { id: string; name: string; slug: string };
};

const BUCKET = "post-images";

/** Revalida as páginas públicas afetadas por uma alteração de post. */
function revalidarPublico(slug?: string, categorySlug?: string) {
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/post/${slug}`);
  if (categorySlug) revalidatePath(`/categoria/${categorySlug}`);
}

// ----------------------------------------------------------------------------
// Autenticação
// ----------------------------------------------------------------------------
export async function signIn(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Informe e-mail e senha." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "E-mail ou senha incorretos." };
  }

  redirect("/admin");
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// ----------------------------------------------------------------------------
// Upload de capa
// ----------------------------------------------------------------------------
async function uploadCover(
  file: File,
  slug: string,
): Promise<{ url?: string; error?: string }> {
  if (!COVER_TYPES.includes(file.type)) {
    return { error: "Imagem deve ser JPG, PNG ou WEBP." };
  }
  if (file.size > COVER_MAX_BYTES) {
    return { error: "Imagem muito grande (máx. 5 MB)." };
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `posts/${slug}/${Date.now()}.${ext}`;
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: true });

  if (error) return { error: `Falha no upload da imagem: ${error.message}` };

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl };
}

// ----------------------------------------------------------------------------
// Criar / editar post
// ----------------------------------------------------------------------------
export async function savePost(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireUser();

  const id = String(formData.get("id") ?? "").trim();
  const raw = {
    title: String(formData.get("title") ?? ""),
    slug: gerarSlug(String(formData.get("slug") ?? "")),
    categoryId: String(formData.get("categoryId") ?? ""),
    author: String(formData.get("author") ?? ""),
    excerpt: String(formData.get("excerpt") ?? "").trim() || undefined,
    content: sanitizeArticleHtml(String(formData.get("content") ?? "")),
    coverImageAlt: String(formData.get("coverImageAlt") ?? "").trim() || undefined,
    publishedAt: String(formData.get("publishedAt") ?? ""),
    published: formData.get("published") === "on",
  };

  const parsed = postSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const [k, v] of Object.entries(parsed.error.flatten().fieldErrors)) {
      if (v && v[0]) fieldErrors[k] = v[0];
    }
    return { error: "Verifique os campos destacados.", fieldErrors };
  }
  const data = parsed.data;

  // O corpo não pode ser visualmente vazio (Tiptap manda "<p></p>").
  if (htmlToPlainText(data.content).length === 0) {
    return {
      error: "Verifique os campos destacados.",
      fieldErrors: { content: "Escreva o conteúdo." },
    };
  }

  const coverImageCredit =
    String(formData.get("coverImageCredit") ?? "").trim() || null;
  const existingCoverUrl = String(formData.get("existingCoverUrl") ?? "").trim();

  // Imagem de capa
  let coverUrl: string | null = existingCoverUrl || null;
  const file = formData.get("cover");
  if (file instanceof File && file.size > 0) {
    const up = await uploadCover(file, data.slug);
    if (up.error) {
      return { error: up.error, fieldErrors: { cover: up.error } };
    }
    coverUrl = up.url ?? coverUrl;
  }

  // Alt da capa é obrigatório só ao PUBLICAR (rascunho pode ficar incompleto).
  if (data.published && coverUrl && !data.coverImageAlt) {
    return {
      error: "Para publicar, descreva a imagem de capa (texto alternativo).",
      fieldErrors: {
        coverImageAlt: "Descreva a imagem (texto alternativo) para acessibilidade.",
      },
    };
  }

  const supabase = await createSupabaseServerClient();
  const row = {
    title: data.title,
    slug: data.slug,
    category_id: data.categoryId,
    author: data.author,
    cover_image_url: coverUrl,
    cover_image_alt: data.coverImageAlt ?? null,
    cover_image_credit: coverImageCredit,
    excerpt: data.excerpt ?? null,
    content: data.content,
    published: data.published,
    published_at: new Date(data.publishedAt).toISOString(),
  };

  let categorySlug: string | undefined;
  {
    const { data: cat } = await supabase
      .from("categories")
      .select("slug")
      .eq("id", data.categoryId)
      .maybeSingle();
    categorySlug = cat?.slug;
  }

  if (id) {
    const { error } = await supabase.from("posts").update(row).eq("id", id);
    if (error) return mapDbError(error.message);
  } else {
    const { error } = await supabase.from("posts").insert(row);
    if (error) return mapDbError(error.message);
  }

  revalidarPublico(data.slug, categorySlug);
  redirect(`/admin?ok=${id ? "editado" : "criado"}`);
}

function mapDbError(message: string): FormState {
  if (/duplicate key|unique/i.test(message)) {
    return {
      error: "Verifique os campos destacados.",
      fieldErrors: { slug: "Já existe um post com este slug." },
    };
  }
  return { error: `Erro ao salvar: ${message}` };
}

// ----------------------------------------------------------------------------
// Excluir / publicar
// ----------------------------------------------------------------------------
export async function deletePost(formData: FormData) {
  await requireUser();
  const id = String(formData.get("id") ?? "");
  const slug = String(formData.get("slug") ?? "");
  const categorySlug = String(formData.get("categorySlug") ?? "");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidarPublico(slug, categorySlug);
  redirect("/admin?ok=excluido");
}

export async function togglePublish(formData: FormData) {
  await requireUser();
  const id = String(formData.get("id") ?? "");
  const slug = String(formData.get("slug") ?? "");
  const categorySlug = String(formData.get("categorySlug") ?? "");
  const publicar = formData.get("publicar") === "true";

  const supabase = await createSupabaseServerClient();

  const update: { published: boolean; published_at?: string } = {
    published: publicar,
  };
  // Ao publicar pela primeira vez, define a data se ainda não houver.
  if (publicar) {
    const { data: atual } = await supabase
      .from("posts")
      .select("published_at")
      .eq("id", id)
      .maybeSingle();
    if (!atual?.published_at) update.published_at = new Date().toISOString();
  }

  const { error } = await supabase.from("posts").update(update).eq("id", id);
  if (error) throw new Error(error.message);

  revalidarPublico(slug, categorySlug);
  redirect(`/admin?ok=${publicar ? "publicado" : "despublicado"}`);
}

// ----------------------------------------------------------------------------
// Criar categoria
// ----------------------------------------------------------------------------
export async function createCategory(
  _prev: CategoryState,
  formData: FormData,
): Promise<CategoryState> {
  await requireUser();
  const parsed = categorySchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) {
    return { error: "Informe o nome da categoria." };
  }

  const slug = gerarSlug(parsed.data.name);
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("categories")
    .insert({ name: parsed.data.name, slug })
    .select("id, name, slug")
    .single();

  if (error) {
    if (/duplicate key|unique/i.test(error.message)) {
      return { error: "Já existe uma categoria com esse nome." };
    }
    return { error: `Erro ao criar categoria: ${error.message}` };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  return { ok: true, category: data };
}
