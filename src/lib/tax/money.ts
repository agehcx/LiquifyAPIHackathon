import Decimal from "decimal.js";
import type { TokenAmount } from "@/types/domain";

// High working precision so intermediate ratios (pro-rata, per-base-unit basis)
// never lose accuracy; rounding to 2dp happens only at export via roundUsd.
Decimal.set({ precision: 50, toExpNeg: -40, toExpPos: 40 });

export const ZERO_USD = "0";

// ── USD arithmetic (decimal-safe; values are decimal strings) ──────────────

export function addUsd(...values: string[]): string {
  return values
    .reduce((acc, v) => acc.plus(v), new Decimal(0))
    .toString();
}

export function subUsd(a: string, b: string): string {
  return new Decimal(a).minus(b).toString();
}

export function mulUsd(a: string, b: string): string {
  return new Decimal(a).times(b).toString();
}

export function divUsd(a: string, b: string): string {
  return new Decimal(a).dividedBy(b).toString();
}

export function negUsd(a: string): string {
  return new Decimal(a).negated().toString();
}

/** Round to fixed decimal places (default 2) using half-up, always padded. */
export function roundUsd(a: string, dp = 2): string {
  return new Decimal(a).toFixed(dp, Decimal.ROUND_HALF_UP);
}

// ── Raw base-unit (non-negative integer) helpers — exact via BigInt ────────

function toBig(raw: string): bigint {
  return BigInt(raw);
}

export function minRaw(a: string, b: string): string {
  const x = toBig(a);
  const y = toBig(b);
  return (x < y ? x : y).toString();
}

export function subRaw(a: string, b: string): string {
  return (toBig(a) - toBig(b)).toString();
}

export function isZeroRaw(raw: string): boolean {
  return toBig(raw) === 0n;
}

export function gtZeroRaw(raw: string): boolean {
  return toBig(raw) > 0n;
}

// ── Tax-specific composites ────────────────────────────────────────────────

/** USD value of a token amount given a per-whole-token price. */
export function valueOfAmountUsd(
  amount: TokenAmount,
  pricePerTokenUsd: string,
): string {
  const whole = new Decimal(amount.raw).dividedBy(
    new Decimal(10).pow(amount.decimals),
  );
  return whole.times(pricePerTokenUsd).toString();
}

/** USD cost basis per base unit, from a total USD basis over a raw quantity. */
export function unitBasisUsd(totalUsd: string, quantityRaw: string): string {
  return divUsd(totalUsd, quantityRaw);
}

/** USD cost for a raw quantity at a given per-base-unit basis. */
export function basisForQty(
  unitBasisUsdValue: string,
  quantityRaw: string,
): string {
  return mulUsd(unitBasisUsdValue, quantityRaw);
}

/** Allocate total USD proceeds pro-rata to a matched slice of the disposal. */
export function proceedsSlice(
  totalProceedsUsd: string,
  matchedQtyRaw: string,
  totalQtyRaw: string,
): string {
  return mulUsd(totalProceedsUsd, divUsd(matchedQtyRaw, totalQtyRaw));
}
