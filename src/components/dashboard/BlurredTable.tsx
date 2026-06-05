import { Lock } from "lucide-react";
import { Card } from "@/components/primitives/Card";
import type { FreeSummaryResponse } from "@/types/api";

/**
 * Teaser of the per-transaction detail. Real symbols + terms come from the
 * free summary's sampleRows; all USD figures are withheld server-side, so the
 * monetary columns are rendered as locked placeholders.
 */
export function BlurredTable({ summary }: { summary: FreeSummaryResponse }) {
  const rows = summary.sampleRows;
  const hidden = Math.max(0, summary.previewRowCount - rows.length);

  return (
    <Card className="relative overflow-hidden p-0">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-line text-[11px] uppercase tracking-[0.08em] text-muted">
            <th className="px-5 py-3 font-semibold">Asset</th>
            <th className="px-5 py-3 font-semibold">Term</th>
            <th className="px-5 py-3 text-right font-semibold">Proceeds</th>
            <th className="px-5 py-3 text-right font-semibold">Gain / Loss</th>
          </tr>
        </thead>
        <tbody className="font-mono">
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-line/60">
              <td className="px-5 py-3 text-ink">{r.symbol}</td>
              <td className="px-5 py-3 text-subtle">
                {r.holdingPeriod === "LONG_TERM" ? "Long-term" : "Short-term"}
              </td>
              <td className="px-5 py-3 text-right">
                <span className="select-none blur-sm">$0,000.00</span>
              </td>
              <td className="px-5 py-3 text-right">
                <span className="select-none blur-sm">$0,000.00</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {hidden > 0 && (
        <div className="flex items-center justify-center gap-2 border-t border-line bg-elevated/60 px-5 py-3 text-sm text-muted">
          <Lock className="size-3.5" />
          <span className="font-mono">
            + {hidden} more row{hidden === 1 ? "" : "s"} — unlock with export
          </span>
        </div>
      )}
    </Card>
  );
}
