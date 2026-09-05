"use client";

import type { ComponentProps } from "react";

import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "@/utils/cn";

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverAnchor = PopoverPrimitive.Anchor;
export const PopoverClose = PopoverPrimitive.Close;

export function PopoverContent({
  className,
  align = "start",
  sideOffset = 8,
  ...props
}: ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        align={align}
        sideOffset={sideOffset}
        collisionPadding={12}
        className={cn(
          "anim-pop z-50 w-[var(--radix-popover-trigger-width)] min-w-[15rem] rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-e3",
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}
