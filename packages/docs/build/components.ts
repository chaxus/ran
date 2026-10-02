/**
 * The three page-level components, rendered at build time.
 *
 * Each was a Vue single-file component. What they mostly were is a template over a copy
 * table — `v-for` across `home-copy.ts` and `demo-copy.ts`, both of which are plain data
 * and stay exactly where they are. A template over static data does not need a framework
 * or a runtime; it needs to be run once, at build time, which is what happens here.
 *
 * The behaviour that *is* real — clipboard, the
 * glass sliders, icon copy — moves to `client/home.ts` as progressive enhancement. So the
 * markup is in the server-rendered HTML, indexable and correct with no JavaScript, and
 * the script adds clipboard and playground interactions on top.
 *
 * Markdown pages write `<HomeCinematic />` and the engine's component hook matches it as
 * an html token, so the tag stays ordinary markup and the page stays readable as prose.
 */
import { View, type Child } from '@alixex/ranview/static';
import { playgroundCopy } from '../client/playground-copy.ts';
import { interactionCopy } from '../client/copy.ts';
import { studioCopy } from '../client/studio-copy.ts';
import { homeCopy } from './langs/home-copy.ts';
import { renderPackageFacts } from './package-facts.ts';
import { demoCopy } from './langs/demo-copy.ts';
import { localeHref } from './langs/locales.ts';
import type { LocaleDef } from './config.ts';
import { currentLinkBase, currentLocale } from './render-context.ts';
import { resolveLinkFrom } from './links.ts';

/** The component hooks the markdown renderer is configured with. */
export const componentRenderers = {
  HomeCinematic: () => renderHome(currentLocale()),
  PackageFacts: (attrs: string) => renderPackageFacts(attrs),
  GlassPlayground: () => renderGlassPlayground(currentLocale()),
  IconGallery: () => renderIconGallery(currentLocale()),
  Loading: () => renderLoadingGallery(),
};

export const resolveCurrentLink = (href: string): string => resolveLinkFrom(currentLinkBase())(href);

/** Small structural helper; every child remains a builder node or escaped text. */
const el = (name: string, classes = '', ...children: Child[]) => {
  const node = View(name);
  if (classes) node.class(classes);
  return node.children(...children);
};

const ICONS: Record<string, () => ReturnType<typeof View>> = {
  ui: () =>
    View('svg')
      .attrs({ viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.6' })
      .children(
        View('rect').attrs({ x: '3', y: '3', width: '18', height: '18', rx: '3' }),
        View('path').attrs({ d: 'M3 9h18M9 21V9' }),
      ),
  utils: () =>
    View('svg')
      .attrs({ viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.6' })
      .children(
        View('path').attrs({
          d: 'M14.7 6.3a4 4 0 0 0-5.4 5.4l-6 6a1.5 1.5 0 0 0 2.1 2.1l6-6a4 4 0 0 0 5.4-5.4l-2.3 2.3-2.1-2.1z',
        }),
      ),
  article: () =>
    View('svg')
      .attrs({ viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.6' })
      .children(
        View('path').attrs({ d: 'M4 4h11l5 5v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z' }),
        View('path').attrs({ d: 'M14 4v5h5M8 13h8M8 17h5' }),
      ),
  agnostic: () =>
    View('svg')
      .attrs({ viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.6' })
      .children(
        View('circle').attrs({ cx: '12', cy: '12', r: '9' }),
        View('path').attrs({ d: 'M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18' }),
      ),
  typed: () =>
    View('svg')
      .attrs({ viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.6' })
      .children(View('path').attrs({ d: 'm8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14' })),
  pwa: () =>
    View('svg')
      .attrs({ viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.6' })
      .children(View('path').attrs({ d: 'M12 3v12m0 0 4-4m-4 4-4-4M5 17v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2' })),
  i18n: () =>
    View('svg')
      .attrs({ viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.6' })
      .children(
        View('circle').attrs({ cx: '12', cy: '12', r: '9' }),
        View('path').attrs({
          d: 'M3 12h18M12 3c2.5 2.6 3.9 6 4 9-.1 3-1.5 6.4-4 9-2.5-2.6-3.9-6-4-9 .1-3 1.5-6.4 4-9z',
        }),
      ),
  bridge: () =>
    View('svg')
      .attrs({ viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.6' })
      .children(
        View('circle').attrs({ cx: '5', cy: '12', r: '2.4' }),
        View('circle').attrs({ cx: '19', cy: '12', r: '2.4' }),
        View('path').attrs({ d: 'M7.4 12h9.2' }),
      ),
  gpu: () =>
    View('svg')
      .attrs({ viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.6' })
      .children(
        View('rect').attrs({ x: '6', y: '6', width: '12', height: '12', rx: '2' }),
        View('path').attrs({ d: 'M9.5 3v3M14.5 3v3M9.5 18v3M14.5 18v3M3 9.5h3M3 14.5h3M18 9.5h3M18 14.5h3' }),
      ),
  vdom: () =>
    View('svg')
      .attrs({ viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.6' })
      .children(
        View('circle').attrs({ cx: '12', cy: '5', r: '2.2' }),
        View('circle').attrs({ cx: '6', cy: '19', r: '2.2' }),
        View('circle').attrs({ cx: '18', cy: '19', r: '2.2' }),
        View('path').attrs({ d: 'M12 7.2v3.3M12 10.5 6.6 16.9M12 10.5l5.4 6.4' }),
      ),
  totp: () =>
    View('svg')
      .attrs({ viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.6' })
      .children(
        View('path').attrs({ d: 'M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z' }),
        View('path').attrs({ d: 'M12 9v3.2l2 1.4' }),
      ),
  mime: () =>
    View('svg')
      .attrs({ viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.6' })
      .children(View('path').attrs({ d: 'M7 3h7l4 4v14H7z' }), View('path').attrs({ d: 'M14 3v4h4M10 13h5M10 17h4' })),
  player: () =>
    View('svg')
      .attrs({ viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.6' })
      .children(
        View('circle').attrs({ cx: '12', cy: '12', r: '9' }),
        View('path').attrs({ d: 'M10.5 9l4.5 3-4.5 3z', fill: 'currentColor', stroke: 'none' }),
      ),
  droplet: () =>
    View('svg')
      .attrs({ viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.6' })
      .children(View('path').attrs({ d: 'M12 3s6 6.4 6 10.5a6 6 0 0 1-12 0C6 9.4 12 3 12 3z' })),
  radar: () =>
    View('svg')
      .attrs({ viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.6' })
      .children(
        View('path').attrs({ d: 'M12 3.5l8 5.8-3 9.2H7l-3-9.2z' }),
        View('path').attrs({ d: 'M12 3.5v15M4 9.3l16 0' }),
      ),
  sigma: () =>
    View('svg')
      .attrs({
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': '1.6',
        'stroke-linejoin': 'round',
        'stroke-linecap': 'round',
      })
      .children(View('path').attrs({ d: 'M17 5H7l6 7-6 7h10' })),
  scratch: () =>
    View('svg')
      .attrs({
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': '1.6',
        'stroke-linejoin': 'round',
      })
      .children(View('path').attrs({ d: 'M12 3l2.1 5.3 5.4 2.1-5.4 2.1L12 18l-2.1-5.5L4.5 10.4l5.4-2.1z' })),
};

const icon = (kind: string) => ICONS[kind]?.();

const ARROW = () =>
  View('svg')
    .attrs({ viewBox: '0 0 24 24', width: '18', height: '18' })
    .children(
      View('path').attrs({
        d: 'M5 12h14M13 6l6 6-6 6',
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': '2',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
      }),
    );
const ARROW_SM = () => ARROW().attrs({ width: '15', height: '15' });
const GITHUB_MARK = () =>
  View('svg')
    .attrs({ viewBox: '0 0 24 24', width: '18', height: '18' })
    .children(
      View('path').attrs({
        fill: 'currentColor',
        d: 'M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05a9.4 9.4 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z',
      }),
    );
const COPY_ICON = () => [
  View('svg')
    .attrs({ class: 'copy-idle', viewBox: '0 0 24 24', width: '16', height: '16' })
    .children(
      View('rect').attrs({
        x: '9',
        y: '9',
        width: '11',
        height: '11',
        rx: '2',
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': '1.8',
      }),
      View('path').attrs({
        d: 'M5 15V5a2 2 0 0 1 2-2h10',
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': '1.8',
      }),
    ),
  View('svg')
    .attrs({ class: 'copy-done', viewBox: '0 0 24 24', width: '16', height: '16' })
    .children(
      View('path').attrs({
        d: 'M4 12l5 5L20 6',
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': '2.2',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
      }),
    ),
];
/**
 * The install snippet and the two code cells are written out rather than highlighted.
 * They are four lines of illustrative markup, not source anyone runs, and shipping shiki
 * across every home page to colour them would cost more than they are worth.
 */
const installSource = (): Child[] => [
  el('span', 'c-kw', 'import'),
  ' ',
  el('span', 'c-str', "'ranui/style'"),
  '\n\n',
  el('span', 'c-com', '// register the <r-*> elements once'),
  '\n',
  el('span', 'c-kw', 'import'),
  ' ',
  el('span', 'c-str', "'ranui'"),
  '\n',
  el('span', 'c-kw', 'import'),
  ' { debounce } ',
  el('span', 'c-kw', 'from'),
  ' ',
  el('span', 'c-str', "'ranuts'"),
];

const useSource = (): Child[] => [
  el('span', 'c-com', '<!-- Vue, React, or plain HTML -->'),
  '\n',
  el('span', 'c-tag', '<r-button'),
  ' ',
  el('span', 'c-attr', 'type'),
  '=',
  el('span', 'c-str', '"primary"'),
  el('span', 'c-tag', '>'),
  'Save',
  el('span', 'c-tag', '</r-button>'),
  '\n',
  el('span', 'c-tag', '<r-progress'),
  ' ',
  el('span', 'c-attr', 'percent'),
  '=',
  el('span', 'c-str', '"66"'),
  el('span', 'c-tag', '></r-progress>'),
];

const attr = (name: string, value: string): Child[] => [
  ' ',
  el('span', 'c-attr', name),
  '=',
  el('span', 'c-str', `"${value}"`),
];

const tag = (name: string, attrs: Child[], body: string): Child[] => [
  el('span', 'c-tag', `<${name}`),
  attrs,
  el('span', 'c-tag', '>'),
  body,
  el('span', 'c-tag', `</${name}>`),
];

/** Source text and live components share the same translated labels. */
const liveSource = (t: ReturnType<typeof homeCopy>): Child[] => [
  tag('r-button', attr('type', 'primary'), t.liveButtons[0]),
  '\n',
  tag('r-button', [], t.liveButtons[1]),
  '\n',
  tag('r-button', attr('type', 'warning'), t.liveButtons[2]),
  '\n\n',
  tag('r-progress', attr('percent', '66'), ''),
  '\n\n',
  tag('r-checkbox', [' ', el('span', 'c-attr', 'checked')], t.liveCheck),
];

const CAPABILITY_LINKS: Record<string, string> = {
  bridge: '/src/ranuts/bridge/',
  gpu: '/src/ranuts/visual/',
  vdom: '/src/ranuts/vnode/',
  totp: '/src/ranuts/utils/totp',
  mime: '/src/ranuts/mime_type/mime_type',
  player: '/src/ranui/player/',
  droplet: '/src/ranui/colorpicker/',
  radar: '/src/ranui/radar/',
  sigma: '/src/ranui/math/',
  scratch: '/src/ranui/scratch/',
};

export const renderHome = (locale: LocaleDef): string => {
  const t = homeCopy(locale.dir);
  const demo = playgroundCopy(locale.lang);
  const feedback = interactionCopy(locale.lang);
  const studio = studioCopy(locale.lang);
  const href = (path: string): string => localeHref(path, locale);
  return el(
    'div',
    'cine',
    el(
      'header',
      'hero',
      el(
        'div',
        'hero-copy',
        el(
          'div',
          'home-identity',
          el('span', 'home-monogram', 'r.').attr('aria-hidden', 'true'),
          el('span', 'home-packages', 'ranui / ranuts'),
          el('span', 'home-open', t.eyebrow),
        ),
        el('h1', 'headline', t.headline),
        el('p', 'subtitle', t.subtitle),
        el(
          'div',
          'cta',
          el('a', 'btn btn-primary', t.ctaPrimary, ARROW()).attr('href', href('/src/ranui/')),
          el('a', 'btn btn-ghost', t.pillars[1].more, ARROW()).attr('href', href('/src/ranuts/')),
        ),
        el('span', 'install-label', studio.install),
        el(
          'div',
          'cmd',
          el('code', '', 'npm\u00a0i\u00a0ranui\u00a0ranuts'),
          el('button', 'copy', COPY_ICON()).attrs({
            type: 'button',
            'data-copy': 'npm i ranui ranuts',
            'aria-label': t.copy,
          }),
        ),
      ),
      el(
        'section',
        'hero-live',
        el(
          'div',
          'preview-toolbar',
          el('span', 'preview-name', 'ranui / playground'),
          el(
            'div',
            'preview-palettes',
            ...['clay', 'moss', 'ink'].map((palette, i) =>
              el('button', 'preview-palette', el('span', 'palette-swatch')).attrs({
                type: 'button',
                hidden: '',
                'data-preview-palette': palette,
                'aria-label': `${studio.palette}: ${studio.palettes[i]}`,
                title: studio.palettes[i],
                'aria-pressed': String(i === 0),
              }),
            ),
          ).attrs({ role: 'group', 'aria-label': studio.palette }),
        ),
        el('div', 'live-head', el('h2', '', demo.title), el('span', 'live-badge', el('span', 'live-dot'), t.liveLabel)),
        el('p', 'live-hint', demo.hint),
        el(
          'div',
          'demo-tabs',
          ...['buttons', 'progress', 'selection'].map((key) =>
            el('button', 'demo-tab', demo[key as 'buttons' | 'progress' | 'selection']).attrs({
              type: 'button',
              hidden: '',
              'data-demo-tab': key,
            }),
          ),
        ),
        el(
          'div',
          'live-body',
          el(
            'div',
            'demo-panel',
            el('h3', 'demo-fallback', demo.buttons),
            el(
              'div',
              'live-row',
              ...t.liveButtons.map((label, i) =>
                el('r-button', '', label).attrs({ type: ['primary', '', 'warning'][i] }),
              ),
            ),
            el(
              'label',
              'demo-control demo-enhancement',
              el('input').attrs({ type: 'checkbox', 'data-demo-disabled': '' }),
              demo.disabled,
            ),
            el('p', 'demo-feedback', '').attrs({ 'data-demo-clicked': '', role: 'status', 'aria-live': 'polite' }),
          ).attrs({ id: 'demo-buttons', 'data-demo-panel': 'buttons' }),
          el(
            'div',
            'demo-panel',
            el('h3', 'demo-fallback', demo.progress),
            el('r-progress', 'live-progress').attrs({ percent: '66', total: '100' }),
            el(
              'label',
              'demo-control demo-range demo-enhancement',
              el('span', '', demo.percent),
              el('output', '', '66%').attrs({ for: 'demo-percent', 'data-demo-value': '' }),
              el('input').attrs({
                id: 'demo-percent',
                type: 'range',
                min: '0',
                max: '100',
                value: '66',
                'data-demo-percent': '',
                'aria-label': demo.percent,
              }),
            ),
          ).attrs({ id: 'demo-progress', 'data-demo-panel': 'progress' }),
          el(
            'div',
            'demo-panel',
            el('h3', 'demo-fallback', demo.selection),
            el('r-checkbox', '', t.liveCheck).attr('checked', 'true'),
            el('p', 'demo-feedback', demo.selected).attrs({ 'data-demo-selection': '', role: 'status' }),
          ).attrs({ id: 'demo-selection', 'data-demo-panel': 'selection' }),
        ),
        el(
          'div',
          'demo-footer demo-enhancement',
          el('a', '', t.pillars[0].more, ARROW_SM()).attrs({ href: href('/src/ranui/button/'), 'data-demo-doc': '' }),
          el('button', 'demo-reset', demo.reset).attrs({ type: 'button', 'data-demo-reset': '' }),
        ),
        el(
          'details',
          'demo-source',
          el('summary', '', demo.code, el('span', 'live-lang', 'HTML')),
          el(
            'div',
            'demo-code-toolbar demo-enhancement',
            el('button', 'copy demo-copy', COPY_ICON(), el('span', 'copy-label', feedback.copy)).attrs({
              type: 'button',
              'data-demo-copy': '',
              'aria-label': feedback.copy,
            }),
          ),
          el('pre', 'snippet live-code', el('code', '', ...liveSource(t))).attrs({
            'data-demo-code': '',
            dir: 'ltr',
            tabindex: '0',
          }),
        ),
      ).attrs({ 'data-playground': '', 'data-lang': locale.lang, 'data-palette': 'clay' }),
    ),
    el(
      'section',
      'stats',
      t.stats.map((s) => el('div', 'stat', el('span', 'stat-num', s.num), el('span', 'stat-label', s.label))),
    ),
    el(
      'section',
      'pillars',
      t.pillars.map((p) =>
        el(
          'a',
          'pillar',
          el('span', 'pillar-icon', icon(p.kind)).attr('data-kind', p.kind),
          el('h3', '', p.title),
          el('p', '', p.desc),
          el('span', 'pillar-more', p.more, ' ', ARROW_SM()),
        ).attr('href', href(p.link)),
      ),
    ),
    el(
      'section',
      'section start',
      el('div', 'sec-head', el('h2', '', t.startTitle), el('p', 'sec-sub', t.startDesc)),
      el(
        'div',
        'panel',
        el(
          'div',
          'code-cell',
          el(
            'div',
            'code-head',
            el('span', '', t.startStep1),
            el('button', 'home-code-copy', el('span', 'copy-label', feedback.copy)).attrs({
              type: 'button',
              'data-copy-snippet': '',
            }),
          ),
          el('pre', 'snippet', installSource()),
        ),
        el(
          'div',
          'code-cell',
          el(
            'div',
            'code-head',
            el('span', '', t.startStep2),
            el('button', 'home-code-copy', el('span', 'copy-label', feedback.copy)).attrs({
              type: 'button',
              'data-copy-snippet': '',
            }),
          ),
          el('pre', 'snippet', useSource()),
        ),
      ),
    ),
    el(
      'section',
      'section caps',
      el('div', 'sec-head', el('h2', '', studio.catalogue), el('p', 'sec-sub', t.capsSub)),
      el(
        'div',
        'catalog-controls',
        el(
          'div',
          'catalog-filters',
          ...['all', 'ranui', 'ranuts'].map((filter, i) =>
            el('button', 'catalog-filter', [studio.all, studio.components, studio.utilities][i]).attrs({
              type: 'button',
              hidden: '',
              'data-catalog-filter': filter,
              'aria-pressed': String(i === 0),
            }),
          ),
        ).attrs({ role: 'group', 'aria-label': studio.catalogue }),
        el('input', 'catalog-search').attrs({
          type: 'search',
          hidden: '',
          'data-catalog-search': '',
          placeholder: studio.search,
          'aria-label': studio.search,
        }),
      ),
      el('p', 'catalog-empty', studio.empty).attrs({ 'data-catalog-empty': '', hidden: '', role: 'status' }),
      el(
        'div',
        'bento',
        t.caps.map((col) =>
          el(
            'div',
            'caps-col',
            el('div', 'caps-col-head', el('span', 'caps-lib', col.lib), el('span', 'caps-lib-tag', col.tag)),
            el(
              'ul',
              'caps-list',
              col.items.map((item) =>
                el(
                  'li',
                  '',
                  el('span', 'caps-ico', icon(item.kind)),
                  el(
                    'div',
                    'caps-text',
                    el('a', 'caps-name', item.name, ' ', el('code', '', item.api)).attr(
                      'href',
                      href(CAPABILITY_LINKS[item.kind]),
                    ),
                    el('span', 'caps-desc', item.desc),
                  ),
                ).attrs({ 'data-catalog-entry': `${item.name} ${item.api} ${item.desc}`, 'data-library': col.lib }),
              ),
            ),
          ).attr('data-catalog-group', col.lib),
        ),
      ),
    ),
    el(
      'section',
      'strip',
      t.features.map((f) =>
        el(
          'div',
          'feature',
          el('span', 'feature-head', el('span', 'feature-icon', icon(f.kind)), el('h4', '', f.title)),
          el('p', '', f.desc),
        ),
      ),
    ),
    el(
      'footer',
      'home-footer',
      el('a', 'home-footer-brand', 'ran.').attr('href', href('/')),
      el('span', '', t.eyebrow),
      el('a', '', 'GitHub', ARROW_SM()).attrs({
        href: 'https://github.com/chaxus/ran',
        target: '_blank',
        rel: 'noreferrer',
      }),
    ),
  ).serialize();
};

// ── Glass playground ────────────────────────────────────────────────────────

/** Initial values, and the range each slider covers. Mirrors the old component's. */
const GLASS_DEFAULTS = { blur: 16, saturate: 180, displace: 8, radius: 24, width: 300 } as const;

const GLASS_SLIDERS = [
  { key: 'blur', min: 0, max: 40, step: 1, unit: 'px' },
  { key: 'saturate', min: 100, max: 260, step: 5, unit: '%' },
  { key: 'displace', min: 0, max: 80, step: 1, unit: '' },
  { key: 'radius', min: 0, max: 48, step: 1, unit: 'px' },
  { key: 'width', min: 180, max: 460, step: 10, unit: 'px' },
] as const;

/**
 * Slider labels are attribute names, so they are not translated. The rule the docs
 * follow: only chrome a reader is *told* in their own language gets translated, and
 * `blur` is the name of a `<r-glass>` attribute, not prose.
 */
export const renderGlassPlayground = (locale: LocaleDef): string => {
  const t = demoCopy(locale.dir).glass;
  const d = GLASS_DEFAULTS;
  const code =
    `<r-glass blur="${d.blur}" saturate="${d.saturate}" displace="${d.displace}" radius="${d.radius}">\n` +
    `  …\n</r-glass>`;

  return el(
    'div',
    'gp',
    el(
      'div',
      'gp-stage',
      el('div', 'gp-bg', el('span', '', 'Aa'), el('b', '', 'ranui'), el('i', '', 'glass')).attr('aria-hidden', 'true'),
      el(
        'r-glass',
        'gp-glass',
        el('div', 'gp-card', el('div', 'gp-card-title', t.cardTitle), el('div', 'gp-card-sub', t.cardSub)),
      ).attrs({
        style: `left:0px;top:0px;width:${d.width}px`,
        blur: d.blur,
        saturate: d.saturate,
        displace: d.displace,
        radius: d.radius,
      }),
    ),
    el(
      'div',
      'gp-panel',
      el(
        'div',
        'gp-rows',
        GLASS_SLIDERS.map((s) =>
          el(
            'label',
            'gp-row',
            el('span', 'gp-label', s.key),
            el('input').attrs({
              type: 'range',
              min: s.min,
              max: s.max,
              step: s.step,
              value: d[s.key],
              'data-param': s.key,
              'data-unit': s.unit,
            }),
            el('span', 'gp-val', `${d[s.key]}${s.unit}`),
          ),
        ),
        el(
          'div',
          'gp-row gp-toggles',
          el('label', 'gp-check', el('input').attrs({ type: 'checkbox', 'data-flag': 'sheen' }), ' sheen'),
          el('label', 'gp-check', el('input').attrs({ type: 'checkbox', 'data-flag': 'interactive' }), ' interactive'),
          el('button', 'gp-reset', t.reset).attrs({ type: 'button', 'data-reset': '' }),
        ),
      ),
      el(
        'div',
        'gp-code',
        el('button', 'gp-copy', t.copy).attrs({
          type: 'button',
          'data-copy-code': '',
          'data-label': t.copy,
          'data-done': t.copied,
        }),
        el('pre', '', el('code', '', code)),
      ),
    ),
  )
    .attr('data-glass', '')
    .serialize();
};

// ── Icon gallery ────────────────────────────────────────────────────────────

/** The showcase set, all registered by `theme/register-icons.ts`. */
const GALLERY_ICONS = [
  'add-user',
  'book',
  'check-circle',
  'close-circle',
  'eye-close',
  'eye',
  'info-circle',
  'loading',
  'lock',
  'message',
  'power-off',
  'setting',
  'team',
  'unlock',
  'user',
  'more',
  'plus',
  'search',
  'menu',
  'sort',
] as const;

/**
 * Rendered at build time rather than upgraded from an empty element, which keeps all
 * twenty cells in the server-rendered HTML. Turning this into a client-side component
 * would have traded that away for nothing — the grid is a constant list.
 */
export const renderIconGallery = (locale: LocaleDef): string => {
  const t = demoCopy(locale.dir).icons;
  return el(
    'div',
    'icon-gallery',
    GALLERY_ICONS.map((name) =>
      el(
        'button',
        'icon-cell',
        el('span', 'icon-cell__glyph', el('r-icon').attrs({ name, size: '26' })),
        el('span', 'icon-cell__name', name),
      ).attrs({ type: 'button', 'data-icon': name, 'aria-label': t.copyLabel.replace('{name}', name) }),
    ),
  )
    .attrs({ 'data-icon-gallery': '', 'data-copied': t.copied })
    .serialize();
};

// ── Loading gallery ─────────────────────────────────────────────────────────

/** Every animation `<r-loading>` ships, in the order the component defines them. */
const LOADING_NAMES = [
  'stretch',
  'rotate',
  'double-bounce',
  'cube',
  'dot',
  'triple-bounce',
  'scale-out',
  'circle',
  'circle-line',
  'square',
  'pulse',
  'solar',
  'cube-fold',
  'circle-fold',
  'cube-grid',
  'circle-turn',
  'circle-rotate',
  'circle-spin',
  'dot-bar',
  'dot-circle',
  'line',
  'dot-pulse',
  'line-scale',
  'text',
  'cube-dim',
  'dot-line',
  'arc',
  'drop',
  'pacman',
] as const;

/**
 * Was a Vue single-file component in `vue/`, imported by eight pages through a
 * `<script setup>` block. It was a `v-for` over this list and nothing else — the last
 * template-over-static-data in the site, and the last Vue in the markdown.
 */
export const renderLoadingGallery = (): string => {
  // The heading was hard-coded English in the Vue component and is not in `demo-copy.ts`,
  // so it renders in English on all eight language pages. Ported as-is rather than
  // inventing eight translations — that is a content decision, not a migration one.
  const heading = 'Move the mouse over the icon to see the loading animation';
  return el(
    'div',
    'loading-gallery',
    el('h3', 'loading-gallery__head', heading),
    LOADING_NAMES.map((name) =>
      el(
        'div',
        'loading-cell',
        el('div', 'loading-cell__name', name),
        el('div', 'loading-cell__icon', el('r-loading').attr('name', name)),
      ),
    ),
  ).serialize();
};
