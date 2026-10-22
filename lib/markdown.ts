import { Lexer, type Token, type Tokens } from "marked";

/**
 * Markdown → tokens for components/sections/ArticleBody.
 *
 * Only the lexer is used. marked's HTML renderer would hand back a string for
 * `dangerouslySetInnerHTML`, which cannot route images through `next/image`
 * (Image Rules in CLAUDE.md) or internal links through `LocalizedLink`. Walking
 * the tokens into React elements ourselves gives both, and keeps raw HTML in a
 * post from reaching the page at all.
 */
export function lexMarkdown(markdown: string): Token[] {
  return Lexer.lex(markdown, { gfm: true });
}

/**
 * Heading anchor: lowercase, letters (any script) and digits joined by hyphens,
 * so `## Где жить` gets `#где-жить` and a shared link survives a reload.
 */
export function headingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]*>/g, "")
    .replace(/[*_`[\]()]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

/** The `##` headings, in order — the post's "In this guide" list. */
export function tableOfContents(tokens: Token[]): { id: string; text: string }[] {
  return tokens
    .filter((t): t is Tokens.Heading => t.type === "heading" && t.depth === 2)
    .map((t) => ({ id: headingId(t.text), text: plainText(t.tokens ?? []) }));
}

/** Inline tokens flattened to text — for the TOC and alt-less contexts. */
export function plainText(tokens: Token[]): string {
  return tokens
    .map((t) => {
      if ("tokens" in t && Array.isArray(t.tokens)) return plainText(t.tokens);
      if (t.type === "br") return " ";
      return "text" in t && typeof t.text === "string" ? t.text : "";
    })
    .join("");
}

/** A paragraph holding nothing but one image — rendered as a <figure>. */
export function soleImage(token: Tokens.Paragraph): Tokens.Image | null {
  const meaningful = (token.tokens ?? []).filter((t) => !(t.type === "text" && t.text.trim() === ""));
  return meaningful.length === 1 && meaningful[0].type === "image" ? (meaningful[0] as Tokens.Image) : null;
}
