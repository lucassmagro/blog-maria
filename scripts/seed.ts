/**
 * Seed do Supabase — Cátedra Política
 *
 * Insere as categorias e os 9 posts originais e faz upload das 9 imagens de
 * capa para o bucket `post-images`. É idempotente (usa upsert por slug), então
 * pode ser executado novamente sem duplicar dados.
 *
 * Pré-requisitos:
 *   1. Rodar supabase/schema.sql e supabase/storage.sql no SQL Editor.
 *   2. Preencher .env.local (NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY).
 *
 * Execução:
 *   npm run seed
 */
import { readFileSync } from "node:fs";
import { basename, join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { CATEGORIES } from "../src/lib/categories";
import { SEED_POSTS } from "../src/lib/seed-posts";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Faltam variáveis. Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY em .env.local.",
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const BUCKET = "post-images";

async function main() {
  console.log("→ Garantindo o bucket de imagens...");
  const { error: bucketErr } = await supabase.storage.createBucket(BUCKET, {
    public: true,
  });
  if (bucketErr && !/already exists/i.test(bucketErr.message)) {
    throw bucketErr;
  }

  console.log("→ Inserindo categorias...");
  const { error: catErr } = await supabase
    .from("categories")
    .upsert(
      CATEGORIES.map((c) => ({ name: c.name, slug: c.slug })),
      { onConflict: "slug" },
    );
  if (catErr) throw catErr;

  const { data: cats, error: catReadErr } = await supabase
    .from("categories")
    .select("id, slug");
  if (catReadErr) throw catReadErr;
  const catIdBySlug = new Map(cats!.map((c) => [c.slug, c.id]));

  console.log("→ Migrando posts e imagens...");
  for (const post of SEED_POSTS) {
    // Upload da imagem de capa para o Storage
    const localPath = join(process.cwd(), "public", post.coverImageUrl);
    const fileName = basename(post.coverImageUrl);
    const storagePath = `seed/${fileName}`;
    const file = readFileSync(localPath);

    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, file, {
        contentType: "image/jpeg",
        upsert: true,
      });
    if (upErr) throw upErr;

    const { data: pub } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(storagePath);

    const { error: postErr } = await supabase.from("posts").upsert(
      {
        title: post.title,
        slug: post.slug,
        category_id: catIdBySlug.get(post.categorySlug) ?? null,
        author: post.author,
        cover_image_url: pub.publicUrl,
        cover_image_alt: post.coverImageAlt,
        cover_image_credit: post.coverImageCredit ?? null,
        excerpt: post.excerpt,
        content: post.content,
        published: post.published,
        published_at: post.publishedAt,
      },
      { onConflict: "slug" },
    );
    if (postErr) throw postErr;

    console.log(`   ✓ ${post.slug}`);
  }

  console.log(
    `\nConcluído: ${CATEGORIES.length} categorias e ${SEED_POSTS.length} posts.`,
  );
}

main().catch((err) => {
  console.error("\nErro no seed:", err.message ?? err);
  process.exit(1);
});
