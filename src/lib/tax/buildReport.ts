import type { ClassifiedEvent, IncomeRow, TaxReport } from "@/types/domain";
import type { CostBasisMethod, Protocol } from "@/types/enums";
import type { LiquifyClient } from "@/lib/liquify/LiquifyClient";
import type { PriceOracle } from "@/lib/pricing/PriceOracle";
import { normalizeAddress } from "@/lib/report/reportKey";
import { aggregate } from "./aggregate";
import { classifyEvent } from "./classify";
import { computeFifo } from "./fifo";
import { computeHifo } from "./hifo";
import { computeSpecificId, type LotSelection } from "./specificId";

export interface ReportDeps {
  readonly liquify: LiquifyClient;
  readonly oracle: PriceOracle;
  /** Override the generation timestamp (unix seconds) — for deterministic tests. */
  readonly now?: number;
}

const PROTOCOL_LABELS: Record<Protocol, string> = {
  UNISWAP_V2: "Uniswap V2",
  UNISWAP_V3: "Uniswap V3",
  STAKING: "Staking",
  AIRDROP: "Airdrop",
  AAVE: "Aave",
  COMPOUND: "Compound",
};

function toIncomeRow(ev: ClassifiedEvent): IncomeRow | null {
  if (ev.incomeUsd === undefined || !ev.acquisition || ev.acquisition.length === 0) return null;
  // Income events are expected to have only one acquisition
  const acquisition = ev.acquisition[0];
  return {
    eventId: ev.source.id,
    tokenAddress: acquisition.amount.tokenAddress,
    symbol: acquisition.amount.symbol,
    decimals: acquisition.amount.decimals,
    receivedAt: ev.timestamp,
    kind: ev.kind,
    amountUsd: ev.incomeUsd,
  };
}

/**
 * End-to-end pipeline: fetch decoded events → classify → FIFO → aggregate into
 * a TaxReport for the given tax year. ALL history is fetched (not just the tax
 * year) because prior-year acquisitions supply cost basis for the year's
 * disposals; the tax-year filter is applied only at aggregation.
 */
export async function buildReport(
  address: string,
  taxYear: number,
  deps: ReportDeps,
  chainId: number = 1,
  costBasisMethod: CostBasisMethod = "FIFO",
  lotSelections?: LotSelection,
): Promise<TaxReport> {
  const wallet = normalizeAddress(address);
  const events = await deps.liquify.getDecodedEvents(wallet, chainId);

  const sorted = [...events].sort((a, b) =>
    a.timestamp !== b.timestamp
      ? a.timestamp - b.timestamp
      : a.logIndex - b.logIndex,
  );

  const classified: ClassifiedEvent[] = [];
  for (const event of sorted) {
    classified.push(await classifyEvent(event, deps.oracle));
  }

  const { disposals, openLots } =
    costBasisMethod === "HIFO"
      ? computeHifo(classified)
      : costBasisMethod === "SPECIFIC_ID" && lotSelections
      ? computeSpecificId(classified, lotSelections)
      : computeFifo(classified);
      
  const allIncomeRows = classified
    .map(toIncomeRow)
    .filter((r): r is IncomeRow => r !== null);

  const { summary, gainLossRows, incomeRows } = aggregate(
    disposals,
    allIncomeRows,
    taxYear,
  );

  const protocolsDetected = [
    ...new Set(sorted.map((e) => PROTOCOL_LABELS[e.protocol] ?? e.protocol)),
  ];

  return {
    address: wallet,
    taxYear,
    generatedAt: deps.now ?? Math.floor(Date.now() / 1000),
    summary: { ...summary, costBasisMethod },
    gainLossRows,
    incomeRows,
    openLots,
    protocolsDetected,
  };
}
