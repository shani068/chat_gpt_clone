import type { Metadata } from "next";

import { ChatShell } from "@/components/chat/chat-shell";

export const metadata: Metadata = {
  title: "Chat",
};

/**
 * An existing conversation. Params are async in the App Router, so the id is
 * awaited here and handed to the shell, which owns the loading state.
 */
export default async function ConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = await params;

  return (
    <div className="h-dvh overflow-hidden">
      <ChatShell chatId={conversationId} />
    </div>
  );
}
