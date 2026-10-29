---
description: 'How to apply ranui on a screen: pick a role and let the token supply the value, design every reachable state, and check what actually rendered.'
---

# Design guidelines

How to apply ranui on a real screen: choose a role and a state, and let the tokens supply the values.

The rules themselves live in two places, and this page links to them rather than restating them: the
[design guide](/src/design/guide) for the method that applies to any product, and the
[ranui implementation adapter](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/adapters/DESIGN.md)
for ranui's tokens, tiers and component rules. Both ship in `node_modules/ranui/docs/DESIGN.md`. The
[design system](/src/ranui/design-system/) lists every token and its value,
[theming](/src/ranui/theme/) covers runtime overrides, and
[information architecture](/src/ranui/information-architecture/) covers page structure.

> **Use when** choosing color, spacing, type, depth or motion for a screen built with `<r-*>` elements.

## Principles

1. **Clarity before personality.** The primary task and the primary action are unmistakable first.
2. **Reuse existing controls.** `r-button`, `r-input`, `r-select` and `r-modal` already carry form,
   keyboard and accessibility behavior; restyle them rather than rebuilding them.
3. **Decide by role and state.** "What is this text?" has an answer; "what size looks right?" does
   not. The token for the role supplies the value, and it follows the theme.
4. **Design every reachable state, and look at the result.** The default state is one of eight, and a
   shadow nobody can see shows up only in a browser.

These are starting points. Depart from one when the screen is better for it, and say why.

## Choosing a color

The [ladder](/src/ranui/design-system/#the-ladder) already decides what hover and active look like;
your job is to name the role.

| The element is…                   | Use                                                            |
| --------------------------------- | -------------------------------------------------------------- |
| A page or surface background      | `--ran-color-bg` / `-bg-subtle` / `-bg-elevated` / `-bg-muted` |
| Under the pointer / being pressed | `--ran-color-bg-hover` / `-bg-active`                          |
| Text                              | `--ran-color-text` / `-text-secondary` / `-text-disabled`      |
| A border                          | `--ran-color-border` / `-hover` / `-active`                    |
| The one action the screen is for  | `--ran-color-primary` (+ `--ran-color-primary-text` on it)     |
| A status                          | `--ran-color-success` / `-warning` / `-danger`                 |
| A link                            | `--ran-color-link`                                             |

**Accents have one meaning each.** Primary is monochrome, so blue is left for links and the focus
ring; green is success, amber warning, red danger. Using red for emphasis leaves nothing to say
"danger" with later.

A raw hex, a fallback that does not flip with the theme, or a fallback naming a token that does not
exist breaks silently in dark mode or drops the whole declaration; the adapter's
[color rules](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/DESIGN.md#ranui-color)
explain each, and `verify:design` catches them in ranui's own source.

## Spacing and rhythm

Take gaps from the [4px scale](/src/ranui/design-system/#spacing) and let the distance carry meaning:

- **8px** between elements inside a group.
- **16px** between groups.
- **24–32px** between regions.

A smaller gap means a closer relationship, so one off-scale gap is what breaks the rhythm. Give each
gap one owner: count a child's margin and the parent's padding before adding a third space between
them.

## Choosing type

Ask what **role** the text plays (heading, label, copy, button, mono); the font, size, weight and
line height follow from the [type scale](/src/ranui/design-system/#typography). Genuinely one-off text,
such as a gesture flash on a video, is better off with its own component token than forced into the
nearest role.

## Depth: shadow and stacking

Pick the shadow tier by what the element is: an in-flow surface, a floating overlay or a blocking
dialog. An overlay that falls back to the card tier looks pinned to the page.

**Embedding ranui overlays in your own chrome.** The [z-index ladder](/src/ranui/design-system/#stacking)
starts at 1000, so a portaled overlay clears ordinary page chrome on its own. A `position: fixed`
overlay that stays inside its own shadow DOM (`r-modal`'s dialog) escapes only as far as its nearest
ancestor **stacking context**. If you wrap embedded content in something that creates one
(`isolation`, `opacity < 1`, `transform`, `filter`, `will-change`), raise that wrapper only while an
overlay is actually open:

```css
.embed {
  isolation: isolate; /* cheap: no z-index of its own, so nothing is promoted */
}
/* Escalate only while a real overlay is open — never "just in case" */
.embed:has(r-modal[open]),
.embed:has(r-modal[closing]) {
  position: relative;
  z-index: 100;
}
```

A permanent `z-index` on the wrapper lifts everything inside it, static content included, over your
sticky header for its whole scroll lifetime; that shipped on this site once. Match `closing` as well
as `open`: the mask keeps painting through its closing transition.

## Motion {#motion}

Frequent feedback (hover, focus, press) is immediate. When motion explains a change, feedback stays
within 0–100ms, entering takes 250–400ms and decelerates, and leaving takes 150–200ms and accelerates.
Keep it interruptible and respect `prefers-reduced-motion`.

**Never let a color property transition.** CSS cannot tell _why_ a color changed, so a `transition`
on `background-color`, `color`, `border-color`, `box-shadow`, `fill` or `stroke` also fires when the
**theme** flips: every element fades at its own pace while the page has already switched. Animate
`transform` and `opacity` instead. `transition: all` and a bare `transition: 0.2s` include color too.

## States and content

Every reachable state is part of the design: hover, active, focus, disabled, loading, empty, error.
Hover maps to `bg-hover` / `border-hover`, active to `bg-active`, focus to the focus ring. Nothing that
does not click looks clickable: `r-card` reacts to hover only with `hoverable`.

Copy is part of the system too:

- **Buttons** name the outcome, with the object when context does not supply it: "Delete member". A
  clearly named dialog may say "Delete"; avoid a generic "OK".
- **Errors** say what happened, then how to fix it. ✅ "Build failed: the bundle exceeds the size
  limit. Reduce it or raise the limit." ❌ "Operation failed, please try again."
- **Confirmations** state the change, not the success, and appear only once it is confirmed.
  ✅ "Project deleted" ❌ "Operation successful".
- Let context remove redundancy: a dialog titled "Delete project" does not need a button labelled
  "Delete project permanently, forever".

## Accessibility {#accessibility}

- Meet **WCAG AA** contrast for text against its background.
- **Never signal state with color alone**: pair it with an icon, a label or text.
- Every interactive element keeps a **visible focus ring** (`--ran-focus-ring`, or
  `outline: 2px solid var(--ran-color-focus); outline-offset: 2px`).
- **Everything is reachable by keyboard.**
- Respect `prefers-reduced-motion` and `prefers-color-scheme`.

## Mouse and touch, narrow and wide

Neither input nor viewport is the secondary target.

- Drags, sliders and gestures use **Pointer Events**, with `touch-action: none` on the exact drag
  surface. `touch-action: none` with no pointer handler behind it is a broken control.
- A **hover-only affordance needs a tap fallback**. `trigger="hover"` on `r-select` or `r-popover`
  becomes a click on touch devices; anything you build should do the same.
- Prefer **viewport-relative sizing** (`min(560px, calc(100vw - 32px))`, `clamp()`) to inventing a
  breakpoint: ranui has no breakpoint token, so each hard breakpoint is a number someone maintains.
- **Never hide the only way to do something on mobile.** Reflow it instead.
- **A measured position is correct only until the next reflow.** Anything derived from
  `getBoundingClientRect()` goes stale on resize, on container reflow and, for a portaled panel, on
  scroll. Loading at a narrow width does not exercise _resizing into_ it, which is where this breaks.

## What the library enforces mechanically

`pnpm -F ranui verify:design` checks nine rules in ranui's own source: color fallbacks that do not
flip, raw color literals, the spacing and sizing scales, mouse-only drags, `:host` rules that break
`hidden`, fallbacks naming undeclared tokens, components searching their own shadow tree, and shadow
trees built outside the constructor. A line that breaks a rule on purpose says so with
`design-ok: <rule> <reason>`. The checks cover only the configured source roots; an application that
uses ranui runs its own checks and looks at its own pages.

## Design examples {#design-examples}

<DesignIllustrations />

## Evidence and acceptance {#evidence-and-acceptance}

The guide's [verifying a change](/src/design/guide#verifying-a-change) says what to check in a real
browser and what to report: what you observed, what you only inferred, and what you could not check.
An agent's review is not the user's acceptance.
