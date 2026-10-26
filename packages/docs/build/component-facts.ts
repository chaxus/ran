/**
 * The line under a component page's title: its element names, and links to the generated
 * API entry, its style tokens and its source.
 *
 * Derived from the generated `COMPONENTS.md` and style-token page rather than written into
 * 38 pages × 8 languages, so a renamed element or a new component cannot leave a stale link.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { slugify } from 'ranpress';
import { localeHref } from './langs/locales.ts';
import { messagesFor } from './langs/index.ts';
import { publicUrl } from './urls.ts';
import type { LocaleDef } from './config.ts';

const SOURCE = 'https://github.com/chaxus/ran/tree/main/packages/ranui/components/';

const esc = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Component directory → the elements whose source lives in it, in API order. */
const elementsByDirectory = (componentsMd: string): Map<string, string[]> => {
  const byDir = new Map<string, string[]>();
  for (const [, element, dir] of componentsMd.matchAll(/^## `<(r-[a-z-]+)>`\s+Source: `components\/([a-z-]+)\//gm)) {
    byDir.set(dir!, [...(byDir.get(dir!) ?? []), element!]);
  }
  return byDir;
};

export interface ComponentFacts {
  /**
   * The facts line for a page, or '' for a page that documents no element. `playground` is
   * the anchor of the page's playground section, when it has one.
   */
  (baseRel: string, locale: LocaleDef, playground?: string): string;
}

/** The elements a component page documents, its own first; `[]` for any other page. */
export const componentElements = (docsRoot: string): ((baseRel: string) => string[]) => {
  const byDir = elementsByDirectory(readFileSync(join(docsRoot, '..', 'ranui', 'docs', 'COMPONENTS.md'), 'utf8'));
  return (baseRel) => {
    const dir = /^src\/ranui\/([a-z-]+)\/index\.md$/.exec(baseRel)?.[1];
    const found = dir ? byDir.get(dir) : undefined;
    return found ? [...found].sort((a, b) => Number(b === `r-${dir}`) - Number(a === `r-${dir}`)) : [];
  };
};

/** Reads the generated references once per build. */
export const componentFacts = (docsRoot: string): ComponentFacts => {
  const elementsOf = componentElements(docsRoot);
  const tokenSections = new Set(
    [...readFileSync(join(docsRoot, 'src', 'ranui', 'style-tokens.md'), 'utf8').matchAll(/^## `([a-z-]+)`$/gm)].map(
      (match) => match[1]!,
    ),
  );
  return (baseRel, locale, playground) => {
    // The page's own element leads, and is the one the API link opens.
    const elements = elementsOf(baseRel);
    const dir = /^src\/ranui\/([a-z-]+)\//.exec(baseRel)?.[1];
    if (!dir || !elements.length) return '';
    const { ui } = messagesFor(locale);
    const site = (path: string): string => publicUrl(localeHref(path, locale));
    const links = [
      `<a href="${esc(`${site('/src/ranui/api')}#${slugify(`\`<${elements[0]}>\``)}`)}">${esc(ui.componentApi)}</a>`,
      ...(tokenSections.has(dir)
        ? [
            `<a href="${esc(`${site('/src/ranui/style-tokens')}#${slugify(`\`${dir}\``)}`)}">${esc(ui.componentTokens)}</a>`,
          ]
        : []),
      ...(playground ? [`<a href="#${esc(playground)}">${esc(ui.playground)}</a>`] : []),
      `<a href="${SOURCE}${dir}/" target="_blank" rel="noopener noreferrer">${esc(ui.componentSource)}</a>`,
    ];
    const names = elements.map((element) => `<code>&lt;${element}&gt;</code>`).join(' ');
    return `<p class="component-facts">${names}<span class="component-facts__links">${links.join('')}</span></p>`;
  };
};
