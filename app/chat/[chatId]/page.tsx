import { ChatShell } from "@/components/chat/chat-shell";

/**
 * A specific conversation. Params are async in the App Router, so the id is
 * awaited here and handed to the shell, which owns the loading state.
 */
export default async function ConversationPage({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const { chatId } = await params;
  return <ChatShell chatId={chatId} />;
}
