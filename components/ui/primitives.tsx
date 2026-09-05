"use client";

import type { ComponentProps, HTMLAttributes, ReactNode } from "react";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/cn";

/* ── Separator ──────────────────────────────────────────────────────────── */

export function Separator({
  className,
  orientation = "horizontal",
  ...props
}: ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      decorative
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className,
      )}
      {...props}
    />
  );
}

/* ── Skeleton ───────────────────────────────────────────────────────────── */

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden
      className={cn("skeleton rounded-md", className)}
      {...props}
    />
  );
}

/* ── Badge ──────────────────────────────────────────────────────────────── */

const badgeVariants = cva(
  "text-caption inline-flex items-center gap-1 rounded-sm border px-1.5 py-0.5 font-medium whitespace-nowrap",
  {
    variants: {
      tone: {
        neutral: "border-border bg-muted text-muted-foreground",
        accent: "border-accent/30 bg-accent/10 text-accent-strong",
        success: "border-success/30 bg-success/10 text-success",
        outline: "border-border text-muted-foreground bg-transparent",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}

/* ── Kbd ────────────────────────────────────────────────────────────────── */

export function Kbd({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <kbd
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded-sm border border-border bg-muted px-1.5 font-sans text-[0.6875rem] font-medium text-muted-foreground",
        className,
      )}
    >
      {children}
    </kbd>
  );
}

/* ── Avatar ─────────────────────────────────────────────────────────────── */

export function Avatar({
  name,
  src,
  size = 28,
  className,
}: {
  name: string;
  src?: string;
  size?: number;
  className?: string;
}) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <AvatarPrimitive.Root
      style={{ width: size, height: size }}
      className={cn(
        "relative flex shrink-0 select-none items-center justify-center overflow-hidden rounded-md border border-border bg-muted",
        className,
      )}
    >
      {src ? (
        <AvatarPrimitive.Image
          src={src}
          alt=""
          className="size-full object-cover"
        />
      ) : null}
      <AvatarPrimitive.Fallback
        delayMs={src ? 300 : 0}
        className="text-muted-foreground text-[0.6875rem] font-semibold tracking-wide"
      >
        {initials || "?"}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}

/* ── Switch ─────────────────────────────────────────────────────────────── */

export function Switch({
  className,
  ...props
}: ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-transparent p-0.5",
        "transition-colors duration-[180ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
        "data-[state=checked]:bg-accent data-[state=unchecked]:bg-input",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "pointer-events-none block size-4 rounded-full bg-background shadow-e1",
          "transition-transform duration-[180ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          "data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0",
        )}
      />
    </SwitchPrimitive.Root>
  );
}
