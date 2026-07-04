import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "outline" | "saved";
type ButtonSize = "default" | "sm";

const baseClassName =
  "inline-flex items-center justify-center rounded-xl text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2";

const variantClassName: Record<ButtonVariant, string> = {
  default: "bg-violet-600 text-white shadow-sm hover:bg-violet-700",
  outline: "border border-violet-200 bg-white text-violet-700 hover:bg-violet-50",
  saved: "bg-emerald-100 text-emerald-700 cursor-default",
};

const sizeClassName: Record<ButtonSize, string> = {
  default: "h-10 px-4",
  sm: "h-9 px-3",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(baseClassName, variantClassName[variant], sizeClassName[size], className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
