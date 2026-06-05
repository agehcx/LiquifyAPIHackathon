"use client";

import { useAccount } from "wagmi";
import type { Address } from "@/types/domain";

/** Thin wrapper over wagmi useAccount, normalizing the connected address. */
export function useWalletAddress(): {
  address: Address | undefined;
  isConnected: boolean;
} {
  const { address, isConnected } = useAccount();
  return {
    address: address?.toLowerCase() as Address | undefined,
    isConnected,
  };
}
