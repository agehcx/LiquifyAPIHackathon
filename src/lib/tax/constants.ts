/** Seconds in a day. */
export const SECONDS_PER_DAY = 86_400;

/**
 * US capital-gains holding-period threshold. A position is long-term when held
 * for MORE THAN one year (strictly greater than 365 days).
 */
export const LONG_TERM_THRESHOLD_SECONDS = 365 * SECONDS_PER_DAY;

/** UTC [start, endExclusive) unix-second bounds for a tax (calendar) year. */
export function taxYearBounds(year: number): {
  start: number;
  endExclusive: number;
} {
  const start = Math.floor(Date.UTC(year, 0, 1) / 1000);
  const endExclusive = Math.floor(Date.UTC(year + 1, 0, 1) / 1000);
  return { start, endExclusive };
}

/** True when a unix-seconds timestamp falls within the given tax year (UTC). */
export function inTaxYear(timestamp: number, year: number): boolean {
  const { start, endExclusive } = taxYearBounds(year);
  return timestamp >= start && timestamp < endExclusive;
}
