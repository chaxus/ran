import type { DocumentFragmentMock, HTMLElementMock } from './mocks';

export type MockNode = HTMLElementMock | DocumentFragmentMock | string;

const isHTMLElementMockNode = (node: MockNode): node is HTMLElementMock => {
  if (typeof node === 'string') return false;
  return 'tagName' in node && 'childrenList' in node;
};

/** Characters that begin a new qualifier, and so end the one before it. */
const QUALIFIER_START = '.#[';

/**
 * Splits a compound selector into its parts.
 *
 * Hand-written rather than a regular expression: the obvious pattern for the attribute
 * form, `\[[^\]]*\]`, backtracks across every position on an input like `[[[[[`, which is
 * polynomial in the selector's length. This walks the string once. A selector is not
 * usually attacker-controlled, but `querySelector` is a library entry point and the caller
 * chooses what reaches it.
 *
 * @param selector The trimmed, non-empty selector.
 * @returns Its parts, or null when the selector uses syntax this engine does not implement.
 */
function splitCompound(selector: string): string[] | null {
  const parts: string[] = [];
  let at = 0;

  const tag = /^[a-zA-Z][\w-]*/.exec(selector);
  if (tag !== null) {
    parts.push(tag[0]);
    at = tag[0].length;
  }

  while (at < selector.length) {
    const start = selector[at];
    if (start === '[') {
      const close = selector.indexOf(']', at + 1);
      if (close === -1) return null;
      parts.push(selector.slice(at, close + 1));
      at = close + 1;
      continue;
    }
    if (start !== '.' && start !== '#') return null;
    let end = at + 1;
    while (end < selector.length && !QUALIFIER_START.includes(selector[end])) end += 1;
    // A bare `.` or `#` qualifies nothing.
    if (end === at + 1) return null;
    parts.push(selector.slice(at, end));
    at = end;
  }

  return parts.length > 0 ? parts : null;
}

/**
 * Matches one simple selector — a single tag, class, id, or attribute test.
 *
 * @param node The node to test.
 * @param selector One simple selector, already trimmed and non-empty.
 * @returns Whether the node matches.
 */
const matchSimple = (node: HTMLElementMock, selector: string): boolean => {
  const trimmed = selector;

  if (trimmed.startsWith('.')) {
    return node.classList.contains(trimmed.slice(1));
  }
  if (trimmed.startsWith('#')) {
    return node.getAttribute('id') === trimmed.slice(1);
  }
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    const content = trimmed.slice(1, -1).trim();
    const [rawKey, rawValue] = content.split('=');
    const key = (rawKey || '').trim();
    if (!key) return false;
    if (rawValue == null) return node.hasAttribute(key);
    const value = rawValue.trim().replace(/^['"]|['"]$/g, '');
    return node.getAttribute(key) === value;
  }
  return node.tagName === trimmed.toLowerCase();
};

/**
 * Matches a compound selector such as `slot[name="footer"]` or `div.row#first`.
 *
 * Every qualifier must match. Supporting only one at a time meant a selector like
 * `slot[name="footer"]` fell through to the tag comparison and matched nothing, which broke
 * server rendering for any component that located a node that way — silently, because a
 * `querySelector` returning null there is usually asserted away with `!`.
 *
 * Anything the tokenizer cannot consume in full — a descendant combinator, `>`, a
 * pseudo-class — returns false rather than matching on the part it understood. A selector
 * this engine does not implement should find nothing, not something arbitrary.
 *
 * @param node The node to test.
 * @param selector The selector to match.
 * @returns Whether the node matches every part of the selector.
 */
export const matchSelector = (node: HTMLElementMock, selector: string): boolean => {
  const trimmed = selector.trim();
  if (!trimmed) return false;
  const parts = splitCompound(trimmed);
  if (parts === null) return false;
  return parts.every((part) => matchSimple(node, part));
};

export const collectMatches = (nodes: MockNode[], selector: string, result: HTMLElementMock[]): void => {
  for (const child of nodes) {
    if (!isHTMLElementMockNode(child)) continue;
    if (matchSelector(child, selector)) {
      result.push(child);
    }
    collectMatches(child.childrenList as MockNode[], selector, result);
  }
};
