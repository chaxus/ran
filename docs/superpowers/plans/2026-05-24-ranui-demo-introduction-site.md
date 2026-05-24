# ranui Demo Introduction Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `packages/ranui/demo/index.html` as a product-grade ranui introduction site while preserving the real component demos and theme switching behavior.

**Architecture:** Keep the current single-file Vite demo structure and existing `packages/ranui/demo/index.ts` registration flow. Replace the HTML/CSS/inline control script in `index.html` with a structured landing page: sticky navigation, hero, live component preview, feature sections, theme lab, grouped component gallery, code examples, and style API section.

**Tech Stack:** Vite, TypeScript entrypoint already imported by the page, native HTML/CSS, ranui Web Components, existing theme utilities and theme-pack document attributes.

---

## File Structure

- Modify: `packages/ranui/demo/index.html`
  - Owns all page structure, styles, responsive layout, theme controls, and demo markup.
  - Keep the `<script type="module" src="./index.ts"></script>` entrypoint unchanged.
  - Keep the inline script responsible for light/dark and theme-pack controls, updating `document.documentElement` attributes.
- Do not modify: `packages/ranui/demo/index.ts`
  - Existing icon registration, theme initialization, theme-pack imports, and component bootstrap stay intact.
- Do not modify component source files.

## Task 1: Replace Page Shell and Visual System

**Files:**
- Modify: `packages/ranui/demo/index.html`

- [ ] **Step 1: Snapshot current demo shell**

Run:

```bash
git diff -- packages/ranui/demo/index.html
```

Expected: either no output or only intentional local changes already understood before editing.

- [ ] **Step 2: Replace the top-level document title, base tokens, and sticky navigation**

In `packages/ranui/demo/index.html`, keep the existing module script:

```html
<script type="module" src="./index.ts"></script>
```

Set the title to:

```html
<title>ranui — Web Components UI Library</title>
```

Use these base navigation anchors:

```html
<a href="#why">Why ranui</a>
<a href="#themes">Theme Lab</a>
<a href="#components">Components</a>
<a href="#code">Code</a>
<a href="#style-api">Style API</a>
```

Keep controls with the existing data attributes:

```html
<button class="seg-btn active" data-theme="">Light</button>
<button class="seg-btn" data-theme="dark">Dark</button>
<button class="pack-chip active" data-pack="">Default</button>
<button class="pack-chip" data-pack="pixel-retro">Pixel</button>
<button class="pack-chip" data-pack="windows-98">Win 98</button>
<button class="pack-chip" data-pack="windows-xp">Win XP</button>
<button class="pack-chip" data-pack="system-6">System 6</button>
<button class="pack-chip" data-pack="wired">Wired</button>
<button class="pack-chip" data-pack="paper">Paper</button>
<button class="pack-chip" data-pack="neo-brutalism">Neo</button>
```

- [ ] **Step 3: Use a restrained product palette**

Define CSS variables for:

```css
:root {
  --page: #f6f8fb;
  --surface: #ffffff;
  --surface-2: #eef3f8;
  --ink: #0f172a;
  --muted: #607086;
  --line: #d8e1ec;
  --accent: #2563eb;
  --accent-2: #0f766e;
  --warn: #f59e0b;
  --shadow: 0 18px 50px rgba(15, 23, 42, 0.12);
}
```

Add dark-mode overrides on `:root[data-ran-theme='dark']` and theme-pack overrides only where needed for page chrome. Do not add decorative blob pseudo-elements.

- [ ] **Step 4: Verify shell visually**

Run the dev server:

```bash
pnpm --filter ranui dev
```

Expected: Vite prints a localhost URL and the page loads without syntax errors.

## Task 2: Build Hero, Live Preview, and Product Messaging

**Files:**
- Modify: `packages/ranui/demo/index.html`

- [ ] **Step 1: Add the hero content**

Add a first-viewport hero with:

```html
<p class="eyebrow">Framework-neutral Web Components</p>
<h1>ranui builds native-feeling interfaces that travel across frameworks.</h1>
<p class="hero-copy">A TypeScript UI library built on custom elements, theme tokens, modular imports, and real browser standards.</p>
```

Include two primary actions:

```html
<a class="primary-action" href="#components">Explore components</a>
<a class="secondary-action" href="#code">Copy install path</a>
```

- [ ] **Step 2: Add install and import examples**

Use a compact code panel containing:

```html
<code>pnpm add ranui</code>
<code>import 'ranui';</code>
<code>import 'ranui/button';</code>
```

- [ ] **Step 3: Add a live component preview surface**

Use real ranui elements:

```html
<r-button type="primary">Deploy interface</r-button>
<r-input placeholder="Search components"></r-input>
<r-select placeholder="Theme pack">
  <r-option value="default">Default</r-option>
  <r-option value="paper">Paper</r-option>
  <r-option value="neo">Neo Brutalism</r-option>
</r-select>
<r-progress percent="72"></r-progress>
<r-checkbox checked>Typed custom elements</r-checkbox>
```

- [ ] **Step 4: Verify hero responsiveness**

Open the page at desktop width and mobile width. Expected: hero text, action buttons, preview surface, and code panel do not overlap.

## Task 3: Add Why, Theme Lab, Code Paths, and Style API Sections

**Files:**
- Modify: `packages/ranui/demo/index.html`

- [ ] **Step 1: Add `#why` feature section**

Add six concise feature cards:

```html
<h3>Cross-framework</h3>
<h3>Native custom elements</h3>
<h3>Modular imports</h3>
<h3>Typed with TypeScript</h3>
<h3>Token-based styling</h3>
<h3>SSR builder path</h3>
```

- [ ] **Step 2: Add `#themes` Theme Lab section**

Move the theme-pack controls into this section or mirror them here using the same `data-pack` values. Include a preview grid that names:

```text
Default, Dark, Pixel Retro, Windows 98, Windows XP, System 6, Wired, Paper, Neo Brutalism
```

- [ ] **Step 3: Add `#code` examples**

Create tabs or static panes for:

```html
<script src="./ranui/dist/umd/index.umd.cjs"></script>
<r-button type="primary">Button</r-button>
```

```js
import 'ranui';
```

```js
import 'ranui/button';
```

```jsx
import 'ranui';

export function App() {
  return <r-button type="primary">Save</r-button>;
}
```

- [ ] **Step 4: Add `#style-api` section**

Explain with short code blocks:

```css
:root {
  --ran-color-primary: #2563eb;
}

r-button::part(button) {
  border-radius: 6px;
}
```

- [ ] **Step 5: Verify anchors and theme controls**

Click each nav anchor and each theme or pack control. Expected: anchors scroll to the right section; selected buttons update active styling; document attributes change to `data-ran-theme` and `data-ran-theme-pack`.

## Task 4: Rebuild the Component Gallery Without Losing Demos

**Files:**
- Modify: `packages/ranui/demo/index.html`

- [ ] **Step 1: Create grouped gallery containers**

Use four groups:

```html
<section id="components" class="site-section">
  <h2>Component Gallery</h2>
  <div class="gallery-group" data-group="Actions and inputs"></div>
  <div class="gallery-group" data-group="Feedback"></div>
  <div class="gallery-group" data-group="Navigation and overlays"></div>
  <div class="gallery-group" data-group="Media and advanced"></div>
</section>
```

- [ ] **Step 2: Preserve these demos**

Move or recreate all current examples:

```text
r-button, r-icon, r-img, r-input, r-select, r-option, r-checkbox,
r-progress, r-loading, r-skeleton, r-message, r-tabs, r-tab,
r-popover, r-content, r-colorpicker, r-math, r-radar, r-form,
r-scratch, r-modal, r-player, Declarative Shadow DOM r-button
```

- [ ] **Step 3: Keep existing interactive triggers**

Keep buttons that call:

```html
onclick="window.message?.success('Saved with ranui')"
onclick="document.querySelector('#demo-modal')?.open?.()"
onclick="document.querySelector('#demo-scratch')?.open?.()"
```

If existing method names differ, inspect the current markup and preserve the working call pattern.

- [ ] **Step 4: Verify component coverage**

Run:

```bash
rg -o "<r-[a-z-]+" packages/ranui/demo/index.html | sort -u
```

Expected: output includes every component listed in Step 2.

## Task 5: Final Browser Verification and Cleanup

**Files:**
- Modify: `packages/ranui/demo/index.html`

- [ ] **Step 1: Run formatter or existing quality command if available**

Run:

```bash
pnpm --filter ranui exec prettier --check demo/index.html
```

Expected: PASS, or if Prettier is not configured for this file, record the exact reason and continue with manual formatting.

- [ ] **Step 2: Run browser verification**

Open the Vite URL in the browser and check:

```text
desktop 1440px wide
mobile 390px wide
light mode
dark mode
at least two theme packs
message trigger
modal trigger
component gallery anchors
```

Expected: no blank page, no obvious overlap, and interactive demos work.

- [ ] **Step 3: Inspect final diff**

Run:

```bash
git diff -- packages/ranui/demo/index.html
```

Expected: diff only changes the demo site markup, styles, and inline page controls.

- [ ] **Step 4: Commit implementation**

Run:

```bash
git add packages/ranui/demo/index.html
git commit -m "feat(ranui): redesign demo introduction site"
```

Expected: commit succeeds.

## Self-Review

- Spec coverage: Tasks cover the page shell, hero, Why ranui, Theme Lab, Component Gallery, Code Paths, Style API, responsiveness, and interactive verification.
- Placeholder scan: The plan has no TBD/TODO placeholders.
- Scope check: The plan stays inside `packages/ranui/demo/index.html` and does not change component implementations or introduce dependencies.
