-- Tabla principal de donaciones. Ver CLAUDE.md > "Esquema de Supabase (mínimo viable)".
create table if not exists public.donaciones (
  id uuid primary key default gen_random_uuid(),
  order_id text not null unique,
  monto numeric not null,
  moneda text not null default 'COP',
  nombre_donante text,
  email_donante text,
  estado text not null default 'pending',
  bold_transaction_id text,
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint donaciones_estado_check check (estado in ('pending', 'approved', 'rejected', 'failed')),
  constraint donaciones_monto_check check (monto > 0)
);

create index if not exists donaciones_estado_idx on public.donaciones (estado);
create index if not exists donaciones_created_at_idx on public.donaciones (created_at desc);

-- Mantiene updated_at correcto automáticamente en cada UPDATE (ej. cuando el
-- webhook de Bold pasa una donación de pending -> approved/rejected/failed),
-- sin depender de que cada caller lo setee a mano.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists donaciones_set_updated_at on public.donaciones;
create trigger donaciones_set_updated_at
before update on public.donaciones
for each row
execute function public.set_updated_at();
