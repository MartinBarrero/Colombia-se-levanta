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

export function ProgressBar({
  totalRecaudado,
  meta,
  numDonaciones,
}: ProgressBarProps) {
  const porcentaje = meta > 0 ? Math.min((totalRecaudado / meta) * 100, 100) : 0;

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
