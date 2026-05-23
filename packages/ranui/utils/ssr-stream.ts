import { getSSRConstructor } from './ssr-registry';
import { renderToString } from './ssr';

// ─── Simple HTML Tokenizer ────────────────────────────────────────────────────
// Identifies custom element tags (tag names containing hyphens) in an HTML string,
// instantiates them via the SSR registry, and substitutes their serialized output.
// Not a full HTML5 parser — handles well-formed input as produced by template strings.

interface StaticToken {
  type: 'static';
  content: string;
}

interface CustomElementToken {
  type: 'custom-element';
  tagName: string;
  attrs: Record<string, string>;
  innerHTML: string;
}

type Token = StaticToken | CustomElementToken;

function parseAttrs(attrsStr: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  // Matches: key="value", key='value', key=value, key (boolean)
  const re = /([\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+)))?/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(attrsStr)) !== null) {
    if (!m[1]) continue;
    attrs[m[1]] = m[2] ?? m[3] ?? m[4] ?? '';
  }
  return attrs;
}

function findClosingTag(html: string, tagName: string, searchFrom: number): number {
  const open = `<${tagName}`;
  const close = `</${tagName}>`;
  let depth = 1;
  let pos = searchFrom;
  while (depth > 0 && pos < html.length) {
    const nextOpen = html.indexOf(open, pos);
    const nextClose = html.indexOf(close, pos);
    if (nextClose === -1) return -1;
    if (nextOpen !== -1 && nextOpen < nextClose) {
      // Ensure it's an actual tag (followed by space, >, or /)
      const after = html[nextOpen + open.length];
      if (after === ' ' || after === '>' || after === '/' || after === '\n' || after === '\t') {
        depth++;
        pos = nextOpen + open.length;
        continue;
      }
    }
    depth--;
    if (depth === 0) return nextClose;
    pos = nextClose + close.length;
  }
  return -1;
}

function tokenize(html: string): Token[] {
  const tokens: Token[] = [];
  // Custom element open tag: tag name must contain a hyphen
  const openTagRe = /<([a-z][a-z0-9]*(?:-[a-z0-9]+)+)((?:\s[^>]*)?)\s*>/gi;
  let cursor = 0;
  let match: RegExpExecArray | null;
  openTagRe.lastIndex = 0;

  while ((match = openTagRe.exec(html)) !== null) {
    const tagStart = match.index;
    const tagName = match[1].toLowerCase();
    const attrsStr = match[2] || '';
    const innerStart = tagStart + match[0].length;

    const closePos = findClosingTag(html, tagName, innerStart);
    if (closePos === -1) continue; // Malformed — skip

    const innerHTML = html.slice(innerStart, closePos);
    const outerEnd = closePos + `</${tagName}>`.length;

    if (tagStart > cursor) {
      tokens.push({ type: 'static', content: html.slice(cursor, tagStart) });
    }
    tokens.push({ type: 'custom-element', tagName, attrs: parseAttrs(attrsStr), innerHTML });
    cursor = outerEnd;
    openTagRe.lastIndex = outerEnd;
  }

  if (cursor < html.length) {
    tokens.push({ type: 'static', content: html.slice(cursor) });
  }
  return tokens;
}

async function collectChunks(gen: AsyncGenerator<string>): Promise<string> {
  const parts: string[] = [];
  for await (const chunk of gen) parts.push(chunk);
  return parts.join('');
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Streaming SSR renderer. Accepts an HTML string containing RanUI custom elements
 * and yields HTML chunks with Declarative Shadow DOM (DSD) inlined.
 *
 * Static HTML is yielded immediately; custom elements are instantiated via the
 * SSR registry and serialized before yielding.
 *
 * @example
 * ```ts
 * import { renderToStream } from 'ranui/ssr-stream';
 *
 * const stream = renderToStream(`
 *   <r-button type="primary">Submit</r-button>
 *   <r-progress percent="65"></r-progress>
 * `);
 * for await (const chunk of stream) res.write(chunk);
 * ```
 */
export async function* renderToStream(html: string): AsyncGenerator<string> {
  const tokens = tokenize(html);
  for (const token of tokens) {
    if (token.type === 'static') {
      yield token.content;
      continue;
    }

    const Ctor = getSSRConstructor(token.tagName);
    if (!Ctor) {
      // Unknown element — pass through unchanged
      const closedAttrs = Object.entries(token.attrs)
        .map(([k, v]) => (v === '' ? ` ${k}` : ` ${k}="${v}"`))
        .join('');
      yield `<${token.tagName}${closedAttrs}>${token.innerHTML}</${token.tagName}>`;
      continue;
    }

    const el = new Ctor();
    for (const [k, v] of Object.entries(token.attrs)) {
      el.setAttribute(k, v);
    }

    // Recursively render children so parent can access them during serialization
    if (token.innerHTML.trim()) {
      const childHtml = await collectChunks(renderToStream(token.innerHTML));
      el.innerHTML = childHtml;
    }

    yield renderToString(el);
  }
}

/**
 * Non-streaming convenience wrapper. Collects all chunks and returns a single string.
 */
export async function renderHTMLToString(html: string): Promise<string> {
  return collectChunks(renderToStream(html));
}
