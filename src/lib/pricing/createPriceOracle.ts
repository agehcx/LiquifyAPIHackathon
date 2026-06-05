import type { PriceOracle } from "./PriceOracle";
import { MockPriceOracle } from "./MockPriceOracle";

/**
 * Factory for the active price oracle. Returns the mock unless a CoinGecko key
 * is configured (the live oracle lands here post-MVP, behind PriceOracle).
 */
export function createPriceOracle(): PriceOracle {
  // if (process.env.COINGECKO_API_KEY) return new CoinGeckoPriceOracle(...);
  return new MockPriceOracle();
}
