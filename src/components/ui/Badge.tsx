import * as React from "react";

type BadgeVariant = "default" | "outline";

const baseClassName =
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition";

const variantClassName: Record<BadgeVariant, string> = {
  default: "border-transparent bg-violet-100 text-violet-800 hover:bg-violet-200",
  outline: "border-violet-200 bg-white text-slate-700 hover:bg-violet-50",
};

function cn(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return <div className={cn(baseClassName, variantClassName[variant], className)} {...props} />;
}
