// Server Component: walks Markdown tokens into elements at build time, so
// neither marked nor the post text ships as JavaScript.
import Image from "next/image";
import { Fragment, type ReactNode } from "react";
import type { Token, Tokens } from "marked";
import { LocalizedLink } from "@/components/common/LocalizedLink";
import { webpSize } from "@/lib/image-size";
import { headingId, lexMarkdown, plainText, soleImage } from "@/lib/markdown";

/*
 * Colours: body is charcoal; secondary text is charcoal/70 (6.05:1 on sand),
 * never `stone`, which is 3.43:1 there and fails AA at body sizes. Links are
 * `accent-text` (deep-teal, 5.36:1 on sand) and underlined, since colour alone
 * must not be the only cue.
 */
const LINK =
  "text-accent-text underline decoration-1 underline-offset-[3px] " +
  "hover:decoration-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2 rounded-sm";

function isInternal(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//");
}

function Inline({ tokens }: { tokens: Token[] }): ReactNode {
  return tokens.map((t, i) => {
    switch (t.type) {
      case "strong":
        return <strong key={i} className="font-semibold"><Inline tokens={t.tokens ?? []} /></strong>;
      case "em":
        return <em key={i}><Inline tokens={t.tokens ?? []} /></em>;
      case "del":
        return <del key={i}><Inline tokens={t.tokens ?? []} /></del>;
      case "codespan":
        return <code key={i} className="font-mono text-[0.9em]">{t.text}</code>;
      case "br":
        return <br key={i} />;
      case "link": {
        const children = <Inline tokens={t.tokens ?? []} />;
        if (isInternal(t.href)) {
          return <LocalizedLink key={i} href={t.href} className={LINK}>{children}</LocalizedLink>;
        }
        return (
          <a key={i} href={t.href} className={LINK} target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        );
      }
      case "image":
        // Inline images are not supported: give the photo its own paragraph.
        throw new Error(`Image ${t.href} must sit in a paragraph of its own`);
      case "html":
        throw new Error(`Raw HTML is not allowed in posts: ${t.raw.trim().slice(0, 60)}`);
      case "text":
        return "tokens" in t && t.tokens ? <Inline key={i} tokens={t.tokens} /> : t.text;
      case "escape":
        return t.text;
      default:
        return "text" in t && typeof t.text === "string" ? t.text : null;
    }
  });
}

function Figure({ image }: { image: Tokens.Image }) {
  const { width, height } = webpSize(image.href);
  const alt = plainText(image.tokens ?? []) || image.text;
  if (!alt.trim()) throw new Error(`Image ${image.href} needs alt text: ![describe it](${image.href})`);
  // Edge to edge on phones; from `sm` the photo steps out of the 624px text
  // column to 64rem (or the viewport less its gutters, whichever is smaller).
  // Negative margins, not 100vw: vw counts the scrollbar, so a 100vw block
  // scrolls sideways on any desktop with classic scrollbars. The caption stays
  // on the text column's edges.
  return (
    <figure className="my-12 -mx-6 sm:mx-[calc(50%_-_min(32rem,_50vw_-_1.5rem))] md:my-16">
      <Image
        src={image.href}
        alt={alt}
        width={width}
        height={height}
        sizes="(max-width: 640px) 100vw, (max-width: 1072px) calc(100vw - 3rem), 1024px"
        className="h-auto max-h-[80vh] w-full object-cover sm:rounded-md"
      />
      {image.title && (
        <figcaption className="mx-auto mt-3 max-w-[39rem] px-6 text-sm leading-snug text-charcoal/70 sm:px-0">
          {image.title}
        </figcaption>
      )}
    </figure>
  );
}

/** `[[name]]` alone in a paragraph marks where a page-supplied block goes. */
const SLOT_RE = /^\[\[([a-z]+)\]\]$/;

type Slots = Record<string, ReactNode>;

function Block({ token, slots }: { token: Token; slots: Slots }): ReactNode {
  switch (token.type) {
    case "space":
      return null;
    case "heading": {
      const id = headingId(token.text);
      const children = <Inline tokens={token.tokens ?? []} />;
      if (token.depth === 2) {
        return (
          <h2 id={id} className="mt-16 mb-5 scroll-mt-28 font-serif text-3xl md:text-4xl font-semibold text-charcoal text-balance">
            {children}
          </h2>
        );
      }
      if (token.depth === 3) {
        return (
          <h3 id={id} className="mt-12 mb-3 scroll-mt-28 font-sans text-xl font-semibold text-charcoal text-balance">
            {children}
          </h3>
        );
      }
      // One <h1> per page (the title); ##/### are the only levels a post needs.
      throw new Error(`Use ## or ### in posts, not ${"#".repeat(token.depth)}: "${token.text}"`);
    }
    case "paragraph": {
      const slot = SLOT_RE.exec(token.text.trim());
      if (slot) {
        if (!(slot[1] in slots)) throw new Error(`Unknown block [[${slot[1]}]] in post`);
        return slots[slot[1]];
      }
      const image = soleImage(token as Tokens.Paragraph);
      if (image) return <Figure image={image} />;
      // Open questions in a draft ("TO CONFIRM: …") stand out on the preview.
      // lib/blog.ts refuses to publish a post that still has one.
      const open = token.text.includes("TO CONFIRM");
      return (
        <p className={open ? "my-5 leading-relaxed text-pretty rounded-md bg-logo-gold/25 px-3 py-2" : "my-5 leading-relaxed text-pretty"}>
          <Inline tokens={token.tokens ?? []} />
        </p>
      );
    }
    case "list": {
      // `- [ ] item` lines: a packing list. Drawn boxes rather than <input>s —
      // there is nothing to submit, and a disabled checkbox is announced as
      // "checkbox, not checked, dimmed" before every item.
      if (!token.ordered && token.items.length > 0 && token.items.every((item: Tokens.ListItem) => item.task)) {
        return (
          <ul className="my-6 space-y-2.5 leading-relaxed">
            {token.items.map((item: Tokens.ListItem, i: number) => (
              <li key={i} className="flex gap-3.5 text-pretty">
                <span aria-hidden="true" className="mt-[0.3em] size-[1.05em] shrink-0 rounded-[3px] border-2 border-deep-teal/80" />
                <span>
                  {item.tokens
                    .filter((child) => child.type !== "checkbox")
                    .map((child, j) =>
                      child.type === "text" ? (
                        <Inline key={j} tokens={"tokens" in child && child.tokens ? child.tokens : [child]} />
                      ) : (
                        <Block key={j} token={child} slots={slots} />
                      )
                    )}
                </span>
              </li>
            ))}
          </ul>
        );
      }
      const ListTag = token.ordered ? "ol" : "ul";
      return (
        <ListTag
          start={token.ordered && token.start !== 1 && token.start !== "" ? Number(token.start) : undefined}
          className={`my-5 space-y-2 pl-6 leading-relaxed marker:text-deep-teal ${token.ordered ? "list-decimal" : "list-disc"}`}
        >
          {token.items.map((item: Tokens.ListItem, i: number) => (
            <li key={i} className="pl-1 text-pretty">
              {item.tokens.map((child, j) =>
                child.type === "text" ? (
                  <Inline key={j} tokens={"tokens" in child && child.tokens ? child.tokens : [child]} />
                ) : (
                  <Block key={j} token={child} slots={slots} />
                )
              )}
            </li>
          ))}
        </ListTag>
      );
    }
    case "table": {
      const label = plainText(token.header.flatMap((h: Tokens.TableCell) => h.tokens));
      return (
        <>
          {/*
            Phones: one card per row — the first column is the card's title and
            the rest are label/value pairs under it. The table was 170px wider
            than a 390px screen, so its last columns sat behind a sideways
            scroll most readers never find. Only one of the two layouts is
            displayed at a time, so assistive tech reads it once.
          */}
          <div className="my-8 space-y-3 sm:hidden" role="list" aria-label={label}>
            {token.rows.map((row: Tokens.TableCell[], r: number) => (
              <div key={r} role="listitem" className="rounded-md bg-ivory p-4 shadow-sm">
                <p className="font-sans font-semibold text-charcoal"><Inline tokens={row[0].tokens} /></p>
                <dl className="mt-2 grid grid-cols-[8.5rem_1fr] gap-x-3 gap-y-1.5 font-sans text-sm">
                  {row.slice(1).map((cell, c) => (
                    <Fragment key={c}>
                      <dt className="text-charcoal/70"><Inline tokens={token.header[c + 1].tokens} /></dt>
                      <dd className="text-charcoal"><Inline tokens={cell.tokens} /></dd>
                    </Fragment>
                  ))}
                </dl>
              </div>
            ))}
          </div>

          {/* From sm: the table, scrolling inside its own box if it is ever wider than the column. */}
          <div className="my-8 hidden overflow-x-auto sm:block" role="region" aria-label={label} tabIndex={0}>
            <table className="w-full min-w-[32rem] border-collapse text-sm">
              <thead>
                <tr>
                  {token.header.map((cell: Tokens.TableCell, i: number) => (
                    <th
                      key={i}
                      scope="col"
                      className={`border-b-2 border-charcoal/15 py-2 pr-4 align-bottom font-semibold ${cell.align === "right" ? "text-right" : "text-left"}`}
                    >
                      <Inline tokens={cell.tokens} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {token.rows.map((row: Tokens.TableCell[], r: number) => (
                  <tr key={r}>
                    {row.map((cell, c) => {
                      const Cell = c === 0 ? "th" : "td";
                      return (
                        <Cell
                          key={c}
                          scope={c === 0 ? "row" : undefined}
                          className={`border-b border-charcoal/10 py-2.5 pr-4 align-top whitespace-nowrap ${c === 0 ? "font-semibold" : ""} ${cell.align === "right" ? "text-right" : "text-left"}`}
                        >
                          <Inline tokens={cell.tokens} />
                        </Cell>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      );
    }
    case "blockquote":
      return (
        <aside className="my-8 border-l-2 border-deep-teal bg-ivory px-5 py-4 rounded-r-md">
          {(token.tokens ?? []).map((child, i) => (
            child.type === "paragraph"
              ? <p key={i} className="my-2 leading-relaxed text-pretty"><Inline tokens={child.tokens ?? []} /></p>
              : <Block key={i} token={child} slots={slots} />
          ))}
        </aside>
      );
    case "hr":
      return <hr className="my-12 border-charcoal/10" />;
    case "html":
      throw new Error(`Raw HTML is not allowed in posts: ${token.raw.trim().slice(0, 60)}`);
    case "code":
      throw new Error("Code blocks are not styled for posts");
    default:
      return null;
  }
}

interface ArticleBodyProps {
  markdown: string;
  /**
   * Blocks the page places inside the prose. A paragraph that is exactly
   * `[[offer]]` renders `slots.offer` there — `null` when the offer is off, so
   * an expired offer leaves no gap. An unknown name fails the build.
   */
  slots?: Slots;
  /**
   * Slots drawn edge to edge. They are rendered between runs of the text
   * column instead of inside one, so a band can span the page without 100vw
   * (which counts the scrollbar). Margins still collapse across the seam: the
   * column wrappers have no vertical padding.
   */
  bleed?: readonly string[];
}

/** The reading column: 624px of text at the 18px desktop size, ~70 characters a line. */
const COLUMN = "mx-auto max-w-[42rem] px-6";

/** A post's Markdown, typeset. Blockquotes render as a tinted aside — use them for tips. */
export function ArticleBody({ markdown, slots = {}, bleed = [] }: ArticleBodyProps) {
  const out: ReactNode[] = [];
  let run: ReactNode[] = [];
  const flush = () => {
    if (run.length > 0) out.push(<div key={`column-${out.length}`} className={COLUMN}>{run}</div>);
    run = [];
  };

  lexMarkdown(markdown).forEach((token, i) => {
    const name = token.type === "paragraph" ? SLOT_RE.exec(token.text.trim())?.[1] : undefined;
    if (name && bleed.includes(name)) {
      if (!(name in slots)) throw new Error(`Unknown block [[${name}]] in post`);
      flush();
      out.push(<Fragment key={`bleed-${i}`}>{slots[name]}</Fragment>);
    } else {
      run.push(<Block key={i} token={token} slots={slots} />);
    }
  });
  flush();

  return <div className="font-sans text-base md:text-lg text-charcoal">{out}</div>;
}
