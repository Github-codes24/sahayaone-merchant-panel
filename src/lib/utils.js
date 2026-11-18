/**
 * Helper utility to merge conditional class names.
 */
export function cn(...inputs) {
  const classes = [];
  for (const input of inputs) {
    if (!input) continue;
    if (typeof input === "string" || typeof input === "number") {
      classes.push(input);
    } else if (Array.isArray(input)) {
      if (input.length) {
        const inner = cn(...input);
        if (inner) classes.push(inner);
      }
    } else if (typeof input === "object") {
      for (const [key, value] of Object.entries(input)) {
        if (value) classes.push(key);
      }
    }
  }
  return classes.filter(Boolean).join(" ");
}
