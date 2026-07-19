# Renderer Components — Design Guide (`r-mermaid`, `r-math`, future `r-*`)

Some ranui components are **async external-library renderers**: they lazy-load a large
third-party library and render its output into the shadow root. Today that's
`r-mermaid` (mermaid) and `r-math` (KaTeX); the same shape fits a future `r-code`
(shiki), `r-chart`, etc.

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
   parsing; else `this.textContent.trim()` for hand-authoring. r-mermaid does both; r-math
   only supports the encoded attribute today.
3. **Render into an `ensureShadowElement` container**, never light DOM. Note: mermaid and
   KaTeX both measure text against a temporary element *they* create, then return a static
   sized output — so placing the result into a (closed) shadow root is safe.
4. **Errors go to the DOM, not the console.** Render an `::part(error)` box with the
   message and dispatch an `error` CustomEvent (`{ detail: { message } }`,
   `bubbles+composed`). r-math's current console-only `catch` is the anti-pattern to fix.
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
  glyphs — copy/check/download/fullscreen/zoom-in/zoom-out/refresh — are **core action
  icons auto-registered by r-icon**, see `components/icon/core-icons.ts`; no per-component
  registration), `defineSSR`, shadow/sheet 4-piece.
- On a render failure mermaid appends a "bomb" error graphic to `<body>`; the component
  removes that leak (`#d{id}`/`#{id}`) so only the `::part(error)` box shows.
- **Fullscreen uses r-modal's `hide-header` attribute** (added for this): no title bar, a
  floating close button (top-right), close via button / mask / ESC; the dialog keeps an
  a11y name via `aria-label` from `title`. This is the industry lightbox pattern
  (PhotoSwipe / MUI Dialog / Ant Image preview).
- **Toolbar icons are outline glyphs.** ranui's builtins are *filled* 1024-grid icons and
  `r-icon`'s `setColor` forces inline `fill: currentColor` on the `<svg>` root — which
  flood-fills an outline icon. So the core action SVGs (`assets/icons/copy.svg` etc.) wrap
  their shapes in `<g fill="none">`, which that inline style doesn't reach. Author any
  future stroke icon the same way (see `components/icon/core-icons.ts`).
- **Browser-verified** (2026-07-19, chrome-devtools): render (flowchart + classDiagram),
  error→part+event with no leak, toolbar copy/download-menu/fullscreen, fullscreen r-modal
  (headerless + floating close, open→close lifecycle clean), pan/zoom; events
  render/copied/download/error/fullscreenchange all fire; outline icons confirmed.
- **Lazy**: `import('mermaid')` and `import('@/components/modal')` are both dynamic — the
  mermaid lib *and* r-modal are async chunks (modal only fetched when fullscreen opens);
  verified `dist/mermaid.js` = 91-byte stub, `index.js` has 0 static mermaid imports.

### 2.2 Gap vs Streamdown's mermaid
| Streamdown control | Behavior | Worth adding to ranui? |
|---|---|---|
| **fullscreen** | button (top-right, on hover) → modal overlay for inspection | ✅ high value for complex diagrams |
| **download** | export **SVG** (Streamdown ships SVG only) | ✅ SVG easy; PNG/source as extras |
| **copy** | copy the rendered diagram to clipboard | ✅ copy **source** and/or SVG |
| **panZoom** | opt-in; zoom in/out + pan for large diagrams | ✅ but opt-in / fullscreen-only |
| **error component** | message + code + retry callback | ✅ becomes `::part(error)` + retry |
| **theme variants** | default/dark/forest/neutral/base + `themeVariables` | 🟡 pass-through optional |
| controls default | all on, individually disableable | ranui: **opt-in** (see below) |

### 2.3 Enrichment design — mapped to ranui mechanisms
- **Controls opt-in, not default-on.** Inline docs diagrams shouldn't all grow a toolbar.
  Expose boolean attributes `copy` / `download` / `fullscreen` / `pan-zoom` (via
  `setBooleanAttribute`), or a single `controls="copy download fullscreen"`. Default =
  no toolbar. This inverts Streamdown's default-all-on, matching ranui's minimal-by-default
  ethos.
- **Toolbar** = a hover-revealed control bar (reuse `r-player`'s auto-hide idiom:
  opacity 0 → 1 on hover). Build icon buttons the **modern** way — `<r-icon name="…">`
  + `registerIcon(...)` in this module (NOT `r-player`'s legacy background-image icons).
  Expose `::part(toolbar)` and `::part(button)`.
- **Fullscreen** = reuse **`r-modal`** as the overlay (it already gives dialog/mask,
  focus-trap, ESC-close, body-scroll-lock, z-index stacking) rather than reinventing.
  Streamdown's "modal overlay with dark background" maps 1:1. (For a *true* browser
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

### 3.1 Current gaps (from source audit)
72-line renderer with real limitations:
- **Block-only** — always wraps in `$$…$$`; no inline mode.
- **Silent failure** — `catch` only `console.warn`s; no DOM error state, no event.
- **Source only via `latex` attribute** (URI-encoded); no text-content authoring.
- **No `::part()`s** — the `.ran-math` container isn't exposed (every other component is).
- **No theme tokens** — `index.less` has zero `--ran-color-*`; color is whatever KaTeX /
  inherited `color` gives; not dark-mode-safe by design.
- **Accessibility gap** — `index.less` hides KaTeX's `.katex-html` branch
  (`--ran-math-katex-display: none`), suppressing the more selectable/AT-friendly output.
- **Undocumented** — no `r-math` entry in the generated `docs/COMPONENTS.md`.

### 3.2 Improvement design (align with the §1 pattern)
- **Content source**: accept `this.textContent` **and** the encoded `latex` attribute
  (mirror r-mermaid's `code`).
- **Inline vs block**: add `display="inline|block"` — inline uses `$…$`, block uses
  `$$…$$` (default `block`).
- **Errors → DOM**: `::part(error)` box + `error` event; stop swallowing to console.
- **Accessibility**: don't suppress the MathML/HTML branch by default; expose
  `role="math"` + `aria-label` derived from the source so screen readers get the formula.
- **Copy (opt-in)**: `copy` attribute → copy the LaTeX source; `label-copy`; `copied`
  event. Shared with r-mermaid's clipboard helper.
- **Theme tokens**: `--ran-math-color`, `--ran-math-error-color`, dark-safe; `theme` attr
  parity if useful.
- **Parts**: `::part(math)`, `::part(error)`.
- **Docs**: add `r-math` to `docs/COMPONENTS.md` (regenerate).

### 3.3 Shared with r-mermaid
Both are §1 renderers. **Don't** pre-extract a shared base for just two — but once a
third arrives (`r-code` with shiki), factor the common bits (source resolution:
attr-or-textContent; error-to-`::part(error)`+event; theme MutationObserver; lazy-import
guard) into a small `utils/renderer.ts` mixin/helper. For now, keep them parallel and
consistent by copying this checklist.

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
