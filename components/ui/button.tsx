"use client";

import type { ButtonHTMLAttributes, Ref } from "react";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/utils/cn";

/**
 * Every interactive surface in the product routes through here, so hover,
 * focus, pressed and disabled treatments stay identical everywhere.
 */
const buttonVariants = cva(
  [
    "relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap",
    "font-medium select-none",
    "transition-[background-color,border-color,color,opacity,transform] duration-[120ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
    "active:scale-[0.98]",
    "disabled:pointer-events-none disabled:opacity-45",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
  ].join(" "),
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-e1 hover:bg-primary/90",
        secondary:
          "border-border bg-card text-foreground shadow-e1 hover:border-foreground/20 hover:bg-muted border",
        ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
        subtle: "bg-muted text-foreground hover:bg-muted/70",
        accent:
          "bg-accent text-accent-foreground shadow-e1 hover:bg-accent/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-e1 hover:bg-destructive/90",
        "destructive-ghost":
          "text-destructive hover:bg-destructive/10 hover:text-destructive",
        link: "text-foreground underline-offset-4 hover:underline active:scale-100",
      },
      size: {
        xs: "text-caption h-7 rounded-sm px-2",
        sm: "text-small h-8 rounded-md px-3",
        md: "text-small h-9 rounded-lg px-3.5",
        lg: "text-body h-11 rounded-lg px-5",
      },
      block: { true: "w-full", false: "" },
    },
    defaultVariants: { variant: "secondary", size: "md", block: false },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  ref?: Ref<HTMLButtonElement>;
}

export function Button({
  className,
  variant,
  size,
  block,
  asChild,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : "button";
  // Slot accepts exactly one child, so the spinner is a non-asChild affordance.
  const showSpinner = loading && !asChild;

  return (
    <Component
      // asChild forwards to a link, which has no `disabled` — guard it.
      {...(asChild
        ? {}
        : { type: props.type ?? "button", disabled: disabled === true || loading })}
      aria-busy={loading ? true : undefined}
      className={cn(buttonVariants({ variant, size, block }), className)}
      {...props}
    >
      {showSpinner ? (
        <>
          <Loader2 size={15} strokeWidth={2.25} aria-hidden className="animate-spin" />
          {children}
        </>
      ) : (
        children
      )}
    </Component>
  );
}

export { buttonVariants };
