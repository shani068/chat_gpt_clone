import { redirect } from "next/navigation";

import { conversationRoute } from "@/constants/routes";

/** Legacy `/chat/:id` → `/c/:id`. */
export default async function LegacyConversationPage({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const { chatId } = await params;
  redirect(conversationRoute(chatId));
}
