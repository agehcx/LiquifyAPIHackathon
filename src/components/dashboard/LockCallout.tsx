"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { Card } from "@/components/primitives/Card";

export function LockCallout({ onExport }: { onExport: () => void }) {
  return (
    <Card className="flex flex-col items-center gap-4 bg-brand-muted text-center sm:flex-row sm:justify-between sm:text-left">
      <div className="flex flex-col gap-1">
        <p className="text-[22px] font-semibold tracking-tight text-ink">
          Unlock your full tax report
        </p>
        <p className="text-sm text-subtle">
          Exact gain/loss per transaction, income breakdown, and an
          accountant-ready CSV (IRS Form 8949).
        </p>
      </div>
      <Button onClick={onExport} className="h-12 shrink-0 px-6">
        <Download className="size-4" />
        Export — $2 USDC
      </Button>
    </Card>
  );
}
