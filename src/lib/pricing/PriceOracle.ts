import type { Address, UsdPrice } from "@/types/domain";

/** Thrown when no FMV can be resolved for a token at a given time. */
export class PriceUnavailableError extends Error {
  constructor(
    readonly tokenAddress: Address,
    readonly chainId: number,
    readonly timestamp: number,
    readonly reason?: string,
  ) {
    super(`No USD price for ${tokenAddress} on chain ${chainId} at ${timestamp}${reason ? ` - ${reason}` : ""}`);
    this.name = "PriceUnavailableError";
  }
}

/**
 * Resolves the fair-market USD price of one whole token at a block timestamp.
 * MVP uses a deterministic mock; CoinGecko historical OHLCV slots in behind
 * this interface post-MVP.
 */
export interface PriceOracle {
  getUsdPriceAt(tokenAddress: Address, chainId: number, timestamp: number): Promise<UsdPrice>;
  /**
   * Whether a token is a USD-pegged stablecoin. Stablecoins are treated as
   * cash: spending one is not a taxable disposal and receiving one creates no
   * cost-basis lot.
   */
  isStablecoin(tokenAddress: Address): boolean;
}
