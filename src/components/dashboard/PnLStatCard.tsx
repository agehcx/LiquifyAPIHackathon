import { Card } from "@/components/primitives/Card";
import { Money } from "@/components/primitives/Money";
import { cn } from "@/lib/cn";

interface Props {
  label: string;
  value?: string;
  plain?: string;
  colorBySign?: boolean;
  blurred?: boolean;
  accent?: "default" | "green" | "red" | "blue";
}

const accentBorder: Record<NonNullable<Props["accent"]>, string> = {
  default: "border-line",
  green: "border-l-4 border-l-brand border-line",
  red: "border-l-4 border-l-error border-line",
  blue: "border-l-4 border-l-info border-line",
};

export function PnLStatCard({
  label,
  value,
  plain,
  colorBySign,
  blurred,
  accent = "default",
}: Props) {
  return (
    <Card className={cn("flex flex-col gap-3", accentBorder[accent])}>
      <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
        {label}
      </span>
      <span
        className={cn(
          "text-[28px] font-bold leading-none tracking-tight",
          blurred && "blur-sm select-none",
        )}
      >
        {value !== undefined ? (
          <Money value={value} colorBySign={colorBySign} />
        ) : (
          <span className="font-mono tabular text-ink">{plain}</span>
        )}
      </span>
    </Card>
  );
}
