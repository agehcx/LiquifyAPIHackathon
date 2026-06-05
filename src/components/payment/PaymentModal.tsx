"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { useExportPayment } from "@/hooks/useExportPayment";
import { DemoModeBadge } from "./DemoModeBadge";
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

  // Auto-close shortly after a successful download.
  useEffect(() => {
    if (phase === "done") {
      const t = setTimeout(onClose, 1500);
      return () => clearTimeout(t);
    }
  }, [phase, onClose]);

  const busy = phase !== "idle" && phase !== "error" && phase !== "done";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[16px] border border-line bg-canvas p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <h2 className="text-[22px] font-semibold tracking-tight text-ink">
            Export Full Report
          </h2>
          <button
            onClick={onClose}
            disabled={busy}
            className="text-muted transition-colors hover:text-ink disabled:opacity-40"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="mt-5 flex flex-col gap-3 rounded-[10px] border border-line bg-surface p-4">
          <Row label="Amount" value="2.00 USDC" />
          <Row label="Network" value="Base Sepolia" />
          <Row label="Deliverable" value="CSV (Form 8949)" />
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {isDemo && <DemoModeBadge />}
          <PaymentStatus phase={phase} error={error} />
        </div>

        <Button
          onClick={exportReport}
          disabled={busy}
          className="mt-5 h-12 w-full"
        >
          {isDemo ? "Download CSV (demo)" : "Confirm in Wallet"}
        </Button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-subtle">{label}</span>
      <span className="font-mono text-ink">{value}</span>
    </div>
  );
}
