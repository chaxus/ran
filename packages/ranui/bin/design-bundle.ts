/**
 * Build a self-contained design-system bundle for Claude Design (claude.ai/design).
 *
 * Every card is **real rendered output**, never a hand-written approximation of one. The
 * docs site is opened in Chromium, each component's shadow tree is serialized into a
 * Declarative Shadow DOM template, and the stylesheets that tree adopted are inlined
 * beside it. The result renders with JavaScript disabled and without ranui on the page —
 * which is the property that makes it safe to hand to another tool: a card cannot claim
 * an appearance the component does not actually have.
 *
 * Usage — the docs preview server supplies the rendered components:
 *
 *   pnpm -F docs build && pnpm -F docs preview   # terminal 1
 *   pnpm -F ranui design:bundle                  # terminal 2
 *
 * Then upload with the DesignSync tool (`finalize_plan` → `write_files`).
 */
import { chromium } from '@playwright/test';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const flag = (name: string, fallback: string): string => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
};

const ORIGIN = flag('origin', 'http://localhost:4174');
const OUT = resolve(flag('out', join(ROOT, 'design-bundle')));

/**
 * Pages whose docs carry live `<ran-demo>` examples. A page without one yields no card —
 * the script says so rather than emitting an empty shell, because an empty card in a
 * design system reads as "this component looks like nothing".
 */
const COMPONENTS = `attachments button card checkbox colorpicker conversation disclosure-row dropdown form
glass icon image input link loading markdown math mermaid message modal player popover preview progress
radar reasoning route router scratch section select skeleton state-dot tab theme-switch token-meter
tool-card voice-button`
  .split(/\s+/)
  .filter(Boolean);

declare global {
  interface Window {
    __dsSerialize: (root: Element) => string;
    __dsTokens: () => string;
  }
}

const CHROME = `
:root{color-scheme:light dark}
*{box-sizing:border-box}
body{margin:0;padding:40px;font-family:var(--ran-font-family,system-ui,sans-serif);
  background:var(--ran-color-bg,#fff);color:var(--ran-color-text,#111);line-height:1.6}
.ds-head{margin:0 0 4px;font-size:30px;font-weight:700;letter-spacing:-.022em}
.ds-desc{margin:0 0 36px;font-size:17px;color:var(--ran-color-text-secondary,#596270);max-width:44rem}
.ds-sec{margin:0 0 32px}
.ds-sec>h2{margin:0 0 12px;font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;
  font-family:var(--ran-font-mono,ui-monospace,monospace);color:var(--ran-color-text-secondary,#596270)}
.ds-stage{display:flex;flex-wrap:wrap;gap:18px;align-items:center;padding:26px 24px;
  border:1px solid var(--ran-color-border,#e5e7eb);border-radius:12px;
  background:var(--ran-color-bg-subtle,#fafafa)}
.ds-stage--col{flex-direction:column;align-items:stretch}
`;

mkdirSync(join(OUT, 'components'), { recursive: true });
mkdirSync(join(OUT, 'foundations'), { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1100, height: 800 } });

/*
 * Browser-side code is passed as a **string**, not as a function.
 *
 * A function argument is serialized after the TypeScript transform has run, and that
 * transform wraps named functions in esbuild's `__name()` helper — which does not exist
 * in the page. The failure is `ReferenceError: __name is not defined`, thrown from inside
 * the injected script where it is thoroughly unobvious. A string is passed through
 * untouched.
 *
 * ranui attaches its shadow roots `mode: 'closed'` by design, so nothing outside can read
 * them. Forcing them open *before* any page script runs is the only way to serialize what
 * they render.
 */
await ctx.addInitScript({
  content: `
(() => {
  const orig = Element.prototype.attachShadow;
  Element.prototype.attachShadow = function (init) { return orig.call(this, { ...init, mode: 'open' }); };

  window.__dsSerialize = (root) => {
    const cssOf = (sr) => sr.adoptedStyleSheets
      .map((s) => { try { return [...s.cssRules].map((r) => r.cssText).join('\\n'); } catch { return ''; } })
      .join('\\n');
    const walk = (node) => {
      if (node.nodeType === Node.TEXT_NODE) return document.createTextNode(node.nodeValue ?? '');
      if (node.nodeType !== Node.ELEMENT_NODE) return null;
      const clone = node.cloneNode(false);
      const sr = node.shadowRoot;
      if (sr) {
        const tpl = document.createElement('template');
        tpl.setAttribute('shadowrootmode', 'open');
        const css = cssOf(sr);
        if (css) { const st = document.createElement('style'); st.textContent = css; tpl.content.append(st); }
        for (const c of sr.childNodes) { const s = walk(c); if (s) tpl.content.append(s); }
        clone.append(tpl);
      }
      for (const c of node.childNodes) { const s = walk(c); if (s) clone.append(s); }
      return clone;
    };
    const box = document.createElement('div');
    const out = walk(root);
    if (out) box.append(out);
    return box.innerHTML;
  };

  /*
   * Token values, resolved — not the site's rules copied.
   *
   * Concatenating the site's own \`:root\` rules reproduces its cascade *order* too, and a
   * later light \`:root\` then overrode the earlier \`@media (prefers-color-scheme: dark)\`
   * block: the stages rendered white on a black page. Reading each token's computed value
   * once per theme sidesteps the cascade entirely and emits exactly the three blocks the
   * theming contract specifies.
   */
  window.__dsTokens = () => {
    const names = new Set();
    for (const sheet of document.styleSheets) {
      let rules;
      try { rules = [...sheet.cssRules]; } catch { continue; }
      const scan = (list) => {
        for (const r of list) {
          /*
           * Read the declarations, then recurse — and never skip past the read. A
           * CSSStyleRule in current Chrome also carries a cssRules list (empty, for CSS
           * nesting), so treating "has cssRules" as "is a container" skips every style
           * rule's own declarations and captures nothing at all.
           */
          if (r.style) {
            for (const prop of r.style) {
              if (prop.startsWith('--ran-')) names.add(prop);
              for (const m of r.style.getPropertyValue(prop).matchAll(/var\\((--ran-[a-z0-9-]+)/gi)) names.add(m[1]);
            }
          }
          if (r.cssRules && r.cssRules.length) scan([...r.cssRules]);
        }
      };
      scan(rules);
    }
    const read = () => {
      const cs = getComputedStyle(document.documentElement);
      const out = {};
      for (const n of names) { const v = cs.getPropertyValue(n).trim(); if (v) out[n] = v; }
      return out;
    };
    const root = document.documentElement;
    const prev = root.getAttribute('data-ran-theme');
    root.setAttribute('data-ran-theme', 'light');
    const light = read();
    root.setAttribute('data-ran-theme', 'dark');
    const dark = read();
    if (prev === null) root.removeAttribute('data-ran-theme'); else root.setAttribute('data-ran-theme', prev);

    const decl = (o, pad) => Object.entries(o).map(([k, v]) => pad + k + ': ' + v + ';').join('\\n');
    const changed = Object.fromEntries(Object.entries(dark).filter(([k, v]) => light[k] !== v));
    return [
      ':root {\\n' + decl(light, '  ') + '\\n}',
      '@media (prefers-color-scheme: dark) {\\n  :root:not([data-ran-theme="light"]) {\\n' + decl(changed, '    ') + '\\n  }\\n}',
      ':root[data-ran-theme="dark"] {\\n' + decl(changed, '  ') + '\\n}',
    ].join('\\n');
  };
})();
`,
});

const page = await ctx.newPage();
let tokens = '';
const made: string[] = [];
const empty: string[] = [];

for (const name of COMPONENTS) {
  const res = await page.goto(`${ORIGIN}/src/ranui/${name}/`, { waitUntil: 'networkidle' });
  if (!res?.ok()) {
    console.log(`  skip ${name}: HTTP ${res?.status()}`);
    continue;
  }
  await page.waitForTimeout(1800);
  if (!tokens) tokens = await page.evaluate(() => window.__dsTokens());

  const data = await page.evaluate(() => {
    const title = document.querySelector('.prose h1')?.textContent?.trim() ?? '';
    const desc = document.querySelector('.prose h1 + p')?.textContent?.trim() ?? '';
    const out: Array<{ label: string; column: boolean; html: string }> = [];
    for (const demo of document.querySelectorAll('ran-demo')) {
      let label = '';
      let n = demo.previousElementSibling;
      while (n) {
        if (/^H[2-4]$/.test(n.tagName)) {
          // The docs name an example "Button Types `type`" — the trailing code span is the
          // attribute, not part of the title, and reads as a stutter once uppercased.
          const h = n.cloneNode(true) as Element;
          h.querySelectorAll('code, .header-anchor').forEach((c) => c.remove());
          label = (h.textContent ?? '').replace(/#$/, '').trim();
          break;
        }
        n = n.previousElementSibling;
      }
      const parts: string[] = [];
      for (const child of demo.children) parts.push(window.__dsSerialize(child));
      if (parts.length) out.push({ label, column: demo.hasAttribute('column'), html: parts.join('\n') });
    }
    return { title, desc, demos: out };
  });

  if (!data.demos.length) {
    empty.push(name);
    continue;
  }

  const body = data.demos
    .map(
      (d) =>
        `<section class="ds-sec">${d.label ? `<h2>${d.label}</h2>` : ''}\n<div class="ds-stage${d.column ? ' ds-stage--col' : ''}">${d.html}</div></section>`,
    )
    .join('\n');

  writeFileSync(
    join(OUT, 'components', `${name}.html`),
    `<!-- @dsCard group="Components" -->
<meta charset="utf-8"><title>${data.title || name}</title>
<style>${tokens}</style>
<style>${CHROME}</style>
<h1 class="ds-head">${data.title || name}</h1>
${data.desc ? `<p class="ds-desc">${data.desc}</p>` : ''}
${body}
`,
  );
  made.push(name);
  console.log(`  ${name}: ${data.demos.length} example(s)`);
}

await browser.close();

if (!tokens) throw new Error(`design-bundle: no page loaded from ${ORIGIN} — is \`pnpm -F docs preview\` running?`);
writeFileSync(join(OUT, '_tokens.css'), tokens);

// ── Foundations, generated from the tokens the site actually resolves ────────
const lightValues: Record<string, string> = {};
for (const line of tokens.slice(tokens.indexOf(':root {') + 7, tokens.indexOf('\n}')).split('\n')) {
  const m = line.match(/^\s*(--ran-[a-z0-9-]+):\s*(.+);$/i);
  if (m) lightValues[m[1]] = m[2].trim();
}
const names = Object.keys(lightValues);
const family = (re: RegExp): string[] =>
  names
    .filter((n) => re.test(n))
    .sort((a, b) => {
      const na = Number(a.match(/(\d+)$/)?.[1] ?? 0);
      const nb = Number(b.match(/(\d+)$/)?.[1] ?? 0);
      return na - nb || a.localeCompare(b);
    });

const FOUNDATION_CSS = `
.ds-grid{display:grid;gap:12px}
.ds-swatch{display:flex;align-items:center;gap:14px;padding:10px 12px;
  border:1px solid var(--ran-color-border,#e5e7eb);border-radius:10px}
.ds-chip{width:44px;height:44px;border-radius:8px;flex:none;
  border:1px solid var(--ran-color-border-subtle,rgba(0,0,0,.08))}
.ds-name{font-family:var(--ran-font-mono,monospace);font-size:12.5px}
.ds-val{margin-left:auto;font-family:var(--ran-font-mono,monospace);font-size:12px;
  color:var(--ran-color-text-secondary,#666)}
.ds-scale{display:flex;gap:4px}
.ds-step{flex:1;min-width:0}
/* The label sits under the swatch, not on it: a number tinted to read on step 100 is
   invisible on step 700, and a ramp has no single colour that works on both. */
.ds-step>i{display:block;height:56px;border-radius:8px;
  border:1px solid var(--ran-color-border-subtle,rgba(0,0,0,.07))}
.ds-step>small{display:block;padding-top:5px;text-align:center;
  font-family:var(--ran-font-mono,monospace);font-size:10.5px;
  color:var(--ran-color-text-secondary,#666)}
`;

const foundation = (file: string, title: string, desc: string, body: string): void =>
  writeFileSync(
    join(OUT, 'foundations', file),
    `<!-- @dsCard group="Foundations" -->
<meta charset="utf-8"><title>${title}</title>
<style>${tokens}</style>
<style>${CHROME}${FOUNDATION_CSS}</style>
<h1 class="ds-head">${title}</h1>
<p class="ds-desc">${desc}</p>
${body}
`,
  );

const swatches = (list: string[]): string =>
  `<div class="ds-grid">${list
    .map(
      (n) =>
        `<div class="ds-swatch"><span class="ds-chip" style="background:var(${n})"></span><span class="ds-name">${n}</span><span class="ds-val">${lightValues[n]}</span></div>`,
    )
    .join('')}</div>`;

const ramp = (prefix: string): string => {
  const steps = family(new RegExp(`^--ran-${prefix}-\\d+$`));
  if (!steps.length) return '';
  return `<section class="ds-sec"><h2>${prefix}</h2><div class="ds-scale">${steps
    .map(
      (n) =>
        `<span class="ds-step"><i style="background:var(${n})"></i><small>${n.match(/(\d+)$/)?.[1]}</small></span>`,
    )
    .join('')}</div></section>`;
};

foundation(
  'colors.html',
  'Colour',
  'Every hue is a 10-step scale where each step has one fixed job, so interaction states are decided up front. The primary action is monochrome; blue is reserved for links and the focus ring.',
  ['gray', 'gray-alpha', 'blue', 'red', 'green', 'amber'].map(ramp).join('\n') +
    `<section class="ds-sec"><h2>Semantic — surfaces</h2>${swatches(family(/^--ran-color-(bg|background)/))}</section>
<section class="ds-sec"><h2>Semantic — text</h2>${swatches(family(/^--ran-color-text/))}</section>
<section class="ds-sec"><h2>Semantic — border</h2>${swatches(family(/^--ran-color-border/))}</section>
<section class="ds-sec"><h2>Semantic — action</h2>${swatches(family(/^--ran-color-(primary|link|success|warning|danger|error)/))}</section>`,
);

foundation(
  'typography.html',
  'Typography',
  'Decide by role — heading, label, copy, button, mono. The role fixes font, size, weight and line-height; never pick a raw px per instance.',
  (
    [
      ['heading', 'Titles'],
      ['label', 'Single-line, scannable'],
      ['copy', 'Multi-line body'],
    ] as const
  )
    .map(
      ([role, use]) => `<section class="ds-sec"><h2>${role} — ${use}</h2>
${family(new RegExp(`^--ran-text-${role}-\\d$`))
  .map(
    (n) => `<p style="margin:0 0 10px;font-size:var(${n});font-weight:var(--ran-text-${role}-weight);line-height:1.3">
  The quick brown fox 中文排版样例 <span class="ds-val">${n} · ${lightValues[n]}</span></p>`,
  )
  .join('')}</section>`,
    )
    .join('\n') +
    `<section class="ds-sec"><h2>mono</h2><p style="font-family:var(--ran-font-mono);margin:0">
  const ran = 'Geist Mono' — 0123456789 <span class="ds-val">--ran-font-mono</span></p></section>`,
);

foundation(
  'spacing.html',
  'Spacing',
  'A limited, rhythmic scale. Spacing carries meaning: related things sit closer than unrelated ones, and a value off the scale is a decision nobody made on purpose.',
  `<div class="ds-grid">${family(/^--ran-space-\d+$/)
    .map(
      (n) =>
        `<div class="ds-swatch"><span style="display:block;height:20px;width:var(${n});background:var(--ran-color-primary,#111);border-radius:3px;flex:none"></span><span class="ds-name">${n}</span><span class="ds-val">${lightValues[n]}</span></div>`,
    )
    .join('')}</div>`,
);

foundation(
  'radius-elevation.html',
  'Radius & elevation',
  'Radius and shadow are structural, not decorative: a raised surface is a claim that something floats above the page.',
  `<section class="ds-sec"><h2>Radius</h2><div class="ds-grid">${family(/^--ran-(radius|border-radius)/)
    .map(
      (n) =>
        `<div class="ds-swatch"><span class="ds-chip" style="border-radius:var(${n});background:var(--ran-color-bg-subtle,#f4f4f5)"></span><span class="ds-name">${n}</span><span class="ds-val">${lightValues[n]}</span></div>`,
    )
    .join('')}</div></section>
<section class="ds-sec"><h2>Elevation</h2><div class="ds-grid">${family(/^--ran-(shadow|elevation)/)
    .map(
      (n) =>
        `<div class="ds-swatch"><span class="ds-chip" style="box-shadow:var(${n});background:var(--ran-color-bg,#fff);border:0"></span><span class="ds-name">${n}</span><span class="ds-val">${(lightValues[n] ?? '').slice(0, 42)}</span></div>`,
    )
    .join('')}</div></section>`,
);

foundation(
  'motion.html',
  'Motion',
  'Prefer none. Motion is for interaction — hover, focus, press — never for flipping light and dark: CSS cannot tell why a property changed, so any palette property in a transition also fades on a theme switch.',
  `<section class="ds-sec"><h2>Duration</h2>${swatches(family(/^--ran-motion-duration/))}</section>
<section class="ds-sec"><h2>Easing</h2>${swatches(family(/^--ran-motion-ease/))}</section>`,
);

console.log(`\n${made.length} component card(s) + 5 foundation card(s) → ${OUT}`);
if (empty.length) console.log(`no live demo on the docs page (no card): ${empty.join(', ')}`);
