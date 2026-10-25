# Browser layout acceptance example

This is a host composition example and test-only measurement utility, not a ranui API or a
set of required product dimensions. The normative owner is [DESIGN §9](../../docs/DESIGN.md#alignment-is-structure-not-polish).

From the repository root:

```sh
pnpm install --frozen-lockfile
pnpm -F ranuts build
pnpm -F ranui exec playwright install chromium firefox webkit
pnpm -F ranui exec playwright test layout-contract.spec.ts --project=chromium --project=firefox --project=webkit --project="Mobile Chrome"
```

The existing Playwright configuration starts the ranui dev server. Keep its configured port free,
so a previously running checkout cannot provide different source. No screenshot baselines are needed.

The example names a common text/content spine and a separate back-button/title column. It measures
text with DOM Range after fonts and a rendered frame settle, label content and frame rectangles,
an icon viewport, and the button/content parts through the existing closed-root testing seam.
Real pointer clicks check that the title acts at its edge while header filler does not act; Enter
checks the native command path. Missing or zero-sized targets fail explicitly.

The variants cover narrow/wide initial layouts and resizing, light/dark, CJK and long German copy,
a coarse-pointer mobile context, and CSS zoom reflow. CSS zoom is an automated stress case; native
browser zoom and text-size accessibility checks remain host acceptance responsibilities.

Reverse checks deliberately translate only title text by 8px and prove its frame is unchanged,
expand the title into filler, and add a sibling region's text inset. Each relationship must reject
its mutation and pass again after restoration. Wrapped labels can end before their content box;
compact hit-area bounds use that box, while visible alignment always uses the text Range.

Adapt the selectors, named spines, wrapping policy and deliberate padding to the consumer surface.
The half-CSS-pixel tolerance handles fractional layout rounding and must not mask a one-pixel drift.

The vertical fixture adds a host-owned spacing vocabulary: 8px for title/description and
label/control/hint pairs, 16px between groups, and 24px between related subsections. These
values are independent expectations, not values read back from the implementation's own
`gap`. The canonical [vertical-rhythm guidance](../../docs/DESIGN.md#vertical-rhythm-across-sibling-views)
explains which relationships they represent and when a different scale role is appropriate.

Real text wraps on resize; the description's height changes while the following group's
gap stays constant. Showing a longer error expands its group; hiding it removes the row
and its gap. Reverse checks add an extra child margin, reserve a phantom helper row and
translate only text vertically inside an unchanged paragraph frame. The text mutation
continues to satisfy the frame-gap checks, demonstrating why a separate Range check and
complete rendered inspection remain necessary. All mutations are removed and the original
relationships checked again. Borders, internal padding and line-height leading are measured
separately rather than rounded into an invented spacing value.
