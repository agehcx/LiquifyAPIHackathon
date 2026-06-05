import { describe, expect, it } from "vitest";
import { DEMO_WALLET } from "@/lib/liquify/fixtures";
import { GET } from "./route";

function req(query: string): Request {
  return new Request(`http://localhost/api/summary?${query}`);
}

describe("GET /api/summary", () => {
  it("returns headline figures + counts but withholds per-row USD", async () => {
    const res = await GET(req(`address=${DEMO_WALLET}&taxYear=2025`));
    expect(res.status).toBe(200);
    const body = await res.json();

    expect(body.locked).toBe(true);
    expect(body.summary.totalCapitalGainUsd).toBe("1250");
    expect(body.summary.totalOrdinaryIncomeUsd).toBe("120");
    expect(body.previewRowCount).toBe(4); // 2 disposals + 2 income
    expect(body.protocolsDetected).toContain("Uniswap V3");

    // Paywall integrity: no per-row USD figures anywhere in the payload.
    const serialized = JSON.stringify(body);
    expect(serialized).not.toContain("proceedsUsd");
    expect(serialized).not.toContain("costBasisUsd");
    expect(serialized).not.toContain("gainLossUsd");
    // sampleRows expose only symbol + holdingPeriod.
    expect(Object.keys(body.sampleRows[0]).sort()).toEqual([
      "holdingPeriod",
      "symbol",
    ]);
  });

  it("rejects a malformed address", async () => {
    const res = await GET(req("address=nothex&taxYear=2025"));
    expect(res.status).toBe(400);
  });
});
