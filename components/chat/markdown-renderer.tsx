"use client";

import { memo, type ComponentProps } from "react";

import ReactMarkdown, { type Components } from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

import {
  HIGHLIGHT_LANGUAGES,
  languageFromClassName,
  textFromNode,
} from "@/lib/chat/markdown";
import { cn } from "@/utils/cn";

import { CodeBlock } from "./code-block";

// Stable references — recreating these each render would re-run the whole
// unified pipeline on every streamed token.
const REMARK_PLUGINS = [remarkGfm];
type RehypePlugins = ComponentProps<typeof ReactMarkdown>["rehypePlugins"];

const REHYPE_PLUGINS: RehypePlugins = [
  [rehypeHighlight, { languages: HIGHLIGHT_LANGUAGES, detect: true, ignoreMissing: true }],
];

const COMPONENTS: Components = {
  // Fenced code is lifted out of <pre> and rendered as a titled block with
  // its own copy affordance; the highlighted <code> passes straight through.
  pre: ({ children }) => <>{children}</>,

  code: ({ className, children, node, ...props }) => {
    // rehype-highlight only touches `pre > code`, so the presence of either
    // class is a reliable signal that this is a fenced block, not inline code.
    const isBlock = Boolean(
      className && (className.includes("language-") || className.includes("hljs")),
    );

    if (!isBlock) {
      return <code {...props}>{children}</code>;
    }

    return (
      <CodeBlock language={languageFromClassName(className)} code={textFromNode(node)}>
        <code className={className} {...props}>
          {children}
        </code>
      </CodeBlock>
    );
  },

  // Wide tables scroll inside their own container instead of the page.
  table: ({ children }) => (
    <div className="table-scroll">
      <table>{children}</table>
    </div>
  ),

  a: ({ children, href, ...props }) => (
    <a
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    >
      {children}
    </a>
  ),
};

/**
 * Renders assistant markdown. Memoised on `content` so sibling re-renders
 * (hover states, action bars) never re-parse a long answer.
 */
export const MarkdownRenderer = memo(function MarkdownRenderer({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  return (
    <div className={cn("md", className)}>
      <ReactMarkdown
        remarkPlugins={REMARK_PLUGINS}
        rehypePlugins={REHYPE_PLUGINS}
        components={COMPONENTS}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});
