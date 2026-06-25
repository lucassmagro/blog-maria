import { createClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

/**
 * Cliente público (chave anon), somente leitura, sem sessão/cookies. Seguro
 * para Server Components e geração estática (ISR/SSG). O acesso é limitado
 * pelas políticas RLS: anon só enxerga posts publicados.
 */
export function createPublicClient() {
  return createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    auth: { persistSession: false },
  });
}
