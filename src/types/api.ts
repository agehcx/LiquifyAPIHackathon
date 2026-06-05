import type { Address, GainLossRow, PnLSummary } from "./domain";

/**
 * Free-tier response. Deliberately withholds per-row USD figures so the
 * paywall cannot be bypassed by reading the network response — only headline
 * summary figures, counts, and a non-sensitive teaser ship over the wire.
 */
export interface FreeSummaryResponse {
  readonly address: Address;
  readonly taxYear: number;
  readonly summary: PnLSummary;
  readonly previewRowCount: number;
  readonly sampleRows: ReadonlyArray<
    Pick<GainLossRow, "symbol" | "holdingPeriod">
  >;
  readonly protocolsDetected: readonly string[];
  readonly locked: true;
}

/** Request body / query for both the summary and export endpoints. */
export interface ReportRequest {
  readonly address: Address;
  readonly taxYear: number;
}

/** Standard error envelope returned by API routes on failure. */
export interface ApiError {
  readonly error: string;
  readonly code: string;
}
