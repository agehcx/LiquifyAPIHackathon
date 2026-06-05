import { describe, expect, it } from "vitest";
import { MockLiquifyClient } from "@/lib/liquify/MockLiquifyClient";
import { DEMO_WALLET } from "@/lib/liquify/fixtures";
import { MockPriceOracle } from "@/lib/pricing/MockPriceOracle";
import { buildReport } from "@/lib/tax/buildReport";
import { toCsv } from "./csvExporter";

const deps = {
  liquify: new MockLiquifyClient(),
  oracle: new MockPriceOracle(),
  now: 1764547200,
};

describe("toCsv", () => {
  it("renders the 2025 demo report as a golden CSV", async () => {
    const report = await buildReport(DEMO_WALLET, 2025, deps);
    const csv = toCsv(report);

    const expected = [
      "DeFi TaxGen — Tax Report 2025",
      "Wallet,0x1111111111111111111111111111111111111111",
      "Cost basis method,FIFO",
      "",
      "Capital Gains / Losses (Form 8949)",
      "Description,Quantity,Date Acquired,Date Sold,Proceeds (USD),Cost Basis (USD),Gain/Loss (USD),Term,Note",
      "WETH,1,2024-06-01,2025-08-01,3000.00,2000.00,1000.00,Long-term,",
      "WETH,0.5,2025-02-01,2025-08-01,1500.00,1250.00,250.00,Short-term,",
      "",
      "Ordinary Income",
      "Description,Quantity,Date Received,Type,Amount (USD)",
      "UNI,,2025-09-15,Staking,70.00",
      "FOO,,2025-10-01,Airdrop,50.00",
      "",
      "Summary",
      "Short-term capital gain (USD),250.00",
      "Long-term capital gain (USD),1000.00",
      "Total capital gain (USD),1250.00",
      "Total ordinary income (USD),120.00",
      "Disposals,2",
      "Income events,2",
      "Disposals needing cost basis,0",
      "",
    ].join("\n");

    expect(csv).toBe(expected);
  });
});
