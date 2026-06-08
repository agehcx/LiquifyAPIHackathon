import type { ReactNode } from "react";
import { WalletScanForm } from "@/components/scan/WalletScanForm";
import { FileText, TrendingUp, Shield, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* ── Hero ── */}
      <main className="relative mx-auto flex w-full max-w-[1280px] flex-col items-center justify-center gap-8 overflow-hidden px-6 pb-24 pt-20 text-center lg:pt-32">
        {/* Subtle radial glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(16,185,129,0.10) 0%, transparent 70%)",
          }}
        />

        <span className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand-muted px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-brand">
          <span className="size-1.5 rounded-full bg-brand" />
          Liquify Indexer API · Challenge 3
        </span>

        <h1 className="max-w-3xl text-[52px] font-bold leading-[1.08] tracking-tight text-ink lg:text-[68px]">
          Your DeFi taxes,{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            done in minutes.
          </span>
        </h1>

        <p className="max-w-lg text-base leading-relaxed text-subtle lg:text-lg">
          Paste any wallet address, get a tax-ready DeFi report.
          No account, no subscription —{" "}
          <span className="font-mono text-ink">$2 USDC</span> only when you
          export.
        </p>

        <div className="w-full max-w-xl">
          <WalletScanForm />
        </div>

        {/* Trust strip */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
          <span>Ethereum Mainnet</span>
          <span className="size-1 rounded-full bg-line" />
          <span>Uniswap V2 / V3</span>
          <span className="size-1 rounded-full bg-line" />
          <span>Payments on Base</span>
          <span className="size-1 rounded-full bg-line" />
          <span>IRS Form 8949</span>
        </div>
      </main>

      {/* ── How it works ── */}
      <section className="border-t border-line bg-surface">
        <div className="mx-auto max-w-[1280px] px-6 py-16">
          <p className="mb-10 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
            How it works
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <Step
              number="01"
              title="Paste your wallet"
              body="Enter any Ethereum address — no wallet connection required to scan."
            />
            <Step
              number="02"
              title="Review your free summary"
              body="Instantly see your taxable event count, detected protocols, and headline P&L."
            />
            <Step
              number="03"
              title="Export for $2 USDC"
              body="Pay once via x402 micropayment on Base. Download your accountant-ready CSV."
            />
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-[1280px] px-6 py-16">
          <p className="mb-10 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
            What you get
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Feature
              icon={<FileText className="size-5" />}
              title="IRS Form 8949"
              body="Every capital gain and loss in the exact format your accountant needs."
            />
            <Feature
              icon={<TrendingUp className="size-5" />}
              title="FIFO cost basis"
              body="Precise lot matching across all your swaps. Short-term vs long-term split automatically."
            />
            <Feature
              icon={<Shield className="size-5" />}
              title="Staking & airdrops"
              body="Ordinary income events classified correctly, separate from capital gains."
            />
            <Feature
              icon={<Zap className="size-5" />}
              title="No account needed"
              body="x402 micropayments mean zero sign-up, zero subscription, zero lock-in."
            />
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-5 text-[12px] text-muted">
          <span>DeFi TaxGen + x402</span>
          <span>Hackathon MVP · Not financial advice</span>
        </div>
      </footer>
    </div>
  );
}

function Step({
  number,
  title,
  body,
}: {
  number: string;
  title: string;
  body: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-[10px] border border-line bg-canvas p-6">
      <span className="font-mono text-2xl font-bold text-brand">{number}</span>
      <p className="font-semibold text-ink">{title}</p>
      <p className="text-sm leading-relaxed text-subtle">{body}</p>
    </div>
  );
}

function Feature({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-[10px] border border-line bg-surface p-5 transition-colors hover:border-brand/40 hover:bg-canvas">
      <span className="text-brand">{icon}</span>
      <p className="text-sm font-semibold text-ink">{title}</p>
      <p className="text-sm leading-relaxed text-subtle">{body}</p>
    </div>
  );
}
