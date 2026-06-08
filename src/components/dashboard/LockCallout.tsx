"use client";

import type { ReactNode } from "react";
import { Download, Lock } from "lucide-react";
import { Button } from "@/components/primitives/Button";

export function LockCallout({ onExport }: { onExport: () => void }) {
  return (
    <div className="relative overflow-hidden rounded-[12px] border border-brand/30 bg-gradient-to-br from-brand-muted to-canvas p-6">
      {/* Decorative glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)" }}
      />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Lock className="size-4 text-brand" />
            <p className="text-[18px] font-bold tracking-tight text-ink">
              Unlock your full tax report
            </p>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-subtle">
            Exact gain/loss per transaction · Income breakdown · Accountant-ready
            CSV (IRS Form 8949)
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Chip>FIFO cost basis</Chip>
            <Chip>Short &amp; long-term split</Chip>
            <Chip>Zero-basis flagged</Chip>
          </div>
        </div>

        <div className="flex flex-col items-start gap-1 sm:items-end">
          <Button onClick={onExport} className="h-12 gap-2.5 px-7 text-base">
            <Download className="size-4" />
            Export CSV
          </Button>
          <span className="pl-1 font-mono text-[11px] text-muted">
            one-time · $2 USDC · Base Sepolia
          </span>
        </div>
      </div>
    </div>
  );
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full bg-brand-muted px-2.5 py-0.5 text-[11px] font-medium text-brand">
      {children}
    </span>
  );
}
