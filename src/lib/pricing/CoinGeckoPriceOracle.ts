import { coinGeckoConfig } from "@/lib/config/env";
import type { Address, UsdPrice } from "@/types/domain";
import { PriceUnavailableError, type PriceOracle } from "./PriceOracle";

/** Known Ethereum mainnet stablecoin addresses. */
const ETH_STABLECOINS: Set<Address> = new Set([
  "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48".toLowerCase() as Address, // USDC
  "0xdAC17f958D2ee523a2206206994597C13D831ec7".toLowerCase() as Address, // USDT
  "0x6B175474E89094C44Da98b954EedeAC495271d0F".toLowerCase() as Address, // DAI
]);

/** Convert a unix-seconds timestamp to a UTC calendar date (YYYY-MM-DD). */
function toUtcDate(timestamp: number): string {
  return new Date(timestamp * 1000).toISOString().slice(0, 10);
}

/**
 * Real implementation of PriceOracle that fetches prices from the CoinGecko API.
 * Includes an in-memory cache to mitigate rate limits for the Free API.
 */
export class CoinGeckoPriceOracle implements PriceOracle {
  private readonly apiKey?: string;
  // Cache prices by `${tokenAddress}:${utcDate}`
  private readonly priceCache = new Map<string, UsdPrice>();

  constructor() {
    this.apiKey = coinGeckoConfig().apiKey;
  }

  isStablecoin(tokenAddress: Address): boolean {
    return ETH_STABLECOINS.has(tokenAddress.toLowerCase() as Address);
  }

  async getUsdPriceAt(
    tokenAddress: Address,
    timestamp: number,
  ): Promise<UsdPrice> {
    const token = tokenAddress.toLowerCase() as Address;

    // 1. Check for stablecoins
    if (this.isStablecoin(token)) {
      return { usd: "1", source: "COINGECKO", asOf: timestamp };
    }

    const utcDate = toUtcDate(timestamp);
    const cacheKey = `${token}:${utcDate}`;

    // 2. Check cache
    if (this.priceCache.has(cacheKey)) {
      return this.priceCache.get(cacheKey)!;
    }

    // 3. Fetch from CoinGecko
    // CoinGecko's /market_chart/range endpoint works with a range,
    // and we'll pick the closest price.
    // We add 86400 (1 day) buffer to ensure we get data for the day
    // around the requested timestamp.
    const from = timestamp - 86400;
    const to = timestamp + 86400;

    const url = new URL(
      `https://api.coingecko.com/api/v3/coins/ethereum/contract/${token}/market_chart/range`,
    );
    url.searchParams.set("vs_currency", "usd");
    url.searchParams.set("from_timestamp", from.toString());
    url.searchParams.set("to_timestamp", to.toString());

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (this.apiKey) {
      // Use for CoinGecko Pro API
      url.searchParams.set("x_cg_pro_api_key", this.apiKey);
    }

    const response = await fetch(url.toString(), { headers });

    if (!response.ok) {
      if (response.status === 429) {
        throw new PriceUnavailableError(
          tokenAddress,
          timestamp,
          "CoinGecko rate limit exceeded.",
        );
      }
      const errorBody = await response.text();
      throw new PriceUnavailableError(
        tokenAddress,
        timestamp,
        `CoinGecko API error: ${response.status} ${response.statusText} - ${errorBody}`,
      );
    }

    const json = await response.json();

    if (
      !json.prices ||
      !Array.isArray(json.prices) ||
      json.prices.length === 0
    ) {
      throw new PriceUnavailableError(
        tokenAddress,
        timestamp,
        "No price data found.",
      );
    }

    // Find the closest price to the requested timestamp
    // json.prices is an array of [timestamp_ms, price]
    const closestPrice = json.prices.reduce(
      (prev: [number, number], curr: [number, number]) => {
        return Math.abs(curr[0] / 1000 - timestamp) <
          Math.abs(prev[0] / 1000 - timestamp)
          ? curr
          : prev;
      },
    );

    const usdPrice: UsdPrice = {
      usd: closestPrice[1].toFixed(8), // Prices can be very small
      source: "COINGECKO",
      asOf: Math.round(closestPrice[0] / 1000), // Convert ms to seconds
    };

    this.priceCache.set(cacheKey, usdPrice);
    return usdPrice;
  }
}
