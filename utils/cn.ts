// Merges Tailwind classes safely — clsx handles conditionals, twMerge removes conflicts
import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge ships with knowledge of Tailwind's *default* scale only, so
 * every custom `--text-*` token in globals.css (`text-body`, `text-small`, …)
 * looks like an unrecognised `text-<colour>` to it. It then treats those as
 * text-colour utilities, which puts them in the same conflict group as real
 * colours — and the last one in the string wins.
 *
 * The visible symptom was `text-primary-foreground` being silently dropped from
 * <Button variant="primary">, leaving white text on a white surface in dark
 * mode. Registering the tokens as font sizes puts them back in their own group.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display",
            "h1",
            "h2",
            "h3",
            "body",
            "chat",
            "small",
            "caption",
            "code",
          ],
        },
      ],
      "shadow": [{ shadow: ["e1", "e2", "e3"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
