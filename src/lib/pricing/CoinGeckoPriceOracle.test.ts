import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { coinGeckoConfig } from "../config/env";
import { PriceUnavailableError } from "./PriceOracle";

const WETH = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" as const;
const USDC = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48" as const;
const UNKNOWN_TOKEN = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" as const;

// Stub the global fetch function at the top level
vi.stubGlobal("fetch", vi.fn());
const mockFetch = vi.fn(); // Our mock function that global.fetch will use

// Mock the coinGeckoConfig to return a valid configuration for testing purposes
vi.mock("../config/env", () => ({
  coinGeckoConfig: vi.fn(() => ({
    apiKey: "test-coingecko-key",
  })),
}));

// Remove the direct import: import { CoinGeckoPriceOracle } from "./CoinGeckoPriceOracle";

describe("CoinGeckoPriceOracle", () => {
  let CoinGeckoPriceOracle: typeof import("./CoinGeckoPriceOracle").CoinGeckoPriceOracle;

  beforeAll(async () => {
    // Explicitly import the module after global.fetch has been set.
    const module = await import("./CoinGeckoPriceOracle");
    CoinGeckoPriceOracle = module.CoinGeckoPriceOracle;
  });

  beforeEach(() => {
    // Re-assign the mock function for fetch and reset its behavior
    (global.fetch as ReturnType<typeof vi.fn>).mockImplementation(mockFetch);
    mockFetch.mockReset();
  });

  it("isStablecoin returns true for known stablecoins", () => {
    const oracle = new CoinGeckoPriceOracle();
    expect(oracle.isStablecoin(USDC)).toBe(true);
    expect(oracle.isStablecoin(USDC.toUpperCase() as any)).toBe(true); // Case-insensitive
    expect(oracle.isStablecoin(WETH)).toBe(false);
  });

  it("getUsdPriceAt returns $1 for stablecoins without fetching", async () => {
    const oracle = new CoinGeckoPriceOracle();
    const price = await oracle.getUsdPriceAt(USDC, 1672531200); // Jan 1, 2023
    expect(price.usd).toBe("1");
    expect(price.source).toBe("COINGECKO");
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("DEBUG: should call mockFetch with correct arguments for non-stablecoin", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          prices: [[1672531200000, 1200.5]],
        }),
    });

    const oracle = new CoinGeckoPriceOracle();
    await oracle.getUsdPriceAt(WETH, 1672531200);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.coingecko.com/api/v3/coins/ethereum/contract/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2/market_chart/range?vs_currency=usd&from_timestamp=1672444800&to_timestamp=1672617600&x_cg_pro_api_key=test-coingecko-key",
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  });

  it("should cache prices and not refetch for the same token/day", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          prices: [[1672531200000, 1200.5]],
        }),
    });

    const oracle = new CoinGeckoPriceOracle();
    await oracle.getUsdPriceAt(WETH, 1672531200); // First fetch
    await oracle.getUsdPriceAt(WETH, 1672531200 + 3600); // Same day, different hour

    expect(mockFetch).toHaveBeenCalledTimes(1); // Should only fetch once
  });

  it("should throw PriceUnavailableError for non-ok responses", async () => {
    mockFetch.mockImplementation(() =>
      Promise.resolve({
        ok: false,
        status: 404,
        statusText: "Not Found",
        text: () => Promise.resolve("Token not found"),
        json: () => Promise.reject(new Error("Should not call json on error")), // Added json() for completeness
      }),
    );

    const oracle = new CoinGeckoPriceOracle();
    await expect(oracle.getUsdPriceAt(UNKNOWN_TOKEN, 1672531200)).rejects.toThrow(
      PriceUnavailableError,
    );
    await expect(oracle.getUsdPriceAt(UNKNOWN_TOKEN, 1672531200)).rejects.toThrow(
      /CoinGecko API error: 404 Not Found - Token not found/,
    );
  });

  it("should throw PriceUnavailableError for 429 rate limit errors", async () => {
    mockFetch.mockImplementation(() =>
      Promise.resolve({
        ok: false,
        status: 429,
        statusText: "Too Many Requests",
        text: () => Promise.resolve("Rate limit exceeded"),
        json: () => Promise.reject(new Error("Should not call json on error")),
      }),
    );

    const oracle = new CoinGeckoPriceOracle();
    await expect(oracle.getUsdPriceAt(WETH, 1672531200)).rejects.toThrow(
      PriceUnavailableError,
    );
    await expect(oracle.getUsdPriceAt(WETH, 1672531200)).rejects.toThrow(
      /CoinGecko rate limit exceeded./,
    );
  });

  it("should find the closest price to the requested timestamp", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          prices: [
            [1672531200000, 1000], // Jan 1, 2023 00:00:00 UTC
            [1672531200000 + 3600000, 1050], // + 1 hour
            [1672531200000 + 7200000, 1100], // + 2 hours
          ],
        }),
    });

    const oracle = new CoinGeckoPriceOracle();
    // Request price for +1 hour 15 minutes, should pick 1050
    const price = await oracle.getUsdPriceAt(WETH, 1672531200 + 4500);

    expect(price.usd).toBe("1050.00000000");
    expect(price.asOf).toBe(Math.round((1672531200000 + 3600000) / 1000));
  });

  it("should throw PriceUnavailableError if no price data is returned", async () => {
    mockFetch.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ prices: [] }),
        text: () => Promise.resolve(JSON.stringify({ prices: [] })),
      }),
    );

    const oracle = new CoinGeckoPriceOracle();
    await expect(oracle.getUsdPriceAt(WETH, 1672531200)).rejects.toThrow(
      PriceUnavailableError,
    );
    await expect(oracle.getUsdPriceAt(WETH, 1672531200)).rejects.toThrow(
      /No price data found./,
    );
  });
});
