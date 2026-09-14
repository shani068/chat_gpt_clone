import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { LogoMark } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export function CallToAction() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="border-border relative overflow-hidden rounded-xl border px-6 py-14 text-center sm:px-10 sm:py-20">
        <div
          aria-hidden
          className="bg-grid mask-fade-edges pointer-events-none absolute inset-0 opacity-50"
        />

        <div className="relative mx-auto max-w-[40rem]">
          <LogoMark size={26} className="mx-auto" />

          <h2 className="text-h1 text-foreground mt-6 text-balance">
            Open it and start typing
          </h2>
          <p className="text-body text-muted-foreground mx-auto mt-3 max-w-[46ch] text-pretty">
            Nothing to install, no account to create. Your first conversation is
            one click away.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-2.5 sm:flex-row">
            <Button variant="primary" size="lg" asChild className="w-full sm:w-auto">
              <Link href={ROUTES.CHAT_ENTRY}>
                Start chatting
                <ArrowRight size={16} strokeWidth={2} aria-hidden />
              </Link>
            </Button>
            <Button variant="ghost" size="lg" asChild className="w-full sm:w-auto">
              <Link href={ROUTES.LOGIN}>Sign in</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
