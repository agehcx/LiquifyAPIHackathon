import { formatUsd } from "@/lib/format/number";
import { cn } from "@/lib/cn";

/** Renders a USD value in mono/tabular with gain-loss coloring. */
export function Money({
  value,
  colorBySign = false,
  className,
}: {
  value: string;
  colorBySign?: boolean;
  className?: string;
}) {
  const negative = value.trim().startsWith("-");
  const color = colorBySign
    ? negative
      ? "text-error"
      : "text-success"
    : undefined;
  const display = `${negative ? "-" : colorBySign ? "+" : ""}$${formatUsd(
    negative ? value.slice(1) : value,
  )}`;
  return (
    <span className={cn("font-mono tabular tracking-tight", color, className)}>
      {display}
    </span>
  );
}
