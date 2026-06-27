// Error boundary scoped to the /dashboard route — must be a Client Component
"use client";

import { useEffect } from "react";

interface ErrorProps {
  error:  Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[DashboardError]", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <p className="text-lg font-semibold">Failed to load dashboard</p>
      <p className="text-sm text-zinc-500">{error.message}</p>
      <button
        onClick={reset}
        className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
