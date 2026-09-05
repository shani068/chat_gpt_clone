"use client";

import { useEffect, useState } from "react";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import type { ThemePreference } from "@/types/user";
import { cn } from "@/utils/cn";

const OPTIONS: { value: ThemePreference; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

/**
 * Segmented three-way theme control. Renders a static placeholder until the
 * theme resolves on the client, so the isSelected pill never flickers.
 */
export function ThemeToggle({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md";
}) {
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  const active = isMounted ? ((theme ?? "system") as ThemePreference) : null;

  return (
    <div
      role="radiogroup"
      aria-label="Colour theme"
      className={cn(
        "inline-flex items-center gap-0.5 rounded-lg border border-border bg-muted/60 p-0.5",
        className,
      )}
    >
      {OPTIONS.map(({ value, label, icon: Icon }) => {
        const isSelected = active === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={label}
            onClick={() => setTheme(value)}
            className={cn(
              "inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-colors duration-[140ms]",
              size === "sm" ? "h-6 px-2 text-caption" : "h-7 px-2.5 text-caption",
              isSelected
                ? "bg-card text-foreground shadow-e1"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon size={14} strokeWidth={2} aria-hidden />
            <span className={size === "sm" ? "sr-only sm:not-sr-only" : ""}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
