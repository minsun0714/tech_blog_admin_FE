import * as React from "react";

type ButtonVariant = "default" | "outline";
type ButtonSize = "default" | "sm";

const baseClassName =
  "inline-flex items-center justify-center rounded-xl text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";

const variantClassName: Record<ButtonVariant, string> = {
  default: "bg-violet-600 text-white shadow-sm hover:bg-violet-700",
  outline: "border border-violet-200 bg-white text-violet-700 hover:bg-violet-50",
};

const sizeClassName: Record<ButtonSize, string> = {
  default: "h-10 px-4",
  sm: "h-9 px-3",
};

function cn(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

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
