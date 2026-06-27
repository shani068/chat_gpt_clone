// Auth layout — centers the card on screen; no navigation chrome
import { APP_NAME } from "@/constants/config";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-4">
      <p className="mb-8 text-xl font-bold tracking-tight">{APP_NAME}</p>
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm ring-1 ring-zinc-100">
        {children}
      </div>
    </div>
  );
}
