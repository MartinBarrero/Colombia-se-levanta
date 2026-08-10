-- Bloquea todo acceso directo del cliente a `donaciones`. Sin policies de
-- select/insert/update para anon/authenticated: la única vía de lectura o
-- escritura es a través de Route Handlers usando SUPABASE_SECRET_KEY,
-- que bypasea RLS por diseño de Supabase.
alter table public.donaciones enable row level security;

-- Vista agregada para la barra de progreso pública. Solo expone sum/count de
-- donaciones aprobadas, nunca filas individuales (sin nombre, email, order_id, etc).
create or replace view public.total_recaudado as
select
  coalesce(sum(monto), 0) as total,
  count(*) as num_donaciones
from public.donaciones
where estado = 'approved';

-- Las vistas en Postgres corren con los privilegios de su dueño (quien aplica
-- esta migración, normalmente el rol `postgres` con bypassrls), no con los del
-- rol que consulta. Por eso esta vista puede leer `donaciones` aunque la tabla
-- tenga RLS habilitado sin policies: es intencional, porque la vista solo
-- expone el agregado, nunca datos de donantes individuales. Se otorga SELECT
-- público sobre la vista (no sobre la tabla) para exponer el total recaudado.
grant select on public.total_recaudado to anon, authenticated;
