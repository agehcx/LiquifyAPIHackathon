import { Lock } from "lucide-react";
import type { FreeSummaryResponse } from "@/types/api";

export function BlurredTable({ summary }: { summary: FreeSummaryResponse }) {
  const rows = summary.sampleRows;
  const hidden = Math.max(0, summary.previewRowCount - rows.length);

  return (
    <div className="overflow-hidden rounded-[10px] border border-line bg-surface">
      <div className="border-b border-line px-5 py-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
          Transaction Preview
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-elevated/60 text-[11px] uppercase tracking-[0.08em] text-muted">
              <th className="px-5 py-3 font-semibold">Asset</th>
              <th className="px-5 py-3 font-semibold">Type</th>
              <th className="px-5 py-3 font-semibold">Term</th>
              <th className="px-5 py-3 text-right font-semibold">Proceeds</th>
              <th className="px-5 py-3 text-right font-semibold">Cost Basis</th>
              <th className="px-5 py-3 text-right font-semibold">Gain / Loss</th>
            </tr>
          </thead>
          <tbody className="font-mono divide-y divide-line/50">
            {rows.map((r, i) => (
              <tr key={i} className="transition-colors hover:bg-elevated/40">
                <td className="px-5 py-3.5 font-medium text-ink">{r.symbol}</td>
                <td className="px-5 py-3.5 text-subtle">
                  {r.holdingPeriod ? "Capital Gain" : "Income"}
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={
                      r.holdingPeriod === "LONG_TERM"
                        ? "rounded-full bg-brand-muted px-2 py-0.5 text-[10px] font-semibold text-brand"
                        : "rounded-full bg-elevated px-2 py-0.5 text-[10px] font-semibold text-subtle"
                    }
                  >
                    {r.holdingPeriod === "LONG_TERM" ? "Long-term" : "Short-term"}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <span className="select-none blur-sm">$0,000.00</span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <span className="select-none blur-sm">$0,000.00</span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <span className="select-none blur-sm">$0,000.00</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hidden > 0 && (
        <div className="flex items-center justify-center gap-2 border-t border-line bg-elevated/40 px-5 py-3.5 text-sm text-muted">
          <Lock className="size-3.5" />
          <span className="font-mono text-[12px]">
            +{hidden} more row{hidden === 1 ? "" : "s"} — export to unlock
          </span>
        </div>
      )}
    </div>
  );
}
