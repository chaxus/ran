/**
 * Block splitting for streaming markdown.
 *
 * The document is tokenised **once** by the same configured marked instance that renders
 * it (`render.ts`), and every top-level token becomes one block. While streaming only the
 * last block's source keeps changing, so the component re-renders that single block and
 * leaves every earlier block's DOM alone.
 *
 * Because the caller's parser knows about the math extensions, a `$$…$$` span is already a
 * single token here — there is no need to re-detect it in the text. The only regrouping
 * left is structural:
 *
 * - blank-line (`space`) tokens fold into the preceding block, so no empty block elements
 * - an HTML block whose tags are still open swallows the following tokens until they close
 *   (CommonMark ends an HTML block at a blank line, but `<div>` wrapping markdown has to
 *   stay one unit or each half would be parsed — and auto-closed — on its own)
 */
import type { Token, Tokens, TokensList } from 'marked';

/** Top-level tokens that must be rendered and diffed as one unit. */
export type TokenGroup = Token[];

/**
 * Whether `html` leaves any element open, decided by the **HTML parser itself** rather
 * than by counting tags: a sentinel is appended and we check whether it landed at the
 * fragment root or got nested inside something still open.
 *
 * Counting `<tag>` / `</tag>` with patterns gets this wrong in both directions — a tag
 * inside a comment (`<!-- <div> -->`) or inside an attribute value (`title="</div>"`)
 * is not markup, and implied structure (`<table><tr><td>`) is markup that was never
 * written. `<template>` content is inert, so nothing in it loads, runs or renders.
 *
 * The `querySelector` here is deliberate and the only one left in the component: this is
 * a throwaway probe, not component DOM, and asking where the sentinel *ended up* also
 * answers whether it survived at all — which is what distinguishes "still open" from
 * "swallowed by an unterminated comment". Walking to `lastChild` instead would conflate
 * the two.
 */
let probe: HTMLTemplateElement | null = null;
export const hasUnclosedTag = (html: string): boolean => {
  if (typeof document === 'undefined') return false;
  if (!probe) probe = document.createElement('template');
  probe.innerHTML = `${html}<i data-ran-probe=""></i>`;
  const sentinel = probe.content.querySelector('[data-ran-probe]');
  // No sentinel at all → it was swallowed by an unterminated comment or a raw-text
  // element; treat that as closed so a stray `<!--` can't merge the rest of the document.
  const open = sentinel !== null && sentinel.parentNode !== probe.content;
  probe.innerHTML = '';
  return open;
};

export const splitTokens = (tokens: TokensList | Token[]): TokenGroup[] => {
  const groups: TokenGroup[] = [];
  /** Raw text of the HTML tokens in the current merge run, '' when not merging. */
  let openHtml = '';

  for (const token of tokens) {
    const current = groups[groups.length - 1];

    if (openHtml) {
      current.push(token);
      // Only HTML tokens can close the run. Markdown in between is not markup yet, so
      // a `</div>` written inside a fenced code block must not end the merge.
      if (token.type === 'html') {
        openHtml += token.raw;
        if (!hasUnclosedTag(openHtml)) openHtml = '';
      }
      continue;
    }

    // Neither blank lines nor link reference definitions render to anything, so they ride
    // along with the preceding block instead of becoming an empty block element of their own.
    if (token.type === 'space' || token.type === 'def') {
      if (current) current.push(token);
      continue;
    }

    groups.push([token]);
    if (token.type === 'html' && (token as Tokens.HTML).block && hasUnclosedTag(token.raw)) {
      openHtml = token.raw;
    }
  }

  return groups;
};

/**
 * Regex matching a code fence at the start of a line, per CommonMark: up to three spaces
 * of indentation, then three or more backticks or tildes.
 */
const CODE_FENCE = /^[ \t]{0,3}(`{3,}|~{3,})/;

/**
 * Whether a fenced-code token's fence is still open. Only meaningful for a `code` token
 * (an indented code block has no fence and yields `false`), so callers gate on the token
 * type instead of scanning arbitrary text for something that looks like a fence.
 */
export const hasIncompleteCodeFence = (markdown: string): boolean => {
  let openChar: string | null = null;
  let openLength = 0;
  for (const line of markdown.split('\n')) {
    const m = CODE_FENCE.exec(line);
    if (openChar === null) {
      if (m) {
        openChar = m[1][0];
        openLength = m[1].length;
      }
    } else if (m && m[1][0] === openChar && m[1].length >= openLength) {
      openChar = null;
      openLength = 0;
    }
  }
  return openChar !== null;
};
