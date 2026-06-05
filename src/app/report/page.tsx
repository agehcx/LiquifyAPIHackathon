import Link from "next/link";
import { ReportDashboard } from "@/components/dashboard/ReportDashboard";
import { Button } from "@/components/primitives/Button";
import { Card } from "@/components/primitives/Card";
import { isAddress } from "@/lib/format/address";

export default async function ReportPage({
  searchParams,
}: {
  searchParams: Promise<{ address?: string; taxYear?: string }>;
}) {
  const { address, taxYear } = await searchParams;
  const year = Number(taxYear);
  const valid = address && isAddress(address) && Number.isInteger(year);

  return (
    <main className="mx-auto w-full max-w-[1280px] flex-1 px-6 py-10">
      {valid ? (
        <ReportDashboard address={address.toLowerCase()} taxYear={year} />
      ) : (
        <Card className="flex flex-col items-center gap-4 py-12 text-center">
          <p className="text-subtle">Provide a valid wallet address to scan.</p>
          <Link href="/">
            <Button>Go home</Button>
          </Link>
        </Card>
      )}
    </main>
  );
}
