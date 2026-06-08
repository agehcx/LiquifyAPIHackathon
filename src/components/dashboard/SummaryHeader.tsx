import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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
    <div className="flex flex-col gap-4">
      {/* Breadcrumb */}
      <Link
        href="/"
        className="inline-flex w-fit items-center gap-1.5 text-[12px] text-muted transition-colors hover:text-brand"
      >
        <ArrowLeft className="size-3.5" />
        New scan
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-[32px] font-bold leading-none tracking-tight text-ink">
              Tax Report
            </h1>
            <span className="rounded-full bg-brand-muted px-2.5 py-1 font-mono text-xs font-semibold text-brand">
              {taxYear}
            </span>
          </div>
          <span className="font-mono text-sm text-subtle">{address}</span>
        </div>

        {/* Protocol badges */}
        {protocols.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {protocols.map((p) => (
              <span
                key={p}
                className="rounded-full border border-line bg-surface px-2.5 py-1 text-[11px] font-medium text-subtle"
              >
                {p}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
