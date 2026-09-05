"use client";

import { useEffect, useMemo, useRef } from "react";

export interface Shortcut {
  /** Lower-case key, e.g. "k", "enter", "o". */
  key: string;
  meta?: boolean;
  shift?: boolean;
  handler: (event: KeyboardEvent) => void;
  /** Fire even while a text field has focus (Cmd+Enter needs this). */
  allowInInput?: boolean;
  enabled?: boolean;
}

function isEditable(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  );
}

/**
 * Global shortcut binding. `meta: true` matches Cmd on macOS and Ctrl
 * elsewhere, so every binding is cross-platform by construction.
 */
export function useKeyboardShortcuts(shortcuts: Shortcut[]): void {
  // Handlers change identity every render; a ref keeps the listener stable.
  const ref = useRef(shortcuts);
  ref.current = shortcuts;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      for (const shortcut of ref.current) {
        if (shortcut.enabled === false) continue;
        if (shortcut.key !== key) continue;

        const hasModifier = event.metaKey || event.ctrlKey;
        if (Boolean(shortcut.meta) !== hasModifier) continue;
        if (Boolean(shortcut.shift) !== event.shiftKey) continue;
        if (!shortcut.allowInInput && isEditable(event.target)) continue;

        event.preventDefault();
        shortcut.handler(event);
        return;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}

/** True on Apple platforms — used to render ⌘ instead of Ctrl. */
export function useIsAppleDevice(): boolean {
  return useMemo(() => {
    if (typeof navigator === "undefined") return false;
    return /mac|iphone|ipad|ipod/i.test(navigator.platform || navigator.userAgent);
  }, []);
}

export interface ShortcutHint {
  id: string;
  label: string;
  keys: string[];
}

/** Single source of truth for what the settings dialog and tooltips display. */
export const SHORTCUT_HINTS: ShortcutHint[] = [
  { id: "search", label: "Search conversations", keys: ["mod", "K"] },
  { id: "new", label: "New chat", keys: ["mod", "Shift", "O"] },
  { id: "send", label: "Send message", keys: ["mod", "Enter"] },
  { id: "newline", label: "New line in composer", keys: ["Enter"] },
  { id: "sidebar", label: "Toggle sidebar", keys: ["mod", "B"] },
  { id: "settings", label: "Open settings", keys: ["mod", ","] },
  { id: "focus", label: "Focus composer", keys: ["/"] },
  { id: "close", label: "Close dialog or menu", keys: ["Esc"] },
];

export function renderKey(key: string, isApple: boolean): string {
  if (key === "mod") return isApple ? "⌘" : "Ctrl";
  if (key === "Shift") return isApple ? "⇧" : "Shift";
  if (key === "Enter") return isApple ? "↵" : "Enter";
  return key;
}
