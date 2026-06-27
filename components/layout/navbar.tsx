// Top navigation bar — shows app name and a user menu placeholder
"use client";

import Link from "next/link";
import { APP_NAME } from "@/constants/config";
import { ROUTES } from "@/constants/routes";

export function Navbar() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-zinc-100 bg-white px-6">
      <Link href={ROUTES.DASHBOARD} className="text-sm font-semibold">
        {APP_NAME}
      </Link>
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-zinc-200" aria-label="User avatar" />
      </div>
    </header>
  );
}
