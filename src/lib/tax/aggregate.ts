import type {
  CostBasisMethod,
  GainLossRow,
  IncomeRow,
  PnLSummary,
} from "@/types/domain";
import { inTaxYear } from "./constants";
import { addUsd } from "./money";

export interface AggregateResult {
  readonly summary: PnLSummary;
  readonly gainLossRows: GainLossRow[];
  readonly incomeRows: IncomeRow[];
}

function sum(values: string[]): string {
  return values.length ? addUsd(...values) : "0";
}

/**
 * Filters realized rows to the requested tax year (UTC) and rolls them up into
 * a PnLSummary. Capital gains are partitioned short/long-term; income is
 * summed separately as ordinary income.
 */
export function aggregate(
  allGainLossRows: readonly GainLossRow[],
  allIncomeRows: readonly IncomeRow[],
  taxYear: number,
  costBasisMethod: CostBasisMethod = "FIFO",
): AggregateResult {
  const gainLossRows = allGainLossRows.filter((r) =>
    inTaxYear(r.disposedAt, taxYear),
  );
  const incomeRows = allIncomeRows.filter((r) =>
    inTaxYear(r.receivedAt, taxYear),
  );

  const shortTermGainUsd = sum(
    gainLossRows
      .filter((r) => r.holdingPeriod === "SHORT_TERM")
      .map((r) => r.gainLossUsd),
  );
  const longTermGainUsd = sum(
    gainLossRows
      .filter((r) => r.holdingPeriod === "LONG_TERM")
      .map((r) => r.gainLossUsd),
  );
  const totalOrdinaryIncomeUsd = sum(incomeRows.map((r) => r.amountUsd));

  const summary: PnLSummary = {
    taxYear,
    costBasisMethod,
    shortTermGainUsd,
    longTermGainUsd,
    totalCapitalGainUsd: addUsd(shortTermGainUsd, longTermGainUsd),
    totalOrdinaryIncomeUsd,
    disposalCount: gainLossRows.length,
    incomeCount: incomeRows.length,
    zeroBasisCount: gainLossRows.filter((r) => r.zeroBasis).length,
  };

  return { summary, gainLossRows, incomeRows };
}
