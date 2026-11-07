import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect, it } from 'vitest';

/**
 * Glass optics are named once. `verify:design` excuses a raw colour only on its own
 * line, so a pigment declaration may carry `design-ok`; a later use has to be `var()`.
 * The four pre-glass shadows stay in the docs baseline. A new literal, or an exemption
 * on anything other than a `--glass-*` pigment, fails here.
 */
const COLOUR = /#[0-9a-fA-F]{3,8}\b|\brgba?\([^()]*\)|\bhsla?\([^()]*\)/g;
const TRANSPARENT = /\brgba\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*,\s*0*\.?0+\s*\)/;
const VAR_FALLBACK = /var\(\s*(--[a-zA-Z0-9-]+)\s*,\s*((?:[^()]|\([^()]*\))*)\)/g;
const DESIGN_OK = /design-ok:\s*([a-z-]+(?:\s*,\s*[a-z-]+)*)\s+[\p{L}\p{N}]/u;
const COMMENT_ONLY = /^\s*(\/\*|\/\/)/;
const PIGMENT = /^\s*(--glass-[a-z0-9-]+):\s*(#[0-9a-fA-F]{3,8})\s*;/;
const BASELINE = new Set([
  'box-shadow: 0 8px 28px -14px rgba(0, 0, 0, 0.4);',
  'box-shadow: 0 24px 64px -24px rgba(0, 0, 0, 0.45);',
  'background: rgba(0, 0, 0, 0.4);',
  'background: rgba(0, 0, 0, 0.35);',
]);
const ON_SCALE = /^-?(4|8|12|16|24|32|40|64|96)px$/;
const SPACING = /^\s*(padding|margin|gap|row-gap|column-gap)(-(top|right|bottom|left))?\s*:\s*([^;]+);/;

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

function read(file: string): { raw: string[]; clean: string[] } {
  const raw = readFileSync(resolve(__dirname, file), 'utf8').split('\n');
  return { raw, clean: stripComments(raw.join('\n')).split('\n') };
}

function bareColours(file: string): string[] {
  const { raw, clean } = read(file);
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
      const own = raw[index] ?? '';
      if (!PIGMENT.test(own) || !excused(raw, index + 1, 'bare-colour')) missed.push(`${index + 1} ${own.trim()}`);
    }
  });
  return missed;
}

it('keeps glass pigments as the only new raw colours', () => {
  const docs = bareColours('../styles/docs.css');
  expect(docs).toEqual([]);
  expect(bareColours('../styles/home.css')).toEqual([]);
  const names = read('../styles/docs.css')
    .raw.map((line) => PIGMENT.exec(line)?.[1])
    .filter((name): name is string => !!name);
  expect(new Set(names).size).toBe(names.length);
  expect(names.length).toBeGreaterThan(10);
});

it('does not put a light-only colour behind a glass token', () => {
  for (const file of ['../styles/docs.css', '../styles/home.css']) {
    const { raw, clean } = read(file);
    const missed: string[] = [];
    clean.forEach((line, index) => {
      for (const match of line.matchAll(VAR_FALLBACK)) {
        const fallback = match[2].trim();
        COLOUR.lastIndex = 0;
        if (!COLOUR.test(fallback) || fallback.includes('var(') || TRANSPARENT.test(fallback)) continue;
        if (!excused(raw, index + 1, 'dark-unsafe-fallback')) missed.push(`${file} ${index + 1} ${match[1]}`);
      }
    });
    expect(missed).toEqual([]);
  }
});

it('keeps the capsule hairline as the only off-scale glass gap', () => {
  const { raw, clean } = read('../styles/docs.css');
  const missed: string[] = [];
  clean.forEach((line, index) => {
    const match = SPACING.exec(line);
    if (!match || match[4].includes('var(--')) return;
    const parts = match[4].trim().split(/\s+/);
    if (parts.every((part) => part === '0' || part === 'auto' || ON_SCALE.test(part))) return;
    if (excused(raw, index + 1, 'spacing-scale')) return;
    missed.push(`${index + 1} ${line.trim()}`);
  });
  expect(missed).toEqual([]);
  expect(
    raw.some((line, index) => clean[index]?.trim() === 'gap: 1px;' && excused(raw, index + 1, 'spacing-scale')),
  ).toBe(true);
});
