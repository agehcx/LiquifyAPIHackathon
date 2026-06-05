import { describe, expect, it } from "vitest";
import { MockPriceOracle } from "./MockPriceOracle";
import { PriceUnavailableError } from "./PriceOracle";

const WETH = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" as const;
const USDC = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48" as const;

describe("MockPriceOracle", () => {
  it("returns $1 for stablecoins on any date", async () => {
    const oracle = new MockPriceOracle();
    const price = await oracle.getUsdPriceAt(USDC, 1754006400);
    expect(price.usd).toBe("1");
  });

  it("resolves a token price by UTC date", async () => {
    const oracle = new MockPriceOracle();
    // 1754006400 = 2025-08-01 UTC
    const price = await oracle.getUsdPriceAt(WETH, 1754006400);
    expect(price.usd).toBe("3000");
  });

  it("is case-insensitive on the token address", async () => {
    const oracle = new MockPriceOracle();
    const price = await oracle.getUsdPriceAt(
      WETH.toUpperCase() as `0x${string}`,
      1717200000,
    );
    expect(price.usd).toBe("2000");
  });

  it("throws PriceUnavailableError when no price exists", async () => {
    const oracle = new MockPriceOracle();
    await expect(oracle.getUsdPriceAt(WETH, 1)).rejects.toBeInstanceOf(
      PriceUnavailableError,
    );
  });
});
