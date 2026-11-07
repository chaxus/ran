# Examples acceptance — 2026-11-07

Browser captures for the `/examples/` compositions and the linked **Build AI chat** guide,
after the Temml copy fix and public-path markdown link sweep. Chromium via Playwright against
a local production `dist/` preview. This is agent visual review, not Document acceptance.

## Matrix

| Path | Themes | Widths | Files |
| ---- | ------ | ------ | ----- |
| `/examples/` | light, dark | 1280, 360 | `examples-{theme}-w{width}.png` |
| `/examples/chat-composer/` | light, dark | 1280, 360 | `examples-chat-composer-…` |
| `/examples/overlay-form/` | light, dark | 1280, 360 | `examples-overlay-form-…` |
| `/examples/content-render/` | light, dark | 1280, 360 | `examples-content-render-…` |
| `/ranui/ai-chat/` | light, dark | 1280, 360 | `ranui-ai-chat-…` |

All captures used `prefers-reduced-motion: reduce`. Raw observations (status, scroll width,
first Tab target, overlay keyboard) are in `observations.json`.

## Findings

- **Layout.** No horizontal overflow at 1280 or 360 (`scrollWidth === viewport`) on any page
  in the matrix.
- **Light / dark.** Theme chrome and demo surfaces remain readable; content-render shows
  mermaid + Temml math in both schemes.
- **Keyboard.** Wide viewports: first Tab lands on a header link (`a`). Narrow: first Tab
  lands on the drawer control label. Overlay form: Enter on **Edit settings** opens the
  modal (`dialogAfter: 1`); Escape dismisses it (`dialogEscaped: 0`). See
  `overlay-form-keyboard-activate-light-w1280.png`.
- **Reduced motion.** Captures were taken with motion reduced; no entrance animation was
  required for these pages to be usable. Continuous normal-vs-reduced recording was not
  repeated here — site-wide motion evidence remains in
  [2026-10-23-product-site](../2026-10-23-product-site/README.md).

## Production build (same day)

`pnpm -F docs build` → **1356** pages; link/anchor/canonical/asset/sitemap verify passed;
every retired `/src/…` URL still one-hop redirects.

| Artifact | Size |
| -------- | ---- |
| `dist/` | 124 MB |
| `dist/search/*.json` (8 locales) | **9.7 MB** total (en 0.92 MB … ja 1.68 MB) |
| Search documents (en) | 2118 stored fields; API routes keep titles, bodies trimmed |

Residual note: `dist/assets/` still emits some Shiki grammar chunks beyond the
`r-markdown` allowlist / docs `LANGS` list (e.g. `emacs-lisp`, `wolfram`, `cpp`), likely
transitive; media/PDF engines remain the dominant weight. KaTeX and Temml chunks both ship
(~252 KB / ~199 KB). Follow-up only if a later size budget needs them.
