import bash from "highlight.js/lib/languages/bash";
import css from "highlight.js/lib/languages/css";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import plaintext from "highlight.js/lib/languages/plaintext";
import python from "highlight.js/lib/languages/python";
import sql from "highlight.js/lib/languages/sql";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";

/**
 * Only the languages the product actually renders are registered — importing
 * all 190 highlight.js grammars would add hundreds of KB to the client bundle.
 */
export const HIGHLIGHT_LANGUAGES = {
  javascript,
  js: javascript,
  jsx: javascript,
  typescript,
  ts: typescript,
  tsx: typescript,
  python,
  py: python,
  json,
  sql,
  bash,
  sh: bash,
  shell: bash,
  css,
  html: xml,
  xml,
  plaintext,
  text: plaintext,
};

interface HastNode {
  type?: string;
  value?: string;
  children?: HastNode[];
}

/**
 * Recovers the raw source text from a hast node. The highlighter has already
 * wrapped everything in spans by this point, so the DOM cannot be trusted for
 * a clean copy — the syntax tree can.
 */
export function textFromNode(node: unknown): string {
  const typed = node as HastNode | undefined;
  if (!typed) return "";
  if (typed.type === "text") return typed.value ?? "";
  return (typed.children ?? []).map(textFromNode).join("");
}

export function languageFromClassName(className: string | undefined): string {
  if (!className) return "text";
  const match = /language-([\w-]+)/.exec(className);
  return match ? match[1] : "text";
}
