import { describe, expect, it } from "vitest";
import type { Address, GainLossRow, IncomeRow } from "@/types/domain";
import { aggregate } from "./aggregate";

const TOKEN = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" as Address;

// 2025-08-01 and 2024-06-01 unix seconds.
const TS_2025 = 1754006400;
const TS_2024 = 1717200000;

function gl(over: Partial<GainLossRow>): GainLossRow {
  return {
    eventId: "e",
    tokenAddress: TOKEN,
    symbol: "WETH",
    decimals: 18,
    quantityRaw: "1000000000000000000",
    acquiredAt: TS_2024,
    disposedAt: TS_2025,
    proceedsUsd: "3000",
    costBasisUsd: "2000",
    gainLossUsd: "1000",
    holdingPeriod: "LONG_TERM",
    zeroBasis: false,
    ...over,
  };
}

function inc(over: Partial<IncomeRow>): IncomeRow {
  return {
    eventId: "i",
    tokenAddress: TOKEN,
    symbol: "UNI",
    decimals: 18,
    receivedAt: TS_2025,
    kind: "STAKING_INCOME",
    amountUsd: "70",
    ...over,
  };
}

describe("aggregate", () => {
  it("partitions short/long term gains and sums income", () => {
    const { summary } = aggregate(
      [
        gl({ holdingPeriod: "LONG_TERM", gainLossUsd: "1000" }),
        gl({ holdingPeriod: "SHORT_TERM", gainLossUsd: "250" }),
      ],
      [inc({ amountUsd: "70" }), inc({ amountUsd: "50" })],
      2025,
    );
    expect(summary.longTermGainUsd).toBe("1000");
    expect(summary.shortTermGainUsd).toBe("250");
    expect(summary.totalCapitalGainUsd).toBe("1250");
    expect(summary.totalOrdinaryIncomeUsd).toBe("120");
    expect(summary.disposalCount).toBe(2);
    expect(summary.incomeCount).toBe(2);
  });

  it("excludes rows outside the requested tax year", () => {
    const { summary, gainLossRows } = aggregate(
      [
        gl({ disposedAt: TS_2025, gainLossUsd: "1000" }),
        gl({ disposedAt: TS_2024, gainLossUsd: "9999" }), // 2024 — excluded
      ],
      [],
      2025,
    );
    expect(gainLossRows).toHaveLength(1);
    expect(summary.totalCapitalGainUsd).toBe("1000");
  });

  it("counts zero-basis disposals", () => {
    const { summary } = aggregate(
      [gl({ zeroBasis: true }), gl({ zeroBasis: false })],
      [],
      2025,
    );
    expect(summary.zeroBasisCount).toBe(1);
  });

  it("returns zeros for an empty year", () => {
    const { summary } = aggregate([], [], 2025);
    expect(summary.totalCapitalGainUsd).toBe("0");
    expect(summary.totalOrdinaryIncomeUsd).toBe("0");
  });
});
