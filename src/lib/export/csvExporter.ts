import type { TaxReport } from "@/types/domain";
import { formatDateUtc, formatTokenQty, formatUsd } from "@/lib/format/number";

/** Escape a CSV field per RFC 4180 (quote if it contains , " or newline). */
function csvField(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function row(fields: string[]): string {
  return fields.map(csvField).join(",");
}

/**
 * Renders a TaxReport as an accountant-ready CSV string. Capital gains follow
 * IRS Form 8949 column conventions; ordinary income is appended as a second
 * section; a summary block closes the file. USD is rounded to 2dp.
 */
export function toCsv(report: TaxReport): string {
  const lines: string[] = [];

  lines.push(row([`DeFi TaxGen — Tax Report ${report.taxYear}`]));
  lines.push(row([`Wallet`, report.address]));
  lines.push(row([`Cost basis method`, report.summary.costBasisMethod]));
  lines.push("");

  // ── Capital gains / losses (Form 8949 style) ──
  lines.push(row(["Capital Gains / Losses (Form 8949)"]));
  lines.push(
    row([
      "Description",
      "Quantity",
      "Date Acquired",
      "Date Sold",
      "Proceeds (USD)",
      "Cost Basis (USD)",
      "Gain/Loss (USD)",
      "Term",
      "Note",
    ]),
  );
  for (const r of report.gainLossRows) {
    lines.push(
      row([
        r.symbol,
        formatTokenQty(r.quantityRaw, r.decimals),
        formatDateUtc(r.acquiredAt),
        formatDateUtc(r.disposedAt),
        formatUsd(r.proceedsUsd),
        formatUsd(r.costBasisUsd),
        formatUsd(r.gainLossUsd),
        r.holdingPeriod === "LONG_TERM" ? "Long-term" : "Short-term",
        r.zeroBasis ? "NEEDS COST BASIS" : "",
      ]),
    );
  }
  lines.push("");

  // ── Ordinary income ──
  lines.push(row(["Ordinary Income"]));
  lines.push(
    row(["Description", "Quantity", "Date Received", "Type", "Amount (USD)"]),
  );
  for (const r of report.incomeRows) {
    lines.push(
      row([
        r.symbol,
        "", // income rows carry USD value, not a re-derived quantity
        formatDateUtc(r.receivedAt),
        r.kind === "STAKING_INCOME" ? "Staking" : "Airdrop",
        formatUsd(r.amountUsd),
      ]),
    );
  }
  lines.push("");

  // ── Summary ──
  const s = report.summary;
  lines.push(row(["Summary"]));
  lines.push(row(["Short-term capital gain (USD)", formatUsd(s.shortTermGainUsd)]));
  lines.push(row(["Long-term capital gain (USD)", formatUsd(s.longTermGainUsd)]));
  lines.push(row(["Total capital gain (USD)", formatUsd(s.totalCapitalGainUsd)]));
  lines.push(row(["Total ordinary income (USD)", formatUsd(s.totalOrdinaryIncomeUsd)]));
  lines.push(row(["Disposals", String(s.disposalCount)]));
  lines.push(row(["Income events", String(s.incomeCount)]));
  lines.push(row(["Disposals needing cost basis", String(s.zeroBasisCount)]));

  return lines.join("\n") + "\n";
}
