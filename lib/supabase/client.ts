import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Cliente con la publishable key (sistema nuevo de API keys de Supabase):
// seguro para el browser porque `donaciones` tiene RLS sin policies (no lee
// ni escribe filas) y la única lectura pública permitida es el agregado en
// la vista `total_recaudado`.
//
// Creado de forma perezosa por la misma razón que lib/supabase/server.ts:
// evitar leer `process.env` en el top-level del módulo.
let client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (client) return client;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY en las variables de entorno."
    );
  }

  client = createClient(supabaseUrl, supabasePublishableKey, {
    auth: {
      persistSession: false,
    },
  });

  return client;
}
