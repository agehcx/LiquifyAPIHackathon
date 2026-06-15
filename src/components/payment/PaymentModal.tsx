"use client";

import { useEffect } from "react";
import { X, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { useExportPayment } from "@/hooks/useExportPayment";
import { PaymentStatus } from "./PaymentStatus";

export function PaymentModal({
  address,
  taxYear,
  onClose,
}: {
  address: string;
  taxYear: number;
  onClose: () => void;
}) {
  const { phase, error, exportReport, isDemo } = useExportPayment(
    address,
    taxYear,
  );

  useEffect(() => {
    if (phase === "done") {
      const t = setTimeout(onClose, 1500);
      return () => clearTimeout(t);
    }
  }, [phase, onClose]);

  const busy = phase !== "idle" && phase !== "error" && phase !== "done";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-4 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-md rounded-[20px] border border-line bg-canvas shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-line px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-[10px] bg-brand-muted">
              <FileText className="size-4 text-brand" />
            </span>
            <div>
              <h2 className="text-[16px] font-bold tracking-tight text-ink">
                Export Full Report
              </h2>
              <p className="text-[12px] text-muted">IRS Form 8949 · CSV</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={busy}
            className="mt-0.5 text-muted transition-colors hover:text-ink disabled:opacity-40"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Details */}
        <div className="px-6 py-5">
          <div className="flex flex-col gap-2.5 rounded-[10px] border border-line bg-surface p-4">
            <Row label="Amount" value="2.00 USDC" highlight />
            <div className="border-t border-line/60" />
            <Row label="Network" value="Base Sepolia" />
            <Row label="Tax year" value={String(taxYear)} />
            <Row label="Format" value="CSV (Form 8949)" />
          </div>

          {/* What you get */}
          <div className="mt-4 flex flex-col gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
              Includes
            </p>
            {[
              "Per-transaction gain/loss",
              "Short-term & long-term split",
              "Staking & airdrop income",
              "Cost basis per lot (FIFO)",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm">
                <Sparkles className="size-3 text-brand" />
                <span className="text-subtle">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-3 border-t border-line px-6 py-5">
          <PaymentStatus phase={phase} error={error} />
          <Button
            onClick={exportReport}
            disabled={busy}
            className="h-12 w-full text-base"
          >
            {isDemo ? "Download Full CSV Report" : "Confirm in Wallet — $2 USDC"}
          </Button>
          <p className="text-center font-mono text-[11px] text-muted">
            One-time payment · No account required
          </p>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-subtle">{label}</span>
      <span
        className={
          highlight
            ? "font-mono text-base font-bold text-ink"
            : "font-mono text-ink"
        }
      >
        {value}
      </span>
    </div>
  );
}
