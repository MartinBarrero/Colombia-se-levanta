Antes de dar luz verde a un deploy a producción, verifica lo siguiente en orden y
reporta el resultado de cada punto (no asumas, corre los comandos):

1. `npm run build` — debe terminar sin errores de tipos ni de build.
2. Confirma que no hay ninguna llave secreta (`BOLD_SECRET_KEY`,
   `SUPABASE_SECRET_KEY`) referenciada en ningún archivo
   que se ejecute en el cliente (busca imports de esos nombres fuera de
   `app/api/**` y `lib/supabase/server.ts` / `lib/bold.ts` si son server-only).
3. Confirma que `.env.local` está en `.gitignore` y que no fue commiteado nunca
   (`git log --all --full-history -- .env.local`).
4. Revisa que `/api/webhooks/bold/route.ts` valide la firma del evento antes de
   confiar en el payload, y que sea idempotente (no procese dos veces el mismo
   `order_id` si Bold reenvía el evento).
5. Revisa que el endpoint de checkout maneje el caso en que Supabase no responda
   (timeout / error) sin romper la experiencia del usuario — mostrar error claro,
   no pantalla en blanco.
6. Confirma que las variables de entorno necesarias están listadas en el `CLAUDE.md`
   y coinciden con las configuradas en el proyecto de Vercel (pídele al usuario que
   confirme esto último si no tienes acceso al dashboard de Vercel).
7. Prueba visual rápida en mobile viewport del formulario de donación y del hero
   con la barra de progreso.

Si todo pasa, resume en 3-4 líneas qué se verificó. Si algo falla, no lo arregles
en silencio: explica el problema y pregunta cómo proceder si implica tocar el flujo
de pagos.