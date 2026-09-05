import { Skeleton } from "@/components/ui/primitives";
import { cn } from "@/utils/cn";

// Uneven widths read as titles rather than as a loading bar. Each value is
// distinct, so it doubles as a stable React key.
const ROW_WIDTHS = [74, 58, 88, 64, 81, 54, 92, 68];

function rowWidths(rows: number, group: number): number[] {
  const perGroup = group === 0 ? Math.ceil(rows / 2) : Math.floor(rows / 2);
  const offset = group === 0 ? 0 : Math.ceil(rows / 2);
  return ROW_WIDTHS.slice(offset, offset + perGroup);
}

/** Sidebar history placeholder — mirrors the real row rhythm, groups included. */
export function ConversationListSkeleton({ rows = 7 }: { rows?: number }) {
  return (
    <div className="space-y-4 px-2 py-1" aria-hidden>
      {[0, 1].map((group) => (
        <div key={group} className="space-y-1">
          <Skeleton className="mx-2 mb-2 h-2.5 w-16 rounded-sm" />
          {rowWidths(rows, group).map((width) => (
            <div key={width} className="flex h-8 items-center px-2">
              <Skeleton className="h-3 rounded-sm" style={{ width: `${width}%` }} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/** Transcript placeholder shown while a conversation loads from storage. */
export function MessageListSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[48rem] space-y-10 px-4 py-10" aria-hidden>
      <div className="flex justify-end">
        <Skeleton className="h-10 w-[min(20rem,70%)] rounded-xl" />
      </div>

      <div className="flex gap-3.5">
        <Skeleton className="size-7 shrink-0 rounded-md" />
        <div className="w-full space-y-2.5">
          <Skeleton className="h-3.5 w-[92%] rounded-sm" />
          <Skeleton className="h-3.5 w-[97%] rounded-sm" />
          <Skeleton className="h-3.5 w-[74%] rounded-sm" />
          <Skeleton className="mt-4 h-20 w-full rounded-lg" />
          <Skeleton className="h-3.5 w-[60%] rounded-sm" />
        </div>
      </div>
    </div>
  );
}

/** Settings sections while preferences hydrate. */
export function SettingsSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-8", className)} aria-hidden>
      {[0, 1].map((section) => (
        <div key={section} className="space-y-4">
          <Skeleton className="h-3 w-24 rounded-sm" />
          {[0, 1, 2].map((row) => (
            <div key={row} className="flex items-center justify-between gap-6">
              <div className="w-full space-y-2">
                <Skeleton className="h-3.5 w-40 rounded-sm" />
                <Skeleton className="h-3 w-64 rounded-sm" />
              </div>
              <Skeleton className="h-5 w-9 shrink-0 rounded-full" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/** Three dots that precede the first token of a response. */
export function ThinkingIndicator({ label = "Thinking" }: { label?: string }) {
  return (
    <div className="text-small text-muted-foreground flex items-center gap-2">
      <span className="flex items-center gap-1" aria-hidden>
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            className="bg-muted-foreground/70 size-1.5 animate-pulse rounded-full"
            style={{ animationDelay: `${index * 160}ms`, animationDuration: "1.1s" }}
          />
        ))}
      </span>
      <span>{label}</span>
    </div>
  );
}
