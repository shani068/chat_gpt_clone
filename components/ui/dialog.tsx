"use client";

import type { ComponentProps, ReactNode } from "react";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@/utils/cn";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;
export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;

interface DialogContentProps extends ComponentProps<typeof DialogPrimitive.Content> {
  /** Hides the default close affordance for dialogs that own their chrome. */
  hideClose?: boolean;
  /** Command-menu dialogs sit higher and wider than form dialogs. */
  variant?: "panel" | "command";
}

export function DialogContent({
  className,
  children,
  hideClose = false,
  variant = "panel",
  ...props
}: DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="anim-fade fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px]" />
      <DialogPrimitive.Content
        className={cn(
          "anim-dialog fixed z-50 flex flex-col border border-border bg-popover text-popover-foreground shadow-e3",
          "focus:outline-none",
          variant === "command"
            ? "inset-x-3 top-[12vh] mx-auto max-h-[70vh] w-auto max-w-[36rem] rounded-xl sm:inset-x-0"
            : "inset-x-3 bottom-3 top-auto max-h-[85vh] rounded-xl sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-[min(40rem,calc(100vw-2rem))] sm:-translate-x-1/2 sm:-translate-y-1/2",
          className,
        )}
        {...props}
      >
        {children}

        {hideClose ? null : (
          <DialogPrimitive.Close
            aria-label="Close"
            className={cn(
              "absolute right-3 top-3 inline-flex size-7 items-center justify-center rounded-md text-muted-foreground",
              "transition-colors hover:bg-muted hover:text-foreground",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            )}
          >
            <X size={15} strokeWidth={2} aria-hidden />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DialogHeader({
  title,
  description,
  className,
  children,
}: {
  title: string;
  description?: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={cn("border-b border-border px-5 py-4 pr-12", className)}>
      <DialogPrimitive.Title className="text-h3 text-foreground">
        {title}
      </DialogPrimitive.Title>
      {description ? (
        <DialogPrimitive.Description className="text-small text-muted-foreground mt-1">
          {description}
        </DialogPrimitive.Description>
      ) : null}
      {children}
    </div>
  );
}

export function DialogFooter({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-2 border-t border-border px-5 py-3.5 sm:flex-row sm:justify-end",
        className,
      )}
    >
      {children}
    </div>
  );
}
