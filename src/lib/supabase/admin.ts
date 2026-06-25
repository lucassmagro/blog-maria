import "server-only";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "./config";

/**
 * Cliente administrativo com a chave service_role. Ignora o RLS, então é
 * EXCLUSIVO do servidor (Server Actions, scripts). O import "server-only"
 * garante erro de build caso vaze para um bundle de cliente.
 */
export function createAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !serviceKey) {
    throw new Error(
      "Supabase admin não configurado: defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
  return createClient(SUPABASE_URL, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
