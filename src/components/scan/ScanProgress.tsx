import { Card } from "@/components/primitives/Card";
import { Skeleton } from "@/components/primitives/Skeleton";

export function ScanProgress() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-6 w-64" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Card key={i} className="flex flex-col gap-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-7 w-32" />
          </Card>
        ))}
      </div>
      <Card className="flex flex-col gap-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </Card>
      <p className="text-center font-mono text-xs text-muted">
        Indexing protocols · classifying events · computing cost basis…
      </p>
    </div>
  );
}
