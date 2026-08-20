/* Render-time text shaping. Nothing here changes wording — only where lines
   are allowed to break. */

/** U+2060 WORD JOINER — zero-width, and unlike a nbsp it adds no space. */
const WORD_JOINER = "⁠";

/**
 * Suppress the line-break opportunity a solidus creates.
 *
 * Browsers may break a line straight after "/", so a compound label like
 * "Аренда Авто/Мото" in a narrow card splits as "Авто/" + "Мото" — three lines
 * with a slash dangling at the end of one. Joining the halves makes it wrap at
 * the space instead: "Аренда" / "Авто/Мото".
 *
 * Applied at render time on purpose. The alternative — storing the joiner in
 * `content/*.json` — hides a zero-width character inside editable copy, where it
 * is invisible in every editor and silently lost the first time someone retypes
 * the label. Keeping it here leaves the content file plain, readable text.
 */
export function joinSlashes(text: string): string {
  return text.replace(/\//g, `/${WORD_JOINER}`);
}
