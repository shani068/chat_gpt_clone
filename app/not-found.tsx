import Link from "next/link";

import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export default function NotFound() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center px-4 text-center">
      <div
        aria-hidden
        className="bg-grid mask-fade-edges pointer-events-none absolute inset-0 opacity-40"
      />

      <div className="relative">
        <Logo size={22} className="mb-8" />

        <p className="text-caption text-muted-foreground font-mono tracking-[0.18em] uppercase">
          404
        </p>
        <h1 className="text-h1 text-foreground mt-3">This page does not exist</h1>
        <p className="text-body text-muted-foreground mx-auto mt-2.5 max-w-[38ch] text-pretty">
          The link may be out of date, or the conversation it pointed at was
          deleted.
        </p>

        <div className="mt-7 flex items-center justify-center gap-2">
          <Button variant="primary" size="md" asChild>
            <Link href={ROUTES.CHAT_ENTRY}>Go to chat</Link>
          </Button>
          <Button variant="ghost" size="md" asChild>
            <Link href={ROUTES.HOME}>Home</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
