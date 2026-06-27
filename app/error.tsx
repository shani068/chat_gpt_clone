// Global error boundary — catches unhandled errors in the root layout subtree
"use client";

import { useEffect } from "react";

interface ErrorProps {
  error:  Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <span className="text-6xl font-bold text-red-100">!</span>
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="text-zinc-500 text-sm">{error.message}</p>
      <button
        onClick={reset}
        className="mt-2 rounded-full bg-black px-6 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
      >
        Try again
      </button>
    </main>
  );
}
