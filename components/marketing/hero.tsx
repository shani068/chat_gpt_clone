"use client";

import Link from "next/link";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EASE_PREMIUM } from "@/constants/motion";
import { ROUTES } from "@/constants/routes";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";

import { ProductPreview } from "./product-preview";

export function Hero() {
  const shouldReduceMotion = usePrefersReducedMotion();

  const rise = (delay: number) => ({
    initial: shouldReduceMotion ? false : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: shouldReduceMotion ? 0 : delay, ease: EASE_PREMIUM },
  });

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="bg-grid mask-fade-edges pointer-events-none absolute inset-x-0 top-0 h-[38rem] opacity-60"
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 pt-16 pb-16 sm:px-6 sm:pt-24 sm:pb-24">
        <div className="mx-auto max-w-[46rem] text-center">
          <motion.p
            {...rise(0)}
            className="border-border bg-card/70 text-caption text-muted-foreground shadow-e1 inline-flex items-center gap-2 rounded-full border py-1 pr-3 pl-1.5"
          >
            <span className="bg-accent/12 text-accent-strong rounded-full px-2 py-0.5 font-medium">
              New
            </span>
            File analysis is now in preview
          </motion.p>

          <motion.h1
            {...rise(0.06)}
            className="text-foreground sm:text-display mt-6 text-[2.5rem] leading-[1.04] font-semibold tracking-[-0.035em] text-balance"
          >
            An AI assistant that keeps up with the work
          </motion.h1>

          <motion.p
            {...rise(0.12)}
            className="text-body text-muted-foreground mx-auto mt-5 max-w-[52ch] text-pretty sm:text-[1.0625rem]"
          >
            Real file analysis, markdown that renders the way you wrote it, and
            answers that stream as they are written. No dashboards to learn —
            open it and start typing.
          </motion.p>

          <motion.div
            {...rise(0.18)}
            className="mt-8 flex flex-col items-center justify-center gap-2.5 sm:flex-row"
          >
            <Button variant="primary" size="lg" asChild className="w-full sm:w-auto">
              <Link href={ROUTES.CHAT_ENTRY}>
                Start chatting
                <ArrowRight size={16} strokeWidth={2} aria-hidden />
              </Link>
            </Button>

            <Button variant="secondary" size="lg" asChild className="w-full sm:w-auto">
              <a href="#preview">View demo</a>
            </Button>
          </motion.div>

          <motion.p {...rise(0.24)} className="text-caption text-muted-foreground mt-4">
            No account required — conversations stay in your browser.
          </motion.p>
        </div>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: shouldReduceMotion ? 0 : 0.28,
            ease: EASE_PREMIUM,
          }}
          className="mt-14 sm:mt-16"
        >
          <ProductPreview className="mx-auto max-w-5xl" />
        </motion.div>
      </div>
    </section>
  );
}
