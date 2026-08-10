import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { verificarFirmaWebhook } from "@/lib/bold";

interface BoldWebhookPayload {
  id: string;
  type: string;
  data?: {
    payment_id?: string;
    metadata?: { reference?: string | null } | null;
  };
}

function mapearEstado(type: string): "approved" | "rejected" | "failed" {
  if (type === "SALE_APPROVED") return "approved";
  if (type === "SALE_REJECTED") return "rejected";
  // VOID_* y cualquier tipo no reconocido: no hay estado "voided" en el MVP,
  // así que se registra como failed y el payload crudo queda en metadata
  // para poder revisarlo manualmente si hace falta.
  return "failed";
}

export async function POST(request: Request) {
  // Se lee el body como texto crudo (no request.json()) porque la firma se
  // valida contra los bytes exactos que mandó Bold; reserializar el JSON
  // parseado podría no coincidir byte a byte y romper la comparación HMAC.
  const rawBody = await request.text();
  const signature = request.headers.get("x-bold-signature");

  if (!verificarFirmaWebhook(rawBody, signature)) {
    console.error("Firma de webhook de Bold inválida.");
    return NextResponse.json({ error: "Firma inválida." }, { status: 400 });
  }

  let payload: BoldWebhookPayload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    console.error("Payload de webhook de Bold no es JSON válido.");
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
  }

  const orderId = payload.data?.metadata?.reference;
  if (!orderId) {
    console.error(`Webhook de Bold (${payload.id}) sin metadata.reference, no se puede asociar.`);
    // Se responde 200 igual: es un evento que no podemos procesar, y
    // devolver error solo haría que Bold lo reintente sin sentido.
    return NextResponse.json({ ok: true });
  }

  try {
    const { error } = await getSupabaseServer()
      .from("donaciones")
      .update({
        estado: mapearEstado(payload.type),
        bold_transaction_id: payload.data?.payment_id ?? null,
        metadata: payload,
      })
      .eq("order_id", orderId);

    if (error) {
      console.error("Error actualizando donación desde webhook de Bold:", error.message);
      return NextResponse.json({ error: "No se pudo procesar el evento." }, { status: 500 });
    }
  } catch (err) {
    console.error(
      "Error inesperado procesando webhook de Bold:",
      err instanceof Error ? err.message : err
    );
    return NextResponse.json({ error: "No se pudo procesar el evento." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
