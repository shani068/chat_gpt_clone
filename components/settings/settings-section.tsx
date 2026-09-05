"use client";

import type { ReactNode } from "react";

import { cn } from "@/utils/cn";

/** A titled block of related preferences. */
export function SettingsSection({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("space-y-1", className)}>
      <h3 className="text-caption text-muted-foreground font-medium tracking-[0.07em] uppercase">
        {title}
      </h3>
      {description ? (
        <p className="text-small text-muted-foreground pb-1">{description}</p>
      ) : null}
      <div className="divide-border border-border bg-card divide-y rounded-lg border">
        {children}
      </div>
    </section>
  );
}

/**
 * One preference row. The control sits right; the label and its explanation
 * sit left, so a column of rows scans as a single list.
 */
export function SettingsRow({
  label,
  description,
  htmlFor,
  control,
  stacked = false,
}: {
  label: string;
  description?: string;
  htmlFor?: string;
  control: ReactNode;
  /** Puts the control on its own line — for wide segmented controls. */
  stacked?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex gap-4 p-3.5",
        stacked ? "flex-col items-start" : "items-center justify-between",
      )}
    >
      <div className="min-w-0 space-y-0.5">
        {htmlFor ? (
          <label htmlFor={htmlFor} className="text-small text-foreground block font-medium">
            {label}
          </label>
        ) : (
          <p className="text-small text-foreground font-medium">{label}</p>
        )}
        {description ? (
          <p className="text-caption text-muted-foreground text-pretty">{description}</p>
        ) : null}
      </div>

      <div className={cn("shrink-0", stacked && "w-full")}>{control}</div>
    </div>
  );
}

/** Radio-style segmented control used for enumerated preferences. */
export function SettingsChoice<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string; hint?: string }[];
  label: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="grid w-full gap-1 sm:auto-cols-fr sm:grid-flow-col"
    >
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-md border px-3 py-2 text-left transition-colors duration-[120ms]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              isSelected
                ? "border-accent/50 bg-accent/10"
                : "border-border bg-transparent hover:bg-muted",
            )}
          >
            <span
              className={cn(
                "block text-small font-medium",
                isSelected ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {option.label}
            </span>
            {option.hint ? (
              <span className="text-caption text-muted-foreground mt-0.5 block">
                {option.hint}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
