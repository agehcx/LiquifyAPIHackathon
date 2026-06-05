import { describe, expect, it } from "vitest";
import type { NextRequest } from "next/server";
import { DEMO_WALLET } from "@/lib/liquify/fixtures";
import { GET } from "./route";

// No X402_PAY_TO in the test env → demo mode → gate bypassed.
function req(query: string): NextRequest {
  return new Request(`http://localhost/api/export?${query}`) as NextRequest;
}

describe("GET /api/export (demo mode)", () => {
  it("returns a downloadable CSV with the full report", async () => {
    const res = await GET(req(`address=${DEMO_WALLET}&taxYear=2025`));
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/csv");
    expect(res.headers.get("content-disposition")).toContain("attachment");

    const csv = await res.text();
    expect(csv).toContain("Capital Gains / Losses (Form 8949)");
    expect(csv).toContain("Total capital gain (USD),1250.00");
    // Full per-row USD IS present in the paid export.
    expect(csv).toContain("3000.00,2000.00,1000.00,Long-term");
  });

  it("rejects a malformed address with 400", async () => {
    const res = await GET(req("address=bad&taxYear=2025"));
    expect(res.status).toBe(400);
  });
});
