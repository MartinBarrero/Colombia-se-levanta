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

export function DonationForm() {
  const montoId = useId();
  const nombreId = useId();
  const emailId = useId();

  const [monto, setMonto] = useState("");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [anonimo, setAnonimo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const montoFinal = Number(monto) || 0;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!montoFinal || montoFinal <= 0) {
      setError("Escribe un monto válido para donar.");
      return;
    }
    setError(null);

    // TODO: reemplazar por la llamada real a /api/checkout (Bold + Supabase).
    console.log("Donación (aún no conectada a Bold/Supabase):", {
      monto: montoFinal,
      moneda: "COP",
      nombreDonante: anonimo ? null : nombre || null,
      emailDonante: anonimo ? null : email || null,
      anonimo,
    });
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

          <Button type="submit" size="lg" className="h-12 w-full text-base">
            Donar {montoFinal > 0 ? formatCOP(montoFinal) : ""}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            El pago se procesa de forma segura a través de Bold. Aún no está
            conectado: por ahora este formulario solo registra la donación en
            la consola.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
