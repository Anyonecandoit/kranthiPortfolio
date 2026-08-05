/**
 * Tiny utility to concatenate class names while handling undefined values.
 */
export function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}
