import "server-only";
import crypto from "node:crypto";

export function generarOrderId(): string {
  const timestamp = Date.now().toString(36);
  const random = crypto.randomBytes(4).toString("hex");
  return `donacion-${timestamp}-${random}`;
}

export function calcularIntegritySignature(params: {
  orderId: string;
  amount: number;
  currency: string;
}): string {
  const secretKey = process.env.BOLD_SECRET_KEY;
  if (!secretKey) {
    throw new Error("Falta BOLD_SECRET_KEY en las variables de entorno.");
  }

  // Orden exacto que exige Bold: OrderID + Amount + Currency + SecretKey.
  const raw = `${params.orderId}${params.amount}${params.currency}${secretKey}`;
  return crypto.createHash("sha256").update(raw).digest("hex");
}

// Verificación de firma del webhook según la doc de Bold: el body crudo se
// codifica en base64 y se firma con HMAC-SHA256 usando la misma
// BOLD_SECRET_KEY (Bold no provee una llave de webhook separada). Se compara
// contra el header `x-bold-signature`.
export function verificarFirmaWebhook(rawBody: string, signatureHeader: string | null): boolean {
  const secretKey = process.env.BOLD_SECRET_KEY;
  if (!secretKey || !signatureHeader) return false;

  const encoded = Buffer.from(rawBody, "utf-8").toString("base64");
  const hashed = crypto.createHmac("sha256", secretKey).update(encoded).digest("hex");

  const expected = Buffer.from(hashed);
  const received = Buffer.from(signatureHeader);
  // timingSafeEqual lanza si los buffers tienen distinto largo, así que se
  // valida el largo antes en vez de dejar que la excepción escape.
  if (expected.length !== received.length) return false;

  return crypto.timingSafeEqual(expected, received);
}
