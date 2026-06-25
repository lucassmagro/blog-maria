import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

/**
 * Cliente Supabase para o servidor, ciente da sessão via cookies
 * (@supabase/ssr). Usado em Server Components, Route Handlers, middleware e
 * Server Actions na área administrativa (Fase 3).
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Chamado de um Server Component (sem permissão de escrita de cookie).
          // O middleware cuida da renovação da sessão nesses casos.
        }
      },
    },
  });
}
