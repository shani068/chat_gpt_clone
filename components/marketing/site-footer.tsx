import Link from "next/link";

import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { APP_NAME, APP_VERSION } from "@/constants/config";
import { ROUTES } from "@/constants/routes";

const COLUMNS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Preview", href: "#preview" },
      { label: "How it works", href: "#how" },
    ],
  },
  {
    heading: "Application",
    links: [
      { label: "Start chatting", href: ROUTES.CHAT },
      { label: "Settings", href: ROUTES.SETTINGS },
      { label: "Sign in", href: ROUTES.LOGIN },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-border border-t">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-[28ch]">
            <Logo size={20} />
            <p className="text-small text-muted-foreground mt-3">
              A frontend reference implementation for an AI assistant. Every
              interaction is real; the model responses are simulated.
            </p>
          </div>

          <div className="flex gap-12 sm:gap-16">
            {COLUMNS.map((column) => (
              <nav key={column.heading} aria-label={column.heading}>
                <h2 className="text-caption text-muted-foreground font-medium tracking-[0.07em] uppercase">
                  {column.heading}
                </h2>
                <ul className="mt-3 space-y-2">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      {link.href.startsWith("#") ? (
                        <a
                          href={link.href}
                          className="text-small text-muted-foreground hover:text-foreground rounded-sm transition-colors"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-small text-muted-foreground hover:text-foreground rounded-sm transition-colors"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="border-border mt-12 flex flex-col-reverse items-start gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-caption text-muted-foreground">
            {APP_NAME} v{APP_VERSION} · Built with Next.js, TypeScript and Tailwind
          </p>
          <ThemeToggle size="sm" />
        </div>
      </div>
    </footer>
  );
}
