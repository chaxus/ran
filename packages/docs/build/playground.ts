/**
 * The attribute playground at the end of each component page: the page's first live
 * example, with a control for every attribute the generated API reference types.
 *
 * Controls come from `COMPONENTS.md` rather than a hand-written schema per component: a
 * boolean becomes a switch, a literal union (or a description listing `'a' | 'b'` values)
 * a select, anything else a text field. `client/playground.ts` applies them to the element.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export type Control =
  | { name: string; kind: 'boolean'; description: string; defaultOn: boolean }
  | { name: string; kind: 'select'; options: string[]; description: string }
  | { name: string; kind: 'text'; description: string };

/** Attributes the playground leaves out: styling escape hatches, ARIA and form plumbing. */
const SKIP = /^(sheet|aria-.*|name|id|class|style|key|slot)$/;

const esc = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** `'a' | 'b'` → `['a', 'b']`; `[]` when the text is not a list of string literals. */
const literals = (text: string): string[] => {
  const values = [...text.matchAll(/'([^']*)'/g)].map((match) => match[1]!);
  return values.length > 1 ? values : [];
};

/** Element → its controls, read from the generated API reference. */
export const parseControls = (componentsMd: string): Map<string, Control[]> => {
  const byElement = new Map<string, Control[]>();
  for (const section of componentsMd.split(/^## /m).slice(1)) {
    const element = /^`<(r-[a-z-]+)>`/.exec(section)?.[1];
    if (!element) continue;
    const attributes = /^- \*\*Attributes\*\*: (.+)$/m.exec(section)?.[1] ?? '';
    const described = new Map(
      [...section.matchAll(/^ {2}- `([A-Za-z-]+): [^`]*`(?: — (.+))?$/gm)].map((match) => [match[1]!, match[2] ?? '']),
    );
    const controls: Control[] = [];
    for (const [, name, type] of attributes.matchAll(/`([A-Za-z-]+)(?:: ([^`]+))?`/g)) {
      if (!type || SKIP.test(name!)) continue;
      // HTML lower-cases attribute names: `iconSize` is observed as `iconsize`.
      const attribute = name!.toLowerCase();
      const description = described.get(name!) ?? '';
      // A switch that is on until written `="false"` says so in its description.
      if (/^boolean\b/.test(type))
        controls.push({ name: attribute, kind: 'boolean', description, defaultOn: /on by default/i.test(description) });
      else if (literals(type).length)
        controls.push({ name: attribute, kind: 'select', options: literals(type), description });
      else if (/^(string|number)\b/.test(type) && literals(description).length)
        controls.push({ name: attribute, kind: 'select', options: literals(description), description });
      else if (/^(string|number)\b/.test(type)) controls.push({ name: attribute, kind: 'text', description });
    }
    if (controls.length) byElement.set(element, controls);
  }
  return byElement;
};

/** The first live example in a page that contains `element`, or `''`. */
export const firstExample = (markdown: string, element: string): string =>
  [...markdown.matchAll(/<ran-demo[^>]*>([\s\S]*?)<\/ran-demo>/g)]
    .map((match) => match[1]!.trim())
    .find((html) => html.includes(`<${element}`)) ?? '';

const controlHtml = (control: Control, id: string): string => {
  const label = `<code>${esc(control.name)}</code>`;
  const title = control.description ? ` title="${esc(control.description.replace(/`/g, ''))}"` : '';
  if (control.kind === 'boolean')
    return `<label class="playground__control"${title}><input type="checkbox" id="${id}" data-attr="${esc(control.name)}"${control.defaultOn ? ' data-default-on' : ''}> ${label}</label>`;
  const field =
    control.kind === 'select'
      ? `<select id="${id}" data-attr="${esc(control.name)}"><option value="">—</option>${control.options
          .filter(Boolean)
          .map((option) => `<option value="${esc(option)}">${esc(option)}</option>`)
          .join('')}</select>`
      : `<input type="text" id="${id}" data-attr="${esc(control.name)}" spellcheck="false" autocomplete="off">`;
  // The field sits beside its label, not inside it, so its options are not read as its name.
  return `<div class="playground__control playground__control--field"${title}><label for="${id}">${label}</label>${field}</div>`;
};

export interface Playground {
  /** The playground section for a page, or `''` when the page has no element to drive. */
  (baseRel: string, markdown: string, labels: { heading: string; markup: string }): string;
}

/** Reads the generated API reference once per build. */
export const playground = (docsRoot: string, elementsFor: (baseRel: string) => string[]): Playground => {
  const controls = parseControls(readFileSync(join(docsRoot, '..', 'ranui', 'docs', 'COMPONENTS.md'), 'utf8'));
  return (baseRel, markdown, { heading, markup }) => {
    const element = elementsFor(baseRel).find((name) => controls.has(name) && firstExample(markdown, name));
    if (!element) return '';
    const example = firstExample(markdown, element);
    const fields = controls
      .get(element)!
      .map((control, i) => controlHtml(control, `pg-${element}-${i}`))
      .join('');
    return (
      `\n\n## ${heading}\n\n` +
      `<div class="playground" data-playground="${element}">` +
      `<div class="playground__stage">${example}</div>` +
      `<fieldset class="playground__controls"><legend class="playground__legend"><code>&lt;${element}&gt;</code></legend>${fields}</fieldset>` +
      `<figure class="playground__markup"><figcaption>${esc(markup)}</figcaption><pre><code></code></pre></figure>` +
      `</div>\n`
    );
  };
};
