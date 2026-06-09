import { coinGeckoConfig } from "@/lib/config/env";
import type { Address, UsdPrice } from "@/types/domain";
import { PriceUnavailableError, type PriceOracle } from "./PriceOracle";
import {
  mainnet,
  bsc,
  arbitrum,
  optimism,
  avalanche,
} from "wagmi/chains";

/** Known stablecoin addresses by chain. */
const STABLECOINS: Record<number, Set<Address>> = {
  [mainnet.id]: new Set([
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48".toLowerCase() as Address, // USDC
    "0xdAC17f958D2ee523a2206206994597C13D831ec7".toLowerCase() as Address, // USDT
    "0x6B175474E89094C44Da98b954EedeAC495271d0F".toLowerCase() as Address, // DAI
  ]),
  // TODO: Add stablecoin addresses for other chains
};

const CHAIN_ID_TO_ASSET_PLATFORM: Record<number, string> = {
    [mainnet.id]: "ethereum",
    [bsc.id]: "binance-smart-chain",
    [arbitrum.id]: "arbitrum-one",
    [optimism.id]: "optimistic-ethereum",
    [avalanche.id]: "avalanche",
};


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
    // For simplicity, we check across all supported chains.
    // This might not be perfectly accurate if a stablecoin address on one chain
    // is a regular token on another.
    for (const chainId in STABLECOINS) {
        if(STABLECOINS[chainId].has(tokenAddress.toLowerCase() as Address)) {
            return true;
        }
    }
    return false;
  }

  async getUsdPriceAt(
    tokenAddress: Address,
    chainId: number,
    timestamp: number,
  ): Promise<UsdPrice> {
    const token = tokenAddress.toLowerCase() as Address;

    // 1. Check for stablecoins
    if (this.isStablecoin(token)) {
      return { usd: "1", source: "COINGECKO", asOf: timestamp };
    }

    const utcDate = toUtcDate(timestamp);
    const cacheKey = `${token}:${utcDate}:${chainId}`;

    // 2. Check cache
    if (this.priceCache.has(cacheKey)) {
      return this.priceCache.get(cacheKey)!;
    }

    const assetPlatform = CHAIN_ID_TO_ASSET_PLATFORM[chainId];
    if (!assetPlatform) {
        throw new PriceUnavailableError(tokenAddress, chainId, timestamp, "Unsupported chain.");
    }

    // 3. Fetch from CoinGecko
    // CoinGecko's /market_chart/range endpoint works with a range,
    // and we'll pick the closest price.
    // We add 86400 (1 day) buffer to ensure we get data for the day
    // around the requested timestamp.
    const from = timestamp - 86400;
    const to = timestamp + 86400;

    const url = new URL(
      `https://api.coingecko.com/api/v3/coins/${assetPlatform}/contract/${token}/market_chart/range`,
    );
    url.searchParams.set("vs_currency", "usd");
    url.searchParams.set("from", from.toString());
    url.searchParams.set("to", to.toString());

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (this.apiKey) {
      // Use for CoinGecko Pro API
      url.host = "pro-api.coingecko.com";
      headers["x-cg-pro-api-key"] = this.apiKey;
    }

    const response = await fetch(url.toString(), { headers });

    if (!response.ok) {
      if (response.status === 429) {
        throw new PriceUnavailableError(
          tokenAddress,
          chainId,
          timestamp,
          "CoinGecko rate limit exceeded.",
        );
      }
      const errorBody = await response.text();
      throw new PriceUnavailableError(
        tokenAddress,
        chainId,
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
        chainId,
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
