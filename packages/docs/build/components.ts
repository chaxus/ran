/**
 * The three page-level components, rendered at build time.
 *
 * Each was a Vue single-file component. What they mostly were is a template over a copy
 * table — `v-for` across `home-copy.ts` and `demo-copy.ts`, both of which are plain data
 * and stay exactly where they are. A template over static data does not need a framework
 * or a runtime; it needs to be run once, at build time, which is what happens here.
 *
 * The behaviour that *is* real — clipboard, theme selection, the
 * glass sliders, icon copy — moves to `client/home.ts` as progressive enhancement. So the
 * markup is in the server-rendered HTML, indexable and correct with no JavaScript, and
 * the script only adds motion and interaction on top.
 *
 * Markdown pages write `<HomeCinematic />` and the engine's component hook matches it as
 * an html token, so the tag stays ordinary markup and the page stays readable as prose.
 */
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homeCopy } from './langs/home-copy.ts';
import { renderPackageFacts } from './package-facts.ts';
import { renderDesignIllustrations } from './design-illustrations.ts';
import { demoCopy } from './langs/demo-copy.ts';
import { localeHref } from './langs/locales.ts';
import type { LocaleDef } from './config.ts';
import { currentLinkBase, currentLocale } from './render-context.ts';
import { resolveLinkFrom } from './links.ts';
import { publicUrl } from './urls.ts';
import { designSectionLink } from './design-reference.ts';
import { GLASS_MATERIALS } from 'ranui/glass';

const DESIGN_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', 'design');

/** The guide sections the home example demonstrates. */
const EXAMPLE_SECTIONS = ['Interaction', 'Words'] as const;

/** The component hooks the markdown renderer is configured with. */
export const componentRenderers = {
  HomeCinematic: () => renderHome(currentLocale()),
  PackageFacts: (attrs: string) => renderPackageFacts(attrs),
  GlassPlayground: () => renderGlassPlayground(currentLocale()),
  IconGallery: () => renderIconGallery(currentLocale()),
  Loading: () => renderLoadingGallery(),
  DesignIllustrations: () => renderDesignIllustrations(currentLocale()),
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
  const href = (path: string): string => publicUrl(localeHref(path, locale));
  // Languages that opt out of word splitting — the CJK headlines and Persian — render as
  // one segment: word units either do not exist there or are not worth reordering an
  // RTL line for.
  const words = t.splitWords ? t.headline.split(/\s+/) : [t.headline];
  const head = (title: string, id: string): string => `<div class="sec-head"><h2 id="${id}">${esc(title)}</h2></div>`;

  return (
    `<div class="cine">` +
    // ── 1. positioning: what ran is, one action, the facts, and a working example ──
    `<header class="hero"><div class="hero-copy">` +
    `<h1 class="headline"><span class="line">` +
    // Real spaces between the word boxes, so the heading's text reads as words to crawlers too.
    words.map((w) => `<span class="word"><span class="word-in">${esc(w)}</span></span>`).join(' ') +
    `</span></h1>` +
    `<p class="subtitle">${esc(t.subtitle)}</p>` +
    `<div class="cta">` +
    `<a class="btn btn-primary" href="${esc(href('/src/agents/'))}">${esc(t.ctaPrimary)}${ARROW}</a>` +
    `<a class="btn-text" href="https://github.com/chaxus/ran" target="_blank" rel="noreferrer">${GITHUB_MARK}${esc(t.ctaSecondary)}</a>` +
    `</div></div>` +
    // The live panel holds real ranui elements. They are inert custom elements until the
    // bundle upgrades them, so this is the markup either way — no skeleton swap.
    // A working example, not a gallery of variants: one small task with every state a
    // reader can reach — empty, invalid, sending, sent, failed and retried. The markup
    // is complete without script; `client/home.ts` adds the behaviour.
    `<div class="hero-live">` +
    `<div class="live-head">${esc(t.liveLabel)}</div>` +
    // A group, not a <form>: the request is simulated, and a real form would submit itself
    // on Enter (its controls are form-associated) and put the email in the URL.
    `<div class="example" role="form" aria-labelledby="home-example-title" data-home-example` +
    ` data-invalid="${esc(t.example.invalid)}" data-sending="${esc(t.example.sending)}"` +
    ` data-sent="${esc(t.example.sent)}" data-failed="${esc(t.example.failed)}">` +
    `<h2 class="example__title" id="home-example-title">${esc(t.example.title)}</h2>` +
    `<r-input class="example__field" name="email" type="email" required label="${esc(t.example.email)}"` +
    ` placeholder="${esc(t.example.emailPlaceholder)}"></r-input>` +
    `<r-select class="example__field" name="role" label="${esc(t.example.role)}" value="editor">` +
    ['viewer', 'editor', 'admin']
      .map((value, i) => `<r-option value="${value}">${esc(t.example.roles[i]!)}</r-option>`)
      .join('') +
    `</r-select>` +
    `<div class="example__actions">` +
    `<r-checkbox class="example__simulate" name="simulate">${esc(t.example.simulate)}</r-checkbox>` +
    `<r-button class="example__submit" type="primary">${esc(t.example.submit)}</r-button>` +
    `</div>` +
    `<p class="example__status" role="status" aria-live="polite"></p>` +
    `</div>` +
    `<div class="example__rules"><span class="example__rules-label">${esc(t.example.rules)}</span>` +
    EXAMPLE_SECTIONS.map((heading) => {
      const { link, label } = designSectionLink(DESIGN_DIR, heading, locale);
      return `<a class="example__rule" href="${esc(href(link))}">${esc(label)}</a>`;
    }).join('') +
    `</div>` +
    `<p class="live-note">${esc(t.liveNote)}</p></div></header>` +
    `<dl class="stats reveal">` +
    t.stats
      .map(
        (s) =>
          `<div class="stat"><dt class="stat-label">${esc(s.label)}</dt>` +
          `<dd class="stat-num">${esc(s.num)}</dd></div>`,
      )
      .join('') +
    `</dl>` +
    // ── 2. live proof: what the library looks like, composed into small states ──
    `<section class="section proof reveal" aria-labelledby="home-proof">` +
    head(t.proofTitle, 'home-proof') +
    renderProof(t.proof) +
    `</section>` +
    // ── 3. choose a pillar, then what the two libraries carry that others leave out ──
    `<section class="section choose reveal" aria-labelledby="home-choose">` +
    head(t.chooseTitle, 'home-choose') +
    `<div class="pillars reveal">` +
    t.pillars
      .map(
        (p) =>
          `<a class="pillar" href="${esc(href(p.link))}">` +
          `<span class="pillar-icon" data-kind="${esc(p.kind)}">${icon(p.kind)}</span>` +
          `<h3>${esc(p.title)}</h3><p>${esc(p.desc)}</p>` +
          `<span class="pillar-more">${esc(p.more)} ${ARROW_SM}</span></a>`,
      )
      .join('') +
    `</div>` +
    `<h3 class="caps-title">${esc(t.capsTitle)}</h3>` +
    `<div class="bento reveal">` +
    t.caps
      .map(
        (col) =>
          `<div class="caps-col"><div class="caps-col-head">` +
          `<span class="caps-lib">${esc(col.lib)}</span><span class="caps-lib-tag">${esc(col.tag)}</span></div>` +
          `<ul class="caps-list">` +
          col.items
            .map(
              (item) =>
                `<li><span class="caps-ico">${icon(item.kind)}</span><div class="caps-text">` +
                `<span class="caps-name">${esc(item.name)} <code>${esc(item.api)}</code></span>` +
                `<span class="caps-desc">${esc(item.desc)}</span></div></li>`,
            )
            .join('') +
          `</ul></div>`,
      )
      .join('') +
    `</div></section>` +
    // ── 4. install ──
    `<section class="section start reveal" aria-labelledby="home-start">` +
    head(t.startTitle, 'home-start') +
    `<p class="sec-sub">${esc(t.startDesc)}</p>` +
    `<div class="cmd"><code>npm&nbsp;i&nbsp;ranui&nbsp;ranuts</code>` +
    `<button class="copy" type="button" data-copy="npm i ranui ranuts" aria-label="${esc(t.copy)}">${COPY_ICON}</button></div>` +
    `<div class="panel">` +
    `<div class="code-cell"><div class="code-head">${esc(t.startStep1)}</div><pre class="snippet">${SNIPPET_INSTALL}</pre></div>` +
    `<div class="code-cell"><div class="code-head">${esc(t.startStep2)}</div><pre class="snippet">${SNIPPET_USE}</pre></div>` +
    `</div></section></div>`
  );
};

const PROOF_STEP_STATES = ['success', 'running', 'idle'] as const;

/**
 * Three small states composed from real `r-*` elements. Every visible word is light-DOM
 * text beside the elements, so with no script the captions, file name and steps still
 * read; only the controls themselves wait for the bundle.
 */
const renderProof = (p: ReturnType<typeof homeCopy>['proof']): string =>
  `<div class="proof-stage">` +
  `<figure class="proof-cell"><figcaption class="proof-cap">${esc(p.states[0])}</figcaption>` +
  `<div class="proof-file"><span class="proof-name">quarterly-report.pdf</span><span class="proof-pct">64%</span></div>` +
  `<r-progress class="proof-bar" percent="64" total="100" aria-label="${esc(p.states[0])}: quarterly-report.pdf"></r-progress>` +
  // A specimen, not a control: the button shows how ranui renders it but takes no focus.
  `<r-button class="proof-action" disabled>${esc(p.cancel)}</r-button></figure>` +
  `<figure class="proof-cell"><figcaption class="proof-cap">${esc(p.states[1])}</figcaption>` +
  `<ol class="proof-steps">` +
  p.steps
    .map(
      (step, i) =>
        `<li><r-state-dot state="${PROOF_STEP_STATES[i]}" label="${esc(p.stepStates[i]!)}"></r-state-dot>` +
        `<span>${esc(step)}</span></li>`,
    )
    .join('') +
  `</ol>` +
  `<r-token-meter class="proof-meter" used="48200" limit="200000" label="${esc(p.meter)}"></r-token-meter></figure>` +
  `<figure class="proof-cell"><figcaption class="proof-cap">${esc(p.states[2])}</figcaption>` +
  `<div class="proof-skel"><r-skeleton class="proof-avatar"></r-skeleton>` +
  `<div class="proof-lines"><r-skeleton></r-skeleton><r-skeleton class="proof-short"></r-skeleton></div></div>` +
  `<div class="proof-text"><r-skeleton></r-skeleton><r-skeleton></r-skeleton><r-skeleton class="proof-short"></r-skeleton></div>` +
  `</figure>` +
  // The same clear glass as the playground: default tint, no rim, so the backdrop it bends
  // stays visible. Nothing here loops. The label carries its own backing (home.css), so the
  // pane does not have to be milked over to keep it readable.
  `<figure class="proof-cell proof-glass"><figcaption class="proof-cap">${esc(p.glass)}</figcaption>` +
  `<div class="proof-glass-stage"><span class="proof-backdrop" aria-hidden="true"><i></i><i></i><i></i></span>` +
  `<r-glass class="proof-pane" radius="16" blur="12" saturate="170" displace="8"><code>&lt;r-glass&gt;</code></r-glass></div>` +
  `</figure>` +
  `</div>`;

// ── Glass playground ────────────────────────────────────────────────────────

/** Geometry the stage starts with; everything optical comes from the `regular` material. */
const GLASS_START = { width: 340, radius: 24 } as const;

const GLASS_OPTICS = [
  { key: 'blur', min: 0, max: 40, step: 1, unit: 'px' },
  { key: 'saturate', min: 100, max: 260, step: 5, unit: '%' },
  { key: 'displace', min: 0, max: 60, step: 1, unit: 'px' },
  { key: 'bevel', min: 4, max: 80, step: 1, unit: 'px' },
  { key: 'dispersion', min: 0, max: 100, step: 5, unit: '%' },
] as const;

const GLASS_SHAPE = [
  { key: 'radius', min: 0, max: 60, step: 1, unit: 'px' },
  { key: 'width', min: 200, max: 520, step: 10, unit: 'px' },
  { key: 'specular', min: 0, max: 200, step: 5, unit: '%' },
] as const;

const GLASS_SCENES = ['aurora', 'paper', 'grid'] as const;

type Slider = { key: string; min: number; max: number; step: number; unit: string };

/**
 * A range control drawn as a field: label left, value right, the filled part shows the value.
 * The value text is hidden from assistive technology: the range announces its own value,
 * and inside the label it would become part of the name ("blur16px").
 */
const rangeField = (s: Slider, value: number): string => {
  const fill = ((value - s.min) / (s.max - s.min)) * 100;
  return (
    `<label class="gp-field gp-range" style="--fill:${fill.toFixed(1)}%"><span class="gp-label">${s.key}</span>` +
    `<span class="gp-val" aria-hidden="true">${value}${s.unit}</span>` +
    `<input type="range" min="${s.min}" max="${s.max}" step="${s.step}" value="${value}" aria-valuetext="${value}${s.unit}" data-param="${s.key}" data-unit="${s.unit}"></label>`
  );
};

const selectField = (key: string, options: readonly string[], value: string): string =>
  `<label class="gp-field"><span class="gp-label">${key}</span><select data-param="${key}">` +
  options.map((o) => `<option${o === value ? ' selected' : ''}>${o}</option>`).join('') +
  `</select></label>`;

const switchField = (key: string): string =>
  `<label class="gp-field gp-switch"><span class="gp-label">${key}</span><input type="checkbox" role="switch" data-flag="${key}"></label>`;

const group = (legend: string, body: string): string =>
  `<fieldset class="gp-group"><legend class="gp-legend">${esc(legend)}</legend><div class="gp-grid">${body}</div></fieldset>`;

/**
 * Control labels are attribute names, so they are not translated. The rule the docs
 * follow: only chrome a reader is *told* in their own language gets translated, and
 * `blur` is the name of a `<r-glass>` attribute, not prose. The group headings and the
 * backdrop pictures' names are prose and are translated.
 */
export const renderGlassPlayground = (locale: LocaleDef): string => {
  const t = demoCopy(locale.dir).glass;
  const m = GLASS_MATERIALS.regular;
  const code = `<r-glass style="width:${GLASS_START.width}px">\n  …\n</r-glass>`;
  const scene = (name: (typeof GLASS_SCENES)[number], index: number): string =>
    `<label class="gp-tile"><input type="radio" name="gp-scene" value="${name}" aria-label="${esc(t.scenes[name])}"${index === 0 ? ' checked' : ''}>` +
    `<img src="/glass/${name}.svg" alt="" loading="lazy"></label>`;

  return (
    `<div class="gp" data-glass data-materials="${esc(JSON.stringify(GLASS_MATERIALS))}">` +
    `<div class="gp-stage" tabindex="0" role="group" aria-label="${esc(t.cardTitle)}" aria-describedby="gp-instructions">` +
    `<img class="gp-scene" src="/glass/aurora.svg" alt="" data-scene>` +
    // The element is in the markup with its defaults already applied, so a reader with
    // no JavaScript still sees the effect — just not the controls moving it.
    `<r-glass class="gp-glass" style="left:24px;top:24px;width:${GLASS_START.width}px" radius="${GLASS_START.radius}">` +
    `<div class="gp-card"><div class="gp-card-title">${esc(t.cardTitle)}</div>` +
    `<div class="gp-card-sub" id="gp-instructions">${esc(t.cardSub)}</div></div></r-glass></div>` +
    `<div class="gp-controls">` +
    `<button class="gp-reset" type="button" data-reset>${esc(t.reset)}</button>` +
    group(t.sections.material, selectField('material', Object.keys(GLASS_MATERIALS), 'regular')) +
    group(t.sections.optics, GLASS_OPTICS.map((s) => rangeField(s, m[s.key])).join('')) +
    group(
      t.sections.light,
      rangeField(GLASS_SHAPE[0], GLASS_START.radius) +
        rangeField(GLASS_SHAPE[1], GLASS_START.width) +
        rangeField(GLASS_SHAPE[2], m.specular) +
        selectField('tone', ['auto', 'dark', 'light'], 'auto') +
        ['rim', 'sheen', 'interactive'].map(switchField).join(''),
    ) +
    group(
      t.sections.backdrop,
      switchField('backdrop') +
        `<div class="gp-tiles">${GLASS_SCENES.map(scene).join('')}` +
        `<label class="gp-tile gp-upload"><input type="file" accept="image/*" data-upload><span>${esc(t.upload)}</span></label></div>`,
    ) +
    `</div><div class="gp-code">` +
    `<button class="gp-copy" type="button" data-copy-code data-label="${esc(t.copy)}" data-done="${esc(t.copied)}">${esc(t.copy)}</button>` +
    `<pre><code>${esc(code)}</code></pre></div></div>`
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
