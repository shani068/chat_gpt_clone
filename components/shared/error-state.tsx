"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

/**
 * Reusable failure UI. `onRetry` is wired to the operation that failed — the
 * button re-runs it rather than reloading the page.
 */
export function ErrorState({
  title = "Something went wrong",
  description,
  onRetry,
  retryLabel = "Try again",
  className,
  compact = false,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-3 text-center",
        compact ? "px-4 py-8" : "px-6 py-14",
        className,
      )}
    >
      <span className="border-destructive/25 bg-destructive/10 text-destructive inline-flex size-9 items-center justify-center rounded-lg border">
        <AlertTriangle size={16} strokeWidth={2} aria-hidden />
      </span>

      <div className="space-y-1">
        <p className={cn("font-medium text-foreground", compact ? "text-small" : "text-body")}>
          {title}
        </p>
        {description ? (
          <p className="text-small text-muted-foreground max-w-[36ch] text-pretty">
            {description}
          </p>
        ) : null}
      </div>

      {onRetry ? (
        <Button variant="secondary" size="sm" onClick={onRetry} className="mt-1">
          <RotateCcw size={14} strokeWidth={2} aria-hidden />
          {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}

/** Inline variant used inside an assistant message that failed to generate. */
export function InlineErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div
      role="alert"
      className="border-destructive/25 bg-destructive/[0.06] flex flex-col gap-3 rounded-lg border p-3.5 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-start gap-2.5">
        <AlertTriangle
          size={15}
          strokeWidth={2}
          aria-hidden
          className="text-destructive mt-0.5 shrink-0"
        />
        <p className="text-small text-foreground">{message}</p>
      </div>

      <Button
        variant="secondary"
        size="sm"
        onClick={onRetry}
        className="shrink-0 self-start sm:self-auto"
      >
        <RotateCcw size={14} strokeWidth={2} aria-hidden />
        Retry response
      </Button>
    </div>
  );
}
