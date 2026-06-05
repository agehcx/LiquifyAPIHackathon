import { z } from "zod";

/** Shared validation for report requests (summary + export). */
export const reportRequestSchema = z.object({
  address: z
    .string()
    .regex(/^0x[0-9a-fA-F]{40}$/, "must be a 0x-prefixed 40-hex address"),
  taxYear: z.coerce.number().int().min(2015).max(2030),
});

export type ReportRequestInput = z.infer<typeof reportRequestSchema>;

/** Parse report params from a URL's query string. */
export function parseReportQuery(url: URL): ReportRequestInput {
  return reportRequestSchema.parse({
    address: url.searchParams.get("address"),
    taxYear: url.searchParams.get("taxYear"),
  });
}
