"use client";

import { TooltipProvider } from "@radix-ui/react-tooltip";
import { ThemeProvider } from "next-themes";

import { ToastProvider } from "@/components/shared/toast-provider";

import { ChatProvider } from "./chat-provider";
import { PreferencesProvider } from "./preferences-provider";
import { SessionProvider } from "./session-provider";

/**
 * Provider tree, outermost first.
 *
 * Order is load-bearing: ChatProvider raises toasts and reads preferences, so
 * it must sit inside both of those.
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
          <SessionProvider>
            <PreferencesProvider>
              <ChatProvider>{children}</ChatProvider>
            </PreferencesProvider>
          </SessionProvider>
        </ToastProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
