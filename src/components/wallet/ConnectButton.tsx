"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { Button } from "@/components/primitives/Button";
import { truncateAddress } from "@/lib/format/address";

/** Connect / disconnect control using the injected (MetaMask/Coinbase) connector. */
export function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <Button variant="secondary" onClick={() => disconnect()}>
        <span className="font-mono text-sm">{truncateAddress(address)}</span>
      </Button>
    );
  }

  return (
    <Button onClick={() => connect({ connector: injected() })} disabled={isPending}>
      {isPending ? "Connecting…" : "Connect Wallet"}
    </Button>
  );
}
