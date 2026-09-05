import { Skeleton } from "@/components/ui/primitives";

/** Shown while the sign-in route suspends. Mirrors the real form's rhythm. */
export default function LoginLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-7 w-24" />
      <Skeleton className="h-4 w-44" />
      <div className="space-y-4 pt-2">
        <Skeleton className="h-9 w-full rounded-lg" />
        <Skeleton className="h-9 w-full rounded-lg" />
        <Skeleton className="h-11 w-full rounded-lg" />
      </div>
    </div>
  );
}
