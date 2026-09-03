import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Every element's documentation page states the three things a consumer cannot guess.
 *
 * The generated reference (`COMPONENTS.md`, published as the site's element API page) has
 * always been complete, but a reader arrives at the component's own page first, and those
 * are hand-written. Fourteen of them documented attributes and events and then stopped --
 * no `::part()`, no CSS variables -- so "how do I restyle this" had no answer anywhere a
 * reader would look, while the answer existed in a generated file inside the repository.
 *
 * What is checked is presence, not prose: whether the page names its parts, names at least
 * one of its events, and mentions the token namespace at all. That is decidable, and it is
 * the difference between a page that can answer the question and one that cannot.
 *
 * Sub-elements (`<r-option>`, `<r-tabs>`, …) have no page of their own -- they only exist
 * inside another component -- so they are required to appear on *some* page instead.
 */
const RANUI = resolve(__dirname, '../..');
const API_DOC = resolve(RANUI, 'docs/COMPONENTS.md');
const STYLE_DOC = resolve(RANUI, 'docs/style-tokens-public.md');
const SITES = [
  ['en', resolve(RANUI, '../docs/src/ranui')],
  ['cn', resolve(RANUI, '../docs/cn/src/ranui')],
] as const;

interface Element {
  tag: string;
  /** The component directory, which is also its page's directory. */
  dir: string;
  parts: string[];
  events: string[];
}

const api = readFileSync(API_DOC, 'utf8');

const elements: Element[] = api
  .split('\n## `<')
  .slice(1)
  .map((block) => {
    const tag = block.slice(0, block.indexOf('>`'));
    const partsLine = /\*\*Parts\*\*: (.+)/.exec(block)?.[1]?.trim() ?? '—';
    return {
      tag,
      dir: /Source: `components\/([a-z-]+)\//.exec(block)?.[1] ?? tag.slice(2),
      parts: partsLine === '—' ? [] : [...partsLine.matchAll(/`([^`]+)`/g)].map((m) => m[1]),
      events: [...block.matchAll(/^ {2}- `([a-z-]+)`/gm)].map((m) => m[1]),
    };
  });

/** Component directories whose stylesheet exposes at least one token of its own. */
const styled = new Set(
  readFileSync(STYLE_DOC, 'utf8')
    .split('\n### `')
    .slice(1)
    .filter((block) => /^- Tokens: [1-9]/m.test(block))
    .map((block) => block.slice(0, block.indexOf('`'))),
);

const pageFor = (root: string, dir: string): string | null => {
  const file = join(root, dir, 'index.md');
  return existsSync(file) ? readFileSync(file, 'utf8') : null;
};

/** Every markdown file under a documentation tree, concatenated. */
const wholeTree = (root: string): string => {
  const walk = (dir: string, out: string[]): string[] => {
    for (const name of readdirSync(dir)) {
      const path = join(dir, name);
      if (statSync(path).isDirectory()) walk(path, out);
      else if (name.endsWith('.md')) out.push(readFileSync(path, 'utf8'));
    }
    return out;
  };
  return walk(root, []).join('\n');
};

describe('every element page answers the three questions', () => {
  it('reads the generated references (sanity)', () => {
    expect(elements.length).toBeGreaterThan(30);
    expect(styled.size).toBeGreaterThan(20);
  });

  for (const [lang, root] of SITES) {
    describe(lang, () => {
      const tree = wholeTree(root);

      it.each(elements.map((el) => [el.tag, el]))('%s', (_tag, el) => {
        const page = pageFor(root, el.dir);
        if (page === null) {
          // A sub-element documented inside its parent's page still has to be findable.
          expect(tree, `<${el.tag}> has no page and is named on none`).toContain(el.tag);
          return;
        }
        if (el.parts.length) {
          expect(
            /::part\(|#+ [^\n]*Parts?\b|Parts?[:：]/.test(page),
            `<${el.tag}> exposes ::part(${el.parts[0]}) but its ${lang} page never mentions parts`,
          ).toBe(true);
        }
        if (el.events.length) {
          expect(
            el.events.some((event) => page.includes(event)),
            `<${el.tag}> dispatches ${el.events.join(', ')} but its ${lang} page names none of them`,
          ).toBe(true);
        }
        if (styled.has(el.dir)) {
          expect(
            page.includes('--ran-'),
            `<${el.tag}> exposes CSS variables but its ${lang} page names none — a reader has nowhere to learn how to restyle it`,
          ).toBe(true);
        }
      });
    });
  }
});
