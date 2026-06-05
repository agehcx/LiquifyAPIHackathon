import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-[8px] px-4 h-11 text-sm font-semibold transition-all duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-brand-hover shadow-sm",
  secondary:
    "bg-surface text-ink border border-line hover:bg-elevated",
  ghost: "text-subtle hover:text-ink hover:bg-elevated",
};

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  return (
    <button className={cn(base, variants[variant], className)} {...props} />
  );
}
