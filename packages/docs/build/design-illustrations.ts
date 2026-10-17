/** One source-token geometry owner for inline teaching diagrams and standalone exports. */
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LOCALES, type LocaleDef } from './langs/locales.ts';
import { DESIGN_ILLUSTRATION_STRINGS } from './langs/design-illustrations-copy.ts';

const foundation = resolve(dirname(fileURLToPath(import.meta.url)), '../../ranui/theme');
const declarations = (file: string): Map<string, string> =>
  new Map(
    [
      ...readFileSync(resolve(foundation, file), 'utf8')
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .matchAll(/^\s*(--ran-[\w-]+):\s*([^;]+);/gm),
    ].map((match) => [match[1], match[2].trim()]),
  );
const light = declarations('tokens.less');
const dark = declarations('dark.less');
const px = (name: string): number => {
  const value = light.get(name);
  if (!value || !/^\d+px$/.test(value)) throw new Error(`Diagram needs a foundation pixel token: ${name}`);
  return Number.parseFloat(value);
};
const outerRadius = px('--ran-radius-lg');
const inset = px('--ran-space-1');
const innerRadius = px('--ran-radius-md');
if (outerRadius - inset !== innerRadius)
  throw new Error('Update the radius illustration: foundation radii no longer share the inset center');
const control = px('--ran-size-7');
const padding = px('--ran-space-2');
const target = control + 2 * padding;
const copyFor = (locale: LocaleDef) => {
  const copy = DESIGN_ILLUSTRATION_STRINGS[locale.dir];
  const values: Record<string, number> = { outer: outerRadius, inset, inner: innerRadius, control, target, padding };
  const format = new Intl.NumberFormat(locale.lang, { useGrouping: false });
  return {
    ...copy,
    descriptions: copy.descriptions.map((text) =>
      text.replace(/\{(\w+)\}/g, (_, key: string) => format.format(values[key])),
    ),
  };
};
const kinds = ['alignment', 'radius', 'density'] as const;
const esc = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Only the palette/font declarations these drawings consume, including var dependencies. */
const standaloneTheme = (): string => {
  const names = new Set([
    '--ran-color-bg',
    '--ran-color-bg-subtle',
    '--ran-color-text',
    '--ran-color-text-secondary',
    '--ran-color-border',
    '--ran-color-link',
    '--ran-color-primary',
    '--ran-color-primary-text',
    '--ran-font-family',
    '--ran-text-label-1',
  ]);
  for (const name of names)
    for (const values of [light, dark])
      for (const match of (values.get(name) ?? '').matchAll(/var\((--ran-[\w-]+)/g)) names.add(match[1]);
  const rules = (values: Map<string, string>): string =>
    [...names]
      .filter((name) => values.has(name))
      .map((name) => `${name}:${values.get(name)};`)
      .join('');
  return `:root{${rules(light)}}@media(prefers-color-scheme: dark){:root{${rules(dark)}}}`;
};
const svgStyles = `
.ran-design-svg{background:var(--ran-color-bg-subtle);color:var(--ran-color-text);font-family:var(--ran-font-family)}
.ran-design-svg .di-surface{fill:var(--ran-color-bg);stroke:var(--ran-color-text-secondary)}
.ran-design-svg .di-line{stroke:currentColor;stroke-width:2;stroke-linecap:round;fill:none}
.ran-design-svg .di-muted{stroke:var(--ran-color-text-secondary);stroke-width:1;fill:none}
.ran-design-svg .di-guide{stroke:var(--ran-color-link);stroke-width:1;stroke-dasharray:3 4;fill:none}
.ran-design-svg .di-control{fill:var(--ran-color-primary)}
.ran-design-svg .di-ink{stroke:var(--ran-color-primary-text);stroke-width:2;fill:none;stroke-linecap:round}
.ran-design-svg text{fill:var(--ran-color-text-secondary);font-size:var(--ran-text-label-1);text-anchor:middle}
.ran-design-figure:is([data-state=playing],[data-state=paused],[data-state=finished]) .di-motion,
.ran-design-svg[data-autoplay] .di-motion{animation-name:var(--di-animation);animation-duration:4s;animation-fill-mode:both;animation-timing-function:ease-in-out;animation-iteration-count:1}
.ran-design-figure[data-state=paused] .di-motion,.ran-design-figure[data-state=finished] .di-motion{animation-play-state:paused}
.ran-design-svg .di-optional{--di-animation:ran-design-optional}
.ran-design-svg .di-corner{--di-animation:ran-design-corner}
.ran-design-svg .di-target{--di-animation:ran-design-target}
@keyframes ran-design-optional{0%,20%{opacity:0;transform:translateY(-4px)}45%,100%{opacity:1;transform:translateY(0)}}
@keyframes ran-design-corner{0%,20%{rx:${px('--ran-radius-sm')}px}50%,100%{rx:${innerRadius}px}}
@keyframes ran-design-target{0%,20%{opacity:0;transform:scale(${control / target})}50%,100%{opacity:1;transform:scale(1)}}
@media(prefers-reduced-motion: reduce){.ran-design-svg .di-motion{animation:none!important}}
`;

const geometry = (kind: (typeof kinds)[number]): string => {
  if (kind === 'alignment')
    return `<path class="di-muted" d="M24 80H296M24 144H296"/>
    <line data-alignment-spine class="di-guide" x1="56" x2="56" y1="24" y2="180"/><path class="di-guide" d="M280 24V180"/>
    ${[48, 112, 176]
      .map(
        (y, index) => `<circle class="di-muted" cx="32" cy="${y - 8}" r="8"/>
    <line data-alignment-text class="di-line" x1="56" x2="${index === 1 ? 176 : 208}" y1="${y - 8}" y2="${y - 8}"/>
    <path class="di-muted" d="M56 ${y + 4}H${index === 1 ? 136 : 160}"/>
    <path class="di-line" d="M276 ${y - 12}l4 4-4 4"/>
    ${index === 1 ? `<g class="di-motion di-optional"><rect class="di-surface" x="192" y="92" width="48" height="24" rx="${px('--ran-radius-sm')}"/><path class="di-muted" d="M204 104h24"/></g>` : ''}`,
      )
      .join('')}`;
  if (kind === 'radius')
    return `<rect data-radius-outer class="di-surface" x="64" y="32" width="192" height="128" rx="${outerRadius}"/>
    <rect data-radius-inner class="di-surface di-motion di-corner" x="${64 + inset}" y="${32 + inset}" width="${192 - 2 * inset}" height="${128 - 2 * inset}" rx="${innerRadius}"/>
    <circle class="di-guide" cx="${64 + outerRadius}" cy="${32 + outerRadius}" r="${outerRadius}"/>
    <circle class="di-guide" cx="${64 + outerRadius}" cy="${32 + outerRadius}" r="${innerRadius}"/>
    <path class="di-line" d="M${60 + outerRadius} ${32 + outerRadius}h8m-4-4v8"/>
    <text x="160" y="100">${outerRadius} − ${inset} = ${innerRadius}</text>`;
  return `<rect data-density-target class="di-guide di-motion di-target" style="transform-origin:160px 96px" x="${160 - target / 2}" y="${96 - target / 2}" width="${target}" height="${target}" rx="${outerRadius}"/>
    <rect data-density-visible class="di-control" x="${160 - control / 2}" y="${96 - control / 2}" width="${control}" height="${control}" rx="${px('--ran-radius-sm')}"/>
    <path class="di-ink" d="M160 103V89m-5 5 5-5 5 5"/>
    <path class="di-muted" d="M${160 - control / 2} 136v8h${control}v-8"/><text x="160" y="164">${control}px</text>
    <g class="di-motion di-optional"><path class="di-guide" d="M${160 - target / 2} 56V48h${target}v8"/><text x="160" y="36">${target}px</text></g>`;
};

const svg = (kind: (typeof kinds)[number], locale: LocaleDef, standalone = false): string => {
  const copy = copyFor(locale);
  const index = kinds.indexOf(kind);
  return `<svg xmlns="http://www.w3.org/2000/svg" class="ran-design-svg" viewBox="0 0 320 200" width="320" height="200" role="img" direction="ltr" lang="${locale.lang}" aria-label="${esc(`${copy.titles[index]}. ${copy.descriptions[index]}`)}"${standalone ? ' data-autoplay=""' : ''}>
    <title>${esc(copy.titles[index])}</title><desc>${esc(copy.descriptions[index])}</desc>
    <style>${standalone ? standaloneTheme() : ''}${svgStyles}</style>${geometry(kind)}</svg>`;
};

export const renderDesignIllustrations = (locale: LocaleDef): string => {
  const copy = copyFor(locale);
  return `<div class="ran-design-illustrations"><p class="ran-design-note">${esc(copy.note)}</p>${kinds
    .map(
      (kind, index) => `<figure class="ran-design-figure" data-design-illustration data-state="idle">
    <figcaption><h3>${esc(copy.titles[index])}</h3><p>${esc(copy.descriptions[index])}</p>${index === 1 ? '<code dir="ltr">--ran-radius-lg − --ran-space-1 = --ran-radius-md</code>' : index === 2 ? '<code dir="ltr">--ran-size-7 + 2 × --ran-space-2</code>' : ''}</figcaption>
    <div class="ran-design-canvas">${svg(kind, locale)}</div>
    <div class="ran-design-tools"><button type="button" hidden data-play="${esc(copy.play)}" data-pause="${esc(copy.pause)}" data-resume="${esc(copy.resume)}" data-replay="${esc(copy.replay)}" data-reduced="${esc(copy.reduced)}">${esc(copy.play)}</button><a href="/illustrations/${locale.lang}/${kind}.svg" download>${esc(copy.download)}</a></div>
    </figure>`,
    )
    .join('')}</div>`;
};

export const designIllustrationFiles = (): [string, string][] =>
  LOCALES.flatMap((locale) =>
    kinds.map((kind) => [`illustrations/${locale.lang}/${kind}.svg`, svg(kind, locale, true)]),
  );
