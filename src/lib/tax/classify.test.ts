import { describe, expect, it } from "vitest";
import type { DecodedEvent } from "@/types/domain";
import { MockPriceOracle } from "@/lib/pricing/MockPriceOracle";
import { classifyEvent, MalformedEventError } from "./classify";

const oracle = new MockPriceOracle();

const WETH = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" as const;
const USDC = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48" as const;
const UNI = "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984" as const;
const WALLET = "0x1111111111111111111111111111111111111111" as const;

function evt(partial: Partial<DecodedEvent>): DecodedEvent {
  return {
    id: "0x:0",
    txHash: "0x",
    logIndex: 0,
    blockNumber: 1,
    timestamp: 1754006400, // 2025-08-01
    chainId: 1,
    protocol: "UNISWAP_V3",
    eventName: "Swap",
    wallet: WALLET,
    raw: {},
    ...partial,
  };
}

describe("classifyEvent", () => {
  it("classifies a sell swap (token -> cash) as a capital gain, no stablecoin lot", async () => {
    const result = await classifyEvent(
      evt({
        sent: { tokenAddress: WETH, symbol: "WETH", decimals: 18, raw: "1500000000000000000" },
        received: { tokenAddress: USDC, symbol: "USDC", decimals: 6, raw: "4500000000" },
      }),
      oracle,
    );
    expect(result.treatment).toBe("CAPITAL_GAIN");
    expect(result.kind).toBe("SWAP");
    expect(result.disposal?.proceedsUsd).toBe("4500"); // 1.5 WETH @ $3000
    expect(result.acquisition).toBeUndefined(); // received USDC is cash
  });

  it("handles a stable-in buy swap: no USDC disposal, WETH lot at trade value", async () => {
    const result = await classifyEvent(
      evt({
        timestamp: 1717200000, // 2024-06-01
        protocol: "UNISWAP_V2",
        sent: { tokenAddress: USDC, symbol: "USDC", decimals: 6, raw: "2000000000" },
        received: { tokenAddress: WETH, symbol: "WETH", decimals: 18, raw: "1000000000000000000" },
      }),
      oracle,
    );
    expect(result.disposal).toBeUndefined(); // spending USDC is not a disposal
    expect(result.acquisition?.costBasisUsd).toBe("2000"); // WETH lot basis = $2000
  });

  it("classifies a staking reward as ordinary income and an acquisition lot at FMV", async () => {
    const result = await classifyEvent(
      evt({
        timestamp: 1757894400, // 2025-09-15
        protocol: "STAKING",
        eventName: "RewardPaid",
        received: { tokenAddress: UNI, symbol: "UNI", decimals: 18, raw: "10000000000000000000" },
      }),
      oracle,
    );
    expect(result.kind).toBe("STAKING_INCOME");
    expect(result.treatment).toBe("ORDINARY_INCOME");
    expect(result.incomeUsd).toBe("70"); // 10 UNI @ $7
    expect(result.acquisition?.costBasisUsd).toBe("70");
  });

  it("classifies an airdrop as ordinary income", async () => {
    const result = await classifyEvent(
      evt({
        timestamp: 1759276800, // 2025-10-01
        protocol: "AIRDROP",
        eventName: "Claimed",
        received: {
          tokenAddress: "0xf000000000000000000000000000000000000000",
          symbol: "FOO",
          decimals: 18,
          raw: "100000000000000000000",
        },
      }),
      oracle,
    );
    expect(result.kind).toBe("AIRDROP_INCOME");
    expect(result.incomeUsd).toBe("50"); // 100 FOO @ $0.50
  });

  it("treats an unrecognized protocol as non-taxable", async () => {
    const result = await classifyEvent(
      evt({ protocol: "LENDING_DEPOSIT" as never }),
      oracle,
    );
    expect(result.treatment).toBe("NON_TAXABLE");
    expect(result.disposal).toBeUndefined();
    expect(result.acquisition).toBeUndefined();
  });

  it("throws on a swap missing a leg", async () => {
    await expect(
      classifyEvent(evt({ sent: undefined, received: undefined }), oracle),
    ).rejects.toBeInstanceOf(MalformedEventError);
  });
});
