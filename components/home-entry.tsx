"use client";

import { ChatShell } from "@/components/chat/chat-shell";
import { MarketingHome } from "@/components/marketing/marketing-home";
import { useSession } from "@/providers/session-provider";

/**
 * `/` is ChatGPT-style chat home when signed in, and the marketing landing
 * when signed out. Conversations live at `/c/{id}`.
 */
export function HomeEntry() {
  const { status } = useSession();

  if (status === "loading") {
    return <div className="bg-background h-dvh" aria-busy="true" />;
  }

  if (status === "authenticated") {
    return (
      <div className="h-dvh overflow-hidden">
        <ChatShell />
      </div>
    );
  }

  return <MarketingHome />;
}
