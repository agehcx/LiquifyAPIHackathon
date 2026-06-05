import type {
  CostBasisMethod,
  EventKind,
  HoldingPeriod,
  Protocol,
  TaxTreatment,
} from "./enums";

// Re-export enums so `@/types/domain` is the single import surface for domain
// types and their supporting unions.
export type {
  CostBasisMethod,
  EventKind,
  HoldingPeriod,
  Protocol,
  TaxTreatment,
} from "./enums";

/** Lowercase 0x-prefixed hex address. */
export type Address = `0x${string}`;

/**
 * A token quantity. `raw` is the integer amount in base units (e.g. wei),
 * serialized as a decimal string so it survives JSON without float drift.
 */
export interface TokenAmount {
  readonly tokenAddress: Address;
  readonly symbol: string;
  readonly decimals: number;
  readonly raw: string; // base units, decimal string
}

/** A resolved fair-market-value USD price for one token unit at a point in time. */
export interface UsdPrice {
  readonly usd: string; // decimal string, e.g. "1843.55"
  readonly source: "MOCK" | "COINGECKO";
  readonly asOf: number; // unix seconds
}

// ── Raw, as decoded by Liquify ────────────────────────────────────────────

export interface DecodedEvent {
  readonly id: string; // stable synthetic id: `${txHash}:${logIndex}`
  readonly txHash: Address;
  readonly logIndex: number;
  readonly blockNumber: number;
  readonly timestamp: number; // unix seconds
  readonly chainId: number; // 1 for the MVP
  readonly protocol: Protocol;
  readonly eventName: string; // "Swap", "RewardPaid", "Claimed", ...
  readonly wallet: Address;
  /** Token leaving the wallet (swaps). */
  readonly sent?: TokenAmount;
  /** Token entering the wallet (swaps + income). */
  readonly received?: TokenAmount;
  /** Original decoded params, retained for audit/debug. */
  readonly raw: Record<string, unknown>;
}

// ── After classification ──────────────────────────────────────────────────

export interface ClassifiedEvent {
  readonly source: DecodedEvent;
  readonly kind: EventKind;
  readonly treatment: TaxTreatment;
  readonly timestamp: number;
  /** Disposal side (capital gain): the asset given up + its USD proceeds. */
  readonly disposal?: { amount: TokenAmount; proceedsUsd: string };
  /** Acquisition side: the asset received becomes a new cost-basis lot. */
  readonly acquisition?: { amount: TokenAmount; costBasisUsd: string };
  /** Ordinary income recognized (FMV of received asset), when applicable. */
  readonly incomeUsd?: string;
}

// ── Cost-basis lot (FIFO queue element) ─────────────────────────────────────

export interface TaxLot {
  readonly id: string;
  readonly tokenAddress: Address;
  readonly symbol: string;
  readonly acquiredAt: number; // unix seconds
  readonly originEventId: string;
  /** Remaining un-disposed quantity in base units (decimal string). */
  readonly quantityRaw: string;
  /** Original acquired quantity in base units (decimal string). */
  readonly originalQuantityRaw: string;
  /** USD cost basis per base unit (decimal string). */
  readonly costBasisUsdPerUnit: string;
}

// ── Realized results ────────────────────────────────────────────────────────

/** One realized disposal slice — maps to an IRS Form 8949 row. */
export interface GainLossRow {
  readonly eventId: string;
  readonly tokenAddress: Address;
  readonly symbol: string;
  readonly decimals: number;
  readonly quantityRaw: string;
  readonly acquiredAt: number; // 0 when basis is unknown (zero-basis fallback)
  readonly disposedAt: number;
  readonly proceedsUsd: string;
  readonly costBasisUsd: string;
  readonly gainLossUsd: string; // proceeds - basis
  readonly holdingPeriod: HoldingPeriod;
  /** True when no acquisition lot was on record (basis assumed 0). */
  readonly zeroBasis: boolean;
}

export interface IncomeRow {
  readonly eventId: string;
  readonly tokenAddress: Address;
  readonly symbol: string;
  readonly decimals: number;
  readonly receivedAt: number;
  readonly kind: EventKind;
  readonly amountUsd: string;
}

export interface PnLSummary {
  readonly taxYear: number;
  readonly costBasisMethod: CostBasisMethod;
  readonly shortTermGainUsd: string;
  readonly longTermGainUsd: string;
  readonly totalCapitalGainUsd: string;
  readonly totalOrdinaryIncomeUsd: string;
  readonly disposalCount: number;
  readonly incomeCount: number;
  /** Count of disposals with no recorded basis (needs user attention). */
  readonly zeroBasisCount: number;
}

export interface TaxReport {
  readonly address: Address;
  readonly taxYear: number;
  readonly generatedAt: number;
  readonly summary: PnLSummary;
  readonly gainLossRows: readonly GainLossRow[];
  readonly incomeRows: readonly IncomeRow[];
  readonly openLots: readonly TaxLot[];
  /** Human-readable protocols detected across the wallet's history. */
  readonly protocolsDetected: readonly string[];
}
