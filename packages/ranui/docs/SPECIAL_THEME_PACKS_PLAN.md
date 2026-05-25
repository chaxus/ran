# ranui Special Theme Packs Planning

> Last updated: 2026-05-24 (added wired/rough theme pack)

## Purpose

This document evaluates how ranui can support special visual themes such as
Windows 98, Windows XP, classic Macintosh, paper-like UI, pixel UI, and
neo-brutalist UI.

These themes are different from ordinary light/dark or brand themes. They do
not only change colors. They often change borders, shadows, typography,
spacing, control proportions, focus rings, interaction states, and sometimes
the expected DOM structure. ranui should support them through a dedicated
theme pack model instead of expanding the core semantic token layer until it
becomes too broad.

## References

- XP.css: <https://botoxparty.github.io/XP.css/>
- 98.css: <https://jdan.github.io/98.css/>
- PaperCSS: <https://github.com/papercss/papercss>
- System.css: <https://sakofchit.github.io/system.css/>
- Logging Studio RetroUI: <https://github.com/Logging-Stuff/RetroUI>
- Pixel RetroUI: <https://github.com/Dksie09/RetroUI>

## Current ranui Constraints

ranui components are Web Components with Shadow DOM styles. This gives strong
encapsulation, but it also means most global CSS framework selectors cannot
style internal component DOM directly.

The available styling channels are:

- inherited CSS custom properties
- component-level `--ran-[component]-*` tokens
- semantic `--ran-color-*`, `--ran-radius-*`, `--ran-shadow-*`, and related
  tokens
- `::part()` where components expose parts
- the `sheet` attribute as an escape hatch for component-local style injection
- exported CSS entry files such as `ranui/style`

Because of this, ranui should not try to import XP.css, 98.css, PaperCSS, or
similar libraries as-is and expect them to style component internals. Instead,
ranui should map each visual language onto ranui's own theme and component
token contract.

## Recommended Technical Direction For Complex Packs

Complex packs such as `paper` and `pixel-retro` should use a layered CSS
architecture:

1. semantic tokens for ordinary product UI values
2. skin primitive tokens for visual language primitives
3. component token fallbacks for component anatomy
4. opt-in theme pack CSS for scoped defaults and component-specific skin rules
5. visual regression tests for final appearance

The primary production path should be CSS custom properties, component tokens,
and scoped first-party CSS. CSS custom properties are the most stable mechanism
for crossing Shadow DOM boundaries. Theme pack CSS should only rely on browser
features that are broadly available in modern evergreen browsers.

Do not use CSS Paint API or Houdini paint worklets as the primary
implementation for `paper`. They are attractive for procedural rough borders,
but they are not a safe baseline dependency. They can be explored later as an
optional progressive enhancement, with a CSS-only fallback that is visually
acceptable.

Do not generate random styles at runtime. Special themes should be deterministic
so screenshots, SSR output, and visual tests are stable.

## Evaluation Of Candidate Theme Families

### Windows 98

Source family: 98.css.

Visual characteristics:

- raised and sunken bevel borders
- compact controls
- grey system surfaces
- dotted focus indicators
- sharp rectangular geometry
- window, title bar, menu, fieldset, tab, select, and button patterns

Adaptation level: **high but feasible**.

Windows 98 can be represented well with component tokens and skin CSS because
most visual differences are borders, shadows, dimensions, background colors,
and focus styles. It is a strong first candidate because it exercises many
theme pack requirements without needing hand-drawn randomness or heavy assets.

Main gaps in ranui:

- not every component exposes enough parts for title-bar-like or fieldset-like
  styling
- button, checkbox, input, select, tab, modal, dropdown, and progress need more
  systematic state token fallbacks
- current semantic tokens do not express bevel edges or inset surfaces

Recommended phase: first special theme pack.

### Windows XP

Source family: XP.css.

Visual characteristics:

- blue title bars and stronger gradients
- more rounded controls than Windows 98
- glossy button and active states
- thicker, image-like borders in some controls
- similar semantic control set to 98.css

Adaptation level: **high but feasible after Windows 98**.

XP should build on the same theme pack infrastructure as Windows 98. It needs
more gradient and state styling, so it should come after the simpler 98 style.

Main gaps in ranui:

- component tokens need to allow gradient backgrounds
- modal/window-like components need themeable title/header areas
- focus and active styles should be configurable without ad hoc `sheet`
  overrides

Recommended phase: second retro OS theme pack.

### Classic Macintosh / System 6

Source family: System.css.

Visual characteristics:

- monochrome surfaces
- black and white borders
- inverted active buttons
- compact typography
- classic window/dialog shape
- simpler color palette but strict geometry

Adaptation level: **medium**.

This style is less color-heavy than XP and often easier to express with tokens.
The main challenge is interaction fidelity: pressed states, default buttons,
and window/dialog presentation.

Main gaps in ranui:

- default button state needs a first-class styling path
- modal and dropdown need stronger part/token exposure
- some components need sharper typography and size token adoption

Recommended phase: parallel candidate with Windows XP after Windows 98.

### Wired / Rough

Source family: wired-elements (https://github.com/rough-stuff/wired-elements).

Visual characteristics:

- SVG-based sketchy borders and fills generated by RoughJS
- every surface looks hand-drawn: buttons, inputs, checkboxes, cards
- irregular but coherent stroke weight across all components
- warm, neutral palette with visible stroke texture
- closer to "live wireframe" than paper notebook

Adaptation level: **medium to high, but technically distinct from Paper UI**.

Wired-elements achieves its look through RoughJS, a library that generates
randomised-looking but algorithmically consistent SVG paths. It is built on Lit
and Web Components, not CSS. ranui cannot import wired-elements directly because
it would introduce a parallel component tree with no connection to ranui's token
and part contracts.

Instead, ranui should implement the wired visual language as a first-party theme
pack using prebuilt SVG assets generated offline by RoughJS with a fixed seed.
This keeps output deterministic across renders and SSR serializations.

This pack replaces Paper UI as the recommended hand-drawn theme. Compared to
PaperCSS, the RoughJS-derived approach produces more convincing sketch borders
and consistent stroke weight across interactive states.

Main gaps in ranui:

- no asset pipeline for prebuilt SVG border-image fragments
- components need consistent `border-image` fallback tokens in the skin layer
- interactive state borders (hover, focus, active) must each have prebuilt SVG
  variants rather than relying on CSS color changes alone
- icons may need a stroke-based rendering mode to match the wired aesthetic
- font choice matters more than for other packs; pack docs should recommend a
  handwriting or monospace font

Recommended phase: after windows-98 validates the theme pack infrastructure.
Replaces paper pack as the primary irregular-border target.

Recommended implementation:

- run RoughJS with a fixed seed offline to generate a small library of SVG
  border-image fragments covering: normal, hover, focus, active, disabled,
  error states at common control sizes (sm, md, lg)
- encode fragments as inline SVG data URIs in a generated Less or CSS file so
  no separate image requests are needed
- expose `--ran-skin-rough-border-image-*` tokens to allow consumers to swap
  fragments without importing the full pack
- use `border-image` CSS property to apply sketchy borders across Shadow DOM
  without piercing encapsulation
- control stroke color through a CSS filter on the border-image or through
  SVG `currentColor` so the pack respects `--ran-color-primary` and
  `--ran-color-border`
- keep a pure CSS fallback for environments that do not support `border-image`
  slicing with inline SVG; the fallback should use a thick solid border with a
  slight radius to suggest informality without the sketch effect
- do not call RoughJS at runtime in the browser; all SVG generation happens
  at build time in a dedicated script under `bin/`

Suggested wired skin tokens:

```css
:root[data-ran-theme-pack='wired'] {
  --ran-skin-font-family: 'Caveat', 'Comic Sans MS', cursive;
  --ran-skin-border-style: solid;
  --ran-skin-border-width: 2px;
  --ran-skin-rough-stroke: currentColor;
  --ran-skin-rough-stroke-width: 1.5;
  --ran-skin-rough-fill: none;
  --ran-skin-rough-seed: 42;
  --ran-skin-rough-border-image-normal: url('data:image/svg+xml,...');
  --ran-skin-rough-border-image-hover: url('data:image/svg+xml,...');
  --ran-skin-rough-border-image-focus: url('data:image/svg+xml,...');
  --ran-skin-rough-border-image-active: url('data:image/svg+xml,...');
  --ran-skin-rough-border-image-disabled: url('data:image/svg+xml,...');
  --ran-skin-hard-shadow: none;
  --ran-skin-rough-shadow: 2px 3px 0 rgba(0, 0, 0, 0.15);
  --ran-radius-sm: 0px;
  --ran-radius-md: 0px;
  --ran-radius-lg: 0px;
}
```

Asset generation script outline (`bin/generate-wired-assets.ts`):

```ts
import { RoughSVG } from 'roughjs/bundled/rough.svg';

const seed = 42;
const sizes = [
  { w: 80, h: 32 },
  { w: 120, h: 40 },
];
const states = ['normal', 'hover', 'focus', 'active', 'disabled'];

// For each size × state combination, generate an SVG rectangle with RoughJS,
// then write the result as a data URI into a generated Less file.
// The generated file is checked into source; the script only needs to rerun
// when stroke parameters change.
```

Wired-specific acceptance criteria:

- all P0 components use the prebuilt SVG border-image fragments in the wired pack
- the pack works without loading an external font (fallback to cursive)
- focus rings remain visible and distinct from the rough border
- disabled state borders use a lighter stroke weight or opacity, not color alone
- screenshots are deterministic across repeated Playwright runs
- importing the pack adds no runtime RoughJS dependency to the browser bundle
- the CSS-only fallback is visually acceptable when border-image is unsupported

### Paper UI

Source family: PaperCSS.

Visual characteristics:

- hand-drawn borders
- intentionally imperfect shapes
- informal typography
- playful rotation or offset effects
- global element styling philosophy

Adaptation level: **medium to high**.

Paper-style UI is not just a token set. It needs a controlled way to add
irregular borders and slight transforms. The theme should be implemented as a
ranui-native theme pack, not by importing PaperCSS globally.

Main gaps in ranui:

- no shared token family for irregular borders
- components need transform-safe layout rules so paper offsets do not break
  alignment
- visual regression tests are important because small CSS changes can make the
  style look broken rather than intentionally informal

Recommended phase: after the first OS-style pack proves the theme pack API.

Recommended implementation:

- model the style as deterministic "roughness", not random drawing
- use CSS custom properties for rough border width, radius, offset, shadow, and
  texture
- use component pseudo-elements inside Shadow DOM for paper shadows and uneven
  surfaces where needed
- use prebuilt CSS assets such as small inline SVG `border-image` values for
  hand-drawn borders
- provide two intensity levels through tokens, for example `paper-subtle` and
  `paper-strong`, before exposing many one-off knobs
- keep layout transforms small and opt-in so labels, popovers, and form fields
  do not drift out of alignment

Suggested paper tokens:

```css
:root[data-ran-theme-pack='paper'] {
  --ran-skin-font-family: 'Patrick Hand', 'Comic Sans MS', cursive;
  --ran-skin-border-width: 2px;
  --ran-skin-border-style: solid;
  --ran-skin-rough-border-image: none;
  --ran-skin-rough-border-image-hover: none;
  --ran-skin-rough-border-image-focus: none;
  --ran-skin-rough-border-image-active: none;
  --ran-skin-rough-border-image-disabled: none;
  --ran-skin-rough-stroke: currentColor;
  --ran-skin-rough-stroke-width: 1.5;
  --ran-skin-rough-seed: 42;
  --ran-skin-rough-radius-sm: 2px 5px 4px 3px;
  --ran-skin-rough-radius-md: 3px 7px 5px 4px;
  --ran-skin-rough-shadow: 2px 3px 0 rgba(0, 0, 0, 0.75);
  --ran-skin-jitter-x: 0px;
  --ran-skin-jitter-y: 0px;
  --ran-skin-surface-texture: none;
}
```

Paper-specific acceptance criteria:

- the pack works without JavaScript beyond normal component registration
- screenshots are deterministic across repeated runs
- focus rings remain visible even with irregular borders
- transforms do not change component layout boxes enough to cause overlap
- the theme works acceptably without loading an external font

### Pixel Retro

Source family: Pixel RetroUI.

Visual characteristics:

- pixelated borders and shadows
- gaming-inspired color palettes
- bitmap or pixel-style fonts
- hard edges
- large contrast between fill, outline, and shadow

Adaptation level: **medium**.

Pixel style maps well to tokens if ranui adds a small number of skin-level
tokens for outline width, shadow offset, font, and image rendering. It may also
need optional font loading guidance.

Main gaps in ranui:

- no theme pack asset/font loading convention
- component shadows and borders need consistent component-token fallbacks
- icons may not visually match pixel UI unless icon rendering is considered

Recommended phase: good second or third pack if the project wants visible
impact quickly.

Recommended implementation:

- treat pixel UI as a strict token-driven skin
- set all core radii to `0`
- use hard outline and offset shadow tokens instead of blurred shadows
- avoid transitions or reduce them to near-zero durations
- expose an optional pixel font import, but keep the pack usable with `monospace`
- set `image-rendering: pixelated` only on surfaces that render pixel assets,
  not globally
- prefer CSS box-shadow offsets over image borders for the first iteration

Suggested pixel tokens:

```css
:root[data-ran-theme-pack='pixel-retro'] {
  --ran-skin-font-family: 'Press Start 2P', monospace;
  --ran-skin-border-width: 2px;
  --ran-skin-border-style: solid;
  --ran-skin-hard-shadow: 4px 4px 0 #000;
  --ran-skin-pixel-size: 2px;
  --ran-radius-sm: 0;
  --ran-radius-md: 0;
  --ran-radius-lg: 0;
  --ran-motion-duration-fast: 0ms;
  --ran-motion-duration-base: 0ms;
}
```

Pixel-specific acceptance criteria:

- button, input, checkbox, select, dropdown, modal, and message all share the
  same hard-border language
- text remains readable when a pixel font is not loaded
- icons do not blur or fight the pixel aesthetic at common sizes
- disabled and focus states remain distinguishable without relying on subtle
  color differences
- no component relies on Tailwind classes or React-specific source patterns

### Neo-Brutalist Retro

Source family: Logging Studio RetroUI.

Visual characteristics:

- bold flat colors
- thick black borders
- hard offset shadows
- playful but modern composition
- often Tailwind-driven in source ecosystems

Adaptation level: **low to medium**.

This is likely the easiest special theme to support through tokens because it
does not require historical OS fidelity. It mostly needs strong border,
surface, radius, and shadow tokens.

Main gaps in ranui:

- semantic tokens do not currently include outline width or hard shadow offset
- component defaults need to consistently read semantic border and shadow tokens
- button, card-like, modal, dropdown, and message components need coherent
  surface treatment

Recommended phase: good early pack if speed matters more than historical
fidelity.

## Theme Pack Model

### Definitions

`theme` means a semantic color and density mode, such as `light` or `dark`.

`theme pack` means a named visual language that can override semantic tokens,
component tokens, and optional skin CSS.

`skin` means component-specific CSS rules shipped by ranui for a theme pack.
Skins are allowed to target component hosts, public parts, and component
tokens. They should avoid reaching into private implementation details.

### Proposed Attribute Model

```html
<html data-ran-theme="light" data-ran-theme-pack="windows-98"></html>
```

Rules:

- `data-ran-theme` controls semantic light/dark values.
- `data-ran-theme-pack` controls special visual language.
- theme packs can be combined with light/dark only where explicitly supported.
- old `theme="dark"` remains compatibility-only.

### Proposed Runtime API

```ts
type RanThemeName = 'light' | 'dark';
type RanThemePackName =
  | 'default'
  | 'windows-98'
  | 'windows-xp'
  | 'system-6'
  | 'wired'
  | 'paper'
  | 'pixel-retro'
  | 'neo-brutalism';

setTheme(name: RanThemeName, target?: ThemeTarget): void;
getTheme(target?: ThemeTarget): RanThemeName | '';
setThemePack(name: RanThemePackName, target?: ThemeTarget): void;
getThemePack(target?: ThemeTarget): RanThemePackName | '';
```

`setThemePack('default')` should remove or reset the pack attribute.

### Proposed CSS Entry Model

Core style remains:

```ts
import 'ranui/style';
```

Optional packs should be explicit:

```ts
import 'ranui/theme-packs/windows-98';
import 'ranui/theme-packs/paper';
```

This avoids making all users pay for novelty theme CSS.

Potential files:

```text
theme-packs/
  index.ts
  windows-98.less
  windows-xp.less
  system-6.less
  wired.less
  wired-assets.less       ← generated, contains prebuilt SVG data URIs
  paper.less
  pixel-retro.less
  neo-brutalism.less

bin/
  generate-wired-assets.ts  ← offline RoughJS asset generator
```

Each pack should scope rules under `[data-ran-theme-pack='...']`.

## Token Extensions Needed

Special packs should not add many one-off semantic tokens. Add only a small
skin layer:

```css
:root {
  --ran-skin-border-width: 1px;
  --ran-skin-border-style: solid;
  --ran-skin-outline-color: var(--ran-color-border);
  --ran-skin-inset-shadow: none;
  --ran-skin-raised-shadow: var(--ran-shadow-elevated);
  --ran-skin-hard-shadow: none;
  --ran-skin-rough-shadow: none;
  --ran-skin-rough-border-image: none;
  --ran-skin-rough-border-image-hover: none;
  --ran-skin-rough-border-image-focus: none;
  --ran-skin-rough-border-image-active: none;
  --ran-skin-rough-border-image-disabled: none;
  --ran-skin-rough-stroke: currentColor;
  --ran-skin-rough-stroke-width: 1.5;
  --ran-skin-rough-seed: 42;
  --ran-skin-surface-texture: none;
  --ran-skin-pixel-size: 1px;
  --ran-skin-jitter-x: 0px;
  --ran-skin-jitter-y: 0px;
  --ran-skin-control-height-sm: 24px;
  --ran-skin-control-height-md: 32px;
  --ran-skin-font-family: var(--ran-font-family);
}
```

Component tokens should then default through these skin tokens where useful:

```css
border: var(
  --ran-btn-content-border,
  var(--ran-skin-border-width) var(--ran-skin-border-style) var(--ran-color-border)
);
box-shadow: var(--ran-btn-content-box-shadow, var(--ran-skin-raised-shadow));
font-family: var(--ran-btn-content-font-family, var(--ran-skin-font-family));
```

This keeps semantic tokens clean while allowing special packs to express
non-modern visuals.

The component implementation should use these tokens only where the visual
concept is meaningful. For example, `--ran-skin-hard-shadow` is useful for
button, modal, dropdown, message, and popover surfaces, but not necessarily for
inline text or icons. `--ran-skin-jitter-*` should be limited to pack CSS and
should not be baked into default component layout.

## Component Exposure Requirements

Theme packs need a reliable component styling surface. The first audit should
classify each component:

| Component   | Priority | Required Exposure                                         |
| ----------- | -------- | --------------------------------------------------------- |
| button      | P0       | content, hover, active, focus, disabled, default action   |
| input       | P0       | wrapper, content, label, focus, disabled, error           |
| checkbox    | P0       | box, checked mark, disabled                               |
| select      | P0       | selection, option text, icon, dropdown bridge             |
| dropdown    | P0       | surface, arrow, shadow, item states                       |
| modal       | P0       | mask, dialog, header, title, body, footer, action buttons |
| message     | P1       | surface, text, icon, toast variant                        |
| tab         | P1       | tab list, tab item, active tab, panel                     |
| progress    | P1       | track, bar, text                                          |
| loading     | P2       | spinner, text                                             |
| player      | P2       | control bar, buttons, progress, menu                      |
| colorpicker | P2       | panel, input, swatches                                    |

P0 components should be ready before shipping the first special pack.

## Why Not Directly Depend On External CSS

Direct dependency is not recommended as the primary path.

Reasons:

- external libraries style native HTML elements and global classes, while ranui
  component internals live in Shadow DOM
- imported global selectors would not reliably reach internal `.ran-*` nodes
- third-party CSS can reset native elements unexpectedly in host pages
- licensing, bundle size, update cadence, and visual drift would become ranui
  release concerns
- ranui already has component tokens, parts, and style generation tools; mapping
  visual language into these contracts is more maintainable

External CSS can still be used as reference material or optional examples, but
ranui theme packs should be first-party CSS built against ranui's own public
styling surface.

## Recommended Implementation Phases

### Phase 0: Finish Core Theme Contract

Complete the existing semantic token migration enough for P0 components:

- button
- input
- checkbox
- select
- dropdown
- modal
- message

Add regression tests that require these components to reference semantic theme
tokens.

### Phase 1: Add Theme Pack Infrastructure

Deliverables:

- `setThemePack()` and `getThemePack()`
- `data-ran-theme-pack` selector convention
- `theme-packs/` CSS entry structure
- `--ran-skin-*` primitive tokens
- SSR-safe runtime tests
- package export entries if the package manifest requires explicit exports

No visual pack should be shipped until this layer is tested.

### Phase 2: Add A Minimal Pixel Retro Pack

Scope:

- button
- input
- checkbox
- select
- dropdown
- modal
- message

This pack should validate the skin primitive layer with hard borders, zero
radii, hard offset shadows, pixel-like typography, and reduced motion. It is
the best first complex-theme implementation because it can be deterministic and
mostly token-driven.

Acceptance criteria:

- importing only `ranui/style` keeps default visual behavior
- importing `ranui/theme-packs/pixel-retro` adds no global side effects unless
  `data-ran-theme-pack="pixel-retro"` is present
- component-level overrides still win over pack defaults
- the pack works without bundled font assets
- screenshots are deterministic

### Phase 3: Add A Minimal Windows 98 Pack

Scope:

- button
- input
- checkbox
- select
- dropdown
- modal

This pack should focus on bevel borders, grey surfaces, compact sizing, and
dotted focus affordances. It does not need to implement every 98.css component.

Acceptance criteria:

- importing only `ranui/style` keeps default visual behavior
- importing `ranui/theme-packs/windows-98` adds no global side effects unless
  `data-ran-theme-pack="windows-98"` is present
- component-level overrides still win over pack defaults
- SSR import remains safe

### Phase 4: Add A Minimal Wired Pack

Scope:

- button
- input
- checkbox
- modal
- message

This pack validates the SVG border-image asset pipeline and replaces Paper as
the primary irregular-border target. It requires a working offline asset
generation script and should not call RoughJS at browser runtime.

Deliverables:

- `bin/generate-wired-assets.ts` — offline RoughJS script with fixed seed
- `theme-packs/wired-assets.less` — generated file containing SVG data URIs
- `theme-packs/wired.less` — pack rules importing the generated assets

Acceptance criteria:

- `bin/generate-wired-assets.ts` produces identical output on repeated runs
- the browser bundle for consumers who import `ranui/theme-packs/wired` does not
  include RoughJS as a runtime dependency
- all P0 scoped components show sketchy SVG borders under the wired pack
- focus rings remain visible and distinct from the sketch border stroke
- the CSS-only fallback (thick solid border, cursive font) is visually
  acceptable when border-image slicing is unsupported
- repeated Playwright screenshots are pixel-identical
- component layout boxes do not shift when the border-image is applied

### Phase 4.5: Add A Minimal Paper Pack

Scope:

- button
- input
- checkbox
- modal
- message

Paper pack is kept as a separate, CSS-only complement to the wired pack. It
targets a looser, notebook aesthetic using border-radius variation and box-shadow
rather than SVG border-image.

Acceptance criteria:

- the pack renders acceptably with pure CSS
- repeated screenshots are deterministic
- component layout boxes remain stable
- paper effects do not hide focus indicators

### Phase 5: Add Visual Regression Coverage

Add one fixture page or Playwright route with:

- default light
- dark
- pixel-retro pack
- windows-98 pack
- paper pack

Cover at least:

- button
- input
- checkbox
- select
- dropdown
- modal
- message

Visual testing is required for special packs because token-only unit tests
cannot detect whether bevels, offsets, or hand-drawn styles look coherent.

### Phase 6: Expand Packs

Recommended order:

1. `pixel-retro` — token-driven, fully deterministic, validates skin primitive layer
2. `windows-98` — bevel borders, historically faithful, validates scoped skin CSS
3. `wired` — SVG border-image pipeline, validates asset generation workflow
4. `paper` — CSS-only complement to wired, looser notebook aesthetic
5. `windows-xp` — builds on windows-98 infrastructure, adds gradients
6. `system-6` — monochrome, validates strict geometry without color dependency
7. `neo-brutalism` — easy token-driven pack, good for quick visual impact

This order validates the generic skin primitive layer first, then OS-faithful
styles, then the SVG asset pipeline through the wired pack, then CSS-only
irregular borders through paper, and finally the remaining packs.

## Pack Switching Smoothness

### The Switching Mechanism

Calling `setThemePack('pixel-retro')` does exactly one thing in JS:

```ts
document.documentElement.setAttribute('data-ran-theme-pack', 'pixel-retro');
```

After that, the browser CSS engine takes over. Pack CSS scoped under
`[data-ran-theme-pack='pixel-retro']` becomes active, CSS custom properties
cascade down the document tree, cross Shadow DOM boundaries through inheritance,
and the browser repaints affected elements. No component JS is triggered.

This mechanism is identical to light/dark switching. The difference in perceived
smoothness comes from _what properties change_, not from the switching API.

### Smoothness By Pack Type

**Token-driven packs: pixel-retro, neo-brutalism**

These packs override CSS custom properties only. The browser performs a single
paint pass with no layout reflow. The visual update completes within one frame.

Risk: pixel-retro specifies an external font (`'Press Start 2P'`). If the font
is not preloaded, text renders in the system fallback first, then jumps to the
pixel font when loading completes. This is a Flash Of Unstyled Text (FOUT) and
breaks the instant-switch experience even though the token cascade itself is
instant.

Expected experience: instant border and color change, possible text FOUT.

**OS skin packs: windows-98, windows-xp, system-6**

These packs combine token overrides with scoped skin CSS targeting `::part()`
selectors. `box-shadow` used for bevel effects is a paintable property, so
bevel borders appear within one frame.

If the pack changes `border-width` or `padding` (likely for compact control
sizing), the browser triggers a layout reflow before painting. All components
resize slightly and adjacent elements shift to accommodate the new dimensions.
This reflow is the main source of visual jitter for OS packs.

OS packs use system fonts. No font loading occurs.

Expected experience: near-instant color and border change, minor layout jitter
if control dimensions change, no font FOUT.

**SVG border-image pack: wired**

`border-image` is not an animatable or transitionable CSS property. When the
pack activates, borders snap instantly from the default style to SVG sketch
strokes with no intermediate state. There is no way to smooth this transition
within CSS.

The wired pack also changes `font-family` to `'Caveat'`. If the font is not
preloaded, text jumps from the system font after the font file loads. Font
metrics differ between `'Caveat'` and the system fallback, which causes a
secondary layout reflow and repaint after the initial snap.

Expected experience: hard visual snap on borders (unavoidable by CSS spec),
possible text FOUT and secondary reflow. This is the least smooth pack to
switch to or from at runtime.

**CSS-only irregular pack: paper**

Paper uses `border-radius` variants and `box-shadow` for the informal aesthetic.
Both are paintable properties with no layout reflow. Paper specifies an external
font (`'Patrick Hand'`), so FOUT risk applies.

Expected experience: instant shape and shadow change, possible text FOUT.

### Smoothness Summary

| Pack          | Layout reflow        | Font FOUT risk      | Border transition              | Overall      |
| ------------- | -------------------- | ------------------- | ------------------------------ | ------------ |
| pixel-retro   | No                   | Yes (external font) | Smooth                         | Near-instant |
| neo-brutalism | Minor (border-width) | No                  | Smooth                         | Near-instant |
| windows-98    | Minor (dimensions)   | No                  | Smooth                         | Near-instant |
| windows-xp    | Minor (dimensions)   | No                  | Smooth                         | Near-instant |
| system-6      | Minor                | No                  | Smooth                         | Near-instant |
| wired         | Minor                | Yes (external font) | Hard snap (not transitionable) | Jarring      |
| paper         | No                   | Yes (external font) | Smooth                         | Near-instant |

### Three Design Gaps Not Addressed In This Document

**Gap 1: No pack switch transition strategy**

The design specifies `--ran-motion-duration-*` tokens for component interaction
animations but says nothing about how to transition between pack states. Without
a transition strategy, all changed properties update simultaneously in one frame,
producing a hard visual cut.

For properties that support `transition`, a targeted rule reduces the cut to a
short fade:

```css
/* Apply only when a pack is active to avoid affecting default interactions */
[data-ran-theme-pack] *,
[data-ran-theme-pack] *::part(*) {
  transition:
    background-color 0.2s,
    color 0.2s,
    border-color 0.2s,
    box-shadow 0.2s,
    border-radius 0.2s;
}
```

Do not include `font-family` or `border-image` in this transition list. They
are not animatable CSS properties and adding them has no effect.

This rule should be an opt-in export, not part of `ranui/style`, because it
adds transition overhead to every element while a pack is active.

**Gap 2: Font preloading strategy**

Packs that reference external fonts (pixel-retro, wired, paper) should document
a font preloading pattern so consumers can eliminate FOUT before enabling
runtime pack switching:

```html
<!-- Preload in <head> before any pack is activated -->
<link rel="preload" href="/fonts/PressStart2P.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/fonts/Caveat.woff2" as="font" type="font/woff2" crossorigin />
```

Alternatively, pack CSS should declare the relevant `@font-face` with
`font-display: optional`. This suppresses FOUT by keeping the system font if
the custom font has not already loaded, at the cost of never showing the pack
font on first render for users with cold caches.

The recommended default for theme pack fonts is `font-display: swap` with
explicit preload guidance in the pack documentation.

**Gap 3: Multi-pack import model vs runtime switching**

The design specifies that packs are opt-in imports:

```ts
import 'ranui/theme-packs/windows-98';
```

If only one pack is imported, switching to it is instant because its CSS is
already in the page. If an application wants to let users switch between
multiple packs at runtime (a theme picker UI), all candidate packs must be
imported upfront. This trades the bundle-size saving for switching latency.

Lazy importing a pack CSS file on first switch introduces a network round-trip
(typically 50–300 ms on a warm connection) before the switch takes effect.

Recommendation: applications that offer runtime pack selection should import all
candidate packs at startup and accept the bundle cost. Applications that apply
one pack permanently at build time get both the bundle saving and zero switch
latency. This trade-off should be documented per pack.

### Implementation Checklist For Smooth Switching

When implementing any pack, verify the following before shipping:

- [ ] Pack CSS references no external resources except documented fonts
- [ ] Pack fonts are declared with `font-display: swap`
- [ ] Pack documentation includes a `<link rel="preload">` snippet for each
      external font
- [ ] Pack does not change `padding` or `border-width` on P0 components unless
      a minor layout reflow is explicitly acceptable and documented
- [ ] Playwright visual tests run pack switching and capture before/after
      screenshots to confirm no unintended layout shift
- [ ] For the wired pack specifically: document that `border-image` transitions
      are a CSS spec limitation, not a ranui limitation

## Testing Strategy

### Unit Tests

- `setThemePack()` writes `data-ran-theme-pack`.
- `getThemePack()` reads the pack attribute.
- `setThemePack('default')` clears the pack attribute.
- all APIs no-op safely without `document`.

### Source Contract Tests

- every P0 component Less file references required semantic tokens
- every shipped theme pack scopes CSS under `[data-ran-theme-pack='name']`
- theme pack files do not introduce unscoped global element selectors
- paper pack files do not require `paint()` or CSS Paint API
- pixel pack files do not depend on Tailwind utility classes
- wired pack files do not import RoughJS or any runtime drawing dependency
- `wired-assets.less` is generated and checked in; its content must match the
  output of `bin/generate-wired-assets.ts` in CI

### Component Contract Tests

- components render with theme pack attributes on root
- component-local CSS variables still override pack defaults
- `sheet` still applies after pack CSS
- component skin hooks fall back to default semantic tokens when no pack is
  active

### SSR Tests

- runtime theme pack utilities import without DOM
- theme pack CSS modules do not require browser-only globals
- Declarative Shadow DOM serialization remains stable

### Visual Tests

- compare default and special pack screenshots for P0 components
- include hover/focus/disabled/active states where Playwright can trigger them
- validate that dark mode and pack mode do not accidentally combine unless the
  pack explicitly supports it
- repeat paper screenshots to catch accidental runtime randomness

## Risks And Mitigations

### Risk: Theme Packs Become Full Component Forks

Mitigation:

- only allow theme packs to use tokens, host selectors, and public parts
- add new parts only when they are useful beyond one theme pack
- avoid changing component markup solely for a novelty theme

### Risk: Token Layer Becomes Too Abstract

Mitigation:

- keep semantic tokens focused on product UI needs
- place unusual visual concepts in `--ran-skin-*`
- keep component-specific behavior in component tokens

### Risk: Bundle Size Growth

Mitigation:

- theme packs are opt-in imports
- do not include image assets in the default package entry
- document pack-specific font imports separately

### Risk: Accessibility Regressions

Mitigation:

- preserve focus indicators even when mimicking old UI
- keep disabled states perceivable
- do not reduce text contrast below accessible thresholds unless the pack is
  explicitly marked decorative/demo-only

### Risk: Visual Incoherence Across Components

Mitigation:

- ship packs in small component sets
- require screenshot coverage for each shipped pack
- publish pack support matrix in docs

### Risk: Experimental Browser Features Leak Into Production

Mitigation:

- CSS Paint API can only be optional progressive enhancement
- all packs must have a CSS-only baseline
- source tests should reject required `paint()` usage in first-party packs

### Risk: Runtime Randomness Breaks Visual Tests And SSR

Mitigation:

- do not generate roughness with random JavaScript at runtime
- use prebuilt variants or deterministic CSS values
- keep all paper offsets within fixed token ranges
- for the wired pack, all RoughJS calls happen in `bin/generate-wired-assets.ts`
  with `seed: 42`; the generated Less file is committed and treated as a source
  artifact, not a build output

### Risk: SVG Border-Image Stroke Color Is Not Themeable

The wired pack uses prebuilt SVG data URIs as `border-image`. Inline SVG in
`border-image` does not inherit CSS `currentColor`, which makes stroke color
difficult to control from outside the Shadow DOM.

Mitigation:

- generate one SVG variant per semantic color role (default, primary, danger,
  disabled) rather than relying on `currentColor` inheritance
- expose `--ran-skin-rough-border-image-*` tokens so consumers can swap the
  entire SVG fragment for a different stroke color without re-running the
  generator
- document the limitation clearly; if dynamic stroke color becomes a hard
  requirement, investigate CSS `mask` + `background-color` as an alternative
  to `border-image`

### Risk: SVG Asset File Size

Prebuilt SVG data URIs for multiple components × multiple states can add up.

Mitigation:

- use SVGO in the generator script to minify output before encoding
- share a single SVG fragment across multiple components at the same size tier
  rather than generating unique shapes per component
- target less than 8 KB total for the wired-assets.less generated file
- ship wired-assets.less only when the wired pack is imported

## Decision

Support special themes as opt-in first-party ranui theme packs.

Do not directly import third-party CSS libraries into component internals.
Instead, use those projects as visual references and map each visual language to
ranui's semantic tokens, skin tokens, component tokens, parts, and scoped pack
CSS.

The first complex implementation target should be a minimal `pixel-retro` theme
pack because it validates the skin primitive layer without procedural drawing.
The first historically faithful implementation target should remain
`windows-98`. The primary hand-drawn theme target is `wired`, replacing `paper`
as the first irregular-border pack. The wired pack introduces an offline SVG
asset generation pipeline using RoughJS with a fixed seed, keeping browser
bundles free of runtime drawing dependencies. The `paper` pack follows as a
CSS-only complement for a looser notebook aesthetic, but only after the wired
pipeline proves the irregular-border infrastructure.

## Open Questions

1. Should ranui expose `theme-packs/*` as public package exports immediately,
   or keep them experimental until the first pack stabilizes?
2. Should special packs support dark mode combinations, or should each pack own
   its complete palette?
3. Should font assets be bundled, or should theme pack docs instruct consumers
   to load fonts themselves?
4. Should generated style docs include theme pack token support matrices?
5. For the wired pack: should `bin/generate-wired-assets.ts` be a devDependency
   on RoughJS only, or should a small bundled copy of rough.js be checked in to
   avoid a separate package install for contributors running the generator?
6. Should `wired-assets.less` be committed to the repository as a source
   artifact, or regenerated as part of the build? Committing simplifies CI but
   creates a generated file that needs manual refresh; generating in CI requires
   the RoughJS devDependency to be present in the build environment.
