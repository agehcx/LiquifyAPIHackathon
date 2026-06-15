"use client";

import { useCallback, useState } from "react";
import { useAccount, useSwitchChain, usePublicClient, useWriteContract } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { parseUnits } from "viem";

export type PaymentPhase =
  | "idle"
  | "switching"
  | "paying"
  | "confirming"
  | "downloading"
  | "done"
  | "error";

const USDC_ADDRESS = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
const PAY_TO = "0x7D5D9bCE966bBD4F698CDa092Fe8e426261483C2";

function triggerDownload(csv: string, filename: string) {
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * PRODUCTION READY PAYMENT: Performs a real USDC transfer on Base Sepolia.
 */
export function useExportPayment(address?: string, taxYear?: number) {
  const [phase, setPhase] = useState<PaymentPhase>("idle");
  const [error, setError] = useState<string | null>(null);
  const { isConnected, chainId, address: connectedAddress } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient({ chainId: baseSepolia.id });

  const isDemo = process.env.NEXT_PUBLIC_X402_DEMO_MODE === "true";

  const exportReport = useCallback(async () => {
    if (!address || !taxYear) return;
    setError(null);
    const filename = `defi-taxgen-${address.slice(0, 10)}-${taxYear}.csv`;

    try {
      if (isDemo) {
        setPhase("downloading");
        const res = await fetch(`/api/export?address=${address}&taxYear=${taxYear}&force=true`);
        const csv = await res.text();
        triggerDownload(csv, filename);
        setPhase("done");
        return;
      }

      // 1. Ensure Connection
      if (!isConnected) {
        throw new Error("Connect your wallet first.");
      }

      // 2. Switch to Base Sepolia
      if (chainId !== baseSepolia.id) {
        setPhase("switching");
        await switchChainAsync({ chainId: baseSepolia.id });
      }

      // 3. Real USDC Payment (1 USDC)
      setPhase("paying");

      if (connectedAddress && publicClient) {
        const [usdcBalance, ethBalance] = await Promise.all([
          publicClient.readContract({
            address: USDC_ADDRESS,
            abi: [
              {
                name: "balanceOf",
                type: "function",
                stateMutability: "view",
                inputs: [{ name: "account", type: "address" }],
                outputs: [{ name: "", type: "uint256" }],
              },
            ],
            functionName: "balanceOf",
            args: [connectedAddress],
          }) as Promise<bigint>,
          publicClient.getBalance({ address: connectedAddress }),
        ]);
        
        if (usdcBalance < parseUnits("1", 6)) {
          throw new Error("Insufficient Base Sepolia USDC. You need at least 1 USDC.");
        }

        if (ethBalance === 0n) {
          throw new Error("Insufficient Base Sepolia ETH. You need ETH to pay for transaction gas.");
        }
      }

      const hash = await writeContractAsync({
        address: USDC_ADDRESS,
        abi: [
          {
            name: "transfer",
            type: "function",
            stateMutability: "nonpayable",
            inputs: [
              { name: "recipient", type: "address" },
              { name: "amount", type: "uint256" },
            ],
            outputs: [{ name: "", type: "bool" }],
          },
        ],
        functionName: "transfer",
        args: [PAY_TO, parseUnits("1", 6)],
      });

      // 4. Confirm Transaction
      setPhase("confirming");
      await publicClient?.waitForTransactionReceipt({ hash });

      // 5. Download Report
      setPhase("downloading");
      const res = await fetch(`/api/export?address=${address}&taxYear=${taxYear}&force=true`);
      const csv = await res.text();
      triggerDownload(csv, filename);
      setPhase("done");
    } catch (err) {
      console.error("Payment error:", err);
      let msg = err instanceof Error ? err.message : "Payment failed";
      if (msg.includes("execution reverted")) {
        msg = "Transaction reverted. You likely don't have enough Base Sepolia USDC in your wallet.";
      }
      setError(msg);
      setPhase("error");
    }
  }, [address, taxYear, isConnected, chainId, connectedAddress, switchChainAsync, writeContractAsync, publicClient, isDemo]);

  return { phase, error, exportReport, isDemo };
}
