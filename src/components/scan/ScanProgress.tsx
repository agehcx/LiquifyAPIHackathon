import { Card } from "@/components/primitives/Card";
import { Skeleton } from "@/components/primitives/Skeleton";

const STEPS = [
  "Fetching on-chain events",
  "Classifying protocols",
  "Computing FIFO cost basis",
  "Aggregating tax report",
];

export function ScanProgress() {
  return (
    <div className="flex flex-col gap-6 pb-16">
      {/* Header skeleton */}
      <div className="flex flex-col gap-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-4 w-80" />
      </div>

      {/* Stat card skeletons */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Card key={i} className="flex flex-col gap-3">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-8 w-28" />
          </Card>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="overflow-hidden rounded-[10px] border border-line bg-surface">
        <div className="border-b border-line px-5 py-3">
          <Skeleton className="h-3 w-36" />
        </div>
        <div className="divide-y divide-line/50">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-6 px-5 py-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="ml-auto h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>

      {/* Progress steps */}
      <div className="flex flex-col items-center gap-3 py-4">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1 w-6 animate-pulse rounded-full bg-brand/30"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
        <div className="flex flex-col items-center gap-1">
          {STEPS.map((step, i) => (
            <p key={i} className="font-mono text-[11px] text-muted">
              {step}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
