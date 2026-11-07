import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect, it } from 'vitest';

/**
 * Site glass is an optical plate, excused in place. `verify:design` only excuses a
 * `design-ok` comment on that line or a comment-only line directly above it, and the
 * docs baseline still owes four pre-glass shadows. A new literal without that comment
 * fails here the same way CI fails.
 */
const COLOUR = /#[0-9a-fA-F]{3,8}\b|\brgba?\([^()]*\)|\bhsla?\([^()]*\)/g;
const TRANSPARENT = /\brgba\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*,\s*0*\.?0+\s*\)/;
const VAR_FALLBACK = /var\(\s*(--[a-zA-Z0-9-]+)\s*,\s*((?:[^()]|\([^()]*\))*)\)/g;
const DESIGN_OK = /design-ok:\s*([a-z-]+(?:\s*,\s*[a-z-]+)*)\s+[\p{L}\p{N}]/u;
const COMMENT_ONLY = /^\s*(\/\*|\/\/)/;
const BASELINE = new Set([
  'box-shadow: 0 8px 28px -14px rgba(0, 0, 0, 0.4);',
  'box-shadow: 0 24px 64px -24px rgba(0, 0, 0, 0.45);',
  'background: rgba(0, 0, 0, 0.4);',
  'background: rgba(0, 0, 0, 0.35);',
]);

function stripComments(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, (comment) => comment.replace(/[^\n]/g, ' '))
    .replace(/(^|[^:])\/\/[^\n]*/g, (comment, lead: string) => lead + ' '.repeat(comment.length - lead.length));
}

function excused(raw: string[], line: number, rule: string): boolean {
  const own = raw[line - 1] ?? '';
  const above = raw[line - 2];
  return [own, above !== undefined && COMMENT_ONLY.test(above) ? above : undefined].some((text) => {
    const ids = text === undefined ? undefined : DESIGN_OK.exec(text)?.[1];
    return !!ids && ids.split(',').some((id) => id.trim() === rule);
  });
}

function bareColours(file: string): string[] {
  const raw = readFileSync(resolve(__dirname, file), 'utf8').split('\n');
  const clean = stripComments(raw.join('\n')).split('\n');
  const missed: string[] = [];
  clean.forEach((line, index) => {
    const covered = [...line.matchAll(VAR_FALLBACK)].map((match) => {
      const start = match.index + match[0].length - 1 - match[2].length;
      return [start, start + match[2].length] as const;
    });
    for (const match of line.matchAll(COLOUR)) {
      const start = match.index;
      const end = start + match[0].length;
      if (covered.some(([from, to]) => from <= start && end <= to)) continue;
      if (TRANSPARENT.test(match[0])) continue;
      if (BASELINE.has(line.trim())) continue;
      if (!excused(raw, index + 1, 'bare-colour')) missed.push(`${index + 1} ${match[0]}`);
    }
  });
  return missed;
}

function darkUnsafe(file: string): string[] {
  const raw = readFileSync(resolve(__dirname, file), 'utf8').split('\n');
  const clean = stripComments(raw.join('\n')).split('\n');
  const missed: string[] = [];
  clean.forEach((line, index) => {
    for (const match of line.matchAll(VAR_FALLBACK)) {
      const fallback = match[2].trim();
      COLOUR.lastIndex = 0;
      if (!COLOUR.test(fallback) || fallback.includes('var(') || TRANSPARENT.test(fallback)) continue;
      if (!excused(raw, index + 1, 'dark-unsafe-fallback')) missed.push(`${index + 1} ${match[1]}`);
    }
  });
  return missed;
}

it('excuses new glass colours in the docs stylesheets', () => {
  expect(bareColours('../styles/docs.css')).toEqual([]);
  expect(bareColours('../styles/home.css')).toEqual([]);
});

it('does not put a light-only colour in a glass token fallback', () => {
  expect(darkUnsafe('../styles/docs.css')).toEqual([]);
  expect(darkUnsafe('../styles/home.css')).toEqual([]);
});
