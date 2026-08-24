import Link from "next/link";
import { ShieldCheck, HeartHandshake, Users, Check, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TotalRecaudadoCard } from "@/components/total-recaudado-card";

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

          <TotalRecaudadoCard />
        </div>
      </section>

      {/* Pereira te necesita */}
      <section id="pereira" className="bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Pereira te necesita
          </h2>

          <div className="mt-10 grid max-w-4xl gap-6 sm:grid-cols-3">
            <img
              src="/images/pereira-1.jpeg"
              alt="Pereira tras el terremoto del 10 de agosto de 2026"
              className="w-full rounded-lg bg-muted object-cover ring-1 ring-foreground/10"
            />
            <img
              src="/images/pereira-2.jpeg"
              alt="Pereira tras el terremoto del 10 de agosto de 2026"
              className="w-full rounded-lg bg-muted object-cover ring-1 ring-foreground/10"
            />
            <img
              src="/images/pereira-3.jpeg"
              alt="Pereira tras el terremoto del 10 de agosto de 2026"
              className="w-full rounded-lg bg-muted object-cover ring-1 ring-foreground/10"
            />
          </div>
        </div>
      </section>

      {/* Links para ayudar */}
      <section id="links-ayudar" className="bg-background">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Links para ayudar
          </h2>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="h-12 px-6 text-base"
              nativeButton={false}
              render={
                <a
                  href="https://colombiatebusca.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              Colombia te busca
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-6 text-base"
              nativeButton={false}
              render={
                <a
                  href="https://vaki.co/vaki/sismocolombia"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              Vaki
            </Button>
          </div>
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
                  className="aspect-video w-full rounded-lg bg-muted object-cover ring-1 ring-foreground/10"
                >
                  Tu navegador no soporta la reproducción de este video.
                </video>
              ) : (
                <img
                  key={item.src}
                  src={item.src}
                  alt="Registro de la zona afectada por el terremoto"
                  className="aspect-video w-full rounded-lg bg-muted object-cover ring-1 ring-foreground/10"
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

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 text-foreground">
                  <Users className="size-5" aria-hidden="true" />
                  <CardTitle>¿Quién organiza esta campaña?</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Martín Barrero López
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 text-foreground">
                  <HeartHandshake className="size-5" aria-hidden="true" />
                  <CardTitle>¿A dónde va el dinero?</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
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

            <Card className="sm:col-span-2 lg:col-span-1">
              <CardHeader>
                <div className="flex items-center gap-2 text-foreground">
                  <ShieldCheck className="size-5" aria-hidden="true" />
                  <CardTitle>Seguridad de tu donación</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Los pagos se procesan a través de Bold, una pasarela de pagos
                  certificada. No almacenamos los datos de tu tarjeta.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 rounded-xl bg-background p-6 ring-1 ring-foreground/10 sm:p-8">
            <div className="flex items-center gap-2 text-foreground">
              <CheckCircle2 className="size-5" aria-hidden="true" />
              <h3 className="font-medium">Nuestro compromiso de transparencia</h3>
            </div>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {[
                "El total recaudado se actualiza automáticamente con cada donación aprobada.",
                "Respondemos dudas sobre la campaña en colombiaselevanta2026@gmail.com.",
                "Al finalizar la respuesta a la emergencia, publicaremos un resumen de cómo se usaron los fondos.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Check className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
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
