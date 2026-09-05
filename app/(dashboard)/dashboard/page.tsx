import { redirect } from "next/navigation";

import { ROUTES } from "@/constants/routes";

/** Legacy entry point — the conversation list is the product's home. */
export default function DashboardPage() {
  redirect(ROUTES.CHAT);
}
