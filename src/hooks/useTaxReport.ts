"use client";

import { useQuery } from "@tanstack/react-query";
import type { FreeSummaryResponse } from "@/types/api";

async function fetchSummary(
  address: string,
  taxYear: number,
): Promise<FreeSummaryResponse> {
  const res = await fetch("/api/summary", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      address,
      taxYear,
    }),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? `Scan failed (${res.status})`);
  }
  return res.json() as Promise<FreeSummaryResponse>;
}

/** Fetches the free blurred summary for an (address, taxYear). */
export function useTaxReport(address?: string, taxYear?: number) {
  return useQuery({
    queryKey: ["summary", address, taxYear],
    queryFn: () => fetchSummary(address!, taxYear!),
    enabled: Boolean(address && taxYear),
  });
}
