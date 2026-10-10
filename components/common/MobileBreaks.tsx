import { Fragment } from "react";

/**
 * Renders each "\n" in a heading as a line break on phones only.
 *
 * Long Russian headings wrap wherever the width runs out on a phone, which
 * splits phrases mid-thought ("Что Гости Думают на" / "Самом Деле"). The copy
 * marks the intended break with "\n" instead, and from `md` up the `<br>` is
 * hidden and the space beside it joins the words, so desktop wraps naturally
 * as before. A string without "\n" renders unchanged.
 */
export function MobileBreaks({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {i > 0 && (
            <>
              <br className="md:hidden" />{" "}
            </>
          )}
          {line}
        </Fragment>
      ))}
    </>
  );
}
