"use client";

import Link from "next/link";

import { useEffect, useState } from "react";

import { Menu, X } from "lucide-react";

import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { ROUTES } from "@/constants/routes";
import { useSession } from "@/providers/session-provider";
import { cn } from "@/utils/cn";

const LINKS = [
  { href: "#features", label: "Features" },
  { href: "#preview", label: "Product" },
  { href: "#how", label: "How it works" },
];

/**
 * Marketing navigation. Becomes a hairline-bordered bar once the page scrolls,
 * so the hero opens against nothing but type.
 */
export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { status } = useSession();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // A drawer that survives a resize into desktop would trap the page.
  useEffect(() => {
    if (!isMenuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMenuOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-colors duration-200",
        isScrolled
          ? "border-b border-border bg-background/85 backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Link
          href={ROUTES.HOME}
          className="focus-visible:outline-ring rounded-md focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          <Logo size={20} />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-small text-muted-foreground hover:text-foreground focus-visible:outline-ring rounded-md px-2.5 py-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle size="sm" className="hidden sm:inline-flex" />

          <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
            <Link href={ROUTES.LOGIN}>
              {status === "authenticated" ? "Account" : "Sign in"}
            </Link>
          </Button>

          <Button variant="primary" size="sm" asChild>
            <Link href={ROUTES.CHAT_ENTRY}>Start chatting</Link>
          </Button>

          <IconButton
            size="md"
            label={isMenuOpen ? "Close menu" : "Open menu"}
            showTooltip={false}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
            icon={
              isMenuOpen ? (
                <X size={17} strokeWidth={2} aria-hidden />
              ) : (
                <Menu size={17} strokeWidth={2} aria-hidden />
              )
            }
            className="md:hidden"
          />
        </div>
      </div>

      {isMenuOpen ? (
        <nav
          aria-label="Primary"
          className="anim-fade border-border bg-background border-t px-4 py-3 md:hidden"
        >
          <ul className="flex flex-col">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-small text-muted-foreground hover:bg-muted hover:text-foreground block rounded-md px-2 py-2 transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <Link
                href={ROUTES.LOGIN}
                onClick={() => setIsMenuOpen(false)}
                className="text-small text-muted-foreground hover:bg-muted hover:text-foreground block rounded-md px-2 py-2 transition-colors"
              >
                Sign in
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
