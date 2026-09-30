import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Substitute `{key}` placeholders, never through a replacement *string*.
 *
 * `String.replace` reads `$&`, `` $` ``, `$'` and `$$` inside the replacement,
 * and every offer price is a dollar amount — "from $65/night" goes into a
 * template as a literal `$6`, which is one authored `$&` away from a mangled
 * message that nobody would notice until a guest sent it. The same holds for
 * a guest's own email address — `a$&b@example.com` is a valid one. A replacer
 * function is handed the value verbatim.
 */
export function fill(template: string, values: Record<string, string>): string {
  return Object.entries(values).reduce(
    (out, [key, value]) => out.replace(`{${key}}`, () => value),
    template
  );
}
