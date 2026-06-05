import type { TaxReport } from "@/types/domain";

/**
 * Module-level memo of computed reports. This is the MVP's only "persistence":
 * the free-summary and paid-export requests for the same (address, taxYear)
 * reuse one computed report so figures stay consistent and work isn't redone.
 */
const TTL_MS = 10 * 60 * 1000; // 10 minutes

interface Entry {
  report: TaxReport;
  expiresAt: number;
}

const cache = new Map<string, Entry>();

export function getCachedReport(key: string): TaxReport | undefined {
  const entry = cache.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return undefined;
  }
  return entry.report;
}

export function setCachedReport(key: string, report: TaxReport): void {
  cache.set(key, { report, expiresAt: Date.now() + TTL_MS });
}

export function clearReportCache(): void {
  cache.clear();
}
