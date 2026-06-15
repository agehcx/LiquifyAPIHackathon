"use client";

import { useState, useRef, useEffect } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "@/components/primitives/Button";
import { truncateAddress } from "@/lib/format/address";

/** Connect / disconnect control with a dropdown for selecting the wallet connector. */
export function ConnectButton() {
  const [showOptions, setShowOptions] = useState(false);
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    }
    if (showOptions) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showOptions]);

  if (isConnected && address) {
    return (
      <Button variant="secondary" onClick={() => disconnect()}>
        <span className="font-mono text-sm">{truncateAddress(address)}</span>
      </Button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button onClick={() => setShowOptions(!showOptions)} disabled={isPending}>
        {isPending ? "Connecting…" : "Connect Wallet"}
      </Button>

      {showOptions && connectors.length > 0 && (
        <div className="absolute right-0 top-full mt-2 flex w-48 flex-col gap-1 rounded-[10px] border border-line bg-surface p-2 shadow-xl z-50">
          <div className="mb-1 px-2 pt-1 text-[10px] font-bold uppercase tracking-widest text-subtle">
            Select Wallet
          </div>
          {connectors.map((connector) => (
            <button
              key={connector.uid}
              className="flex w-full items-center justify-start rounded-md px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-canvas disabled:opacity-50"
              onClick={() => {
                connect({ connector });
                setShowOptions(false);
              }}
              disabled={isPending}
            >
              {connector.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
