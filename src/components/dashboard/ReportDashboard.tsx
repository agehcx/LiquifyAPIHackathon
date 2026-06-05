"use client";

import { useState } from "react";
import Link from "next/link";
import { useTaxReport } from "@/hooks/useTaxReport";
import { ScanProgress } from "@/components/scan/ScanProgress";
import { Card } from "@/components/primitives/Card";
import { Button } from "@/components/primitives/Button";
import { PaymentModal } from "@/components/payment/PaymentModal";
import { SummaryHeader } from "./SummaryHeader";
import { PnLStatCard } from "./PnLStatCard";
import { BlurredTable } from "./BlurredTable";
import { LockCallout } from "./LockCallout";

export function ReportDashboard({
  address,
  taxYear,
}: {
  address: string;
  taxYear: number;
}) {
  const { data, isLoading, isError, error } = useTaxReport(address, taxYear);
  const [payOpen, setPayOpen] = useState(false);

  if (isLoading) return <ScanProgress />;

  if (isError || !data) {
    return (
      <Card className="flex flex-col items-center gap-4 py-12 text-center">
        <p className="text-error">{(error as Error)?.message ?? "Scan failed."}</p>
        <Link href="/">
          <Button variant="secondary">Try another wallet</Button>
        </Link>
      </Card>
    );
  }

  const s = data.summary;
  const taxableEvents = s.disposalCount + s.incomeCount;

  return (
    <div className="flex flex-col gap-6">
      <SummaryHeader
        address={data.address}
        taxYear={data.taxYear}
        protocols={data.protocolsDetected}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <PnLStatCard
          label="Net Capital Gain"
          value={s.totalCapitalGainUsd}
          colorBySign
          blurred
        />
        <PnLStatCard
          label="DeFi Income"
          value={s.totalOrdinaryIncomeUsd}
          blurred
        />
        <PnLStatCard label="Taxable Events" plain={String(taxableEvents)} />
        <PnLStatCard
          label="Protocols"
          plain={String(data.protocolsDetected.length)}
        />
      </div>

      {s.zeroBasisCount > 0 && (
        <Card className="border-warning/40 bg-[rgba(245,158,11,0.12)] text-sm text-ink">
          <span className="font-semibold text-warning">Heads up:</span>{" "}
          {s.zeroBasisCount} disposal{s.zeroBasisCount === 1 ? "" : "s"} had no
          recorded cost basis and were treated as zero-basis. Review these in the
          exported report.
        </Card>
      )}

      <LockCallout onExport={() => setPayOpen(true)} />

      <BlurredTable summary={data} />

      {payOpen && (
        <PaymentModal
          address={address}
          taxYear={taxYear}
          onClose={() => setPayOpen(false)}
        />
      )}
    </div>
  );
}
