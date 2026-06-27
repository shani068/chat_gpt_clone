// Home page — public landing page at /
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { APP_NAME } from "@/constants/config";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-4xl font-bold tracking-tight">{APP_NAME}</h1>
      <p className="text-zinc-500 text-lg">Welcome. Get started by signing in.</p>
      <div className="flex gap-4">
        <Link
          href={ROUTES.LOGIN}
          className="rounded-full bg-black px-6 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
        >
          Sign in
        </Link>
        <Link
          href={ROUTES.REGISTER}
          className="rounded-full border border-zinc-300 px-6 py-2 text-sm font-medium hover:bg-zinc-50 transition-colors"
        >
          Create account
        </Link>
      </div>
    </main>
  );
}
