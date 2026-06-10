"use client";

import { useCallback, useState } from "react";
import { useWalletClient, useSwitchChain, useAccount } from "wagmi";
import { baseSepolia } from "wagmi/chains";

export type PaymentPhase =
  | "idle"
  | "switching"
  | "signing"
  | "submitting"
  | "downloading"
  | "done"
  | "error";

/** Client-side demo bypass: anything other than an explicit "false" bypasses. */
export const CLIENT_DEMO_MODE =
  process.env.NEXT_PUBLIC_X402_DEMO_MODE !== "false";

function triggerDownload(csv: string, filename: string) {
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Drives the export: in demo mode it fetches the CSV directly; otherwise it
 * wraps fetch with x402 payment (sign on Base Sepolia) before downloading.
 */
export function useExportPayment(address?: string, taxYear?: number) {
  const [phase, setPhase] = useState<PaymentPhase>("idle");
  const [error, setError] = useState<string | null>(null);
  const { data: walletClient } = useWalletClient();
  const { switchChainAsync } = useSwitchChain();
  const { chainId } = useAccount();

  const exportReport = useCallback(async () => {
    if (!address || !taxYear) return;
    setError(null);
    const url = `/api/export?address=${address}&taxYear=${taxYear}`;
    const filename = `defi-taxgen-${address.slice(0, 10)}-${taxYear}.csv`;

    try {
      let doFetch: (input: string) => Promise<Response> = (u) => fetch(u);

      if (!CLIENT_DEMO_MODE) {
        if (!walletClient) throw new Error("Connect a wallet to pay.");
        if (chainId !== baseSepolia.id) {
          setPhase("switching");
          await switchChainAsync({ chainId: baseSepolia.id });
        }
        setPhase("signing");
        const { wrapFetchWithPayment } = await import("x402-fetch");
        doFetch = wrapFetchWithPayment(
          fetch,
          // viem wallet client from wagmi acts as the x402 signer
          walletClient as unknown as Parameters<typeof wrapFetchWithPayment>[1],
        );
      }

      setPhase("submitting");
      const res = await doFetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, taxYear }),
      });
      if (!res.ok) throw new Error(`Export failed (${res.status})`);

      setPhase("downloading");
      const csv = await res.text();
      triggerDownload(csv, filename);
      setPhase("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
      setPhase("error");
    }
  }, [address, taxYear, walletClient, switchChainAsync, chainId]);

  return { phase, error, exportReport, isDemo: CLIENT_DEMO_MODE };
}
