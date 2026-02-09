import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

/*
  Button Variants Strategy
  ------------------------
  - default   → App theme (uses CSS variables)
  - auth      → Login / Signup (explicit slate + indigo)
  - others    → Safe variants
*/

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        /* ===============================
           APP THEME (AFTER LOGIN)
        =============================== */
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90",

        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",

        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",

        /* ===============================
           AUTH THEME (LOGIN / SIGNUP)
        =============================== */
        auth:
          "bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/20",

        outline:
          "border border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-700",

        ghost:
          "text-slate-100 hover:bg-slate-800",

        link:
          "text-indigo-400 underline-offset-4 hover:underline",
      },

      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-10 px-8",
        icon: "h-9 w-9",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
