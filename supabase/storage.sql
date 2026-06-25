-- ===========================================================================
-- Cátedra Política — bucket de imagens e políticas de Storage
-- Cole no SQL Editor do Supabase e clique em "Run". Idempotente.
--
-- Convenção de pastas no bucket `post-images`:
--   posts/<slug-ou-id>/<arquivo>   ex.: posts/condicoes-de-vida.../capa.jpg
--   seed/img_post_1.jpg ...        (imagens migradas pelo script de seed)
-- ===========================================================================

-- Cria o bucket público (se ainda não existir).
insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true)
on conflict (id) do update set public = true;

-- Leitura pública dos arquivos do bucket
drop policy if exists "post_images_leitura_publica" on storage.objects;
create policy "post_images_leitura_publica" on storage.objects
  for select
  using (bucket_id = 'post-images');

-- Upload / atualização / remoção somente para autenticados
drop policy if exists "post_images_insert_autenticado" on storage.objects;
create policy "post_images_insert_autenticado" on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'post-images');

drop policy if exists "post_images_update_autenticado" on storage.objects;
create policy "post_images_update_autenticado" on storage.objects
  for update
  to authenticated
  using (bucket_id = 'post-images')
  with check (bucket_id = 'post-images');

drop policy if exists "post_images_delete_autenticado" on storage.objects;
create policy "post_images_delete_autenticado" on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'post-images');
