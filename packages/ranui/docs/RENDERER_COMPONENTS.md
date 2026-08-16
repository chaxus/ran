# Renderer Components — Design Guide (`r-mermaid`, `r-math`, future `r-*`)

Some ranui components are **async external-library renderers**: they lazy-load a large
third-party library and render its output into the shadow root. Today that's
`r-mermaid` (mermaid) and `r-math` (**Temml → native MathML**); the same shape fits a
future `r-code` (shiki), `r-chart`, etc.

This file is the **canonical evaluation** for these components so the analysis isn't
redone each time — including how they should be enriched (fullscreen / zoom / copy /
download, à la Vercel [Streamdown](https://streamdown.ai/docs/plugins/mermaid)) while
staying consistent with ranui's existing systems. All ranui-mechanism claims below are
grounded in the conventions codified in `CLAUDE.md` and the component sources.

---

## 1. The shared "async external-lib renderer" pattern

Every renderer component should share this skeleton (r-mermaid already does; r-math
predates it and should be brought in line):

1. **Lazy, on-demand dependency.** The heavy lib is a normal `dependency` (so it
   auto-installs with ranui — no peerDependency gap; yarn classic never auto-installs
   peers) but is only ever reached via a **dynamic `import()` inside `render()`**. Result:
   apps that never use the component don't bundle the lib; it arrives as an async chunk on
   first render. Verified for r-mermaid: `dist/mermaid.js` is a 91-byte stub, the lib is a
   separate `mermaid.core-*.js` chunk, and the full `index.js` has zero static mermaid
   imports.
2. **Source from either an attribute or text content.** Priority: a URI-encoded attribute
   (`code` for mermaid, `latex` for math) so multiline / `<|--` / `$$` survive HTML
   parsing; else `this.textContent.trim()` for hand-authoring. Both r-mermaid and r-math
   do this.
3. **Render into an `ensureShadowElement` container**, never light DOM. Note: mermaid
   returns a statically-sized SVG and Temml returns a self-contained MathML string that the
   browser lays out natively — so placing the result into a (closed) shadow root is safe.
4. **Errors go to the DOM, not the console.** Render an `::part(error)` box with the
   message and dispatch an `error` CustomEvent (`{ detail: { message } }`,
   `bubbles+composed`). Both components do this (r-math's old console-only `catch` was the
   anti-pattern — now fixed).
5. **Theme-aware.** A `theme` attribute (`auto | light | dark`); `auto` follows the page
   (`<html class="dark">` and `[data-ran-theme="dark"]`) and re-renders on change via a
   `MutationObserver` on `documentElement` (`class`, `data-ran-theme`). Disconnect it in
   `disconnectedCallback`.
6. **Standard shadow/sheet wiring** — the rigid 4-piece contract (`'sheet'` in
   `observedAttributes`; getter/setter; `handlerExternalCss`; called in
   `connectedCallback` + on `attributeChangedCallback` for `sheet`), plus `defineSSR` for
   registration and `EventManager` for all lifecycle listeners.

---

## 2. `r-mermaid`

### 2.1 Current (shipped — enriched)

Full renderer + interactive viewer. Everything below the base render is **opt-in**:

- **Source**: `code` attribute (URI-encoded) **or** text content.
- **Theme**: `theme=auto|light|dark`; `auto` follows `.dark`/`[data-ran-theme]` via
  `MutationObserver` (disconnected on unmount).
- **Controls (opt-in boolean attrs)**: `copy` (copy source → clipboard, with a check-mark
  confirmation), `download` (SVG / PNG / source `.mmd` — a single format downloads
  directly, multiple show a menu; restrict with `download="svg png"`), `fullscreen` (opens
  an **`r-modal`** lightbox — titled "Diagram" — with **pan/zoom**: wheel-zoom,
  pointer-drag pan, zoom-in/out/reset controls). A bare `<r-mermaid>` renders a clean
  static diagram — the hover toolbar only appears when a control attr is set
  (`.has-controls`).
- **Error** → `::part(error)` box + `error` CustomEvent (no more console-only).
- **Parts**: `mermaid`, `diagram`, `toolbar`, `button`, `error`.
- **Events** (all `bubbles+composed`): `render` `{ok}`, `copied` `{kind}`, `download`
  `{format}`, `error` `{message}`, `fullscreenchange` `{open}`.
- **i18n**: `label-copy` / `label-download` / `label-fullscreen` / `label-zoom-in` /
  `label-zoom-out` / `label-reset` (English fallbacks).
- **CSS vars**: `--ran-mermaid-{padding,toolbar-*,button-*,error-color}`.
- **Toolkit compliance**: `EventManager` for listeners, `<r-icon name="copy">` (the toolbar
  glyphs — copy/check/download/fullscreen/zoom-in/zoom-out/refresh — resolve through
  `r-icon`'s own name-driven lazy loading of `assets/icons/*.svg`; no per-component
  registration, one async fetch on first use), `defineSSR`, shadow/sheet 4-piece.
- On a render failure mermaid appends a "bomb" error graphic to `<body>`; the component
  removes that leak (`#d{id}`/`#{id}`) so only the `::part(error)` box shows.
- **Fullscreen uses r-modal's `hide-header` attribute** (added for this): no title bar, a
  floating close button (top-right), close via button / mask / ESC; the dialog keeps an
  a11y name via `aria-label` from `title`. This is the industry lightbox pattern
  (PhotoSwipe / MUI Dialog / Ant Image preview).
- **Toolbar icons are outline glyphs.** ranui's builtins are _filled_ 1024-grid icons and
  `r-icon`'s `setColor` forces inline `fill: currentColor` on the `<svg>` root — which
  flood-fills an outline icon. So the toolbar action SVGs (`assets/icons/copy.svg` etc.) wrap
  their shapes in `<g fill="none">`, which that inline style doesn't reach. Author any
  future stroke icon the same way.
- **Browser-verified** (2026-07-19, chrome-devtools): render (flowchart + classDiagram),
  error→part+event with no leak, toolbar copy/download-menu/fullscreen, fullscreen r-modal
  (headerless + floating close, open→close lifecycle clean), pan/zoom; events
  render/copied/download/error/fullscreenchange all fire; outline icons confirmed.
- **Lazy**: `import('mermaid')` and `import('@/components/modal')` are both dynamic — the
  mermaid lib _and_ r-modal are async chunks (modal only fetched when fullscreen opens);
  verified `dist/mermaid.js` = 91-byte stub, `index.js` has 0 static mermaid imports.

### 2.2 Gap vs Streamdown's mermaid

| Streamdown control  | Behavior                                                    | Worth adding to ranui?             |
| ------------------- | ----------------------------------------------------------- | ---------------------------------- |
| **fullscreen**      | button (top-right, on hover) → modal overlay for inspection | ✅ high value for complex diagrams |
| **download**        | export **SVG** (Streamdown ships SVG only)                  | ✅ SVG easy; PNG/source as extras  |
| **copy**            | copy the rendered diagram to clipboard                      | ✅ copy **source** and/or SVG      |
| **panZoom**         | opt-in; zoom in/out + pan for large diagrams                | ✅ but opt-in / fullscreen-only    |
| **error component** | message + code + retry callback                             | ✅ becomes `::part(error)` + retry |
| **theme variants**  | default/dark/forest/neutral/base + `themeVariables`         | 🟡 pass-through optional           |
| controls default    | all on, individually disableable                            | ranui: **opt-in** (see below)      |

### 2.3 Enrichment design — mapped to ranui mechanisms

- **Controls opt-in, not default-on.** Inline docs diagrams shouldn't all grow a toolbar.
  Expose boolean attributes `copy` / `download` / `fullscreen` / `pan-zoom` (via
  `setBooleanAttribute`), or a single `controls="copy download fullscreen"`. Default =
  no toolbar. This inverts Streamdown's default-all-on, matching ranui's minimal-by-default
  ethos.
- **Toolbar** = a hover-revealed control bar (reuse `r-player`'s auto-hide idiom:
  opacity 0 → 1 on hover). Build icon buttons the **modern** way — `<r-icon name="…">`
  - `registerIcon(...)` in this module (the pattern `r-player` itself now uses throughout —
    see `docs/PLAYER_ROADMAP.md` §1.4). Expose `::part(toolbar)` and `::part(button)`.
- **Fullscreen** = reuse **`r-modal`** as the overlay (it already gives dialog/mask,
  focus-trap, ESC-close, body-scroll-lock, z-index stacking) rather than reinventing.
  Streamdown's "modal overlay with dark background" maps 1:1. (For a _true_ browser
  fullscreen instead, the only reusable helper is `components/player/core/fullscreen.ts`'s
  `requestElementFullscreen`/`exitDocumentFullscreen` — pure, prefix-handling functions.)
  Recommendation: **r-modal overlay** + enable pan/zoom inside it.
- **Copy** = `navigator.clipboard.writeText(source)` (offer SVG copy too); dispatch
  `copied` (`{ detail: { kind: 'source' | 'svg' } }`, bubbles+composed); localize the
  button via `label-copy`. No existing component does clipboard — this introduces the
  pattern (keep it tiny and reusable).
- **Download** = serialize the shadow `<svg>` → `Blob` → object-URL `<a download>`; PNG via
  canvas rasterization; source as `.mmd`. Start with **SVG** (parity with Streamdown), add
  PNG/source later. `label-download`.
- **Pan / Zoom** = there's no zoom-pan sibling to copy, so follow the `r-colorpicker` /
  `r-player` pointer-drag idiom (`range()` clamp + `getBoundingClientRect()` +
  percentage) for **pan (translate)**, and add a `wheel` handler + `transform: scale()`
  for **zoom**, on a `.ran-mermaid-diagram` wrapper; clamp scale; provide a reset. Opt-in
  via `pan-zoom`, always active inside fullscreen.
- **Error + retry** = `::part(error)` box (message) + a retry `<r-icon>` button; dispatch
  `error` (`{ detail: { message } }`). Replaces the current console-only warning.
- **Theme** = keep `theme=auto|light|dark`; optionally accept raw mermaid theme names
  (`forest|neutral|base`) as a pass-through.
- **CSS variables** = `--ran-mermaid-padding`, `--ran-mermaid-toolbar-background`,
  `--ran-mermaid-button-size`, `--ran-mermaid-button-color`, `--ran-mermaid-error-color`,
  `--ran-mermaid-z-index` (for the fullscreen host) — each with the standard 3-level
  fallback (`--ran-mermaid-* → --ran-color-*/semantic → literal`).
- **Events** = `render` (`{ ok }`), `copied`, `error`, `fullscreenchange` — all
  `bubbles+composed` since consumers observe from outside the shadow boundary.
- **i18n** = per-attribute overrides `label-copy` / `label-download` / `label-fullscreen`
  / `label-zoom-in` / `label-zoom-out` / `label-reset` with English fallbacks, synced in
  `attributeChangedCallback` (the `r-theme-switch` `label-*` pattern). Do **not** wire the
  `ranui/i18n` singleton — no component does, and it's an opt-in separate subpath.

### 2.4 Roadmap (status)

- **P0 — done:** error → `::part(error)` + `error` event; `EventManager`; `::part`s.
- **P1 — done:** hover toolbar with **copy (source)** + **download (SVG)** + **fullscreen
  via r-modal**.
- **P2 — done**: pan/zoom (fullscreen: wheel-zoom, drag-pan, reset), download **PNG**
  (canvas rasterize, theme-aware bg; foreignObject/HTML-label diagrams may fail → `error`
  event) + **source** (`.mmd`), multi-format menu. **Still open (optional):** inline
  `pan-zoom` attr (pan/zoom is fullscreen-only today); raw mermaid theme-name pass-through
  (`forest|neutral|base`).

Every control is opt-in; a bare `<r-mermaid>` stays a clean static diagram.

---

## 3. `r-math`

### 3.1 Current (shipped — Temml → native MathML)

**Rendering backend = [Temml](https://temml.org)**, not KaTeX. Temml compiles LaTeX to
**native MathML** which the browser lays out itself — the deliberate "industry best
practice" choice for a lightweight, SSR-friendly component library:

- **Proper dependency, lazy chunk.** `temml` is a normal `dependency` reached via dynamic
  `import('temml')` → a ~277 KB lazy chunk. This replaced a **612 KB vendored JS blob**
  (`assets/js/katex/*`, unversioned, committed to git) that additionally needed ~20 KaTeX
  web font files. Verified: `dist/math.js` is an 80-byte stub and the barrel `index.js` has
  0 static temml/font imports.
- **Bundled math font for cross-browser consistency.** MathML's appearance otherwise
  depends on whatever math font the reader's OS ships (Cambria Math on Windows, nothing
  reliable on many macOS/Linux setups). So the component **bundles Latin Modern Math**
  (Computer-Modern / LaTeX look — GUST/LPPL) plus the small `Temml.woff2` script/prime face
  (MIT), both **inlined as `?inline` data-URIs**, **dynamically imported** (own lazy chunk —
  never eager in the barrel) and registered **once at the document level** via
  `ensureMathFonts()`. Chromium ignores `@font-face` declared _inside_ a shadow root, so
  document-level injection is the portable workaround; the family names are only referenced
  by `<r-math>`'s own MathML, so nothing leaks. System math fonts stay in the `font-family`
  stack as fallbacks. Provenance/licenses: `assets/fonts/LICENSE.md`. Cost: the lazy `math`
  font chunk is ~518 KB — fetched only when `<r-math>` actually renders.
- **Theme is automatic — no `MutationObserver`, no re-render.** MathML inherits `color` via
  `currentColor`; `:host` sets `color: var(--ran-color-text)`, so light/dark flips in the
  same paint with no JS. (This is why r-math, unlike r-mermaid, needs no `theme` attr or
  observer — mermaid bakes colors into its SVG and must re-render; MathML doesn't.)
- **Self-contained CSS.** Temml's MathML stylesheet is vendored trimmed into
  `components/math/temml.css` (upstream `Temml-Local.css` minus the `@font-face` rules —
  injected at the document level instead — and with `body`→`:host` for the equation-number
  counter reset), injected into the shadow root alongside `index.less?inline`. The
  `font-family` stack leads with `'Latin Modern Math'`.

Feature set:

- **Source**: URI-encoded `latex` attribute **or** `this.textContent.trim()` (both, like
  r-mermaid's `code`). Getter `decodeURIComponent`s with a raw-string fallback so
  hand-authored attributes still work; setter `encodeURIComponent`s.
- **Inline vs block**: `display="inline|block"` (default `block`) → Temml `displayMode`.
- **Accessibility**: `annotate: true` embeds `<annotation encoding="application/x-tex">`
  (source is copyable + available to AT); native `<math>` already carries the math role.
- **Errors → DOM**: bad LaTeX (`throwOnError: true` + `catch`) renders an `::part(error)`
  `<pre>` box + dispatches an `error` CustomEvent `{ detail: { message } }`
  (`bubbles+composed`). No more console-only swallow.
- **Copy (opt-in)**: `copy` boolean attr → a hover-revealed top-right toolbar button that
  copies the **LaTeX source** to the clipboard (icon flips to a check-mark for 1.2 s),
  dispatches `copied` `{ kind }`, localizable via `label-copy`. `copy="mathml"` copies the
  rendered **MathML markup** instead (`kind: 'mathml'`) — Temml emits no SVG, so MathML is
  the portable/vector form. Mirrors r-mermaid: `<r-icon name="copy">` (core glyph,
  auto-registered by `@/components/icon`), `EventManager`, `.has-controls` gate. A bare
  `<r-math>` has no toolbar.
- **Download (opt-in)**: `download` attr → export **source `.tex`** (`application/x-tex`)
  and/or **MathML `.mml`** (`application/mathml+xml`). Bare `download` offers both via a
  small menu (like r-mermaid's format menu); `download="mathml"` / `download="source"`
  download that one directly. Dispatches `download` `{ format }`, `label-download` /
  `label-download-source` / `label-download-mathml`. **No SVG/PNG raster export**: MathML
  can only rasterize via an SVG `<foreignObject>`, which _always_ taints the canvas →
  `toBlob` throws (r-mermaid hits this only for HTML-label diagrams; r-math would hit it for
  every formula). Raster/SVG image output would need a different backend (MathJax-SVG); out
  of scope for the native-MathML approach.
- **Bundled-font opt-out**: `font="system"` skips `ensureMathFonts()` and falls through to
  the system-font stack in `temml.css` — trades cross-browser consistency back for ~518 KB.
- **Temml pass-through**: `macros='{"\\RR":"\\mathbb{R}"}'` (JSON, invalid JSON ignored) →
  Temml `macros`; `wrap="none|tex|="` → Temml soft line-breaking (invalid values dropped).
- **Events**: `render` `{ ok: true }`, `error` `{ message }`, `copied` `{ kind }`,
  `download` `{ format }` (all `bubbles+composed`).
- **Parts**: `::part(math)` (wrap), `::part(render)` (MathML target), `::part(error)`,
  `::part(toolbar)`, `::part(button)`, `::part(menu)`.
- **CSS vars**: `--ran-math-{display,inline-display,color,align,position}`,
  `--ran-math-error-{color,background,padding}`,
  `--ran-math-toolbar-{top,right,gap,background,shadow}`,
  `--ran-math-button-{size,color,hover-background,hover-color,focus-outline}`,
  `--ran-math-menu-{top,item-color}` — each dark-safe (fallbacks point at flipping tokens).

**Trade-off accepted (documented):** the bundled Latin Modern face makes glyphs identical
across browsers, but MathML _layout_ is still the browser's own — so old Safari's spacing
of a few constructs is marginally less refined than KaTeX's hand-tuned HTML boxes. This is
inherent to native MathML and affects spacing only, not glyphs. The cost of the guarantee
is the ~518 KB lazy font chunk; a consumer who wants to trade consistency back for bytes
sets **`font="system"`**, which skips `ensureMathFonts()` and falls through to the
system-font stack already present in `temml.css`.

### 3.2 Not yet done (optional)

- **Raster/SVG image export** — deliberately **not** implemented (see the download bullet:
  MathML→canvas always taints). Would require a MathJax-SVG rendering path; only worth it if
  a consumer specifically needs a PNG of a formula.
- **Raw Temml theme/trust options** (`errorColor`, `trust`, `colorIsTextColor`) as
  attributes if needed.

### 3.3 Shared with r-mermaid (and r-markdown)

Both are §1 renderers, and **`r-markdown`** (`components/markdown/`) is the third: it
lazy-loads marked + DOMPurify + remend as one chunk (`render.ts`), shiki as another
(`highlight.ts`, opt-in via `highlight`), and _composes_ the other two — closed
` ```mermaid ` fences become `<r-mermaid>`, `$$…$$` / `\(…\)` become `<r-math>`,
each registered on demand via `import('@/components/…')` from the render chunk. Its
streaming model (remend → block split → per-block DOM diff) is described in the module
headers of `blocks.ts` / `render.ts` / `index.ts`. With three renderers in place, factoring
the common bits (source resolution: attr-or-textContent; error-to-`::part(error)`+event;
lazy-import guard) into a small `utils/renderer.ts` helper is now the documented next
refactor — not done yet, to keep the r-markdown change scoped. Note the theme axis differs (mermaid re-renders via a
MutationObserver; math rides `currentColor` for free), so the theme step stays
per-component. For now, keep them parallel and consistent by copying this checklist.

---

## 4. Consistency checklist for any renderer component

- [ ] Heavy lib is a **regular `dependency`**, reached only via dynamic `import()` in
      `render()` (lazy async chunk; nothing eager in `index.js`).
- [ ] Source = URI-encoded attribute **or** `textContent`.
- [ ] Renders into `ensureShadowElement` container (closed shadow root via
      `ensureShadowRoot`).
- [ ] Errors → `::part(error)` + `error` CustomEvent (`bubbles+composed`), never
      console-only.
- [ ] `theme=auto|light|dark`, `auto` follows `.dark` / `[data-ran-theme]` via
      MutationObserver, disconnected on unmount.
- [ ] Shadow/sheet 4-piece contract + `defineSSR` + `EventManager` for all listeners.
- [ ] `::part()` names are short & semantic; CSS vars are `--ran-{comp}-{path}` with the
      3-level fallback chain.
- [ ] Localizable strings via `label-*` attribute overrides (English fallbacks), not the
      i18n singleton.
- [ ] Internal chrome icons via `<r-icon>` + `registerIcon(...)` in-module.
- [ ] Interactive controls are **opt-in**; the bare element renders a clean static result.
- [ ] Entry added to `vite.config.ts` `componentEntries`, `./{name}` export in
      `package.json`, and the four touchpoints in root `index.ts` (export / side-effect
      import / type import / `HTMLElementTagNameMap`).
