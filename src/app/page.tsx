import { WalletScanForm } from "@/components/scan/WalletScanForm";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col items-center justify-center gap-8 px-6 py-24 text-center">
      <span className="rounded-full bg-brand-muted px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-brand">
        Liquify Indexer API · Challenge 3
      </span>
      <h1 className="text-[56px] font-bold leading-[1.1] tracking-tight text-ink">
        Your DeFi taxes,
        <br />
        done in 3 minutes.
      </h1>
      <p className="max-w-xl text-base leading-relaxed text-subtle">
        Paste a wallet address, get a tax-ready DeFi report. No account, no
        subscription — pay <span className="font-mono">$2 USDC</span> only when
        you export.
      </p>
      <WalletScanForm />
    </main>
  );
}
