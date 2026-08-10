import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { calcularIntegritySignature, generarOrderId } from "@/lib/bold";

interface CheckoutBody {
  monto?: unknown;
  nombreDonante?: unknown;
  emailDonante?: unknown;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CheckoutBody;
    const monto = Number(body.monto);

    if (!Number.isFinite(monto) || monto <= 0) {
      return NextResponse.json({ error: "Monto inválido." }, { status: 400 });
    }

    const apiKey = process.env.NEXT_PUBLIC_BOLD_IDENTITY_KEY;
    if (!apiKey) {
      console.error("Falta NEXT_PUBLIC_BOLD_IDENTITY_KEY en las variables de entorno.");
      return NextResponse.json({ error: "No se pudo iniciar el pago." }, { status: 500 });
    }

    const orderId = generarOrderId();
    const currency = "COP";
    // Bold exige el monto sin decimales.
    const montoEntero = Math.round(monto);

    const integritySignature = calcularIntegritySignature({
      orderId,
      amount: montoEntero,
      currency,
    });

    const nombreDonante =
      typeof body.nombreDonante === "string" && body.nombreDonante.trim()
        ? body.nombreDonante.trim()
        : null;
    const emailDonante =
      typeof body.emailDonante === "string" && body.emailDonante.trim()
        ? body.emailDonante.trim()
        : null;

    const { error } = await getSupabaseServer().from("donaciones").insert({
      order_id: orderId,
      monto: montoEntero,
      moneda: currency,
      nombre_donante: nombreDonante,
      email_donante: emailDonante,
      estado: "pending",
    });

    if (error) {
      console.error("Error creando donación pendiente:", error.message);
      return NextResponse.json({ error: "No se pudo iniciar el pago." }, { status: 500 });
    }

    return NextResponse.json({
      orderId,
      amount: montoEntero,
      currency,
      apiKey,
      integritySignature,
    });
  } catch (err) {
    console.error("Error inesperado en /api/checkout:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "No se pudo iniciar el pago." }, { status: 500 });
  }
}
