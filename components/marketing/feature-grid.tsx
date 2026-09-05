import {
  FileSearch,
  History,
  Lock,
  PencilLine,
  SquareCode,
  Zap,
} from "lucide-react";

import { cn } from "@/utils/cn";

interface Feature {
  icon: typeof Zap;
  title: string;
  description: string;
  /** Grid weight — the composition varies, the treatment does not. */
  span: string;
  detail?: string[];
}

const FEATURES: Feature[] = [
  {
    icon: Zap,
    title: "Responses that start immediately",
    description:
      "Tokens stream as they are produced, with a stop control that takes effect on the same frame you press it.",
    span: "md:col-span-7",
    detail: ["First token < 400ms", "Stop mid-stream", "Regenerate in place"],
  },
  {
    icon: PencilLine,
    title: "Edit a question, rewrite the answer",
    description:
      "Change what you asked and the response below it is regenerated in place — no starting the thread over.",
    span: "md:col-span-5",
  },
  {
    icon: FileSearch,
    title: "File analysis",
    description: "PDFs, spreadsheets, images and source files, validated before they upload.",
    span: "md:col-span-4",
  },
  {
    icon: History,
    title: "History that stays organised",
    description: "Grouped by day, searchable from anywhere with ⌘K, renameable in one click.",
    span: "md:col-span-4",
  },
  {
    icon: SquareCode,
    title: "Markdown and code, rendered properly",
    description: "Syntax highlighting, scrollable tables, and copy that returns the source.",
    span: "md:col-span-4",
  },
  {
    icon: Lock,
    title: "Nothing leaves the browser",
    description:
      "Conversations, preferences and uploads are stored locally. There is no account to create and no telemetry to opt out of.",
    span: "md:col-span-12",
  },
];

/**
 * A bordered grid rather than six floating cards: cells share hairlines, and
 * the spans vary so the eye has somewhere to travel.
 */
export function FeatureGrid() {
  return (
    <section id="features" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <header className="max-w-[42rem]">
        <p className="text-caption text-accent-strong font-mono tracking-[0.16em] uppercase">
          Capabilities
        </p>
        <h2 className="text-h1 text-foreground mt-3 text-balance">
          Everything the conversation needs, nothing it does not
        </h2>
      </header>

      <div className="border-border mt-10 overflow-hidden rounded-xl border sm:mt-12">
        {/* Every cell draws its own top and left hairline; the negative offset
            tucks the outermost ones under the container's border. */}
        <div className="-mt-px -ml-px grid grid-cols-1 md:grid-cols-12">
          {FEATURES.map(({ icon: Icon, title, description, span, detail }) => (
            <article
              key={title}
              className={cn(
                "flex flex-col gap-3 border-l border-t border-border p-6 sm:p-7",
                span,
              )}
            >
              <span className="border-border bg-muted/50 text-muted-foreground inline-flex size-8 items-center justify-center rounded-lg border">
                <Icon size={15} strokeWidth={1.75} aria-hidden />
              </span>

              <h3 className="text-h3 text-foreground">{title}</h3>
              <p className="text-small text-muted-foreground max-w-[54ch] text-pretty">
                {description}
              </p>

              {detail ? (
                <ul className="mt-1 flex flex-wrap gap-1.5">
                  {detail.map((item) => (
                    <li
                      key={item}
                      className="border-border bg-card text-muted-foreground rounded-sm border px-2 py-1 font-mono text-[0.6875rem]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
