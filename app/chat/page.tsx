import { redirect } from "next/navigation";

/** Legacy `/chat` → ChatGPT-style `/`. */
export default function LegacyChatPage() {
  redirect("/");
}
