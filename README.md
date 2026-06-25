# Cátedra Política

Blog editorial brasileiro com ensaios sobre política, sociedade, gênero, direito
e filosofia. Site originalmente estático (HTML + CSS, GitHub Pages), em migração
para uma aplicação moderna em **Next.js** com área administrativa para publicação
de novos textos.

Domínio: `catedrapolitica.com.br`

---

## Stack

- **Next.js (App Router) + TypeScript** — Server Components, ISR, ótimo SEO.
- **Tailwind CSS v4** — as seis cores da marca ficam centralizadas como tokens
  em [`src/app/globals.css`](src/app/globals.css).
- **next/font** — Playfair Display (títulos) e Roboto (corpo).
- **react-markdown + rehype-sanitize** — corpo dos artigos em Markdown,
  renderizado de forma sanitizada.
- **Supabase** (Fase 2) — banco, autenticação e armazenamento de imagens.

---

## Rodando localmente

```bash
npm install
npm run dev      # http://localhost:3000
```

Outros comandos:

```bash
npm run build      # build de produção
npm run start      # serve o build
npm run lint       # ESLint (next lint)
npm run typecheck  # checagem de tipos (tsc)
```

---

## Identidade visual (preservada do site original)

As seis cores da marca, em `@theme` no `globals.css`:

| Token Tailwind        | Cor       | Uso                              |
| --------------------- | --------- | -------------------------------- |
| `fundo`               | `#F0EBE3` | Fundo (bege/creme quente)        |
| `texto-principal`     | `#4E342E` | Texto principal (marrom espresso)|
| `texto-secundario`    | `#795548` | Texto secundário (marrom café)   |
| `acento`              | `#8D6E63` | Acento (cappuccino)              |
| `acento-hover`        | `#5D4037` | Hover (marrom escuro)            |
| `borda-titulo`        | `#C0A898` | Sublinhado de título e rodapé    |

Use como utilitários normais: `bg-fundo`, `text-texto-principal`,
`border-borda-titulo`, etc.

---

## Estrutura

```
src/
├── app/
│   ├── layout.tsx              # raiz: fontes, metadados, favicon (🪑)
│   ├── globals.css             # tokens da marca + estilo do corpo do artigo
│   ├── not-found.tsx           # 404 na paleta da marca
│   ├── sitemap.ts / robots.ts  # SEO
│   └── (public)/
│       ├── layout.tsx          # cabeçalho + rodapé do site público
│       ├── page.tsx            # home: grade + filtro de categorias
│       ├── post/[slug]/        # artigo (ISR, metadados, JSON-LD)
│       └── categoria/[slug]/   # posts por categoria
├── components/                 # SiteHeader, SiteFooter, PostCard, etc.
└── lib/
    ├── types.ts                # tipos de domínio (espelham o Supabase)
    ├── posts.ts                # camada de acesso a dados (troca p/ Supabase em Fase 2)
    ├── seed-posts.ts           # os 9 textos migrados (Markdown)
    ├── categories.ts           # categorias
    ├── format.ts               # datas em pt-BR, slug, resumo
    └── site.ts                 # nome, URL, redes sociais
```

---

## Conteúdo migrado

Os 9 textos originais foram migrados com título, data, autoria e categoria
fiéis. O corpo, antes em `<br><br>`, virou parágrafos Markdown semânticos.
As 9 imagens de capa estão em `public/posts/imgs/`.

Em Fase 2 o conteúdo passa a vir do Supabase, e em Fase 3 o cliente poderá
publicar novos textos pela área administrativa (`/admin`).

---

## Supabase

A camada de dados ([`src/lib/posts.ts`](src/lib/posts.ts)) funciona em **modo
duplo**:

- **Com** as variáveis `NEXT_PUBLIC_SUPABASE_*` definidas → lê do Supabase.
- **Sem** elas → usa o seed local (`src/lib/seed-posts.ts`), para o site nunca
  quebrar durante a configuração.

Para ligar ao banco, siga o [`SUPABASE_SETUP.md`](SUPABASE_SETUP.md). Resumo:

```bash
cp .env.example .env.local   # preencha as chaves do Supabase
# rode supabase/schema.sql e supabase/storage.sql no SQL Editor
npm run seed                 # migra as 8 categorias, 9 posts e 9 imagens
npm run dev
```

Clientes do Supabase em [`src/lib/supabase/`](src/lib/supabase/): `public`
(anon, leitura pública), `server` (sessão via cookies, para o admin) e `admin`
(service_role, somente servidor).

---

## Deploy

Publicação na **Vercel** e migração do domínio (Registro.br): veja o
[`DEPLOY.md`](DEPLOY.md). Resumo: subir para o GitHub → importar na Vercel →
cadastrar as variáveis de ambiente (a `service_role` como **somente servidor**) →
testar na URL `*.vercel.app` → só então apontar o domínio.

SEO já incluso: metadados e Open Graph/Twitter por post, canônicas, JSON-LD
`Article`, `sitemap.xml`, `robots.txt` (com `/admin` bloqueado) e 404 na marca.
As URLs usam `NEXT_PUBLIC_SITE_URL`.

---

## Roadmap

- [x] **Fase 1** — Migração do site público para Next.js com identidade
      preservada e os 9 posts.
- [x] **Fase 2** — Supabase (banco, RLS, Storage, auth) + `SUPABASE_SETUP.md` +
      seed. Site lê do banco quando configurado.
- [x] **Fase 3** — Área administrativa (login, painel, editor Tiptap com upload).
- [x] **Fase 4** — SEO final, `DEPLOY.md` e migração do domínio para a Vercel.
```
