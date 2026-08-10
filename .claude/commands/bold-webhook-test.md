Guía para probar el webhook de Bold en `/api/webhooks/bold`:

1. Confirma que el endpoint está desplegado (o expuesto vía túnel como ngrok si es
   local) y registrado en el panel de Bold (Integraciones > Webhook).
2. Usa la opción "Probar el webhook" de Bold al finalizar una compra de prueba en el
   ambiente de pruebas (sandbox) — las notificaciones automáticas de webhook NO se
   envían en modo pruebas salvo que se use esa opción explícita.
3. Verifica en los logs de Vercel (o localmente) que el payload llegó, que la firma
   se validó correctamente, y que el registro en `donaciones` se actualizó al
   estado correspondiente (`approved` / `rejected` / `failed`).
4. Simula un reenvío del mismo evento (mismo `order_id` / transaction id) y confirma
   que NO se duplica el registro ni se rompe — debe ser un upsert idempotente.
5. Simula un payload con firma inválida y confirma que el endpoint la rechaza
   (responde 4xx) sin actualizar nada en la base de datos.

Si no existe aún el endpoint o la lógica de validación de firma, avisa antes de
escribir código nuevo y pregunta si seguimos el esquema de integrity signature del
Botón de pagos manual o el de la API de Pagos en Línea, ya que difieren.