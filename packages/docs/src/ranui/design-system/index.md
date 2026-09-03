---
description: "ranui's design language and its complete token reference: every global `--ran-*` token, covering the Geist colour ladder with light and dark values, semantic roles, spacing, sizing, typography, radius, elevation, stacking, motion, focus and skin primitives."
---

# Design system

The **design language** ranui is built from, and the **complete** catalog of the tokens that
express it: every global `--ran-*` custom property the library declares, with its value in
both themes. Components read these instead of hard-coding values, so overriding one token
restyles everything that consumes it.

Three pages answer three different questions, and they are deliberately separate:

| Page                                           | Answers                                             |
| ---------------------------------------------- | --------------------------------------------------- |
| **Design system** (this page)                  | _What_ the tokens are: the vocabulary               |
| [Design guidelines](/src/ranui/design-guides/) | _How to choose_ between them when building a screen |
| [Theming](/src/ranui/theme/)                   | _How to switch and override_ them at runtime        |

> **Use when** you need the name or the value of a token (a colour role, a spacing step, an
> icon size, a shadow tier, an easing curve) or want to understand why the scales are shaped
> the way they are.

## The language: Geist

ranui's tokens are based on [Geist](https://vercel.com/geist), Vercel's open-source design
system. Its defining idea is that **colour is a state ladder, not a palette**: a scale is not a
set of pretty shades to pick from, it is a set of _jobs_. Step 200 is not "a slightly darker
gray", it is "the hover background". Once the ladder is fixed, interaction states stop being a
judgement call.

ranui adopts that ladder as its `--ran-*` scales, layers semantic tokens on top, and ships
**Geist Sans / Geist Mono** as the default typefaces.

## Two layers

**Layer 1: base palette.** The raw scales below. Rarely consumed directly.

**Layer 2: semantic tokens.** `--ran-color-*` and friends, mapped onto layer 1. **Consume
this layer.** Dark mode redefines only layer 1, so every semantic token flips through `var()`
with no per-component dark overrides anywhere in the library.

```
--ran-gray-1000        →  #171717 (light)  /  #ededed (dark)     ← layer 1, flips
--ran-color-text       →  var(--ran-gray-1000)                    ← layer 2, follows
--ran-btn-color        →  var(--ran-color-text, …)                ← component token
```

That chain is the whole architecture: change a base step and it propagates everywhere; change
a semantic token and it changes one role; change a component token and it changes one element.

## Colour

### The ladder

Every hue scale runs `100 → 1000`, and each step has one fixed job:

| Step | Role                        | Step | Role                      |
| ---- | --------------------------- | ---- | ------------------------- |
| 100  | Default background          | 600  | Active border             |
| 200  | Hover background            | 700  | Solid fill (button/badge) |
| 300  | Active (pressed) background | 800  | Solid fill (hover)        |
| 400  | Default border              | 900  | Secondary text & icons    |
| 500  | Hover border                | 1000 | Primary text & icons      |

### Backgrounds

| Token                  | Light     | Dark      | Use for           |
| ---------------------- | --------- | --------- | ----------------- |
| `--ran-background-100` | `#ffffff` | `#000000` | Page background   |
| `--ran-background-200` | `#fafafa` | `#000000` | Subtle page zones |

### Gray — `--ran-gray-100..1000`

The scale behind text, borders and surfaces.

| Step | Light     | Dark      |
| ---- | --------- | --------- |
| 100  | `#f2f2f2` | `#1a1a1a` |
| 200  | `#ebebeb` | `#1f1f1f` |
| 300  | `#e6e6e6` | `#292929` |
| 400  | `#eaeaea` | `#2e2e2e` |
| 500  | `#c9c9c9` | `#454545` |
| 600  | `#a8a8a8` | `#878787` |
| 700  | `#8f8f8f` | `#8f8f8f` |
| 800  | `#7d7d7d` | `#7d7d7d` |
| 900  | `#4d4d4d` | `#a0a0a0` |
| 1000 | `#171717` | `#ededed` |

### Gray alpha — `--ran-gray-alpha-100..1000`

Translucent, so it layers over any surface: the right choice for a scrim, a hover wash or a
divider that must sit on unknown content.

| Step | Light       | Dark        |
| ---- | ----------- | ----------- |
| 100  | `#0000000d` | `#ffffff12` |
| 200  | `#00000015` | `#ffffff17` |
| 300  | `#0000001a` | `#ffffff21` |
| 400  | `#00000014` | `#ffffff24` |
| 500  | `#00000036` | `#ffffff3d` |
| 600  | `#0000003d` | `#ffffff82` |
| 700  | `#00000070` | `#ffffff8a` |
| 800  | `#00000082` | `#ffffff78` |
| 900  | `#000000b3` | `#ffffff9c` |
| 1000 | `#000000e8` | `#ffffffeb` |

### Blue — `--ran-blue-100..1000`

Reserved for links and the focus ring.

| Step | Light     | Dark      |
| ---- | --------- | --------- |
| 100  | `#f0f7ff` | `#06193a` |
| 200  | `#e9f4ff` | `#022248` |
| 300  | `#dfefff` | `#002f62` |
| 400  | `#cae7ff` | `#003674` |
| 500  | `#94ccff` | `#00418b` |
| 600  | `#48aeff` | `#0090ff` |
| 700  | `#006bff` | `#006efe` |
| 800  | `#0059ec` | `#005be7` |
| 900  | `#005ff2` | `#47a8ff` |
| 1000 | `#002359` | `#eaf6ff` |

### Red — `--ran-red-100..1000`

Danger and errors.

| Step | Light     | Dark      |
| ---- | --------- | --------- |
| 100  | `#ffeeef` | `#330a11` |
| 200  | `#ffe8ea` | `#440d13` |
| 300  | `#ffe3e4` | `#5d0e17` |
| 400  | `#ffd7d6` | `#6f101b` |
| 500  | `#ffb1b3` | `#88151f` |
| 600  | `#ff676d` | `#f32e40` |
| 700  | `#fc0035` | `#f13242` |
| 800  | `#ea001d` | `#e2162a` |
| 900  | `#d8001b` | `#ff565f` |
| 1000 | `#47000c` | `#ffe9ed` |

### Amber — `--ran-amber-100..1000`

Warnings.

| Step | Light     | Dark      |
| ---- | --------- | --------- |
| 100  | `#fff6de` | `#2a1700` |
| 200  | `#fff4cf` | `#361900` |
| 300  | `#fff1c1` | `#502800` |
| 400  | `#ffdc73` | `#5b3000` |
| 500  | `#ffc543` | `#703e00` |
| 600  | `#ffa600` | `#ed9a00` |
| 700  | `#ffae00` | `#ffae00` |
| 800  | `#ff9300` | `#ff9300` |
| 900  | `#aa4d00` | `#ff9300` |
| 1000 | `#561900` | `#fff3d5` |

### Green — `--ran-green-100..1000`

Success.

| Step | Light     | Dark      |
| ---- | --------- | --------- |
| 100  | `#ecfdec` | `#002608` |
| 200  | `#e5fce7` | `#00320b` |
| 300  | `#d3fad1` | `#003a0e` |
| 400  | `#b9f5bc` | `#004615` |
| 500  | `#82eb8d` | `#006717` |
| 600  | `#4ce15e` | `#00952d` |
| 700  | `#28a948` | `#00ac3a` |
| 800  | `#279141` | `#009432` |
| 900  | `#107d32` | `#00ca50` |
| 1000 | `#003a00` | `#d8ffe4` |

### Semantic colour tokens

The layer components actually read. Everything here resolves through the scales above, so it
flips with the theme on its own.

| Token                          | Resolves to                              | Role                            |
| ------------------------------ | ---------------------------------------- | ------------------------------- |
| `--ran-color-bg`               | `--ran-background-100`                   | Page background                 |
| `--ran-color-bg-subtle`        | `--ran-background-200`                   | Subtle page zones               |
| `--ran-color-bg-elevated`      | `--ran-background-100` · gray-100 (dark) | Cards, surfaces                 |
| `--ran-color-bg-muted`         | `--ran-gray-100`                         | Inset / muted fills             |
| `--ran-color-bg-hover`         | `--ran-gray-200`                         | Hover surface                   |
| `--ran-color-bg-active`        | `--ran-gray-300`                         | Active (pressed) surface        |
| `--ran-color-text`             | `--ran-gray-1000`                        | Primary text                    |
| `--ran-color-text-secondary`   | `--ran-gray-900`                         | Secondary text                  |
| `--ran-color-text-disabled`    | `--ran-gray-700`                         | Disabled text                   |
| `--ran-color-border`           | `--ran-gray-400`                         | Default border                  |
| `--ran-color-border-secondary` | `--ran-gray-300`                         | Subtler border                  |
| `--ran-color-border-hover`     | `--ran-gray-500`                         | Hover border                    |
| `--ran-color-border-active`    | `--ran-gray-600`                         | Active border                   |
| `--ran-color-primary`          | `--ran-gray-1000`                        | The primary action (monochrome) |
| `--ran-color-primary-hover`    | `#383838` · `#cccccc` (dark)             | Primary hover                   |
| `--ran-color-primary-active`   | `#4d4d4d` · `#b3b3b3` (dark)             | Primary pressed                 |
| `--ran-color-primary-text`     | `--ran-background-100`                   | Ink **on** a primary surface    |
| `--ran-color-success`          | `--ran-green-700`                        | Success                         |
| `--ran-color-warning`          | `--ran-amber-700`                        | Warning                         |
| `--ran-color-danger`           | `--ran-red-700`                          | Danger / error                  |
| `--ran-color-link`             | `--ran-blue-700`                         | Links                           |

`--ran-color-primary-hover` / `-active` are the two literals in the semantic layer: they step
toward the page background rather than along a scale, so dark mode redefines them directly.

### What each accent means

- **Primary is monochrome**: black-on-white in light, white-on-black in dark (the Geist brand
  tone, `<r-button type="primary">`). Text and icons on it use `--ran-color-primary-text`,
  which flips with it. There is no separate "contrast" token: primary _is_ the
  highest-contrast action.
- **Blue is reserved** for links (`--ran-color-link`) and the focus ring. It is not an
  alternative primary.
- **Green = success · amber = warning · red = danger.** One meaning each.

There is no `--ran-color-error`; the token is `--ran-color-danger`. A `var()` naming a property
that was never declared resolves to nothing and the entire declaration is dropped silently,
which is why the wrong name is worth checking against this table rather than guessing.

## Spacing

Gaps between things: `padding`, `margin`, `gap`. A 4px base unit with **nine values**, no more:

| Token           | Value | Token            | Value |
| --------------- | ----- | ---------------- | ----- |
| `--ran-space-1` | 4px   | `--ran-space-8`  | 32px  |
| `--ran-space-2` | 8px   | `--ran-space-10` | 40px  |
| `--ran-space-3` | 12px  | `--ran-space-16` | 64px  |
| `--ran-space-4` | 16px  | `--ran-space-24` | 96px  |
| `--ran-space-6` | 24px  |                  |       |

The number is the multiple of 4px, so the scale skips: there is no `--ran-space-5`. That is the
point: a limited set is what produces a page's rhythm.

## Sizing

An element's own dimensions: icon sizes, control heights, small square or rectangular controls.

| Token          | Value | Typically                       |
| -------------- | ----- | ------------------------------- |
| `--ran-size-1` | 16px  | Checkbox box, small inline icon |
| `--ran-size-2` | 18px  | —                               |
| `--ran-size-3` | 20px  | Icon inside a control           |
| `--ran-size-4` | 24px  | Toolbar icon button             |
| `--ran-size-5` | 28px  | Compact control height          |
| `--ran-size-6` | 30px  | —                               |
| `--ran-size-7` | 32px  | Default control height          |

**This is a separate scale from spacing on purpose**, and mixing them is a machine-checked
error (`sizing-scale`). The two have different ranges and progressions (a 4px-doubling
spacing scale produces awkward values for icon and control sizes), and a consumer must be able
to retune one without disturbing the other: an icon getting bigger should not also widen every
gap that happens to share its pixel value. Where a step coincides numerically with a spacing
step (`--ran-size-4` and `--ran-space-6` are both 24px) that is coincidence, not aliasing.

A genuinely one-off dimension that no other component shares (a menu's `min-width`, say) stays
a plain component token with its own literal fallback rather than being forced onto a step.

## Typography

| Token               | Value                                                        |
| ------------------- | ------------------------------------------------------------ |
| `--ran-font-family` | Geist / Geist Sans, then the system UI stack                 |
| `--ran-font-mono`   | Geist Mono, then `ui-monospace`, SF Mono, Menlo, Consolas, … |
| `--ran-font-size`   | `14px` (the base size)                                       |
| `--ran-line-height` | `1.5715`                                                     |

Type is organised by **role**, and the role fixes font, size, weight and line-height together:

| Role        | Use                    | Weight token                                                                   | Size tokens                               |
| ----------- | ---------------------- | ------------------------------------------------------------------------------ | ----------------------------------------- |
| **heading** | Titles                 | `--ran-text-heading-weight` (600)                                              | `--ran-text-heading-1..4` (32/24/20/16px) |
| **label**   | Single-line, scannable | `--ran-text-label-weight` (500)                                                | `--ran-text-label-1..3` (14/13/12px)      |
| **copy**    | Multi-line body        | `--ran-text-copy-weight` (400)                                                 | `--ran-text-copy-1..2` (16/14px)          |
| **button**  | Button text            | `--ran-text-button-weight` (500)                                               | `--ran-text-button-size` (14px)           |
| **mono**    | Code, data, eyebrows   | `--ran-text-mono-weight-regular` (400) / `--ran-text-mono-weight-medium` (500) | borrows the label / copy sizes            |

Two tokens exist only to make a role land correctly:

| Token                           | Value     | Why                                                    |
| ------------------------------- | --------- | ------------------------------------------------------ |
| `--ran-text-heading-tracking`   | `-0.03em` | Headings need tighter tracking at display sizes.       |
| `--ran-text-button-line-height` | `1`       | Crisp vertical centring inside a fixed-height control. |

Geist caps weight at 600 (semibold). Emphasis comes from size and spacing, not from a heavier
face. There is no `--ran-text-copy-3`: the 12px step is `--ran-text-label-3`.

### Fonts

ranui self-hosts both faces (variable weight 100–900, SIL OFL 1.1), so one import loads them
with no CDN dependency:

```js
import 'ranui/fonts'; // bundlers
```

```html
<link rel="stylesheet" href="…/ranui/dist/fonts/fonts.css" />
```

Without it the tokens fall back to system font stacks; everything still works, just without
the Geist faces.

## Radius

| Token               | Value    | Use for                         |
| ------------------- | -------- | ------------------------------- |
| `--ran-radius-sm`   | `6px`    | Controls: button, input, select |
| `--ran-radius-md`   | `12px`   | Cards, dialogs                  |
| `--ran-radius-lg`   | `16px`   | Large surfaces                  |
| `--ran-radius-full` | `9999px` | Pills, avatars                  |

## Elevation

Shadow is a **role**, not decoration. Pick the tier by what the element is. Dark mode replaces
all three, because a shadow tuned for a white page disappears on a black one.

| Token                   | Use for                                                              | Light                                                           | Dark                                                                                        |
| ----------------------- | -------------------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `--ran-shadow-elevated` | In-flow surfaces that also have a border: `r-card`, `r-section`      | `0 1px 2px rgba(0,0,0,.04), 0 2px 4px -2px rgba(0,0,0,.05)`     | `0 1px 2px rgba(0,0,0,.16)`                                                                 |
| `--ran-shadow-menu`     | Transient layers over content: dropdown, select menu, popover, toast | `0 2px 4px rgba(0,0,0,.05), 0 8px 24px -6px rgba(0,0,0,.14)`    | `0 1px 1px rgba(0,0,0,.2), 0 4px 8px -4px rgba(0,0,0,.4), 0 16px 24px -8px rgba(0,0,0,.5)`  |
| `--ran-shadow-modal`    | Blocking dialogs: `r-modal`                                          | `0 4px 12px rgba(0,0,0,.08), 0 20px 48px -12px rgba(0,0,0,.22)` | `0 1px 1px rgba(0,0,0,.2), 0 8px 16px -4px rgba(0,0,0,.4), 0 24px 32px -8px rgba(0,0,0,.5)` |

Borderless overlays rely on the shadow alone for separation, so the overlay tiers carry real
weight; an overlay falling back to the raised tier looks flat and pinned to the page.

## Stacking

Floating overlays portal to `<body>`, so they need an explicit tier:

| Token              | Default | Use for                                                                                      |
| ------------------ | ------- | -------------------------------------------------------------------------------------------- |
| `--ran-z-modal`    | `1000`  | Blocking dialogs and their mask                                                              |
| `--ran-z-dropdown` | `1100`  | Dropdown / select menu / popover: **above** modal, so a select inside a dialog stays visible |
| `--ran-z-message`  | `1200`  | Toasts and notifications: always on top                                                      |

The ladder starts at 1000 so it clears ordinary page chrome (nav bars and backdrops normally
live in the tens). Override a tier on `:root`, or per component
(`--ran-dropdown-host-z-index`, `--ran-modal-root-z-index`, `--ran-message-z-index`), never
with `!important`.

## Motion

| Token                        | Value   | Use                              |
| ---------------------------- | ------- | -------------------------------- |
| `--ran-motion-duration-fast` | `0.15s` | Hover / active state transitions |
| `--ran-motion-duration-base` | `0.2s`  | Popovers, menus                  |
| `--ran-motion-duration-slow` | `0.35s` | Larger reveals                   |

| Easing token                 | Curve                               | Character                            |
| ---------------------------- | ----------------------------------- | ------------------------------------ |
| `--ran-motion-ease-standard` | `cubic-bezier(0.645,0.045,0.355,1)` | In-out, general purpose              |
| `--ran-motion-ease-snappy`   | `cubic-bezier(0.33,0,0.15,1)`       | Quick, no overshoot: toggles         |
| `--ran-motion-ease-spring`   | `cubic-bezier(0.34,1.26,0.5,1)`     | Slight overshoot: buttons, cards     |
| `--ran-motion-ease-bouncy`   | `cubic-bezier(0.34,1.56,0.64,1)`    | Playful overshoot: like, add-to-cart |
| `--ran-motion-ease-smooth`   | `cubic-bezier(0.4,0,0.2,1)`         | Calm, no overshoot: reveals, layout  |

The spring family is distilled from tuned SwiftUI springs (response/damping reduced to a
single-overshoot bézier).

**Pair these with motion properties only**: `transform`, `opacity`, box geometry. Palette
properties (`background-color`, `color`, `border-color`, `box-shadow`, `fill`, `stroke`)
deliberately carry no default transition, because CSS cannot tell an interaction apart from a
theme flip: any fade you add to a colour also fires when light↔dark switches. Every component
still exposes a `--ran-*-transition` hook if you want to opt back in.

## Focus

| Token                            | Value                                                                | For                                                         |
| -------------------------------- | -------------------------------------------------------------------- | ----------------------------------------------------------- |
| `--ran-focus-ring`               | `0 0 0 2px var(--ran-background-100), 0 0 0 4px var(--ran-blue-700)` | The standard ring, as a `box-shadow`                        |
| `--ran-focus-ring-inverse-color` | `#fff`                                                               | The ring colour for a surface that is dark in _both_ themes |

The ring is two layers: a background-coloured inner ring and a blue outer one, so it stays
visible on any surface, and it stays blue rather than following the now-monochrome primary.

`--ran-focus-ring-inverse-color` is **deliberately not redefined in dark mode**: it exists for
a component whose own surface is fixed-dark regardless of page theme (`r-player`'s control bar,
over arbitrary video), and that surface does not change when the page does.

## Skin primitives

The few structural values components share that are not colour, size or type. Kept minimal on
purpose: this layer used to be much larger and most of it was removed with the theme packs.

| Token                           | Value                        | For                                                                         |
| ------------------------------- | ---------------------------- | --------------------------------------------------------------------------- |
| `--ran-skin-border-width`       | `1px`                        | The border width components draw                                            |
| `--ran-skin-border-style`       | `solid`                      | The border style components draw                                            |
| `--ran-skin-border-image-width` | `4px`                        | `border-image-slice`'s inset, shared by button/checkbox/input/modal/message |
| `--ran-skin-raised-shadow`      | `var(--ran-shadow-elevated)` | The raised-surface shadow, indirected so a skin can change it               |
| `--ran-skin-font-family`        | `var(--ran-font-family)`     | The family components use, indirected the same way                          |

## What dark mode redefines

`data-ran-theme="dark"` on `<html>` (or on any subtree, see [theming](/src/ranui/theme/))
redefines **the base palette and nothing else**, with three exceptions that cannot resolve
through a scale:

- the whole of layer 1: every step of gray, gray-alpha, blue, red, amber, green, and both
  backgrounds;
- `--ran-color-bg-elevated`, which points at `--ran-gray-100` in dark so a card lifts off a
  black page instead of vanishing into it;
- `--ran-color-primary-hover` / `-active`, which are literals rather than scale references;
- all three shadow tiers, retuned for a dark ground.

Everything else (every other semantic token, every size, every duration) is defined once.

## Component tokens

Below the semantic layer, every component exposes its own hooks, named:

```
--ran-{component}-{element}[-{state}]-{property}
```

for example `--ran-btn-hover-background`, `--ran-select-search-active-border-width`. They
default to semantic tokens: `var(--ran-btn-background, var(--ran-color-primary, #171717))`,
so overriding a semantic token reaches all of them, and overriding a component token narrows
the change to one element.

The full generated list is
[style-tokens-public.md](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/style-tokens-public.md)
in the repository; the per-element API is [here](/src/ranui/api). For how to apply them, see
[Theming](/src/ranui/theme/#customizing-tokens).

## Using tokens in your own CSS

```css
.panel {
  background: var(--ran-color-bg-elevated);
  color: var(--ran-color-text);
  border: var(--ran-skin-border-width) var(--ran-skin-border-style) var(--ran-color-border);
  border-radius: var(--ran-radius-md);
  padding: var(--ran-space-4);
  box-shadow: var(--ran-shadow-elevated);
}
```

Three rules keep that dark-safe:

1. **No raw hex** for anything that should follow the theme.
2. **A fallback must name a token that flips**: `var(--ran-color-text, var(--ran-gray-1000))`,
   never `var(--ran-color-text, #171717)`.
3. **A fallback must name a token that exists**, or the declaration is dropped and the element
   silently keeps whatever it inherited.

> Every global token the library declares is listed on this page, and a unit test fails if one
> is added without being documented here. Component-scoped tokens are generated separately, in
> [style-tokens-public.md](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/style-tokens-public.md).
