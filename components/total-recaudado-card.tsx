"use client";

import { useEffect, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { ProgressBar } from "@/components/progress-bar";

const META_RECAUDACION = 4_000_000;

interface Stats {
  total: number;
  numDonaciones: number;
  disponible: boolean;
}

export function TotalRecaudadoCard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/stats", { cache: "no-store" })
      .then((res) => res.json())
      .then((data: Stats) => {
        if (!cancelled) setStats(data);
      })
      .catch(() => {
        if (!cancelled) setStats({ total: 0, numDonaciones: 0, disponible: false });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Card className="ring-foreground/10">
      <CardContent className="space-y-4">
        <p className="text-sm font-medium text-muted-foreground">Total recaudado</p>
        {stats === null ? (
          <div className="space-y-2" role="status" aria-label="Cargando total recaudado">
            <div className="h-8 w-40 animate-pulse rounded bg-muted" />
            <div className="h-2.5 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-32 animate-pulse rounded bg-muted" />
          </div>
        ) : (
          <>
            <ProgressBar
              totalRecaudado={stats.total}
              meta={META_RECAUDACION}
              numDonaciones={stats.numDonaciones}
            />
            {!stats.disponible && (
              <p className="text-xs text-muted-foreground">
                No pudimos cargar el total actualizado en este momento.
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
