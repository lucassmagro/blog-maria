import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./config";

/**
 * Renova a sessão do Supabase a cada requisição e protege a área /admin.
 * Visitante sem sessão tentando acessar /admin/** é mandado para o login;
 * usuário logado que abre /admin/login é levado ao painel.
 */
export async function updateSession(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Sem Supabase configurado, não há como autenticar: bloqueia o admin.
  if (!isSupabaseConfigured) {
    if (path.startsWith("/admin")) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const ehLogin = path === "/admin/login";
  const ehAdmin = path.startsWith("/admin");

  if (ehAdmin && !ehLogin && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  if (ehLogin && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
