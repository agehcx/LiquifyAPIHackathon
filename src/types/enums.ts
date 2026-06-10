// Domain enums. Kept as string-literal unions (not TS `enum`) for ergonomics
// and zero runtime cost. All are extensible for post-MVP event types/methods.

/** Taxable event kinds covered by the MVP. */
export type EventKind =
  | "SWAP"
  | "STAKING_INCOME"
  | "AIRDROP_INCOME"
  | "LP_ADD"
  | "LP_REMOVE"
  | "LENDING_DEPOSIT"
  | "LENDING_WITHDRAWAL";

/** How an event is treated for tax purposes. */
export type TaxTreatment =
  | "CAPITAL_GAIN"
  | "ORDINARY_INCOME"
  | "NON_TAXABLE";

/** Cost-basis accounting method. MVP ships FIFO only; union is extensible. */
export type CostBasisMethod = "FIFO" | "HIFO" | "SPECIFIC_ID";

/** Capital-gains holding period (US: long-term if held > 365 days). */
export type HoldingPeriod = "SHORT_TERM" | "LONG_TERM";

/** Protocols whose decoded events the MVP understands. */
export type Protocol =
  | "UNISWAP_V2"
  | "UNISWAP_V3"
  | "STAKING"
  | "AIRDROP"
  | "AAVE"
  | "COMPOUND";
