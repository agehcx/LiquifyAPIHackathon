import { describe, expect, it } from "vitest";
import { MockLiquifyClient } from "@/lib/liquify/MockLiquifyClient";
import { DEMO_WALLET } from "@/lib/liquify/fixtures";
import { MockPriceOracle } from "@/lib/pricing/MockPriceOracle";
import { buildReport } from "./buildReport";

const deps = {
  liquify: new MockLiquifyClient(),
  oracle: new MockPriceOracle(),
  now: 1764547200, // 2025-12-01, fixed for determinism
};

describe("buildReport (integration over fixtures)", () => {
  it("produces the expected 2025 tax report for the demo wallet", async () => {
    const report = await buildReport(DEMO_WALLET, 2025, deps);

    // Two disposal slices from the single 1.5 WETH sell (FIFO across 2 lots).
    expect(report.gainLossRows).toHaveLength(2);
    expect(report.summary.longTermGainUsd).toBe("1000"); // 2024 lot, held >1yr
    expect(report.summary.shortTermGainUsd).toBe("250"); // 2025 lot
    expect(report.summary.totalCapitalGainUsd).toBe("1250");

    // Income: 10 UNI @ $7 + 100 FOO @ $0.50 = $120.
    expect(report.summary.totalOrdinaryIncomeUsd).toBe("120");
    expect(report.summary.incomeCount).toBe(2);

    // Stablecoins are cash → no zero-basis disposals from spending USDC.
    expect(report.summary.zeroBasisCount).toBe(0);

    // Open lots: 0.5 WETH remainder + the UNI + FOO income lots (no USDC).
    const symbols = report.openLots.map((l) => l.symbol).sort();
    expect(symbols).toEqual(["FOO", "UNI", "WETH"]);
  });

  it("excludes the 2025 disposals from a 2024 report", async () => {
    const report = await buildReport(DEMO_WALLET, 2024, deps);
    expect(report.gainLossRows).toHaveLength(0);
    expect(report.summary.totalOrdinaryIncomeUsd).toBe("0");
  });
});
