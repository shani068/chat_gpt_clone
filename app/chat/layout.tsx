import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat",
};

/**
 * The chat routes share the application frame. Providers live at the root, so
 * this layout only scopes metadata and pins the viewport height — the shell
 * itself owns its scrolling regions.
 */
export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return <div className="h-dvh overflow-hidden">{children}</div>;
}
