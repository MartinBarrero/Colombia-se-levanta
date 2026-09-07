import { Card, CardContent } from "@/components/ui/card";
import { ProgressBar } from "@/components/progress-bar";

// Campaña cerrada: el monto final incluye 500.000 COP donados directamente
// al organizador por fuera de la plataforma, que nunca pasaron por Bold/Supabase.
const TOTAL_RECAUDADO_FINAL = 2_573_800;
const NUM_DONACIONES_FINAL = 38;

export function TotalRecaudadoCard() {
  return (
    <Card className="ring-foreground/10">
      <CardContent className="space-y-4">
        <p className="text-sm font-medium text-muted-foreground">Total recaudado</p>
        <ProgressBar
          totalRecaudado={TOTAL_RECAUDADO_FINAL}
          numDonaciones={NUM_DONACIONES_FINAL}
        />
      </CardContent>
    </Card>
  );
}
