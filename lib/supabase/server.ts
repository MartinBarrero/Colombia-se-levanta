import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Cliente con la secret key (sistema nuevo de API keys de Supabase): bypasea
// RLS. Solo debe usarse desde Route Handlers o Server Actions. El import
// "server-only" hace fallar el build si alguien lo importa desde un archivo
// "use client".
//
// Se crea de forma perezosa (no en el top-level del módulo): en Next 16 el
// paso de build "collecting page data" importa este módulo para inspeccionar
// el route handler antes de que el entorno de runtime esté garantizado, así
// que leer `process.env` fuera de una función puede fallar en build aunque
// las variables sí existan en runtime.
let client: SupabaseClient | null = null;

export function getSupabaseServer(): SupabaseClient {
  if (client) return client;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    const faltantes = [
      !supabaseUrl && "NEXT_PUBLIC_SUPABASE_URL",
      !supabaseSecretKey && "SUPABASE_SECRET_KEY",
    ].filter(Boolean);
    throw new Error(`Faltan variables de entorno: ${faltantes.join(", ")}.`);
  }

  client = createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return client;
}
