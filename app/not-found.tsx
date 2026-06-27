// Global 404 page — rendered whenever Next.js cannot match a route
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <span className="text-6xl font-bold text-zinc-200">404</span>
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-zinc-500">The page you are looking for does not exist.</p>
      <Link
        href={ROUTES.HOME}
        className="mt-2 rounded-full bg-black px-6 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
      >
        Go home
      </Link>
    </main>
  );
}
