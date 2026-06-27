// Inline loading spinner — drop into any layout that needs a loading indicator
import { cn } from "@/utils/cn";

interface SpinnerProps {
  size?:      "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-10 w-10" };

export function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        "inline-block animate-spin rounded-full border-2 border-current border-t-transparent text-zinc-400",
        sizeClasses[size],
        className
      )}
    />
  );
}
