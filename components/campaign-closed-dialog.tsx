"use client";

import type { ReactElement } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const EMAIL_CONTACTO = "colombiaselevanta2026@gmail.com";

export function CampaignClosedDialog({ trigger }: { trigger: ReactElement }) {
  return (
    <Dialog>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gracias por tu intención</DialogTitle>
          <DialogDescription>
            En este momento ya se ha cerrado la campaña. Si estás interesado
            en hacer alguna donación, puedes comunicarte directamente a{" "}
            <a href={`mailto:${EMAIL_CONTACTO}`}>{EMAIL_CONTACTO}</a>.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
