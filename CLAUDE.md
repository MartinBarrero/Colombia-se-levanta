# Colombia Se Levanta — CLAUDE.md

## Qué es esto
Sitio web de recaudación de fondos para la emergencia del terremoto del 10/08/2026
(epicentro Chocó, magnitud 7.4, afectación fuerte en Cali, Pereira, Manizales y zona
cafetera). El sitio permite a personas donar dinero para apoyar la respuesta.

**Prioridad #1: que funcione y no se caiga.** Esto no es un proyecto para lucirse con
arquitectura compleja. Es simple, robusto, rápido de lanzar y confiable. Ante la duda
entre "elegante" y "simple y que no falla", siempre elige lo segundo.

**Prioridad #2: que se vea confiable.** La gente va a decidir donar en segundos.
Diseño limpio, transparencia sobre quién está detrás, a dónde va la plata, y sin
fricción en el flujo de donación.

## Stack (decisiones ya tomadas, no las cambies sin preguntar)
- **Framework**: Next.js 14+ (App Router), TypeScript
- **Estilos**: Tailwind CSS + shadcn/ui (componentes accesibles, sin reinventar UI)
- **Base de datos**: Supabase (Postgres + client JS)
- **Pasarela de pagos**: Bold (Botón de pagos, integración manual con `integrity signature`)
- **Deploy**: Vercel
- **Gestor de paquetes**: npm

## Arquitectura del flujo de donación
1. Usuario elige un monto (o monto libre) en el formulario de donación.
2. El **cliente** llama a un endpoint propio `/api/checkout` (server) enviando el monto.
3. El **server** genera `orderId` único + calcula el `integritySignature` (hash) usando
   la llave secreta de Bold — **esto nunca se hace en el cliente**.
4. El server crea/actualiza un registro `donaciones` en Supabase con estado `pending`.
5. El cliente recibe `orderId`, `amount`, `apiKey` (pública) e `integritySignature`, y
   abre el checkout de Bold (`BoldCheckout` o script embebido).
6. Bold procesa el pago y notifica por **webhook** a `/api/webhooks/bold`.
7. El webhook valida la firma del evento, actualiza el registro en Supabase a
   `approved` / `rejected` / `failed`, y es **idempotente** (si Bold reintenta el
   mismo evento, no debe duplicar ni romper nada).
8. El frontend consulta el total recaudado (para la barra de progreso) desde una
   vista/RPC de Supabase que solo suma donaciones `approved`. Nunca desde el cliente
   directo a la tabla cruda sin RLS.

**Regla de oro de seguridad**: la llave secreta de Bold (`BOLD_SECRET_KEY`) y el
`SUPABASE_SECRET_KEY` **jamás** se usan ni exponen en código de cliente
(`"use client"`, archivos en `app/**/page.tsx` que corran en browser, etc.). Solo en
Route Handlers / Server Actions.

## Variables de entorno (definir en Vercel y en `.env.local`)
Usamos el sistema nuevo de API keys de Supabase (publishable/secret), no el legacy
anon/service_role.
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=              # server-only
NEXT_PUBLIC_BOLD_IDENTITY_KEY=    # llave de identidad, pública, se usa en el botón
BOLD_SECRET_KEY=                  # server-only, firma integrity signature Y valida el
                                   # webhook (Bold no da una llave de webhook aparte)
NEXT_PUBLIC_SITE_URL=             # https://colombiaselevanta.vercel.app o dominio propio
```
Nunca commitear `.env.local`. Confirmar que `.gitignore` lo excluye.

## Esquema de Supabase (mínimo viable)
Tabla `donaciones`:
- `id` uuid pk default gen_random_uuid()
- `order_id` text unique not null
- `monto` numeric not null
- `moneda` text default 'COP'
- `nombre_donante` text nullable (opcional, puede donar anónimo)
- `email_donante` text nullable
- `estado` text not null default 'pending'  -- pending | approved | rejected | failed
- `bold_transaction_id` text nullable
- `metadata` jsonb nullable  -- guardar el payload crudo del webhook por si acaso
- `created_at` timestamptz default now()
- `updated_at` timestamptz default now()

RLS: habilitar RLS en `donaciones`. El cliente **no** debe poder leer ni escribir esta
tabla directamente. Toda lectura pública (ej. total recaudado) sale de una vista o
función `security definer` que solo expone el agregado, no filas individuales.

Vista sugerida `total_recaudado`:
```sql
create view total_recaudado as
select coalesce(sum(monto), 0) as total, count(*) as num_donaciones
from donaciones
where estado = 'approved';
```

## Estructura de carpetas esperada
```
app/
  page.tsx                     # landing con hero, barra de progreso, CTA donar
  donar/page.tsx               # formulario de donación
  api/
    checkout/route.ts          # crea orden + integrity signature (server)
    webhooks/bold/route.ts     # recibe confirmación de pago
    stats/route.ts             # expone total recaudado (cacheable)
lib/
  supabase/server.ts           # cliente Supabase server-side (secret key)
  supabase/client.ts           # cliente Supabase browser (publishable key, solo lecturas públicas)
  bold.ts                      # helpers: generar orderId, calcular integrity signature
components/
  ui/                          # shadcn
  donation-form.tsx
  progress-bar.tsx
```

## Reglas de trabajo para Claude Code en este repo
- Antes de tocar pagos o webhooks, explica el cambio en una frase antes de escribir código.
- Nunca "arreglar" un bug de pagos comentando la validación de firma o el manejo de
  errores para que "pase". Si algo no valida, se investiga por qué, no se apaga.
- Todo endpoint que toque dinero (`/api/checkout`, `/api/webhooks/bold`) debe:
  - tener try/catch y devolver códigos HTTP correctos
  - loguear errores con suficiente contexto (sin loguear llaves secretas)
  - ser idempotente donde aplique (webhooks pueden llegar duplicados)
- Preferir Server Components y Server Actions sobre client-side fetching cuando no
  haya interactividad real.
- No agregar dependencias nuevas sin justificar por qué shadcn/ui + lo ya instalado
  no alcanza.
- Mantener el diseño simple: tipografía clara, buen contraste, mobile-first (la
  mayoría va a donar desde el celular).
- Antes de cada deploy a producción, correr `npm run build` localmente y confirmar
  que no hay errores de tipos ni de build.

## Transparencia y confianza (importante para conversión y para hacer las cosas bien)
- La página debe decir claramente quién organiza la recaudación (persona, organización,
  o alianza con una entidad ya establecida) y a dónde va el dinero.
- Si no eres una entidad legalmente registrada para recaudar donaciones públicas,
  considera canalizar los fondos a través de una ONG o entidad ya establecida
  (Cruz Roja Colombiana, Bomberos, UNGRD, alcaldías) en vez de recibir directo a
  cuenta personal — esto protege tanto a los donantes como a ti. Vale la pena
  resolver esto en paralelo a lo técnico, no después.
- No prometer beneficios tributarios ni deducciones si no está confirmado.
- Mostrar el total recaudado y, si es posible, un resumen simple de en qué se usa.

## Fuera de alcance por ahora (no construir salvo que se pida)
- Panel de administración complejo (con RLS + vista de agregados alcanza para el MVP)
- Autenticación de usuarios/donantes (las donaciones pueden ser anónimas)
- Multi-moneda (arrancar solo en COP)

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
