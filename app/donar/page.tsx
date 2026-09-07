import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const EMAIL_CONTACTO = "colombiaselevanta2026@gmail.com";

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
            Gracias por tu intención
          </h1>
          <p className="text-muted-foreground">
            En este momento ya se ha cerrado la campaña.
          </p>
        </div>

        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Si estás interesado en hacer alguna donación, puedes comunicarte
              directamente a{" "}
              <a
                href={`mailto:${EMAIL_CONTACTO}`}
                className="text-foreground underline underline-offset-4"
              >
                {EMAIL_CONTACTO}
              </a>
              .
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
