/**
 * Frontmatter for this site's own markdown — a deliberately small, strict subset of
 * YAML rather than a YAML dependency.
 *
 * The site controls every file it parses, and the schema is five fields. A real YAML
 * parser buys nothing here and brings the failure mode that bit the docs site: a
 * translator turned an em dash into a colon, the value silently became a mapping key,
 * and the whole build died with a stack trace naming one file out of six.
 *
 * So this parser handles exactly what is documented below and **throws on anything
 * else**, naming the file and the line. Guessing is the one thing it must not do.
 *
 * Supported:
 *
 *     key: bare text through end of line     → string
 *     key: "quoted, with: punctuation"       → string ('single' also works)
 *     key: [a, b, "c d"]                     → string[]
 *     key: true | false                      → boolean
 *     key:                                   → '' (explicitly empty)
 *     # a comment on its own line            → ignored
 *
 * Not supported, on purpose: nesting, block scalars, anchors, multi-line values,
 * dash lists. If a post ever needs one, the schema is wrong, not this parser.
 */

export type FrontmatterValue = string | string[] | boolean;
export type Frontmatter = Record<string, FrontmatterValue>;

export interface ParsedFile {
  data: Frontmatter;
  /** Body with the frontmatter block removed. Line numbers below shift accordingly. */
  content: string;
}

const DELIMITER = /^---[ \t]*$/;

/** `"a, b"` / `'a, b'` → `a, b`; anything else is returned untouched. */
const unquote = (raw: string): string => {
  const s = raw.trim();
  if (s.length >= 2 && ((s[0] === '"' && s.at(-1) === '"') || (s[0] === "'" && s.at(-1) === "'"))) {
    return s.slice(1, -1);
  }
  return s;
};

/**
 * Split `[a, "b, c"]` on commas that are not inside quotes. A naive `split(',')`
 * would cut a quoted title containing a comma in half — which is exactly the kind of
 * silent damage this whole module exists to refuse.
 */
const splitList = (inner: string): string[] => {
  const out: string[] = [];
  let buf = '';
  let quote: '"' | "'" | null = null;
  for (const ch of inner) {
    if (quote) {
      if (ch === quote) quote = null;
      else buf += ch;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      continue;
    }
    if (ch === ',') {
      out.push(buf.trim());
      buf = '';
      continue;
    }
    buf += ch;
  }
  if (buf.trim()) out.push(buf.trim());
  return out.filter(Boolean);
};

const parseValue = (raw: string): FrontmatterValue => {
  const s = raw.trim();
  if (s === '') return '';
  if (s === 'true') return true;
  if (s === 'false') return false;
  if (s.startsWith('[')) {
    if (!s.endsWith(']')) throw new Error(`list is not closed: ${s}`);
    return splitList(s.slice(1, -1));
  }
  return unquote(s);
};

/**
 * Split a file into its frontmatter and body.
 *
 * A file with no leading `---` is not an error — it simply has no frontmatter, and
 * every field falls back to a default. A file that *opens* a block and never closes it
 * is an error, because the alternative is silently treating the whole post as metadata.
 */
export const parseFrontmatter = (raw: string, file: string): ParsedFile => {
  // Strip a UTF-8 BOM: it would make the first line `﻿---`, which matches nothing,
  // and the frontmatter would be silently rendered into the page as prose.
  const text = raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw;
  const lines = text.split('\n');
  if (!DELIMITER.test(lines[0] ?? '')) return { data: {}, content: text };

  const end = lines.findIndex((line, i) => i > 0 && DELIMITER.test(line));
  if (end === -1) throw new Error(`${file}: frontmatter opened with --- but never closed`);

  const data: Frontmatter = {};
  for (let i = 1; i < end; i++) {
    const line = lines[i];
    if (!line.trim() || line.trimStart().startsWith('#')) continue;
    if (/^\s/.test(line)) {
      throw new Error(`${file}:${i + 1}: indented frontmatter is not supported — the schema is flat`);
    }
    const colon = line.indexOf(':');
    if (colon === -1) {
      throw new Error(`${file}:${i + 1}: expected "key: value", got ${JSON.stringify(line)}`);
    }
    const key = line.slice(0, colon).trim();
    if (!key) throw new Error(`${file}:${i + 1}: empty key`);
    if (key in data) throw new Error(`${file}:${i + 1}: duplicate key "${key}"`);
    try {
      data[key] = parseValue(line.slice(colon + 1));
    } catch (e) {
      throw new Error(`${file}:${i + 1}: ${(e as Error).message}`);
    }
  }
  return { data, content: lines.slice(end + 1).join('\n') };
};

// ── Typed accessors ─────────────────────────────────────────────────────────
// Every read of a frontmatter field goes through one of these, so a post with a
// mistyped field fails at build time naming the file, instead of rendering
// "[object Object]" into a <title> that nobody looks at again.

export const readString = (data: Frontmatter, key: string, file: string, fallback?: string): string => {
  const v = data[key];
  if (v === undefined || v === '') {
    if (fallback !== undefined) return fallback;
    throw new Error(`${file}: frontmatter is missing required "${key}"`);
  }
  if (typeof v !== 'string') throw new Error(`${file}: frontmatter "${key}" must be a string, got ${typeof v}`);
  return v;
};

export const readList = (data: Frontmatter, key: string, file: string): string[] => {
  const v = data[key];
  if (v === undefined || v === '') return [];
  if (Array.isArray(v)) return v;
  throw new Error(`${file}: frontmatter "${key}" must be a list like [a, b]`);
};

export const readBoolean = (data: Frontmatter, key: string, file: string, fallback: boolean): boolean => {
  const v = data[key];
  if (v === undefined || v === '') return fallback;
  if (typeof v !== 'boolean') throw new Error(`${file}: frontmatter "${key}" must be true or false`);
  return v;
};
