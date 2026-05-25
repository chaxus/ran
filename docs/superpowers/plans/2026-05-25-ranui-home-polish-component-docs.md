# ranui Home Polish Component Docs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Polish the ranui homepage and turn the component gallery into a same-page component documentation entry.

**Architecture:** Keep the existing single-page Vite demo in `packages/ranui/demo/index.html`. Add a source contract test that reads the static HTML and verifies the homepage has component anchors, card metadata, and detail blocks before changing the page.

**Tech Stack:** Native HTML/CSS, ranui Web Components, Vite, Vitest source-contract tests, existing ranui theme utilities.

---

## File Structure

- Modify: `packages/ranui/demo/index.html`
  - Owns the homepage layout, component gallery markup, docs-preview blocks, visual polish CSS, and inline theme-control script.
- Create: `packages/ranui/test/unit/demo-home.source.test.ts`
  - Reads `demo/index.html` as source and asserts homepage documentation-entry contracts.
- Do not modify: `packages/ranui/demo/index.ts`
  - Existing component/theme imports remain sufficient for this pass.

## Task 1: Add Homepage Docs-Entry Contract Test

**Files:**
- Create: `packages/ranui/test/unit/demo-home.source.test.ts`

- [ ] **Step 1: Write the failing source contract test**

Create `packages/ranui/test/unit/demo-home.source.test.ts`:

```ts
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '../..');
const readDemo = (): string => readFileSync(resolve(root, 'demo/index.html'), 'utf8');

const COMPONENTS = [
  'button',
  'icon',
  'input',
  'select',
  'checkbox',
  'form',
  'progress',
  'loading',
  'skeleton',
  'message',
  'tabs',
  'popover',
  'modal',
  'image',
  'colorpicker',
  'math',
  'radar',
  'scratch',
];

describe('ranui demo homepage source', () => {
  it('exposes the component gallery as a docs entry point', () => {
    const source = readDemo();

    expect(source).toContain('id="components"');
    expect(source).toContain('Component Directory');
    expect(source).toContain('Component notes');
    expect(source).toContain('class="component-meta"');
    expect(source).toContain('class="component-docs"');

    for (const component of COMPONENTS) {
      expect(source, `${component} card anchor missing`).toContain(`id="component-${component}"`);
      expect(source, `${component} detail anchor missing`).toContain(`id="docs-${component}"`);
      expect(source, `${component} detail link missing`).toContain(`href="#docs-${component}"`);
    }
  });

  it('keeps homepage navigation focused on product and docs tasks', () => {
    const source = readDemo();

    expect(source).toContain('href="#components"');
    expect(source).toContain('Browse components');
    expect(source).toContain('href="#themes"');
    expect(source).toContain('href="#style-api"');
  });
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run:

```bash
pnpm -F ranui test:unit -- test/unit/demo-home.source.test.ts
```

Expected: FAIL because `demo-home.source.test.ts` exists but `demo/index.html` does not yet contain `Component Directory`, `Component notes`, `component-meta`, or the required `docs-*` anchors.

## Task 2: Polish Homepage Shell and Component Directory

**Files:**
- Modify: `packages/ranui/demo/index.html`
- Test: `packages/ranui/test/unit/demo-home.source.test.ts`

- [ ] **Step 1: Update hero CTAs and component section heading**

In `packages/ranui/demo/index.html`, change the hero CTA text:

```html
<a class="primary-action" href="#components">Browse components</a>
<a class="secondary-action" href="#themes">Open theme lab</a>
```

Change the component section heading:

```html
<h2>Component Directory</h2>
<p class="section-kicker">Live examples with same-page notes for imports, usage, and styling hooks.</p>
```

- [ ] **Step 2: Add card metadata and detail links**

For every `.component-card`, add an id, metadata row, and docs link. The pattern for Button is:

```html
<article class="component-card" id="component-button">
  <div class="component-card-head">
    <div>
      <h3>Button</h3>
      <p>Trigger actions with primary, warning, text, icon, and disabled states.</p>
    </div>
    <span class="component-meta">action</span>
  </div>
  <div class="demo-row">
    <r-button type="primary">Primary</r-button>
    <r-button type="warning">Warning</r-button>
    <r-button type="text">Text</r-button>
    <r-button disabled>Disabled</r-button>
    <r-button icon="home">Icon</r-button>
  </div>
  <a class="component-link" href="#docs-button">View notes</a>
</article>
```

Use these ids and metadata:

```text
button/action, icon/visual, input/form, select/form, checkbox/form, form/form,
progress/feedback, loading/feedback, skeleton/feedback, message/feedback,
tabs/navigation, popover/overlay, modal/overlay,
image/media, colorpicker/input, math/content, radar/chart, scratch/advanced
```

- [ ] **Step 3: Add CSS for a more polished directory**

Add these rules near the existing component-card styles:

```css
.section-kicker {
  margin: -8px 0 0;
  color: var(--muted);
}

.component-card-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.component-meta {
  flex: 0 0 auto;
  border: 1px solid color-mix(in srgb, var(--accent) 28%, var(--line));
  border-radius: 999px;
  padding: 3px 8px;
  color: var(--accent);
  background: color-mix(in srgb, var(--accent) 8%, var(--surface));
  font-size: 11px;
  font-weight: 800;
  line-height: 1.2;
  text-transform: uppercase;
}

.component-link {
  align-self: start;
  color: var(--accent);
  font-size: 13px;
  font-weight: 800;
  text-decoration: none;
}

.component-link:hover {
  text-decoration: underline;
}
```

- [ ] **Step 4: Run the source contract test**

Run:

```bash
pnpm -F ranui test:unit -- test/unit/demo-home.source.test.ts
```

Expected: still FAIL because detail blocks have not been added yet.

## Task 3: Add Same-Page Component Notes

**Files:**
- Modify: `packages/ranui/demo/index.html`
- Test: `packages/ranui/test/unit/demo-home.source.test.ts`

- [ ] **Step 1: Add component docs section after the gallery groups**

After the last gallery group and before `#code`, add:

```html
<section class="content-section component-docs" aria-labelledby="component-notes-title">
  <div class="section-header">
    <h2 id="component-notes-title">Component notes</h2>
    <p>Quick import paths and usage reminders for the controls shown above.</p>
  </div>
  <div class="docs-grid">
    <!-- component detail cards go here -->
  </div>
</section>
```

- [ ] **Step 2: Add detail cards for all gallery components**

Use this exact pattern for each component:

```html
<article class="docs-card" id="docs-button">
  <div class="docs-card-head">
    <h3>Button</h3>
    <a href="#component-button">Back to demo</a>
  </div>
  <p>Use buttons for direct commands and compact tool actions.</p>
  <code>import 'ranui/button';</code>
  <pre><code>&lt;r-button type="primary"&gt;Save&lt;/r-button&gt;</code></pre>
  <ul>
    <li>Supports primary, warning, text, disabled, and icon states.</li>
    <li>Theme packs style the same element through CSS variables.</li>
  </ul>
</article>
```

Add cards with these ids and import paths:

```text
docs-button/import 'ranui/button';
docs-icon/import 'ranui/icon';
docs-input/import 'ranui/input';
docs-select/import 'ranui/select';
docs-checkbox/import 'ranui/checkbox';
docs-form/import 'ranui/form';
docs-progress/import 'ranui/progress';
docs-loading/import 'ranui/loading';
docs-skeleton/import 'ranui/skeleton';
docs-message/import 'ranui/message';
docs-tabs/import 'ranui/tab';
docs-popover/import 'ranui/popover';
docs-modal/import 'ranui/modal';
docs-image/import 'ranui/image';
docs-colorpicker/import 'ranui/colorpicker';
docs-math/import 'ranui/math';
docs-radar/import 'ranui/radar';
docs-scratch/import 'ranui/scratch';
```

- [ ] **Step 3: Add docs layout CSS**

Add these rules near the code/style section styles:

```css
.component-docs {
  scroll-margin-top: 96px;
}

.docs-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.docs-card {
  display: grid;
  align-content: start;
  gap: 12px;
  min-width: 0;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface-2);
  padding: 16px;
  scroll-margin-top: 112px;
}

.docs-card-head {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 12px;
}

.docs-card h3,
.docs-card p,
.docs-card ul {
  margin: 0;
}

.docs-card a {
  color: var(--accent);
  font-size: 13px;
  font-weight: 800;
  text-decoration: none;
}

.docs-card code {
  overflow-x: auto;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: var(--surface);
  padding: 8px 10px;
  color: var(--ink);
  font-family: "SF Mono", "Cascadia Code", ui-monospace, monospace;
  font-size: 12px;
}

.docs-card pre {
  margin: 0;
  overflow-x: auto;
}

.docs-card ul {
  padding-left: 18px;
  color: var(--muted);
  font-size: 13px;
}
```

In the `@media (max-width: 620px)` block, include:

```css
.docs-grid {
  grid-template-columns: 1fr;
}
```

- [ ] **Step 4: Run the source contract test**

Run:

```bash
pnpm -F ranui test:unit -- test/unit/demo-home.source.test.ts
```

Expected: PASS.

## Task 4: Verify Type Safety, Build, and Visual Behavior

**Files:**
- Verify: `packages/ranui/demo/index.html`
- Verify: `packages/ranui/test/unit/demo-home.source.test.ts`

- [ ] **Step 1: Run type check**

Run:

```bash
pnpm -F ranui tsc
```

Expected: exit 0.

- [ ] **Step 2: Run focused homepage/source tests**

Run:

```bash
pnpm -F ranui test:unit -- test/unit/demo-home.source.test.ts test/unit/theme-packs.source.test.ts
```

Expected: exit 0.

- [ ] **Step 3: Run production build**

Run:

```bash
pnpm -F ranui build
```

Expected: exit 0 with Vite output for CSS and JS bundles.

- [ ] **Step 4: Run local visual verification**

Run:

```bash
cd packages/ranui
pnpm exec vite --host 127.0.0.1 --port 5175
```

Open:

```text
http://127.0.0.1:5175/demo/
http://127.0.0.1:5175/demo/#components
http://127.0.0.1:5175/demo/#docs-button
```

Expected:

- Desktop and mobile widths show no overlapping nav, hero, card, or docs text.
- `#components` lands on the component directory.
- `#docs-button` lands below the sticky nav with the details visible.
- Theme mode and theme-pack controls still update active states and document attributes.
- Existing modal, message, and scratch interactions remain usable.
