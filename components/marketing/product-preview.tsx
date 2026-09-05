"use client";

import { ArrowUp, Paperclip, Plus, Search } from "lucide-react";

import { MarkdownRenderer } from "@/components/chat/markdown-renderer";
import { LogoMark } from "@/components/shared/logo";
import { Avatar, Kbd } from "@/components/ui/primitives";
import { cn } from "@/utils/cn";

const F = "```";

const SAMPLE_ANSWER = `Retries are only safe when the receiver can recognise a repeat. Give the client ownership of the key and the server ownership of the dedupe:

${F}typescript
export function idempotent<T>(handler: Handler<T>) {
  return async (key: string, payload: T) => {
    const cached = await store.get(key);
    if (cached) return cached;

    const result = await handler(payload);
    await store.set(key, result, { ttl: "24h" });
    return result;
  };
}
${F}

| Failure | Without a key | With a key |
| --- | --- | --- |
| Timeout then retry | Charged twice | Charged once |
| Duplicate webhook | Two records | One record |`;

const SIDEBAR_ITEMS = [
  { label: "Idempotency in payment APIs", active: true },
  { label: "Postgres index strategy", active: false },
  { label: "Rewriting the auth middleware", active: false },
  { label: "Edge caching trade-offs", active: false },
];

/**
 * A real frame of the product, assembled from the same components the app
 * uses — the markdown pipeline here is the shipping one, code copy included.
 * Marketing and product cannot drift apart when they share the renderer.
 */
export function ProductPreview({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-background shadow-e3",
        className,
      )}
    >
      <div className="flex h-[26rem] sm:h-[32rem]">
        {/* Sidebar */}
        <aside className="border-border bg-sunken hidden w-[15rem] shrink-0 flex-col border-r md:flex">
          <div className="flex h-12 items-center gap-2 px-3">
            <LogoMark size={17} />
            <span className="text-small text-foreground font-semibold tracking-[-0.02em]">
              ChatGPT
            </span>
          </div>

          <div className="space-y-1 px-3 pb-3">
            <div className="border-border bg-card text-caption text-foreground shadow-e1 flex h-8 items-center gap-2 rounded-lg border px-2.5">
              <Plus size={13} strokeWidth={2} aria-hidden />
              New chat
            </div>
            <div className="text-caption text-muted-foreground flex h-8 items-center gap-2 rounded-lg px-2.5">
              <Search size={13} strokeWidth={2} aria-hidden />
              Search
              <Kbd className="ml-auto h-4">⌘K</Kbd>
            </div>
          </div>

          <div className="min-h-0 flex-1 px-2">
            <p className="text-muted-foreground/80 px-2 pt-2 pb-1 text-[0.6875rem] font-medium tracking-[0.07em] uppercase">
              Today
            </p>
            <ul className="space-y-px">
              {SIDEBAR_ITEMS.map((item) => (
                <li key={item.label}>
                  <div
                    className={cn(
                      "relative flex h-8 items-center rounded-md px-2 text-caption",
                      item.active
                        ? "bg-muted font-medium text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {item.active ? (
                      <span
                        aria-hidden
                        className="bg-accent absolute top-1/2 -left-1 h-4 w-[2px] -translate-y-1/2 rounded-full"
                      />
                    ) : null}
                    <span className="truncate">{item.label}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-border border-t p-2">
            <div className="flex items-center gap-2 rounded-lg p-1.5">
              <Avatar name="Alex Rivera" size={24} />
              <span className="min-w-0">
                <span className="text-caption text-foreground block truncate font-medium">
                  Alex Rivera
                </span>
                <span className="text-muted-foreground block truncate text-[0.6875rem]">
                  alex@example.com
                </span>
              </span>
            </div>
          </div>
        </aside>

        {/* Conversation */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="border-border flex h-12 shrink-0 items-center gap-2.5 border-b px-4">
            <span className="text-caption text-foreground truncate font-medium">
              Idempotency in payment APIs
            </span>
            <span className="text-muted-foreground ml-auto shrink-0 text-[0.6875rem]">
              4 messages
            </span>
          </div>

          <div className="min-h-0 flex-1 overflow-hidden px-4 py-5 sm:px-6">
            <div className="mx-auto flex max-w-[34rem] flex-col gap-6">
              <div className="flex justify-end">
                <p className="bg-bubble text-caption text-foreground sm:text-small max-w-[80%] rounded-xl px-3.5 py-2.5">
                  How should I make our payment webhooks safe to retry?
                </p>
              </div>

              <div className="flex gap-3">
                <span className="border-border bg-card text-foreground mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md border">
                  <LogoMark size={15} showDot={false} />
                </span>
                <div className="min-w-0 flex-1">
                  <MarkdownRenderer
                    content={SAMPLE_ANSWER}
                    className="text-caption sm:text-small"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="shrink-0 px-4 pb-4 sm:px-6">
            <div className="border-border bg-card shadow-e2 mx-auto flex max-w-[34rem] items-center gap-2 rounded-xl border px-2.5 py-2">
              <Paperclip
                size={15}
                strokeWidth={1.9}
                aria-hidden
                className="text-muted-foreground shrink-0"
              />
              <span className="text-caption text-muted-foreground/70 min-w-0 flex-1 truncate">
                Message ChatGPT…
              </span>
              <span className="bg-primary text-primary-foreground flex size-7 shrink-0 items-center justify-center rounded-lg">
                <ArrowUp size={15} strokeWidth={2.25} aria-hidden />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
