import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleContent } from "@/components/ArticleContent";
import { ContinueReading } from "@/components/ContinueReading";
import { ArrowLeftIcon } from "@/components/icons";
import {
  getAllPublishedSlugs,
  getPostBySlug,
  getRelatedPosts,
} from "@/lib/posts";
import { dataAttr, formatarDataPtBr, tempoDeLeitura } from "@/lib/format";
import { htmlToPlainText } from "@/lib/sanitize";
import { SITE } from "@/lib/site";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Publicação não encontrada" };

  const url = `${SITE.url}/post/${post.slug}`;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/post/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url,
      publishedTime: post.publishedAt,
      authors: [post.author],
      images: [{ url: post.coverImageUrl, alt: post.coverImageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.coverImageUrl],
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const relacionados = await getRelatedPosts(slug, post.categorySlug, 3);

  const multiplasAutoras = post.author.includes(" e ");
  const rotuloAutoria = multiplasAutoras ? "Autoras" : "Autora";
  const leitura = tempoDeLeitura(htmlToPlainText(post.content));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: `${SITE.url}${post.coverImageUrl}`,
    datePublished: post.publishedAt,
    author: post.author
      .split(/\s+e\s+/)
      .map((nome) => ({ "@type": "Person", name: nome.trim() })),
    publisher: { "@type": "Organization", name: SITE.name },
    mainEntityOfPage: `${SITE.url}/post/${post.slug}`,
    articleSection: post.categoryName,
  };

  return (
    <>
      <article className="mx-auto max-w-[var(--container-leitura)] pt-2">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[0.82rem] font-bold uppercase tracking-[0.5px] text-texto-secundario transition-colors hover:text-acento-hover"
        >
          <ArrowLeftIcon />
          Voltar para o blog
        </Link>

        <header className="mb-8 mt-6">
          <div className="text-[0.8rem]">
            <Link
              href={`/categoria/${post.categorySlug}`}
              className="font-bold uppercase tracking-[0.5px] text-texto-secundario transition-colors hover:text-acento-hover"
            >
              {post.categoryName}
            </Link>
          </div>

          <h1 className="mt-4 text-[2.1rem] leading-[1.12] sm:text-[3rem]">
            {post.title}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-linha pt-4 text-[0.9rem] text-texto-secundario">
            <span className="font-bold text-texto-principal">{post.author}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={dataAttr(post.publishedAt)}>
              {formatarDataPtBr(post.publishedAt)}
            </time>
            <span aria-hidden="true">·</span>
            <span>{leitura}</span>
          </div>
        </header>

        <figure className="mb-10">
          <div className="relative aspect-[3/2] w-full overflow-hidden">
            <Image
              src={post.coverImageUrl}
              alt={post.coverImageAlt}
              fill
              sizes="(max-width: 680px) 100vw, 680px"
              priority
              className="object-cover"
            />
          </div>
          {post.coverImageCredit ? (
            <figcaption className="mt-2 text-[0.8rem] italic text-texto-secundario">
              {post.coverImageCredit}
            </figcaption>
          ) : null}
        </figure>

        <ArticleContent html={post.content} capitular />

        <footer className="mt-12 border-t border-linha pt-6">
          <h2 className="text-[1.3rem]">{rotuloAutoria}</h2>
          <p className="mt-2 text-texto-secundario">{post.author}</p>
        </footer>
      </article>

      <ContinueReading posts={relacionados} />
    </>
  );
}
