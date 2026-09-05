"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Check, Info, X } from "lucide-react";

import { EASE_PREMIUM } from "@/constants/motion";
import { cn } from "@/utils/cn";

type ToastVariant = "default" | "success" | "error";

interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: { label: string; onClick: () => void };
}

interface Toast extends ToastOptions {
  id: string;
}

interface ToastContextValue {
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

/** Three at a time — beyond that they stop being readable. */
const MAX_VISIBLE = 3;

const ICONS: Record<ToastVariant, typeof Info> = {
  default: Info,
  success: Check,
  error: AlertTriangle,
};

const ICON_TONE: Record<ToastVariant, string> = {
  default: "text-muted-foreground",
  success: "text-success",
  error: "text-destructive",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((entry) => entry.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const toast = useCallback(
    (options: ToastOptions) => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      const entry: Toast = { variant: "default", duration: 3600, ...options, id };

      setToasts((current) => [...current, entry].slice(-MAX_VISIBLE));
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), entry.duration),
      );
      return id;
    },
    [dismiss],
  );

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div
        // Polite: toasts confirm actions the user just took, they never interrupt.
        role="status"
        aria-live="polite"
        aria-relevant="additions"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex flex-col items-center gap-2 p-4 sm:inset-x-auto sm:right-0 sm:items-end sm:p-6"
      >
        <AnimatePresence initial={false} mode="popLayout">
          {toasts.map((entry) => {
            const Icon = ICONS[entry.variant ?? "default"];
            return (
              <motion.div
                key={entry.id}
                layout
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.97 }}
                transition={{ duration: 0.24, ease: EASE_PREMIUM }}
                className={cn(
                  "pointer-events-auto flex w-full max-w-[26rem] items-start gap-3 rounded-lg border border-border bg-popover p-3 pr-2.5 shadow-e3",
                  "sm:w-auto sm:min-w-[20rem]",
                )}
              >
                <Icon
                  size={16}
                  strokeWidth={2}
                  aria-hidden
                  className={cn("mt-0.5 shrink-0", ICON_TONE[entry.variant ?? "default"])}
                />

                <div className="min-w-0 flex-1">
                  <p className="text-small text-popover-foreground font-medium">
                    {entry.title}
                  </p>
                  {entry.description ? (
                    <p className="text-caption text-muted-foreground mt-0.5">
                      {entry.description}
                    </p>
                  ) : null}
                  {entry.action ? (
                    <button
                      type="button"
                      onClick={() => {
                        entry.action?.onClick();
                        dismiss(entry.id);
                      }}
                      className="text-caption text-accent-strong mt-2 rounded-sm font-medium underline-offset-4 hover:underline"
                    >
                      {entry.action.label}
                    </button>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={() => dismiss(entry.id)}
                  aria-label={`Dismiss: ${entry.title}`}
                  className="text-muted-foreground hover:bg-muted hover:text-foreground -m-0.5 rounded-sm p-1.5 transition-colors"
                >
                  <X size={14} strokeWidth={2} aria-hidden />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside <ToastProvider>");
  }
  return context;
}
