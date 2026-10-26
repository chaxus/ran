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
import { UNSET } from '../client/playground.ts';

export type Control =
  | { name: string; kind: 'boolean'; description: string; defaultOn: boolean }
  | { name: string; kind: 'select'; options: string[]; description: string; defaultValue?: string }
  | { name: string; kind: 'text'; description: string; defaultValue?: string };

/** Attributes the playground leaves out: styling escape hatches, ARIA and form plumbing. */
const SKIP = /^(sheet|aria-.*|name|id|class|style|key|slot)$/;

const esc = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** `'a' | 'b'` → `['a', 'b']`; `[]` when the text is not a list of string literals. */
const literals = (text: string): string[] => {
  const values = [...text.matchAll(/'([^']*)'/g)].map((match) => match[1]!);
  return values.length > 1 ? values : [];
};

/**
 * The default a description states — `Default 'x'`, `Defaults to 'x'`, `'x' (default)`,
 * `Behaves as x when unset` — or `undefined` when it states none. `''` (default) reads as `default`.
 */
export const statedDefault = (description: string): string | undefined => {
  const marked = /`'([^'`]*)'` \(default\)/.exec(description);
  if (marked) return marked[1] || 'default';
  const stated =
    /(?:Defaults? to|Default) (?:`'?([^'`]*)'?`|"([^"]+)")|Behaves as `([^`]+)` when unset/.exec(description);
  const value = stated?.[1] ?? stated?.[2] ?? stated?.[3];
  // An expression such as `document.body` is how the default is computed, not a value to type.
  if (!value || /^[A-Za-z_$][\w$]*\.[A-Za-z_$]/.test(value)) return undefined;
  return value;
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
      else {
        const defaultValue = statedDefault(description);
        const withDefault = defaultValue === undefined ? {} : { defaultValue };
        if (literals(type).length)
          controls.push({ name: attribute, kind: 'select', options: literals(type), description, ...withDefault });
        else if (/^(string|number)\b/.test(type) && literals(description).length)
          controls.push({
            name: attribute,
            kind: 'select',
            options: literals(description),
            description,
            ...withDefault,
          });
        else if (/^(string|number)\b/.test(type))
          controls.push({ name: attribute, kind: 'text', description, ...withDefault });
      }
    }
    if (controls.length) byElement.set(element, controls);
  }
  return byElement;
};

/** The first live example in a page that contains `element`, or `''`; its ids are dropped because the page already has the original. */
export const firstExample = (markdown: string, element: string): string =>
  (
    [...markdown.matchAll(/<ran-demo[^>]*>([\s\S]*?)<\/ran-demo>/g)]
      .map((match) => match[1]!.trim())
      .find((html) => html.includes(`<${element}`)) ?? ''
  ).replace(/\s+id="[^"]*"/g, '');

/**
 * Controls are ranui elements named through their own `label` (or slotted text). Before the
 * modules load, `demos.css` prints that label so the generated section still reads.
 */
const controlHtml = (control: Control): string => {
  const attr = ` data-attr="${esc(control.name)}"`;
  const title = control.description ? ` title="${esc(control.description.replace(/`/g, ''))}"` : '';
  if (control.kind === 'boolean')
    return `<r-checkbox class="playground__switch"${attr}${control.defaultOn ? ' data-default-on' : ''}${title}><code>${esc(control.name)}</code></r-checkbox>`;
  const shown = control.defaultValue ?? 'not set';
  if (control.kind === 'text')
    return `<r-input class="playground__field"${attr} label="${esc(control.name)}" placeholder="${esc(shown)}"${title}></r-input>`;
  // The stated default is what an unwritten attribute does, so it is the unset choice, not a second option.
  const options = control.options
    .filter((option) => option && option !== control.defaultValue)
    .map((option) => `<r-option value="${esc(option)}">${esc(option)}</r-option>`)
    .join('');
  return `<r-select class="playground__field"${attr} label="${esc(control.name)}" placeholder="${esc(shown)}"${title}><r-option value="${UNSET}">${esc(shown)}</r-option>${options}</r-select>`;
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
    const all = controls.get(element)!;
    const switches = all.filter((control) => control.kind === 'boolean');
    const fields = all.filter((control) => control.kind !== 'boolean');
    const group = (name: string, items: Control[]): string =>
      items.length
        ? `<div class="playground__${name}">${items.map((control) => controlHtml(control)).join('')}</div>`
        : '';
    return (
      `\n\n## ${heading}\n\n` +
      `<div class="playground" data-playground="${element}">` +
      `<div class="playground__stage">${example}</div>` +
      `<fieldset class="playground__controls"><legend class="playground__legend"><code>&lt;${element}&gt;</code></legend>${group('switches', switches)}${group('fields', fields)}</fieldset>` +
      `<figure class="playground__markup"><figcaption>${esc(markup)}</figcaption><pre><code></code></pre></figure>` +
      `</div>\n`
    );
  };
};
