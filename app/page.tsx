import Link from "next/link";
import { ShieldCheck, HeartHandshake, MapPin, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProgressBar } from "@/components/progress-bar";

// TODO: reemplazar por datos reales desde la vista `total_recaudado` de Supabase.
const TOTAL_RECAUDADO = 0;
const META_RECAUDACION = 500_000_000;
const NUM_DONACIONES = 0;

export default function Home() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-center md:py-24 lg:px-8">
          <div className="space-y-6">
            <Badge className="bg-urgent text-urgent-foreground">
              Emergencia activa · Terremoto del 10 de agosto de 2026
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Colombia se levanta
            </h1>
            <p className="text-lg leading-relaxed text-muted-foreground">
              El 10 de agosto de 2026 un terremoto de magnitud 7.4, con epicentro
              en Chocó, afectó con fuerza a Cali, Pereira, Manizales y la zona
              cafetera. Miles de familias necesitan apoyo inmediato para
              alimentación, alojamiento temporal y atención médica. Tu donación,
              sin importar el monto, ayuda a la respuesta de emergencia.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="h-12 px-6 text-base"
                nativeButton={false}
                render={<Link href="/donar" />}
              >
                Donar ahora
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-6 text-base"
                nativeButton={false}
                render={<Link href="#transparencia" />}
              >
                Ver a dónde va tu dinero
              </Button>
            </div>
          </div>

          <Card className="ring-foreground/10">
            <CardContent className="space-y-4">
              <p className="text-sm font-medium text-muted-foreground">
                Total recaudado
              </p>
              <ProgressBar
                totalRecaudado={TOTAL_RECAUDADO}
                meta={META_RECAUDACION}
                numDonaciones={NUM_DONACIONES}
              />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Videos */}
      <section id="videos" className="bg-background">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Así está la situación
            </h2>
            <p className="text-muted-foreground">
              Registros desde las zonas afectadas por el terremoto del 10 de
              agosto de 2026.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              { type: "video", src: "/videos/testimonio-1.mp4" },
              { type: "video", src: "/videos/testimonio-2.mp4" },
              { type: "video", src: "/videos/testimonio-3.mp4" },
              { type: "video", src: "/videos/testimonio-4.mp4" },
              { type: "video", src: "/videos/testimonio-5.mp4" },
              { type: "image", src: "/images/foto-1.jpg" },
              { type: "image", src: "/images/foto-2.jpg" },
            ].map((item) =>
              item.type === "video" ? (
                <video
                  key={item.src}
                  src={item.src}
                  controls
                  preload="metadata"
                  playsInline
                  className="w-full rounded-lg bg-muted ring-1 ring-foreground/10"
                >
                  Tu navegador no soporta la reproducción de este video.
                </video>
              ) : (
                <img
                  key={item.src}
                  src={item.src}
                  alt="Registro de la zona afectada por el terremoto"
                  className="w-full rounded-lg bg-muted object-cover ring-1 ring-foreground/10"
                />
              )
            )}
          </div>
        </div>
      </section>

      {/* Transparencia */}
      <section id="transparencia" className="bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Transparencia
            </h2>
            <p className="text-muted-foreground">
              Sabemos que decides donar en segundos. Por eso queremos ser claros
              sobre quién está detrás de esta campaña y a dónde va tu dinero.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <Card>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-foreground">
                  <Users className="size-5" aria-hidden="true" />
                  <h3 className="font-medium">¿Quién organiza esta campaña?</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Martín Barrero López
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-foreground">
                  <HeartHandshake className="size-5" aria-hidden="true" />
                  <h3 className="font-medium">¿A dónde va el dinero?</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  El dinero recaudado será puesto a disposición de las
                  organizaciones que lo requieran para la respuesta a la
                  emergencia: la Cruz Roja, iglesias, grupos de rescatistas y
                  comunidades que se unan a este proyecto. Además, también
                  será entregado directamente a las familias que lo
                  requieran, ya sea en efectivo o en especie: comida,
                  prendas de vestir, entre otros.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-foreground">
                  <MapPin className="size-5" aria-hidden="true" />
                  <h3 className="font-medium">Zonas afectadas</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Chocó (epicentro), Cali, Pereira, Manizales y municipios de la
                  zona cafetera. [Placeholder: actualizar con el detalle real de
                  cobertura de la respuesta.]
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-foreground">
                  <ShieldCheck className="size-5" aria-hidden="true" />
                  <h3 className="font-medium">Seguridad de tu donación</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Los pagos se procesan a través de Bold, una pasarela de pagos
                  certificada. No almacenamos los datos de tu tarjeta.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Gracias por tu aporte
          </h2>
          <p className="mt-3 text-primary-foreground/80">
            Colombia se levanta
          </p>

          <Separator className="mx-auto my-8 max-w-xs bg-primary-foreground/20" />

          <p className="text-sm font-medium tracking-wide text-primary-foreground/70 uppercase">
            Contacto
          </p>
          <a
            href="mailto:colombiaselevanta2026@gmail.com"
            className="mt-1 inline-block text-lg underline underline-offset-4 hover:text-primary-foreground/80"
          >
            colombiaselevanta2026@gmail.com
          </a>
        </div>
      </footer>
    </main>
  );
}
