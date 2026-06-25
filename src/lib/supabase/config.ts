/** Configuração e detecção do Supabase. */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Quando as variáveis públicas existem, o site lê do Supabase. Caso contrário,
 * usa o seed local (modo de transição, antes de configurar o banco).
 */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
