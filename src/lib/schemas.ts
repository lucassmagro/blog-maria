import { z } from "zod";

/** Validação do formulário de post (compartilhada pelas Server Actions). */
export const postSchema = z.object({
  title: z.string().trim().min(1, "Informe o título."),
  slug: z
    .string()
    .trim()
    .min(1, "Informe o slug.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug inválido: use apenas letras minúsculas, números e hífens.",
    ),
  categoryId: z.string().uuid("Selecione uma categoria."),
  author: z.string().trim().min(1, "Informe a autoria."),
  excerpt: z.string().trim().max(300, "O resumo é muito longo (máx. 300).").optional(),
  content: z.string().min(1, "Escreva o conteúdo."),
  coverImageAlt: z.string().trim().optional(),
  publishedAt: z.string().min(1, "Informe a data de publicação."),
  published: z.boolean(),
});

export type PostInput = z.infer<typeof postSchema>;

/** Limites do upload de imagem de capa. */
export const COVER_MAX_BYTES = 5 * 1024 * 1024; // 5 MB
export const COVER_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const categorySchema = z.object({
  name: z.string().trim().min(1, "Informe o nome da categoria."),
});
