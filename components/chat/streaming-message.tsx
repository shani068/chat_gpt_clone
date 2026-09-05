"use client";

import { ThinkingIndicator } from "@/components/shared/loading-skeleton";

import { MarkdownRenderer } from "./markdown-renderer";

/**
 * The in-flight assistant answer.
 *
 * Before the first token lands there is nothing to render, so a thinking
 * indicator holds the space. Once tokens arrive the same markdown pipeline the
 * settled message uses takes over — with `is-streaming`, which places the
 * caret at the end of the final block via CSS rather than by injecting a node
 * into the markdown tree.
 */
export function StreamingMessage({
  content,
  label = "Thinking",
}: {
  content: string;
  label?: string;
}) {
  if (!content) return <ThinkingIndicator label={label} />;

  return <MarkdownRenderer content={content} className="is-streaming" />;
}
