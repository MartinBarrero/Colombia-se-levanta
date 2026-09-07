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
  numDonaciones: number;
}

// Campaña cerrada: la barra siempre se muestra llena y en verde como estado
// final, ya no representa progreso hacia una meta en curso.
export function ProgressBar({ totalRecaudado, numDonaciones }: ProgressBarProps) {
  return (
    <div className="w-full space-y-2">
      <div>
        <span className="text-2xl font-semibold tabular-nums text-foreground">
          {formatCOP(totalRecaudado)}
        </span>
      </div>
      <Progress
        value={100}
        locale="es-CO"
        aria-label="Progreso de la recaudación"
      >
        <ProgressTrack className="h-2.5">
          <ProgressIndicator className="bg-emerald-600 dark:bg-emerald-500" />
        </ProgressTrack>
      </Progress>
      <p className="text-sm text-muted-foreground">
        {`${numDonaciones} ${numDonaciones === 1 ? "donación" : "donaciones"} hasta ahora`}
      </p>
    </div>
  );
}
