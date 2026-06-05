"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/primitives/Button";
import { useWalletAddress } from "@/hooks/useWalletAddress";
import { isAddress } from "@/lib/format/address";
import { DEMO_WALLET } from "@/lib/liquify/fixtures";

const YEARS = [2025, 2024];

export function WalletScanForm() {
  const router = useRouter();
  const { address: connected } = useWalletAddress();
  // Show the user's typed value once they've edited; otherwise fall back to the
  // connected wallet (no effect-driven state sync).
  const [typed, setTyped] = useState<string | null>(null);
  const [taxYear, setTaxYear] = useState(YEARS[0]);

  const address = typed ?? connected ?? "";
  const valid = isAddress(address);
  const setAddress = (v: string) => setTyped(v);

  return (
    <form
      className="flex w-full max-w-xl flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (valid) router.push(`/report?address=${address}&taxYear=${taxYear}`);
      }}
    >
      <input
        value={address}
        onChange={(e) => setAddress(e.target.value.trim())}
        placeholder="0x… wallet address"
        spellCheck={false}
        className="h-12 rounded-[8px] border border-line bg-surface px-4 font-mono text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-brand"
      />
      <div className="flex gap-3">
        <select
          value={taxYear}
          onChange={(e) => setTaxYear(Number(e.target.value))}
          className="h-12 rounded-[8px] border border-line bg-surface px-3 font-mono text-sm text-ink outline-none focus:border-brand"
        >
          {YEARS.map((y) => (
            <option key={y} value={y}>
              Tax year {y}
            </option>
          ))}
        </select>
        <Button type="submit" disabled={!valid} className="flex-1 h-12">
          Scan Wallet
        </Button>
      </div>
      <button
        type="button"
        onClick={() => setAddress(DEMO_WALLET)}
        className="self-start font-mono text-xs text-muted underline-offset-2 hover:text-brand hover:underline"
      >
        Use demo wallet
      </button>
    </form>
  );
}
