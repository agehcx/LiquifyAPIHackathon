import { Check, Loader2, TriangleAlert } from "lucide-react";
import type { PaymentPhase } from "@/hooks/useExportPayment";

const LABELS: Record<PaymentPhase, string> = {
  idle: "",
  switching: "Switching to Base Sepolia…",
  signing: "Confirm payment in your wallet…",
  submitting: "Verifying payment…",
  downloading: "Generating report…",
  done: "Report downloaded.",
  error: "Something went wrong.",
};

export function PaymentStatus({
  phase,
  error,
}: {
  phase: PaymentPhase;
  error: string | null;
}) {
  if (phase === "idle") return null;

  const busy =
    phase === "switching" ||
    phase === "signing" ||
    phase === "submitting" ||
    phase === "downloading";

  return (
    <div className="flex items-center gap-2 text-sm">
      {busy && <Loader2 className="size-4 animate-spin text-brand" />}
      {phase === "done" && <Check className="size-4 text-success" />}
      {phase === "error" && <TriangleAlert className="size-4 text-error" />}
      <span
        className={
          phase === "error"
            ? "text-error"
            : phase === "done"
              ? "text-success"
              : "text-subtle"
        }
      >
        {phase === "error" ? (error ?? LABELS.error) : LABELS[phase]}
      </span>
    </div>
  );
}
