"use client";

import type { ReactNode } from "react";

import { Check, Copy } from "lucide-react";

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/utils/cn";

/** Display names for the languages the highlighter is configured with. */
const LANGUAGE_LABEL: Record<string, string> = {
  js: "JavaScript",
  javascript: "JavaScript",
  jsx: "JSX",
  ts: "TypeScript",
  typescript: "TypeScript",
  tsx: "TSX",
  py: "Python",
  python: "Python",
  json: "JSON",
  sql: "SQL",
  bash: "Bash",
  sh: "Bash",
  shell: "Bash",
  css: "CSS",
  html: "HTML",
  xml: "HTML",
  md: "Markdown",
  markdown: "Markdown",
  text: "Text",
  plaintext: "Text",
};

export function CodeBlock({
  language,
  code,
  children,
}: {
  language: string;
  /** Raw source, used for the clipboard — not the highlighted markup. */
  code: string;
  children: ReactNode;
}) {
  const { isCopied, copy } = useCopyToClipboard();
  const label = LANGUAGE_LABEL[language.toLowerCase()] ?? language.toUpperCase();

  return (
    <figure className="group/code border-border bg-code-surface my-4 overflow-hidden rounded-lg border">
      <figcaption className="bg-code-chrome flex items-center justify-between gap-3 border-b border-white/[0.07] py-1.5 pr-1.5 pl-3.5">
        <span className="text-code-foreground/55 font-mono text-[0.6875rem] font-medium tracking-[0.08em] uppercase">
          {label}
        </span>

        <button
          type="button"
          onClick={() => void copy(code)}
          aria-label={isCopied ? "Copied to clipboard" : `Copy ${label} code`}
          className={cn(
            "inline-flex h-6 items-center gap-1.5 rounded-md px-2 text-[0.6875rem] font-medium",
            "text-code-foreground/65 transition-colors duration-[120ms]",
            "hover:bg-white/[0.08] hover:text-code-foreground",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            isCopied && "text-success",
          )}
        >
          {isCopied ? (
            <Check size={12} strokeWidth={2.5} aria-hidden />
          ) : (
            <Copy size={12} strokeWidth={2} aria-hidden />
          )}
          <span>{isCopied ? "Copied" : "Copy"}</span>
        </button>
      </figcaption>

      <div className="overflow-x-auto">
        <pre className="text-code w-fit min-w-full px-3.5 py-3 font-mono leading-[1.65]">
          {children}
        </pre>
      </div>
    </figure>
  );
}
