"use client";

import Link from "next/link";

import { useEffect } from "react";

import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/** Root error boundary. `reset` re-renders the failed segment in place. */
export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <main className="flex min-h-dvh items-center justify-center px-4">
      <div className="w-full max-w-md">
        <ErrorState
          title="Something went wrong"
          description={
            error.message || "An unexpected error interrupted this page."
          }
          onRetry={reset}
        />

        <div className="mt-2 flex justify-center">
          <Button variant="ghost" size="sm" asChild>
            <Link href={ROUTES.CHAT}>Back to chat</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
