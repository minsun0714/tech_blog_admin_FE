import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300",
  {
    variants: {
      variant: {
        default: "border-violet-600 bg-violet-600 text-white",
        secondary: "border-violet-200 bg-violet-100 text-violet-800",
        destructive: "border-rose-200 bg-rose-100 text-rose-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  removable?: boolean;
  onRemove?: () => void;
}

function Badge({ className, variant, removable = false, onRemove, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      <span>{children}</span>
      {removable && onRemove ? (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onRemove();
          }}
          className="rounded-full p-0.5 transition hover:bg-black/10"
          aria-label="삭제"
        >
          <X className="h-3 w-3" />
        </button>
      ) : null}
    </div>
  );
}

export { Badge, badgeVariants };
