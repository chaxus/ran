/**
 * The three page-level components, rendered at build time.
 *
 * Each was a Vue single-file component. What they mostly were is a template over a copy
 * table — `v-for` across `home-copy.ts` and `demo-copy.ts`, both of which are plain data
 * and stay exactly where they are. A template over static data does not need a framework
 * or a runtime; it needs to be run once, at build time, which is what happens here.
 *
 * The behaviour that *is* real — clipboard, hover tilt, scroll reveal, count-up, the
 * glass sliders, icon copy — moves to `client/home.ts` as progressive enhancement. So the
 * markup is in the server-rendered HTML, indexable and correct with no JavaScript, and
 * the script only adds motion and interaction on top.
 *
 * Markdown pages write `<HomeCinematic />` and the engine's component hook matches it as
 * an html token, so the tag stays ordinary markup and the page stays readable as prose.
 */
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

const esc = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const ICONS: Record<string, string> = {
  ui: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18M9 21V9"/></svg>',
  utils:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4l-6 6a1.5 1.5 0 0 0 2.1 2.1l6-6a4 4 0 0 0 5.4-5.4l-2.3 2.3-2.1-2.1z"/></svg>',
  article:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 4h11l5 5v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"/><path d="M14 4v5h5M8 13h8M8 17h5"/></svg>',
  agnostic:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>',
  typed:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14"/></svg>',
  pwa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 17v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2"/></svg>',
  i18n: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.9 6 4 9-.1 3-1.5 6.4-4 9-2.5-2.6-3.9-6-4-9 .1-3 1.5-6.4 4-9z"/></svg>',
  bridge:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="5" cy="12" r="2.4"/><circle cx="19" cy="12" r="2.4"/><path d="M7.4 12h9.2"/></svg>',
  gpu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9.5 3v3M14.5 3v3M9.5 18v3M14.5 18v3M3 9.5h3M3 14.5h3M18 9.5h3M18 14.5h3"/></svg>',
  vdom: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="5" r="2.2"/><circle cx="6" cy="19" r="2.2"/><circle cx="18" cy="19" r="2.2"/><path d="M12 7.2v3.3M12 10.5 6.6 16.9M12 10.5l5.4 6.4"/></svg>',
  totp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z"/><path d="M12 9v3.2l2 1.4"/></svg>',
  mime: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M10 13h5M10 17h4"/></svg>',
  player:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M10.5 9l4.5 3-4.5 3z" fill="currentColor" stroke="none"/></svg>',
  droplet:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3s6 6.4 6 10.5a6 6 0 0 1-12 0C6 9.4 12 3 12 3z"/></svg>',
  radar:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3.5l8 5.8-3 9.2H7l-3-9.2z"/><path d="M12 3.5v15M4 9.3l16 0"/></svg>',
  sigma:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"><path d="M17 5H7l6 7-6 7h10"/></svg>',
  scratch:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 3l2.1 5.3 5.4 2.1-5.4 2.1L12 18l-2.1-5.5L4.5 10.4l5.4-2.1z"/></svg>',
};

const icon = (kind: string): string => ICONS[kind] ?? '';

/** Staggered entrance delay, as a CSS custom property on the element. */
const hd = (i: number): string => `style="--hd:${i * 55}ms"`;
const rd = (i: number): string => `style="--rd:${i * 60}ms"`;

const ARROW =
  '<svg viewBox="0 0 24 24" width="18" height="18"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const ARROW_SM = ARROW.replace(/width="18" height="18"/, 'width="15" height="15"');
const GITHUB_MARK =
  '<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05a9.4 9.4 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z"/></svg>';
const COPY_ICON =
  '<svg class="copy-idle" viewBox="0 0 24 24" width="16" height="16"><rect x="9" y="9" width="11" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M5 15V5a2 2 0 0 1 2-2h10" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>' +
  '<svg class="copy-done" viewBox="0 0 24 24" width="16" height="16"><path d="M4 12l5 5L20 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

/**
 * The install snippet and the two code cells are written out rather than highlighted.
 * They are four lines of illustrative markup, not source anyone runs, and shipping shiki
 * across every home page to colour them would cost more than they are worth.
 */
const SNIPPET_INSTALL = `<span class="c-com">$ npm i ranui ranuts</span>

<span class="c-com">// register the &lt;r-*&gt; elements once</span>
<span class="c-kw">import</span> <span class="c-str">'ranui'</span>
<span class="c-kw">import</span> { debounce } <span class="c-kw">from</span> <span class="c-str">'ranuts'</span>`;

const SNIPPET_USE = `<span class="c-com">&lt;!-- Vue, React, or plain HTML --&gt;</span>
<span class="c-tag">&lt;r-button</span> <span class="c-attr">type</span>=<span class="c-str">"primary"</span><span class="c-tag">&gt;</span>Save<span class="c-tag">&lt;/r-button&gt;</span>
<span class="c-tag">&lt;r-progress</span> <span class="c-attr">percent</span>=<span class="c-str">"66"</span><span class="c-tag">&gt;&lt;/r-progress&gt;</span>`;

export const renderHome = (locale: LocaleDef): string => {
  const t = homeCopy(locale.dir);
  const href = (path: string): string => localeHref(path, locale);
  // Languages that opt out of word splitting — the CJK headlines and Persian — rise as
  // one segment: word units either do not exist there or are not worth reordering an
  // RTL line for.
  const words = t.splitWords ? t.headline.split(/\s+/) : [t.headline];
  const n = words.length;

  return (
    `<div class="cine">` +
    `<div class="bg" aria-hidden="true"><span class="glow"></span><span class="grid"></span></div>` +
    // ── hero ──
    `<header class="hero"><div class="hero-copy">` +
    `<span class="eyebrow" data-hero ${hd(0)}><span class="dot"></span>${esc(t.eyebrow)}</span>` +
    `<h1 class="headline"><span class="line">` +
    words.map((w, i) => `<span class="word" ${hd(2 + i)}><span class="word-in">${esc(w)}</span></span>`).join('') +
    `</span></h1>` +
    `<p class="subtitle" data-hero ${hd(2 + n)}>${esc(t.subtitle)}</p>` +
    `<div class="cmd" data-hero ${hd(3 + n)}><code>npm&nbsp;i&nbsp;ranui&nbsp;ranuts</code>` +
    `<button class="copy" type="button" data-copy="npm i ranui ranuts" aria-label="${esc(t.copy)}">${COPY_ICON}</button></div>` +
    `<div class="cta" data-hero ${hd(4 + n)}>` +
    `<a class="btn btn-primary" href="${esc(href('/src/ranui/'))}">${esc(t.ctaPrimary)}${ARROW}</a>` +
    `<a class="btn btn-ghost" href="https://github.com/chaxus/ran" target="_blank" rel="noreferrer">${GITHUB_MARK}${esc(t.ctaSecondary)}</a>` +
    `</div></div>` +
    // The live panel holds real ranui elements. They are inert custom elements until the
    // bundle upgrades them, so this is the markup either way — no skeleton swap, and
    // therefore none of the hydration mismatch the Vue version had to avoid.
    `<div class="hero-live" data-hero ${hd(3 + n)}>` +
    `<div class="live-head"><span class="live-dot"></span>${esc(t.liveLabel)}</div>` +
    `<div class="live-body">` +
    `<div class="live-row"><r-button type="primary">${esc(t.liveButtons[0])}</r-button>` +
    `<r-button>${esc(t.liveButtons[1])}</r-button>` +
    `<r-button type="warning">${esc(t.liveButtons[2])}</r-button></div>` +
    `<div class="live-row"><r-progress class="live-progress" percent="66" total="100"></r-progress></div>` +
    `<div class="live-row live-inline"><r-loading class="live-loading" name="circle-line"></r-loading>` +
    `<r-checkbox checked="true">${esc(t.liveCheck)}</r-checkbox></div>` +
    `</div><span class="live-note">${esc(t.liveNote)}</span></div></header>` +
    // ── stats ──
    `<section class="stats reveal" data-reveal>` +
    t.stats
      .map(
        (s, i) =>
          `<div class="stat" ${rd(i)}><span class="stat-num" data-count>${esc(s.num)}</span>` +
          `<span class="stat-label">${esc(s.label)}</span></div>`,
      )
      .join('') +
    `</section>` +
    // ── pillars ──
    `<section class="pillars">` +
    t.pillars
      .map(
        (p, i) =>
          `<a class="pillar reveal" data-reveal ${rd(i)} href="${esc(href(p.link))}">` +
          `<span class="pillar-icon" data-kind="${esc(p.kind)}">${icon(p.kind)}</span>` +
          `<h3>${esc(p.title)}</h3><p>${esc(p.desc)}</p>` +
          `<span class="pillar-more">${esc(p.more)} ${ARROW_SM}</span></a>`,
      )
      .join('') +
    `</section>` +
    // ── capabilities ──
    `<section class="section caps"><div class="sec-head reveal" data-reveal>` +
    `<span class="kicker">${esc(t.capsKicker)}</span><h2>${esc(t.capsTitle)}</h2>` +
    `<p class="sec-sub">${esc(t.capsSub)}</p></div><div class="bento reveal" data-reveal>` +
    t.caps
      .map(
        (col) =>
          `<div class="caps-col"><div class="caps-col-head">` +
          `<span class="caps-lib">${esc(col.lib)}</span><span class="caps-lib-tag">${esc(col.tag)}</span></div>` +
          `<ul class="caps-list">` +
          col.items
            .map(
              (item, ii) =>
                `<li ${rd(ii)}><span class="caps-ico">${icon(item.kind)}</span><div class="caps-text">` +
                `<span class="caps-name">${esc(item.name)} <code>${esc(item.api)}</code></span>` +
                `<span class="caps-desc">${esc(item.desc)}</span></div></li>`,
            )
            .join('') +
          `</ul></div>`,
      )
      .join('') +
    `</div></section>` +
    // ── get started ──
    `<section class="section start"><div class="sec-head reveal" data-reveal>` +
    `<span class="kicker">${esc(t.startKicker)}</span><h2>${esc(t.startTitle)}</h2>` +
    `<p class="sec-sub">${esc(t.startDesc)}</p></div>` +
    `<div class="panel reveal" data-reveal>` +
    `<div class="code-cell"><div class="code-head">${esc(t.startStep1)}</div><pre class="snippet">${SNIPPET_INSTALL}</pre></div>` +
    `<div class="code-cell"><div class="code-head">${esc(t.startStep2)}</div><pre class="snippet">${SNIPPET_USE}</pre></div>` +
    `</div></section>` +
    // ── feature strip ──
    `<section class="strip reveal" data-reveal>` +
    t.features
      .map(
        (f, i) =>
          `<div class="feature" ${rd(i)}><span class="feature-head">` +
          `<span class="feature-icon">${icon(f.kind)}</span><h4>${esc(f.title)}</h4></span>` +
          `<p>${esc(f.desc)}</p></div>`,
      )
      .join('') +
    `</section></div>`
  );
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

  return (
    `<div class="gp" data-glass>` +
    `<div class="gp-stage"><div class="gp-bg" aria-hidden="true"><span>Aa</span><b>ranui</b><i>glass</i></div>` +
    // The element is in the markup with its defaults already applied, so a reader with
    // no JavaScript still sees the effect — just not the sliders moving it.
    `<r-glass class="gp-glass" style="left:0px;top:0px;width:${d.width}px" blur="${d.blur}" ` +
    `saturate="${d.saturate}" displace="${d.displace}" radius="${d.radius}">` +
    `<div class="gp-card"><div class="gp-card-title">${esc(t.cardTitle)}</div>` +
    `<div class="gp-card-sub">${esc(t.cardSub)}</div></div></r-glass></div>` +
    `<div class="gp-panel"><div class="gp-rows">` +
    GLASS_SLIDERS.map(
      (s) =>
        `<label class="gp-row"><span class="gp-label">${s.key}</span>` +
        `<input type="range" min="${s.min}" max="${s.max}" step="${s.step}" ` +
        `value="${d[s.key]}" data-param="${s.key}" data-unit="${s.unit}">` +
        `<span class="gp-val">${d[s.key]}${s.unit}</span></label>`,
    ).join('') +
    `<div class="gp-row gp-toggles">` +
    `<label class="gp-check"><input type="checkbox" data-flag="sheen"> sheen</label>` +
    `<label class="gp-check"><input type="checkbox" data-flag="interactive"> interactive</label>` +
    `<button class="gp-reset" type="button" data-reset>${esc(t.reset)}</button></div>` +
    `</div><div class="gp-code">` +
    `<button class="gp-copy" type="button" data-copy-code data-label="${esc(t.copy)}" data-done="${esc(t.copied)}">${esc(t.copy)}</button>` +
    `<pre><code>${esc(code)}</code></pre></div></div></div>`
  );
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
  return (
    `<div class="icon-gallery" data-icon-gallery data-copied="${esc(t.copied)}">` +
    GALLERY_ICONS.map(
      (name) =>
        `<button type="button" class="icon-cell" data-icon="${name}" ` +
        `aria-label="${esc(t.copyLabel.replace('{name}', name))}">` +
        `<span class="icon-cell__glyph"><r-icon name="${name}" size="26"></r-icon></span>` +
        `<span class="icon-cell__name">${name}</span></button>`,
    ).join('') +
    `</div>`
  );
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
  return (
    `<div class="loading-gallery"><h3 class="loading-gallery__head">${esc(heading)}</h3>` +
    LOADING_NAMES.map(
      (name) =>
        `<div class="loading-cell"><div class="loading-cell__name">${name}</div>` +
        `<div class="loading-cell__icon"><r-loading name="${name}"></r-loading></div></div>`,
    ).join('') +
    `</div>`
  );
};
