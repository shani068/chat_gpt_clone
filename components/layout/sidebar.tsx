// Left sidebar — primary navigation links for the dashboard shell
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
import { ROUTES } from "@/constants/routes";

const NAV_ITEMS = [
  { label: "Dashboard", href: ROUTES.DASHBOARD },
  { label: "Settings",  href: ROUTES.SETTINGS  },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-56 flex-col border-r border-zinc-100 bg-white px-3 py-6">
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-zinc-50",
              pathname === href ? "bg-zinc-100 text-zinc-900" : "text-zinc-500"
            )}
          >
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
