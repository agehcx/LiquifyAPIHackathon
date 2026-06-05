import { describe, expect, it } from "vitest";
import {
  addUsd,
  basisForQty,
  divUsd,
  gtZeroRaw,
  isZeroRaw,
  minRaw,
  mulUsd,
  proceedsSlice,
  roundUsd,
  subRaw,
  subUsd,
  unitBasisUsd,
  valueOfAmountUsd,
} from "./money";

describe("USD arithmetic (decimal-safe)", () => {
  it("adds without float drift", () => {
    // 0.1 + 0.2 is the classic float trap.
    expect(addUsd("0.1", "0.2")).toBe("0.3");
    expect(addUsd("1843.55", "0.45", "100")).toBe("1944");
  });

  it("subtracts", () => {
    expect(subUsd("1000", "999.99")).toBe("0.01");
    expect(subUsd("100", "150")).toBe("-50");
  });

  it("multiplies", () => {
    expect(mulUsd("1843.55", "2")).toBe("3687.1");
  });

  it("divides with high precision", () => {
    expect(divUsd("1", "4")).toBe("0.25");
  });

  it("rounds to 2dp for export (half-up)", () => {
    expect(roundUsd("1.005")).toBe("1.01");
    expect(roundUsd("1.004")).toBe("1.00");
    expect(roundUsd("-0.005")).toBe("-0.01");
    expect(roundUsd("1234.5")).toBe("1234.50");
  });
});

describe("raw base-unit (integer) helpers", () => {
  it("min of two raw quantities", () => {
    expect(minRaw("100", "250")).toBe("100");
    expect(minRaw("250", "100")).toBe("100");
  });

  it("subtracts raw quantities exactly (huge values)", () => {
    expect(subRaw("1000000000000000000", "250000000000000000")).toBe(
      "750000000000000000",
    );
  });

  it("detects zero / positive", () => {
    expect(isZeroRaw("0")).toBe(true);
    expect(isZeroRaw("100")).toBe(false);
    expect(gtZeroRaw("1")).toBe(true);
    expect(gtZeroRaw("0")).toBe(false);
  });
});

describe("tax-specific composites", () => {
  it("values a token amount at a per-whole-token USD price", () => {
    // 1.5 ETH (18 decimals) at $2000 => $3000
    const amount = {
      tokenAddress: "0x0" as `0x${string}`,
      symbol: "ETH",
      decimals: 18,
      raw: "1500000000000000000",
    };
    expect(valueOfAmountUsd(amount, "2000")).toBe("3000");
  });

  it("computes per-base-unit basis and recovers cost for a slice", () => {
    // $3000 basis over 1.5 ETH; cost of 0.5 ETH slice = $1000
    const unit = unitBasisUsd("3000", "1500000000000000000");
    expect(basisForQty(unit, "500000000000000000")).toBe("1000");
  });

  it("allocates proceeds pro-rata by matched quantity", () => {
    // $900 total proceeds, match 1/3 of the disposal => $300
    expect(proceedsSlice("900", "1", "3")).toBe("300");
  });
});
