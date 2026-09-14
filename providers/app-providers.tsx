"use client";

import { TooltipProvider } from "@radix-ui/react-tooltip";
import { ThemeProvider } from "next-themes";

import { ToastProvider } from "@/components/shared/toast-provider";

import { ChatProvider } from "./chat-provider";
import { PreferencesProvider } from "./preferences-provider";
import { QueryProvider } from "./query-provider";
import { SessionProvider } from "./session-provider";

/**
 * Provider tree, outermost first.
 *
 * Order is load-bearing: ChatProvider raises toasts, reads preferences, and
 * uses React Query, so it must sit inside those providers.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider delayDuration={320} skipDelayDuration={200}>
        <ToastProvider>
          <QueryProvider>
            <SessionProvider>
              <PreferencesProvider>
                <ChatProvider>{children}</ChatProvider>
              </PreferencesProvider>
            </SessionProvider>
          </QueryProvider>
        </ToastProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
