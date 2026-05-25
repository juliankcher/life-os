import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none px-6 py-3",
          variant === "default" && "bg-blue-500 text-white hover:bg-blue-600",
          variant === "outline" && "border border-slate-300 bg-white hover:bg-slate-50",
          variant === "ghost" && "hover:bg-slate-100",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
