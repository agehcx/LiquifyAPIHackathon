import { Card } from "@/components/primitives/Card";
import { Money } from "@/components/primitives/Money";
import { cn } from "@/lib/cn";

interface Props {
  label: string;
  /** USD value to render, or undefined to show a count/plain value. */
  value?: string;
  plain?: string;
  colorBySign?: boolean;
  blurred?: boolean;
}

export function PnLStatCard({
  label,
  value,
  plain,
  colorBySign,
  blurred,
}: Props) {
  return (
    <Card className="flex flex-col gap-2">
      <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
        {label}
      </span>
      <span className={cn("text-2xl", blurred && "blur-sm select-none")}>
        {value !== undefined ? (
          <Money value={value} colorBySign={colorBySign} />
        ) : (
          <span className="font-mono tabular text-ink">{plain}</span>
        )}
      </span>
    </Card>
  );
}
