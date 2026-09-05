/**
 * Motion tokens. Durations are deliberately short — the interface should feel
 * quick, not animated — and everything shares one easing curve so transitions
 * across the product read as the same hand.
 */
export const EASE_PREMIUM: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const DURATION = {
  fast: 0.12,
  normal: 0.18,
  medium: 0.24,
  large: 0.32,
} as const;
