// Layout for the standalone (non-chat) application pages.
// Providers live at the root; this group only supplies the page canvas.
export default function AppPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="bg-background min-h-dvh">{children}</div>;
}
