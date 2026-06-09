import type { Address, UsdPrice } from "@/types/domain";
import { type PriceOracle, PriceUnavailableError } from "./PriceOracle";
import priceData from "./fixtures/prices.json";

type PriceTable = {
  stablecoins: string[];
  prices: Record<string, Record<string, string>>;
};

/** Convert a unix-seconds timestamp to a UTC calendar date (YYYY-MM-DD). */
function utcDate(timestamp: number): string {
  return new Date(timestamp * 1000).toISOString().slice(0, 10);
}

/**
 * Deterministic FMV oracle backed by a static price grid. Stablecoins resolve
 * to $1 on any date; everything else must have an entry for the event's UTC
 * date or a PriceUnavailableError is thrown.
 */
export class MockPriceOracle implements PriceOracle {
  private readonly stables: Set<string>;
  private readonly prices: Record<string, Record<string, string>>;

  constructor(table: PriceTable = priceData as PriceTable) {
    this.stables = new Set(table.stablecoins.map((a) => a.toLowerCase()));
    this.prices = table.prices;
  }

  isStablecoin(tokenAddress: Address): boolean {
    return this.stables.has(tokenAddress.toLowerCase());
  }

  async getUsdPriceAt(
    tokenAddress: Address,
    chainId: number,
    timestamp: number,
  ): Promise<UsdPrice> {
    const token = tokenAddress.toLowerCase();
    if (this.stables.has(token)) {
      return { usd: "1", source: "MOCK", asOf: timestamp };
    }
    const usd = this.prices[token]?.[utcDate(timestamp)];
    if (usd === undefined) {
      throw new PriceUnavailableError(tokenAddress, chainId, timestamp);
    }
    return { usd, source: "MOCK", asOf: timestamp };
  }
}
