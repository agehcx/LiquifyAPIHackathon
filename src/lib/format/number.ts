import Decimal from "decimal.js";

/** Format a unix-seconds timestamp as a UTC date (YYYY-MM-DD), or "—" if 0. */
export function formatDateUtc(timestamp: number): string {
  if (!timestamp) return "—";
  return new Date(timestamp * 1000).toISOString().slice(0, 10);
}

/** Convert a base-unit quantity to a human whole-token decimal string. */
export function formatTokenQty(raw: string, decimals: number): string {
  return new Decimal(raw)
    .dividedBy(new Decimal(10).pow(decimals))
    .toSignificantDigits(10)
    .toString();
}

/** Format a USD decimal string with a leading sign for negatives, 2dp. */
export function formatUsd(value: string): string {
  return new Decimal(value).toFixed(2, Decimal.ROUND_HALF_UP);
}
