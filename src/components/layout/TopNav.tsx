import Link from "next/link";
import { ConnectButton } from "@/components/wallet/ConnectButton";

export function TopNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-brand" />
          <span className="text-sm font-semibold tracking-tight text-ink">
            DeFi TaxGen
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
            x402
          </span>
        </Link>
        <ConnectButton />
      </div>
    </header>
  );
}
