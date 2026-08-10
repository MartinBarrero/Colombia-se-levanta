import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { DonationForm } from "@/components/donation-form";

export default function DonarPage() {
  return (
    <main className="flex-1 bg-muted/40">
      <div className="mx-auto max-w-lg px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Volver
        </Link>

        <div className="mb-8 space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Haz tu donación
          </h1>
          <p className="text-muted-foreground">
            Cada aporte ayuda a la respuesta de emergencia por el terremoto del
            10 de agosto de 2026.
          </p>
        </div>

        <DonationForm />
      </div>
    </main>
  );
}
