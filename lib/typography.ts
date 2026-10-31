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

/**
 * Words that must not end a line: Russian one- and two-letter prepositions and
 * conjunctions belong with the word after them, so "Дайвинг и Снорклинг" sets as
 * "Дайвинг" / "и Снорклинг", never "Дайвинг и" / "Снорклинг".
 */
const BINDS_FORWARD = new Set(["и", "а", "в", "во", "с", "со", "к", "ко", "о", "об", "у", "на", "по", "за", "из", "от", "до"]);

/** Words that must not start a line: an ampersand stays with the word before it ("Diving &"). */
const BINDS_BACKWARD = new Set(["&"]);

/**
 * Split a short title into at most two lines, as evenly as the word breaks
 * allow, for the photo tiles that always set their titles on two lines.
 *
 * Chosen at render time rather than stored as "\n" in content, for the same
 * reason as `joinSlashes`: the copy stays plain text that anyone can retype. A
 * one-word title, or one with no permitted break, comes back as a single line.
 */
export function splitTitle(text: string): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length < 2) return [words.join(" ")];

  let best: string[] | null = null;
  let bestLongest = Infinity;
  for (let i = 1; i < words.length; i++) {
    if (BINDS_FORWARD.has(words[i - 1].toLowerCase())) continue;
    if (BINDS_BACKWARD.has(words[i])) continue;
    const first = words.slice(0, i).join(" ");
    const second = words.slice(i).join(" ");
    const longest = Math.max(first.length, second.length);
    if (longest < bestLongest) {
      bestLongest = longest;
      best = [first, second];
    }
  }
  return best ?? [words.join(" ")];
}

/** Characters in the longest line `splitTitle` will set — what a tile must fit. */
export function longestTitleLine(text: string): number {
  return Math.max(...splitTitle(text).map((line) => line.length));
}
