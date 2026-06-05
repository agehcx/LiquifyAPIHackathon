import { truncateAddress } from "@/lib/format/address";

export function SummaryHeader({
  address,
  taxYear,
  protocols,
}: {
  address: string;
  taxYear: number;
  protocols: readonly string[];
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-[28px] font-semibold tracking-tight text-ink">
          Tax Report
        </h1>
        <span className="rounded-full bg-elevated px-2.5 py-1 font-mono text-xs text-subtle">
          {truncateAddress(address)}
        </span>
        <span className="rounded-full bg-brand-muted px-2.5 py-1 font-mono text-xs text-brand">
          {taxYear}
        </span>
      </div>
      {protocols.length > 0 && (
        <p className="text-sm text-subtle">
          Detected:{" "}
          <span className="text-ink">{protocols.join(" · ")}</span>
        </p>
      )}
    </div>
  );
}
