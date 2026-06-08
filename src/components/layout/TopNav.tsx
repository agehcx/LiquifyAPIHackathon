import Link from "next/link";
import { ConnectButton } from "@/components/wallet/ConnectButton";

export function TopNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3">
          {/* Logo mark */}
          <span className="flex size-7 items-center justify-center rounded-[7px] bg-brand text-[11px] font-bold text-white">
            T
          </span>
          <span className="text-sm font-semibold tracking-tight text-ink">
            DeFi TaxGen
          </span>
          <span className="hidden rounded-full bg-brand-muted px-2 py-0.5 font-mono text-[10px] font-semibold text-brand sm:inline-flex">
            x402
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {/* Network badge */}
          <span className="hidden items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1 font-mono text-[10px] text-subtle sm:flex">
            <span className="size-1.5 rounded-full bg-brand" />
            Base Sepolia
          </span>
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}
