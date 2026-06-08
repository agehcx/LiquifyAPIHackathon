"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
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
      <Card className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-error font-medium">
          {(error as Error)?.message ?? "Scan failed."}
        </p>
        <Link href="/">
          <Button variant="secondary">Try another wallet</Button>
        </Link>
      </Card>
    );
  }

  const s = data.summary;
  const taxableEvents = s.disposalCount + s.incomeCount;

  return (
    <div className="flex flex-col gap-6 pb-16">
      <SummaryHeader
        address={data.address}
        taxYear={data.taxYear}
        protocols={data.protocolsDetected}
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <PnLStatCard
          label="Net Capital Gain"
          value={s.totalCapitalGainUsd}
          colorBySign
          blurred
          accent="green"
        />
        <PnLStatCard
          label="DeFi Income"
          value={s.totalOrdinaryIncomeUsd}
          blurred
          accent="blue"
        />
        <PnLStatCard
          label="Taxable Events"
          plain={String(taxableEvents)}
        />
        <PnLStatCard
          label="Protocols"
          plain={String(data.protocolsDetected.length)}
        />
      </div>

      {/* Zero-basis warning */}
      {s.zeroBasisCount > 0 && (
        <div className="flex items-start gap-3 rounded-[10px] border border-warning/40 bg-warning/8 px-4 py-3 text-sm">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
          <span>
            <span className="font-semibold text-warning">Heads up: </span>
            <span className="text-ink">
              {s.zeroBasisCount} disposal{s.zeroBasisCount === 1 ? "" : "s"}{" "}
              had no recorded cost basis and were treated as zero-basis. Review
              these rows in your exported report.
            </span>
          </span>
        </div>
      )}

      {/* Paywall CTA */}
      <LockCallout onExport={() => setPayOpen(true)} />

      {/* Teaser table */}
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
