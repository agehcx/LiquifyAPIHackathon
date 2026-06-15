import { z } from "zod";
import { mainnet } from "wagmi/chains";

/** Shared validation for report requests (summary + export). */
export const reportRequestSchema = z.object({
  address: z
    .string()
    .regex(/^0x[0-9a-fA-F]{40}$/, "must be a 0x-prefixed 40-hex address"),
  chainId: z.coerce
    .number()
    .int()
    .transform((val) => (val <= 0 ? mainnet.id : val))
    .default(mainnet.id),
  taxYear: z.coerce.number().int().min(2015).max(2030),
  format: z.enum(["csv", "pdf"]).optional().default("csv"),
  costBasisMethod: z.enum(["FIFO", "HIFO", "SPECIFIC_ID"]).optional().default("FIFO"),
});

export type ReportRequestInput = z.infer<typeof reportRequestSchema>;

/** Parse report params from a URL's query string. */
export function parseReportQuery(url: URL, body: any = {}): ReportRequestInput {
  return reportRequestSchema.parse({
    address: body.address ?? url.searchParams.get("address"),
    chainId: body.chainId ?? url.searchParams.get("chainId"),
    taxYear: body.taxYear ?? url.searchParams.get("taxYear"),
    format: body.format ?? url.searchParams.get("format") ?? "csv",
    costBasisMethod: body.costBasisMethod ?? url.searchParams.get("costBasisMethod") ?? "FIFO",
  });
}
