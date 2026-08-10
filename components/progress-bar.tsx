import {
  Progress,
  ProgressTrack,
  ProgressIndicator,
} from "@/components/ui/progress";

const formatCOP = (value: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);

interface ProgressBarProps {
  totalRecaudado: number;
  meta: number;
  numDonaciones: number;
}

// Ancho visual máximo al llegar exactamente a la meta. No usamos 100: la meta
// es una referencia, no un tope real de recaudación (se sigue recibiendo
// después), así que dejamos un margen que se va llenando cada vez más lento.
const CAP_LINEAL = 96;

function calcularPorcentaje(totalRecaudado: number, meta: number): number {
  if (meta <= 0) return 0;
  if (totalRecaudado <= meta) {
    return (totalRecaudado / meta) * CAP_LINEAL;
  }
  // Más allá de la meta: se acerca asintóticamente a 100% sin llegar nunca,
  // para no dar la impresión de que la recaudación "terminó".
  return CAP_LINEAL + (100 - CAP_LINEAL) * (1 - meta / totalRecaudado);
}

export function ProgressBar({
  totalRecaudado,
  meta,
  numDonaciones,
}: ProgressBarProps) {
  const porcentaje = calcularPorcentaje(totalRecaudado, meta);

  return (
    <div className="w-full space-y-2">
      <div>
        <span className="text-2xl font-semibold tabular-nums text-foreground">
          {formatCOP(totalRecaudado)}
        </span>
      </div>
      <Progress
        value={porcentaje}
        locale="es-CO"
        aria-label="Progreso de la recaudación"
      >
        <ProgressTrack className="h-2.5">
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>
      <p className="text-sm text-muted-foreground">
        {numDonaciones === 0
          ? "Sé la primera persona en donar"
          : `${numDonaciones} ${numDonaciones === 1 ? "donación" : "donaciones"} hasta ahora`}
      </p>
    </div>
  );
}
