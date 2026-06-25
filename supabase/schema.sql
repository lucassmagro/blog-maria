-- ===========================================================================
-- Cátedra Política — esquema do banco, índices, trigger e políticas RLS
-- Cole este arquivo inteiro no SQL Editor do Supabase e clique em "Run".
-- É idempotente: pode rodar mais de uma vez sem erro.
-- ===========================================================================

-- gen_random_uuid() (normalmente já habilitado no Supabase)
create extension if not exists "pgcrypto";

-- --------------------------------------------------------------------------
-- Tabelas
-- --------------------------------------------------------------------------
create table if not exists categories (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists posts (
  id                 uuid primary key default gen_random_uuid(),
  title              text not null,
  slug               text not null unique,
  category_id        uuid references categories(id) on delete set null,
  author             text not null,
  cover_image_url    text,
  cover_image_alt    text,
  cover_image_credit text,
  excerpt            text,
  content            text not null,            -- HTML sanitizado (editor Tiptap)
  published          boolean not null default false,
  published_at       timestamptz,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index if not exists posts_published_idx on posts (published, published_at desc);
create index if not exists posts_category_idx  on posts (category_id);

-- --------------------------------------------------------------------------
-- updated_at automático
-- --------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_set_updated_at on posts;
create trigger posts_set_updated_at
  before update on posts
  for each row execute function set_updated_at();

-- --------------------------------------------------------------------------
-- Row Level Security
--   • anon (visitante): lê todas as categorias e SÓ os posts publicados.
--   • authenticated (admin logado): lê tudo e pode inserir/editar/excluir.
--   • service_role (scripts/servidor): ignora o RLS por padrão.
-- --------------------------------------------------------------------------
alter table categories enable row level security;
alter table posts      enable row level security;

-- Categorias: leitura pública
drop policy if exists "categorias_leitura_publica" on categories;
create policy "categorias_leitura_publica" on categories
  for select
  using (true);

-- Categorias: escrita só para autenticados
drop policy if exists "categorias_escrita_autenticado" on categories;
create policy "categorias_escrita_autenticado" on categories
  for all
  to authenticated
  using (true)
  with check (true);

-- Posts: visitante lê apenas publicados
drop policy if exists "posts_leitura_publicados" on posts;
create policy "posts_leitura_publicados" on posts
  for select
  using (published = true);

-- Posts: autenticado lê tudo (inclusive rascunhos)
drop policy if exists "posts_leitura_autenticado" on posts;
create policy "posts_leitura_autenticado" on posts
  for select
  to authenticated
  using (true);

-- Posts: escrita só para autenticados
drop policy if exists "posts_escrita_autenticado" on posts;
create policy "posts_escrita_autenticado" on posts
  for all
  to authenticated
  using (true)
  with check (true);
