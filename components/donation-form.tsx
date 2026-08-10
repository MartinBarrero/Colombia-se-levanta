"use client";

import { useId, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const formatCOP = (value: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);

const BOLD_SCRIPT_SRC = "https://checkout.bold.co/library/boldPaymentButton.js";

declare global {
  interface Window {
    BoldCheckout?: new (config: {
      orderId: string;
      currency: string;
      amount: string;
      apiKey: string;
      integritySignature: string;
      description?: string;
      redirectionUrl?: string;
    }) => { open: () => void };
  }
}

function cargarScriptBold(): Promise<void> {
  if (window.BoldCheckout) return Promise.resolve();

  const existing = document.querySelector<HTMLScriptElement>(
    `script[src="${BOLD_SCRIPT_SRC}"]`
  );
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("No se pudo cargar Bold.")));
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = BOLD_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("No se pudo cargar Bold."));
    document.body.appendChild(script);
  });
}

export function DonationForm() {
  const montoId = useId();
  const nombreId = useId();
  const emailId = useId();

  const [monto, setMonto] = useState("");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [anonimo, setAnonimo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const montoFinal = Number(monto) || 0;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!montoFinal || montoFinal <= 0) {
      setError("Escribe un monto válido para donar.");
      return;
    }

    setError(null);
    setEnviando(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          monto: montoFinal,
          nombreDonante: anonimo ? null : nombre || null,
          emailDonante: anonimo ? null : email || null,
        }),
      });

      if (!res.ok) {
        throw new Error("No se pudo iniciar el pago. Intenta de nuevo.");
      }

      const { orderId, amount, currency, apiKey, integritySignature } = await res.json();

      await cargarScriptBold();

      if (!window.BoldCheckout) {
        throw new Error("No se pudo cargar Bold. Intenta de nuevo.");
      }

      const checkout = new window.BoldCheckout({
        orderId,
        currency,
        amount: String(amount),
        apiKey,
        integritySignature,
        description: "Donación - Colombia se levanta",
        redirectionUrl: `${window.location.origin}/`,
      });

      checkout.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar el pago.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <Label htmlFor={montoId}>Monto a donar (COP)</Label>
            <Input
              id={montoId}
              type="number"
              inputMode="numeric"
              min={1}
              placeholder="Ej: 50000"
              value={monto}
              onChange={(event) => setMonto(event.target.value)}
            />
          </div>

          <fieldset className="space-y-4" disabled={anonimo}>
            <div className="space-y-1.5">
              <Label htmlFor={nombreId}>Nombre (opcional)</Label>
              <Input
                id={nombreId}
                type="text"
                autoComplete="name"
                placeholder="Tu nombre"
                value={nombre}
                onChange={(event) => setNombre(event.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor={emailId}>Correo electrónico (opcional)</Label>
              <Input
                id={emailId}
                type="email"
                autoComplete="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
          </fieldset>

          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <Checkbox
              checked={anonimo}
              onCheckedChange={(checked) => setAnonimo(checked === true)}
            />
            Quiero donar de forma anónima
          </label>

          {error && (
            <p role="alert" className="text-sm font-medium text-destructive">
              {error}
            </p>
          )}

          <Button type="submit" size="lg" className="h-12 w-full text-base" disabled={enviando}>
            {enviando ? "Procesando..." : `Donar ${montoFinal > 0 ? formatCOP(montoFinal) : ""}`}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            El pago se procesa de forma segura a través de Bold. No almacenamos
            los datos de tu tarjeta.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
