"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Clipboard write with a self-clearing "copied" flag, plus a fallback for
 * insecure origins where `navigator.clipboard` is unavailable.
 */
export function useCopyToClipboard(resetAfter = 2000) {
  const [isCopied, setIsCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = useCallback(
    async (value: string): Promise<boolean> => {
      const didWrite = await writeToClipboard(value);
      if (!didWrite) return false;

      setIsCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setIsCopied(false), resetAfter);
      return true;
    },
    [resetAfter],
  );

  return { isCopied, copy };
}

async function writeToClipboard(value: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(value);
      return true;
    }

    const area = document.createElement("textarea");
    area.value = value;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const didCopy = document.execCommand("copy");
    document.body.removeChild(area);
    return didCopy;
  } catch {
    return false;
  }
}
