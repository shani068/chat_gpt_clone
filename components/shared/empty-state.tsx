import type { ReactNode } from "react";

import { cn } from "@/utils/cn";

import type { LucideIcon } from "lucide-react";

/**
 * Empty states are text-first — no illustration, no oversized icon. The icon
 * is a hairline glyph in a bordered square, sized to sit under the headline.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  compact = false,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        compact ? "gap-2 px-4 py-8" : "gap-3 px-6 py-14",
        className,
      )}
    >
      {Icon ? (
        <span className="border-border bg-muted/50 text-muted-foreground mb-1 inline-flex size-9 items-center justify-center rounded-lg border">
          <Icon size={16} strokeWidth={1.75} aria-hidden />
        </span>
      ) : null}

      <p className={cn("font-medium text-foreground", compact ? "text-small" : "text-body")}>
        {title}
      </p>

      {description ? (
        <p className="text-small text-muted-foreground max-w-[30ch] text-pretty">
          {description}
        </p>
      ) : null}

      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
