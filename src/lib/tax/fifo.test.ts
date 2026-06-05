import { describe, expect, it } from "vitest";
import type {
  Address,
  ClassifiedEvent,
  DecodedEvent,
  TokenAmount,
} from "@/types/domain";
import { LONG_TERM_THRESHOLD_SECONDS } from "./constants";
import { computeFifo } from "./fifo";

const WETH = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" as Address;
const ONE = "1000000000000000000"; // 1 WETH (18 dp)
const HALF = "500000000000000000"; // 0.5 WETH

function amt(raw: string): TokenAmount {
  return { tokenAddress: WETH, symbol: "WETH", decimals: 18, raw };
}

let counter = 0;
function source(timestamp: number): DecodedEvent {
  counter += 1;
  return {
    id: `0xevt${counter}:0`,
    txHash: "0x",
    logIndex: 0,
    blockNumber: counter,
    timestamp,
    chainId: 1,
    protocol: "UNISWAP_V3",
    eventName: "Swap",
    wallet: "0x1111111111111111111111111111111111111111",
    raw: {},
  };
}

function buy(timestamp: number, raw: string, costBasisUsd: string): ClassifiedEvent {
  return {
    source: source(timestamp),
    kind: "SWAP",
    treatment: "CAPITAL_GAIN",
    timestamp,
    acquisition: { amount: amt(raw), costBasisUsd },
  };
}

function sell(timestamp: number, raw: string, proceedsUsd: string): ClassifiedEvent {
  return {
    source: source(timestamp),
    kind: "SWAP",
    treatment: "CAPITAL_GAIN",
    timestamp,
    disposal: { amount: amt(raw), proceedsUsd },
  };
}

describe("computeFifo", () => {
  it("matches a full disposal against a single lot", () => {
    const { disposals, openLots } = computeFifo([
      buy(1000, ONE, "2000"),
      sell(2000, ONE, "3000"),
    ]);
    expect(disposals).toHaveLength(1);
    expect(disposals[0].gainLossUsd).toBe("1000");
    expect(disposals[0].costBasisUsd).toBe("2000");
    expect(openLots).toHaveLength(0);
  });

  it("leaves the remainder open on a partial disposal", () => {
    const { disposals, openLots } = computeFifo([
      buy(1000, "2000000000000000000", "4000"), // 2 WETH @ $2000
      sell(2000, ONE, "3000"), // sell 1 WETH
    ]);
    expect(disposals[0].gainLossUsd).toBe("1000"); // 3000 - 2000
    expect(openLots).toHaveLength(1);
    expect(openLots[0].quantityRaw).toBe(ONE);
  });

  it("spans multiple lots FIFO with pro-rata proceeds", () => {
    const { disposals, openLots } = computeFifo([
      buy(1000, ONE, "2000"), // lot 1
      buy(2000, ONE, "2500"), // lot 2
      sell(3000, "1500000000000000000", "4500"), // sell 1.5 WETH @ $3000
    ]);
    expect(disposals).toHaveLength(2);
    // lot 1: proceeds 3000, basis 2000 => +1000
    expect(disposals[0].proceedsUsd).toBe("3000");
    expect(disposals[0].gainLossUsd).toBe("1000");
    // lot 2: 0.5 WETH, proceeds 1500, basis 1250 => +250
    expect(disposals[1].proceedsUsd).toBe("1500");
    expect(disposals[1].gainLossUsd).toBe("250");
    expect(openLots).toHaveLength(1);
    expect(openLots[0].quantityRaw).toBe(HALF);
  });

  it("treats exactly 365 days as short-term, and one second more as long-term", () => {
    const short = computeFifo([
      buy(1000, ONE, "2000"),
      sell(1000 + LONG_TERM_THRESHOLD_SECONDS, ONE, "3000"),
    ]);
    expect(short.disposals[0].holdingPeriod).toBe("SHORT_TERM");

    const long = computeFifo([
      buy(1000, ONE, "2000"),
      sell(1000 + LONG_TERM_THRESHOLD_SECONDS + 1, ONE, "3000"),
    ]);
    expect(long.disposals[0].holdingPeriod).toBe("LONG_TERM");
  });

  it("emits a flagged zero-basis row when no lot is on record", () => {
    const { disposals } = computeFifo([sell(2000, ONE, "3000")]);
    expect(disposals).toHaveLength(1);
    expect(disposals[0].zeroBasis).toBe(true);
    expect(disposals[0].costBasisUsd).toBe("0");
    expect(disposals[0].gainLossUsd).toBe("3000");
    expect(disposals[0].acquiredAt).toBe(0);
  });

  it("lets an income-acquired lot be disposed later", () => {
    const income: ClassifiedEvent = {
      source: source(1000),
      kind: "STAKING_INCOME",
      treatment: "ORDINARY_INCOME",
      timestamp: 1000,
      incomeUsd: "70",
      acquisition: { amount: amt(ONE), costBasisUsd: "70" },
    };
    const { disposals } = computeFifo([income, sell(2000, ONE, "100")]);
    expect(disposals[0].costBasisUsd).toBe("70");
    expect(disposals[0].gainLossUsd).toBe("30");
  });

  it("does not match a token received in the same event", () => {
    // One event that both disposes and acquires the same token: the acquired
    // leg must NOT satisfy the disposal (no lot exists yet → zero-basis).
    const both: ClassifiedEvent = {
      source: source(1000),
      kind: "SWAP",
      treatment: "CAPITAL_GAIN",
      timestamp: 1000,
      disposal: { amount: amt(ONE), proceedsUsd: "3000" },
      acquisition: { amount: amt(ONE), costBasisUsd: "3000" },
    };
    const { disposals, openLots } = computeFifo([both]);
    expect(disposals[0].zeroBasis).toBe(true);
    expect(openLots).toHaveLength(1); // the acquired lot survives
  });
});
