# Configuração do Supabase — Cátedra Política

Guia passo a passo para ligar o blog ao Supabase (banco de dados, login do
admin e armazenamento das imagens). Não é preciso saber programar: basta seguir
na ordem e copiar/colar o que estiver indicado.

Sempre que aparecer **➜ FAÇA ISTO NO PAINEL DO SUPABASE**, é uma ação que só
você consegue fazer no site do Supabase (o código não faz por você).

Leva uns 15 minutos.

---

## 1. Criar o projeto

**➜ FAÇA ISTO NO PAINEL DO SUPABASE**

1. Acesse <https://supabase.com> e clique em **Start your project** / faça login
   (pode entrar com a conta do GitHub).
2. Clique em **New project**.
3. Preencha:
   - **Name:** `catedra-politica` (ou o que preferir).
   - **Database Password:** clique em **Generate a password** e **guarde essa
     senha** num lugar seguro (gerenciador de senhas). Você raramente vai
     precisar dela, mas não dá para recuperar depois.
   - **Region:** escolha **South America (São Paulo)** — `sa-east-1`. É o mais
     próximo do Brasil, deixa o site mais rápido.
4. Clique em **Create new project** e espere 1–2 minutos até o projeto ficar
   pronto.

### Onde achar as chaves

**➜ FAÇA ISTO NO PAINEL DO SUPABASE**

No menu lateral, vá em **Project Settings** (ícone de engrenagem) → **API**.
Você vai usar três valores:

| No painel (Settings → API)         | Vai para a variável             | Pode ir ao navegador? |
| ---------------------------------- | ------------------------------- | --------------------- |
| **Project URL**                    | `NEXT_PUBLIC_SUPABASE_URL`      | Sim                   |
| **Project API keys → anon public** | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sim                   |
| **Project API keys → service_role**| `SUPABASE_SERVICE_ROLE_KEY`     | **NÃO. Só servidor.** |

> ⚠️ A chave **service_role** tem acesso total e ignora as regras de segurança.
> Nunca a coloque no navegador, em prints, no Git ou em qualquer lugar público.
>
> ⚠️ **Project URL** é só o endereço base, terminando em `.supabase.co`
> (ex.: `https://abcdefgh.supabase.co`). **Não** use a URL da API REST
> (a que termina em `/rest/v1/`) nem deixe barra `/` no final.

---

## 2. Variáveis de ambiente (.env.local)

No computador, na pasta do projeto, crie um arquivo chamado **`.env.local`**
(copie do `.env.example`) e preencha com os valores do passo 1:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=cole-a-chave-anon-aqui
SUPABASE_SERVICE_ROLE_KEY=cole-a-chave-service-role-aqui
NEXT_PUBLIC_SITE_URL=https://catedrapolitica.com.br
```

- O arquivo `.env.local` **não** é versionado (já está no `.gitignore`).
- As mesmas variáveis serão cadastradas na Vercel na Fase 4 (deploy). A
  `service_role` lá deve ser marcada como variável **somente de servidor**
  (sem o prefixo `NEXT_PUBLIC_`).

---

## 3. Criar as tabelas (banco de dados)

**➜ FAÇA ISTO NO PAINEL DO SUPABASE**

1. No menu lateral, abra **SQL Editor** → **New query**.
2. Abra o arquivo [`supabase/schema.sql`](supabase/schema.sql) do projeto,
   **copie tudo** e cole no editor.
3. Clique em **Run** (ou `Ctrl/Cmd + Enter`).

Isso cria as tabelas `categories` e `posts`, os índices, o `updated_at`
automático e liga a segurança (RLS). Pode rodar de novo sem problema.

### O que as regras de segurança (RLS) fazem

Em linguagem simples, depois desse passo:

- **Visitante (não logado):** consegue **ler** todas as categorias e **apenas os
  posts publicados**. Rascunhos ficam invisíveis para o público.
- **Admin (logado):** consegue **ler tudo** (inclusive rascunhos) e
  **criar, editar e excluir** posts e categorias.
- Ninguém de fora consegue alterar nada sem estar logado.

---

## 4. Criar o armazenamento de imagens (Storage)

**➜ FAÇA ISTO NO PAINEL DO SUPABASE**

1. Ainda no **SQL Editor** → **New query**.
2. Abra [`supabase/storage.sql`](supabase/storage.sql), copie tudo, cole e
   clique em **Run**.

Isso cria o bucket **`post-images`** como **público para leitura** (para as capas
aparecerem no site) e libera **upload/edição/remoção só para quem está logado**.

**Convenção de pastas** dentro do bucket:

- `seed/...` — as 9 imagens migradas do site antigo (feitas pelo script do passo 6).
- `posts/...` — as novas capas que o admin subir pelo painel (Fase 3).

> Conferência (opcional): menu **Storage** → deve aparecer o bucket
> `post-images` com um cadeado aberto (público).

---

## 5. Criar o login do admin e desativar cadastros públicos

**➜ FAÇA ISTO NO PAINEL DO SUPABASE**

### 5.1 Criar o usuário da sua cliente

1. Menu lateral → **Authentication** → **Users** → **Add user** →
   **Create new user**.
2. Preencha **Email** e **Password** (uma senha forte; entregue à sua cliente
   por um canal seguro).
3. Marque **Auto Confirm User** (assim ela já pode entrar sem e-mail de
   confirmação).
4. Clique em **Create user**.

Esse é o único acesso de administração. Se um dia precisar de outra pessoa,
basta repetir e criar outro usuário aqui.

### 5.2 Desativar cadastros públicos (importante)

Para que ninguém de fora possa se registrar:

1. Menu lateral → **Authentication** → **Sign In / Providers** (ou
   **Providers**).
2. Em **Email**, **desative** a opção **Allow new users to sign up**
   (Enable sign-ups) e salve.

Assim, só os usuários que **você** criar na tela de Users conseguem entrar.

---

## 6. Migrar o conteúdo atual (9 posts + imagens)

Esse passo é rodado **no seu computador** (usa a chave service_role do
`.env.local`). Ele insere as 8 categorias e os 9 textos, e sobe as 9 imagens de
capa para o Storage.

1. Garanta que os passos 2, 3 e 4 foram feitos.
2. No terminal, na pasta do projeto:

   ```bash
   npm run seed
   ```

3. Você verá um `✓` para cada post. Ao final: "Concluído: 8 categorias e 9 posts."

O script é **idempotente**: se rodar de novo, ele atualiza em vez de duplicar
(usa o `slug` como chave). Nada do site atual é perdido.

> Conferência (opcional): no painel, **Table Editor** → `posts` deve ter 9
> linhas; **Storage** → `post-images/seed` deve ter 9 imagens.

---

## 7. Ver o site lendo do banco

1. Pare o servidor de desenvolvimento se estiver rodando (`Ctrl + C`).
2. Rode de novo:

   ```bash
   npm run dev
   ```

3. Abra <http://localhost:3000>. Como o `.env.local` agora tem as variáveis, o
   site passa a ler **do Supabase** (antes lia do seed local).

Se as variáveis não estiverem preenchidas, o site continua funcionando com o
conteúdo local — então nada quebra durante a configuração.

---

## Resumo do que é seu x do que é do código

| Tarefa                                            | Quem faz             |
| ------------------------------------------------- | -------------------- |
| Criar projeto, achar as chaves                    | Você (painel)        |
| Preencher `.env.local`                            | Você (arquivo)       |
| Rodar `schema.sql` e `storage.sql`                | Você (SQL Editor)    |
| Criar usuário admin e desativar cadastro          | Você (painel)        |
| Tabelas, RLS, políticas, bucket                   | Os scripts SQL       |
| Migrar posts/imagens                              | `npm run seed`       |
| Ler do banco no site                              | Já está no código    |

Concluído isto, seguimos para a **Fase 3** (área administrativa: login, painel e
editor de posts).
