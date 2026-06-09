import type { TaxReport } from "@/types/domain";
import { createLiquifyClient } from "@/lib/liquify/createLiquifyClient";
import { createPriceOracle } from "@/lib/pricing/createPriceOracle";
import { buildReport } from "@/lib/tax/buildReport";
import { getCachedReport, setCachedReport } from "./reportCache";
import { reportKey } from "./reportKey";
import type { CostBasisMethod } from "@/types/enums";

/**
 * Returns the report for (address, taxYear), building it from the active
 * Liquify client + price oracle on a cache miss and memoizing the result so the
 * free-summary and paid-export endpoints stay consistent.
 */
export async function getOrBuildReport(
  address: string,
  chainId: number,
  taxYear: number,
  costBasisMethod: CostBasisMethod,
): Promise<TaxReport> {
  const key = reportKey(address, chainId, taxYear, costBasisMethod);
  const cached = getCachedReport(key);
  if (cached) return cached;

  const report = await buildReport(address, chainId, taxYear, costBasisMethod, {
    liquify: createLiquifyClient(),
    oracle: createPriceOracle(),
  });
  setCachedReport(key, report);
  return report;
}
