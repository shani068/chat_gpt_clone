"use client";

import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/cn";

import { Tooltip } from "./tooltip";

const iconButtonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center",
    "transition-[background-color,color,opacity,transform] duration-[120ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
    "active:scale-95 disabled:pointer-events-none disabled:opacity-40",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
  ].join(" "),
  {
    variants: {
      variant: {
        ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
        outline:
          "border-border bg-card text-muted-foreground shadow-e1 hover:border-foreground/20 hover:text-foreground border",
        solid: "bg-primary text-primary-foreground hover:bg-primary/90",
        accent: "bg-accent text-accent-foreground hover:bg-accent/90",
        destructive:
          "text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
      },
      size: {
        xs: "size-6 rounded-sm",
        sm: "size-7 rounded-md",
        md: "size-8 rounded-md",
        lg: "size-9 rounded-lg",
      },
      /** Renders the pressed/selected state for toggles. */
      active: { true: "", false: "" },
    },
    compoundVariants: [
      {
        variant: "ghost",
        active: true,
        className: "bg-muted text-foreground",
      },
    ],
    defaultVariants: { variant: "ghost", size: "md", active: false },
  },
);

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">,
    VariantProps<typeof iconButtonVariants> {
  /** Doubles as the accessible name and the tooltip copy. */
  label: string;
  icon: ReactNode;
  shortcut?: string[];
  tooltipSide?: "top" | "right" | "bottom" | "left";
  /** Turn off on touch layouts, where hover tooltips never resolve. */
  showTooltip?: boolean;
  ref?: Ref<HTMLButtonElement>;
}

/**
 * Icon-only control. The label is mandatory — an unlabelled icon button is
 * invisible to assistive tech, so the API makes it impossible to omit.
 */
export function IconButton({
  label,
  icon,
  shortcut,
  tooltipSide = "top",
  showTooltip = true,
  variant,
  size,
  active,
  className,
  ...props
}: IconButtonProps) {
  const button = (
    <button
      type={props.type ?? "button"}
      aria-label={label}
      aria-pressed={active === true ? true : undefined}
      className={cn(iconButtonVariants({ variant, size, active }), className)}
      {...props}
    >
      {icon}
    </button>
  );

  if (!showTooltip) return button;

  return (
    <Tooltip label={label} shortcut={shortcut} side={tooltipSide}>
      {button}
    </Tooltip>
  );
}
