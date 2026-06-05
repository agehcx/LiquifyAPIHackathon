import { NextResponse } from "next/server";
import { z } from "zod";
import type { FreeSummaryResponse } from "@/types/api";
import { getOrBuildReport } from "@/lib/report/getReport";
import { parseReportQuery } from "@/lib/api/validation";

export const dynamic = "force-dynamic";

/**
 * FREE tier. Returns headline figures + counts + a non-sensitive teaser only.
 * Per-row USD figures are deliberately withheld so the paywall cannot be
 * bypassed by reading the network response — those ship from /api/export after
 * the x402 payment settles.
 */
export async function GET(request: Request): Promise<NextResponse> {
  let params;
  try {
    params = parseReportQuery(new URL(request.url));
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.issues[0]?.message ?? "Invalid request", code: "BAD_REQUEST" },
        { status: 400 },
      );
    }
    throw err;
  }

  const report = await getOrBuildReport(params.address, params.taxYear);

  const body: FreeSummaryResponse = {
    address: report.address,
    taxYear: report.taxYear,
    summary: report.summary,
    previewRowCount: report.gainLossRows.length + report.incomeRows.length,
    sampleRows: report.gainLossRows.slice(0, 3).map((r) => ({
      symbol: r.symbol,
      holdingPeriod: r.holdingPeriod,
    })),
    protocolsDetected: report.protocolsDetected,
    locked: true,
  };

  return NextResponse.json(body);
}
