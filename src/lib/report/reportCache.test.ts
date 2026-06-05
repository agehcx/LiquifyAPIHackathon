import { describe, expect, it } from "vitest";
import { getOrBuildReport } from "./getReport";
import { DEMO_WALLET } from "@/lib/liquify/fixtures";

describe("getOrBuildReport caching", () => {
  it("returns the identical (memoized) object on a cache hit", async () => {
    const first = await getOrBuildReport(DEMO_WALLET, 2025);
    const second = await getOrBuildReport(DEMO_WALLET, 2025);
    expect(second).toBe(first); // same reference → served from cache
  });

  it("normalizes address case to the same cache entry", async () => {
    const lower = await getOrBuildReport(DEMO_WALLET.toLowerCase(), 2025);
    const upper = await getOrBuildReport(
      DEMO_WALLET.toUpperCase().replace("0X", "0x"),
      2025,
    );
    expect(upper).toBe(lower);
  });
});
