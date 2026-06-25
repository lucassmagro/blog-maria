# Deploy e migração do domínio — Cátedra Política

Como publicar o site na **Vercel** e migrar o domínio
`catedrapolitica.com.br` do GitHub Pages para a Vercel, sem perder o ar.

Sempre que aparecer **➜ FAÇA ISTO NO PAINEL**, é uma ação manual sua (no site
da Vercel ou do registrador do domínio).

> Por que Vercel? O site público é rápido (SSR/ISR) **e** a área administrativa
> (login + editor) funciona. Num "static export" no GitHub Pages, o `/admin`
> **não funcionaria** (sem servidor para autenticar) — veja a Seção 4.

---

## 1. Subir o código para o GitHub

A Vercel publica a partir de um repositório. O repositório do domínio hoje serve
o site antigo (HTML estático); vamos substituí-lo pelo app Next.

1. Confirme que o projeto roda localmente: `npm run dev`.
2. Faça commit de tudo e envie para o repositório no GitHub:

   ```bash
   git add .
   git commit -m "Migração para Next.js + Supabase"
   git push
   ```

   > ⚠️ Garanta que o `.env.local` **não** vai junto (já está no `.gitignore`).
   > As chaves do Supabase serão cadastradas direto na Vercel (passo 2.3).

---

## 2. Criar o projeto na Vercel

**➜ FAÇA ISTO NO PAINEL DA VERCEL** (<https://vercel.com>)

1. **Add New… → Project** e importe o repositório do GitHub.
2. **Framework Preset:** a Vercel detecta **Next.js** automaticamente. Não
   precisa mudar build command nem output.
3. **Environment Variables** — adicione as mesmas do `.env.example`, para
   **Production** e **Preview**:

   | Nome                            | Valor                                   | Exposição          |
   | ------------------------------- | --------------------------------------- | ------------------ |
   | `NEXT_PUBLIC_SUPABASE_URL`      | URL do projeto Supabase                 | Pode ir ao browser |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | chave anon                              | Pode ir ao browser |
   | `SUPABASE_SERVICE_ROLE_KEY`     | chave service_role                      | **Somente servidor** |
   | `NEXT_PUBLIC_SITE_URL`          | `https://catedrapolitica.com.br`        | Pode ir ao browser |

   > ⚠️ A `SUPABASE_SERVICE_ROLE_KEY` **não** pode ter o prefixo `NEXT_PUBLIC_`.
   > Deixe-a como variável normal (somente servidor). Nunca exponha no browser.

4. Clique em **Deploy** e espere o build terminar.
5. **Teste tudo na URL temporária** `https://SEU-PROJETO.vercel.app` **antes** de
   mexer no domínio:
   - Home, um post, filtro de categoria.
   - `/admin/login` → entrar com o usuário admin → criar/editar um post → ver no
     ar. (A troca de domínio é sempre o **último** passo.)

---

## 3. Migrar o domínio (GitHub Pages → Vercel)

O `catedrapolitica.com.br` é um domínio `.com.br`, registrado no
**Registro.br**. O DNS é gerenciado no painel do Registro.br ("DNS / Editar
Zona") ou onde os nameservers apontarem. Os registros atuais apontam para o
GitHub Pages e precisam ser substituídos.

> **A fonte da verdade são os valores que a Vercel mostrar para este domínio.**
> A Vercel pode indicar um IP ou um CNAME específicos do projeto. Os valores
> abaixo são os padrões/genéricos da Vercel.

### 3.1 Preparação (faça ~24h antes, para a virada ser rápida)

**➜ FAÇA ISTO NO PAINEL DO REGISTRO.BR**

1. Baixe o **TTL** dos registros existentes para **60 segundos**. Assim a
   propagação na hora da virada leva minutos, não horas.

### 3.2 Na Vercel

**➜ FAÇA ISTO NO PAINEL DA VERCEL**

2. Projeto → **Settings → Domains → Add** → digite `catedrapolitica.com.br`.
   A Vercel também oferece adicionar `www.catedrapolitica.com.br`. **Adicione os
   dois.** O recomendado é `www` como principal com redirecionamento do apex
   para o `www` (ou o contrário). Escolha um sentido e mantenha.
3. A Vercel mostra os **registros DNS exatos** a criar. **Anote-os.**

### 3.3 No painel de DNS (Registro.br) — remover o GitHub Pages

**➜ FAÇA ISTO NO PAINEL DO REGISTRO.BR**

4. Apague os registros **A** do apex que apontam para o GitHub Pages:
   `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
5. Apague quaisquer registros **AAAA** (IPv6) do GitHub
   (`2606:50c0:8000::153` … `2606:50c0:8003::153`). Registros AAAA esquecidos
   **quebram a emissão do certificado SSL** na Vercel.
6. Apague o **CNAME** de `www` que aponta para `usuario.github.io`.

### 3.4 No painel de DNS — adicionar a Vercel

**➜ FAÇA ISTO NO PAINEL DO REGISTRO.BR** (use os valores que a Vercel mostrou)

7. **Apex** (`@` / `catedrapolitica.com.br`): registro **A** →
   `76.76.21.21` (ou o IP específico que a Vercel indicar). A regra de DNS proíbe
   CNAME no apex, por isso é um registro A.
8. **www**: registro **CNAME** → `cname.vercel-dns.com` (ou o destino exato que a
   Vercel indicar, ex.: um `*.vercel-dns-0xx.com`).
9. Se já existir um registro **CAA** no domínio, adicione um permitindo a Let's
   Encrypt: `0 issue "letsencrypt.org"` — senão o SSL não é emitido. Se não
   houver nenhum CAA, **pule** este passo.

### 3.5 No repositório

10. Remova o arquivo **`CNAME`** da raiz (ele é do GitHub Pages; a Vercel
    gerencia o domínio pelo painel e não usa esse arquivo). Posso remover por
    você quando formos publicar.

### 3.6 Verificar

11. Aguarde a propagação (minutos, com o TTL baixo; no pior caso até 48h). Use
    <https://whatsmydns.net> para confirmar que o apex resolve para o IP da
    Vercel no mundo todo.
12. Na Vercel, confirme que os dois domínios mostram **Valid Configuration** e
    que o **certificado SSL** foi emitido (Let's Encrypt, automático).
13. Teste `https://catedrapolitica.com.br` e `https://www.catedrapolitica.com.br`
    numa aba anônima. Se ainda aparecer o site antigo do GitHub Pages, é registro
    velho não propagado — revise os passos 4–6.
14. Depois de tudo no ar, suba o **TTL** de volta para um valor normal (ex.: 3600).

---

## 4. E se eu quisesse GitHub Pages (export estático)?

Dá para exportar o site público como estático, mas há um custo importante:
**o `/admin` (login e editor) não funciona** em hospedagem estática, porque não
há servidor para autenticar nem rodar as Server Actions. Você precisaria de outra
hospedagem só para o admin de qualquer forma.

Por isso a recomendação é a **Vercel**: mantém o blog público rápido (ISR) e, ao
mesmo tempo, viabiliza o painel administrativo no mesmo lugar.

---

## Depois do deploy

- Novos posts publicados pelo painel aparecem no ar na hora (revalidação sob
  demanda) — não precisa fazer novo deploy para publicar conteúdo.
- Só é preciso novo deploy quando o **código** mudar (ele acontece sozinho a cada
  `git push`).
