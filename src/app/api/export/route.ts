import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getOrBuildReport } from "@/lib/report/getReport";
import { toCsv } from "@/lib/export/csvExporter";
import { toPdf } from "@/lib/export/pdfExporter";
import { parseReportQuery } from "@/lib/api/validation";
import { isPaymentDemoMode, x402ServerConfig } from "@/lib/config/env";

export const dynamic = "force-dynamic";

type RouteHandler = (request: NextRequest) => Promise<NextResponse>;

/**
 * PAID tier. Generates the full CSV report. Payment is enforced by the x402
 * wrapper (HTTP 402 until a settled USDC payment is presented); the handler
 * itself contains no payment logic. In demo mode the wrapper is omitted.
 */
const handler: RouteHandler = async (request) => {
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

  const report = await getOrBuildReport(params.address, params.chainId, params.taxYear, params.costBasisMethod);
  
  if (params.format === "pdf") {
    const pdf = await toPdf(report);
    const filename = `defi-taxgen-${params.address.slice(0, 10)}-${params.taxYear}.pdf`;
    return new NextResponse(pdf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  }

  const csv = toCsv(report);
  const filename = `defi-taxgen-${params.address.slice(0, 10)}-${params.taxYear}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
};

// Resolve the (optionally x402-gated) handler once, lazily. x402-next is
// imported only when the gate is active, so demo mode pulls in no payment code.
let resolved: RouteHandler | null = null;
async function resolveHandler(): Promise<RouteHandler> {
  if (resolved) return resolved;

  const cfg = x402ServerConfig();
  if (isPaymentDemoMode() || !cfg.payTo) {
    resolved = handler;
    return resolved;
  }

  const { withX402 } = await import("x402-next");
  resolved = withX402(
    handler,
    cfg.payTo,
    {
      price: cfg.priceUsd,
      network: cfg.network,
      config: { description: "Full DeFi Tax Report Export (CSV/PDF)" },
    },
    cfg.facilitatorUrl
      ? { url: cfg.facilitatorUrl as `${string}://${string}` }
      : undefined,
  ) as RouteHandler;
  return resolved;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const h = await resolveHandler();
  return h(request);
}
