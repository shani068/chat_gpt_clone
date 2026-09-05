import Link from "next/link";

import { Logo } from "@/components/shared/logo";
import { ROUTES } from "@/constants/routes";

/**
 * Auth pages: a single centred column on the app background, with the same
 * hairline grid the marketing hero uses so the two feel like one product.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center px-4 py-12">
      <div
        aria-hidden
        className="bg-grid mask-fade-edges pointer-events-none absolute inset-0 opacity-50"
      />

      <div className="relative w-full max-w-[22rem]">
        <Link
          href={ROUTES.HOME}
          className="focus-visible:outline-ring mb-8 inline-flex rounded-md focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          <Logo size={22} />
        </Link>

        {children}
      </div>
    </div>
  );
}
