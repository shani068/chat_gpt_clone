"use client";

import type { ReactNode } from "react";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@/utils/cn";

export const TooltipProvider = TooltipPrimitive.Provider;

interface TooltipProps {
  label: ReactNode;
  /** Rendered right-aligned in the tooltip, e.g. ⌘K. */
  shortcut?: string[];
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  /** Suppresses the tooltip on touch layouts where hover does not exist. */
  disabled?: boolean;
  children: ReactNode;
}

export function Tooltip({
  label,
  shortcut,
  side = "top",
  align = "center",
  sideOffset = 6,
  disabled = false,
  children,
}: TooltipProps) {
  if (disabled) return <>{children}</>;

  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side={side}
          align={align}
          sideOffset={sideOffset}
          className={cn(
            "anim-pop z-[90] flex items-center gap-2 rounded-md border border-border bg-popover px-2 py-1.5 text-caption text-popover-foreground shadow-e2",
          )}
        >
          <span>{label}</span>
          {shortcut?.length ? (
            <span className="text-muted-foreground flex items-center gap-0.5">
              {shortcut.map((key) => (
                <kbd
                  key={key}
                  className="border-border bg-muted rounded-[4px] border px-1 font-sans text-[0.6875rem] leading-4"
                >
                  {key}
                </kbd>
              ))}
            </span>
          ) : null}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}
