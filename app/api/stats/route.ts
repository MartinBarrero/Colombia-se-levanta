import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

const TIMEOUT_MS = 5000;

interface StatsPayload {
  total: number;
  numDonaciones: number;
  disponible: boolean;
}

function fallback(): NextResponse<StatsPayload> {
  // Sin dato confiable de Supabase: mostramos cero con `disponible: false` en
  // vez de inventar un "último valor conocido" (requeriría persistir estado
  // aparte). El frontend usa el flag para avisar que el número no está
  // actualizado, en vez de mostrar un total posiblemente engañoso como si
  // fuera real.
  return NextResponse.json({ total: 0, numDonaciones: 0, disponible: false });
}

export async function GET() {
  // Promise.race no cancela al perdedor: si la consulta gana, el setTimeout
  // de abajo sigue pendiente y, sin este clearTimeout, dispara un reject()
  // varios segundos después que nadie consume -> unhandledRejection.
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  try {
    const timeout = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => reject(new Error("Timeout consultando Supabase")), TIMEOUT_MS);
    });

    const { data, error } = await Promise.race([
      getSupabaseServer().from("total_recaudado").select("total, num_donaciones").single(),
      timeout,
    ]);

    if (error || !data) {
      console.error("Error consultando total_recaudado:", error?.message);
      return fallback();
    }

    return NextResponse.json({
      total: Number(data.total),
      numDonaciones: Number(data.num_donaciones),
      disponible: true,
    } satisfies StatsPayload);
  } catch (err) {
    console.error("Error inesperado en /api/stats:", err instanceof Error ? err.message : err);
    return fallback();
  } finally {
    clearTimeout(timeoutId);
  }
}
