"use client";

import type { ComponentProps, ReactNode } from "react";

import * as DropdownPrimitive from "@radix-ui/react-dropdown-menu";
import { Check } from "lucide-react";

import { cn } from "@/utils/cn";

export const DropdownMenu = DropdownPrimitive.Root;
export const DropdownMenuTrigger = DropdownPrimitive.Trigger;
export const DropdownMenuGroup = DropdownPrimitive.Group;
export const DropdownMenuRadioGroup = DropdownPrimitive.RadioGroup;

export function DropdownMenuContent({
  className,
  sideOffset = 6,
  align = "start",
  ...props
}: ComponentProps<typeof DropdownPrimitive.Content>) {
  return (
    <DropdownPrimitive.Portal>
      <DropdownPrimitive.Content
        sideOffset={sideOffset}
        align={align}
        className={cn(
          "anim-pop z-50 min-w-[13rem] overflow-hidden rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-e3",
          "max-h-[var(--radix-dropdown-menu-content-available-height)] overflow-y-auto",
          className,
        )}
        {...props}
      />
    </DropdownPrimitive.Portal>
  );
}

const itemClasses = cn(
  "relative flex cursor-pointer select-none items-center gap-2.5 rounded-md px-2 py-1.5 text-small outline-none",
  "text-foreground transition-colors duration-[100ms]",
  "data-[highlighted]:bg-muted data-[highlighted]:text-foreground",
  "data-[disabled]:pointer-events-none data-[disabled]:opacity-45",
);

export function DropdownMenuItem({
  className,
  tone = "default",
  ...props
}: ComponentProps<typeof DropdownPrimitive.Item> & {
  tone?: "default" | "destructive";
}) {
  return (
    <DropdownPrimitive.Item
      className={cn(
        itemClasses,
        tone === "destructive" &&
          "text-destructive data-[highlighted]:bg-destructive/10 data-[highlighted]:text-destructive",
        className,
      )}
      {...props}
    />
  );
}

export function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: ComponentProps<typeof DropdownPrimitive.RadioItem>) {
  return (
    <DropdownPrimitive.RadioItem
      className={cn(itemClasses, "pr-8", className)}
      {...props}
    >
      {children}
      <DropdownPrimitive.ItemIndicator className="absolute right-2 flex items-center">
        <Check size={14} strokeWidth={2.5} className="text-accent-strong" aria-hidden />
      </DropdownPrimitive.ItemIndicator>
    </DropdownPrimitive.RadioItem>
  );
}

export function DropdownMenuLabel({
  className,
  ...props
}: ComponentProps<typeof DropdownPrimitive.Label>) {
  return (
    <DropdownPrimitive.Label
      className={cn(
        "px-2 pb-1 pt-2 text-caption font-medium uppercase tracking-[0.06em] text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function DropdownMenuSeparator({
  className,
  ...props
}: ComponentProps<typeof DropdownPrimitive.Separator>) {
  return (
    <DropdownPrimitive.Separator
      className={cn("my-1 h-px bg-border", className)}
      {...props}
    />
  );
}

/** Right-aligned trailing hint, e.g. a keyboard shortcut. */
export function DropdownMenuShortcut({ children }: { children: ReactNode }) {
  return (
    <span className="text-caption text-muted-foreground ml-auto pl-4 tracking-wide">
      {children}
    </span>
  );
}
