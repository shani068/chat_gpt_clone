import { cn } from "@/utils/cn";

/**
 * The product mark: a four-point spark, the common shorthand for generative
 * output. Drawn in currentColor so it inherits whatever surface it sits on;
 * the accent only appears on the optional secondary spark.
 *
 * Deliberately an original geometric mark rather than a copy of any vendor's
 * trademarked logo.
 */
export function LogoMark({
  size = 20,
  className,
  showDot = true,
}: {
  size?: number;
  className?: string;
  showDot?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={cn("shrink-0", className)}
    >
      <path
        d="M12 2.5Q13.52 10.48 21.5 12 13.52 13.52 12 21.5 10.48 13.52 2.5 12 10.48 10.48 12 2.5Z"
        fill="currentColor"
      />
      {showDot ? (
        <path
          d="M20 0.6Q20.54 3.46 23.4 4 20.54 4.54 20 7.4 19.46 4.54 16.6 4 19.46 3.46 20 0.6Z"
          className="fill-accent"
        />
      ) : null}
    </svg>
  );
}

export function Logo({
  className,
  size = 20,
  showWordmark = true,
}: {
  className?: string;
  size?: number;
  showWordmark?: boolean;
}) {
  return (
    <span className={cn("text-foreground inline-flex items-center gap-2", className)}>
      <LogoMark size={size} />
      {showWordmark ? (
        <span className="text-[0.9375rem] font-semibold tracking-[-0.02em]">
          ChatGPT
        </span>
      ) : null}
    </span>
  );
}
