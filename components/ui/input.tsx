"use client";

import type { InputHTMLAttributes, ReactNode, Ref } from "react";
import { useId } from "react";

import { cn } from "@/utils/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  /** Rendered inside the field, before the text. */
  leading?: ReactNode;
  trailing?: ReactNode;
  ref?: Ref<HTMLInputElement>;
}

export function Input({
  label,
  hint,
  error,
  leading,
  trailing,
  className,
  id,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const describedBy = error
    ? `${inputId}-error`
    : hint
      ? `${inputId}-hint`
      : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <label
          htmlFor={inputId}
          className="text-small text-foreground font-medium"
        >
          {label}
        </label>
      ) : null}

      <div
        className={cn(
          "group relative flex items-center gap-2 rounded-lg border bg-card px-3",
          "transition-colors duration-[120ms]",
          "focus-within:border-ring/60 focus-within:ring-2 focus-within:ring-ring/25",
          error ? "border-destructive/60" : "border-input hover:border-foreground/20",
          className,
        )}
      >
        {leading ? (
          <span className="text-muted-foreground shrink-0" aria-hidden>
            {leading}
          </span>
        ) : null}

        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            "h-9 w-full min-w-0 bg-transparent text-small text-foreground outline-none",
            "placeholder:text-muted-foreground/80",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
          {...props}
        />

        {trailing ? <span className="shrink-0">{trailing}</span> : null}
      </div>

      {error ? (
        <p id={`${inputId}-error`} className="text-caption text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="text-caption text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
