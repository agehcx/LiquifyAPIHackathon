import { FlaskConical } from "lucide-react";

/** Visible indicator that the x402 payment gate is bypassed (offline demo). */
export function DemoModeBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-warning/40 bg-[rgba(245,158,11,0.15)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-warning">
      <FlaskConical className="size-3" />
      Demo — payment bypassed
    </span>
  );
}
