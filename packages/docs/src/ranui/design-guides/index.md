---
description: 'Design rules for building screens with ranui: pick a role and let the token supply the value, design every reachable state, and verify what actually rendered.'
---

# Design guidelines

The rules a screen built out of ranui components should follow so it reads as **one system**
rather than a pile of parts.

This page is about **judgement**: which token to reach for, what to check before shipping.
The token catalog itself is the [design system](/src/ranui/design-system/); switching and
overriding at runtime is [theming](/src/ranui/theme/). The full, machine-enforced version of
these rules lives in the repository as
[`packages/ranui/docs/DESIGN.md`](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/DESIGN.md).

> **Use when** you are laying out a page or building an app-level component out of `<r-*>`
> elements and have to decide a color, a gap, a text size, a shadow or a motion duration. The
> short answer is always the same: **pick a role, and let the token supply the value.**

## Principles

1. **Clarity before personality.** The primary task and the primary action must be
   unmistakable before anything else is considered.
2. **Compose, don't re-invent.** Reach for `r-button`, `r-input`, `r-select`, `r-modal` before
   building a primitive out of `div`s: the components already carry the focus, keyboard and
   ARIA behaviour you would otherwise have to re-derive.
3. **Tokens, never raw values.** A hex code, a `20px` gap or a hand-picked shadow is a decision
   that will not follow the theme.
4. **Decide by role and state, not by eye.** "What is this text?" (heading / label / copy /
   button) has an answer; "what size looks right?" does not.
5. **Design every reachable state.** Default, hover, active, focus, disabled, loading, empty,
   error. The happy path is one of eight.
6. **Verify what rendered.** In light _and_ dark, narrow _and_ wide, mouse _and_ touch. Review
   does not catch a shadow you cannot see.

Conflict order when two rules pull apart: **user goals → verified evidence → these guidelines
→ shipped patterns → general heuristics.**

## Choosing a color

Color is assigned by **role and state**, never picked by eye. The
[ladder](/src/ranui/design-system/#the-ladder) has already decided what hover and active look
like; your job is to name the role.

| The element is…                   | Use                                                            |
| --------------------------------- | -------------------------------------------------------------- |
| A page or surface background      | `--ran-color-bg` / `-bg-subtle` / `-bg-elevated` / `-bg-muted` |
| Under the pointer / being pressed | `--ran-color-bg-hover` / `-bg-active`                          |
| Text                              | `--ran-color-text` / `-text-secondary` / `-text-disabled`      |
| A border                          | `--ran-color-border` / `-hover` / `-active`                    |
| The one action the screen is for  | `--ran-color-primary` (+ `--ran-color-primary-text` on it)     |
| A status                          | `--ran-color-success` / `-warning` / `-danger`                 |
| A link                            | `--ran-color-link`                                             |

**Accents have one meaning each.** Primary is monochrome (black-on-white in light,
white-on-black in dark), so don't recruit blue for it: blue belongs to links and the focus
ring. Green is success, amber is warning, red is danger; using red for emphasis spends a signal
you will want later.

**Three rules that prevent silent breakage:**

- Never hard-code a hex or `rgb()` for a value that should follow the theme.
- A fallback must name a **token that flips**: `var(--ran-color-text, var(--ran-gray-1000))`,
  never `var(--ran-color-text, #171717)`: a light-only literal disappears in dark mode.
- A fallback must name a token that **exists**. `var()` on an undeclared property resolves to
  nothing, the whole declaration is dropped, and the element keeps whatever it inherited,
  which usually looks _almost_ right. (`--ran-color-error` does not exist; it is
  `--ran-color-danger`.)

## Spacing and rhythm

Take every gap from the [nine-value scale](/src/ranui/design-system/#spacing), and let the
distance carry meaning:

- **8px** between elements inside a group.
- **16px** between groups.
- **32–40px** between sections.

Don't invent `20px` or `28px`. The limited set is what produces the page's rhythm; one
off-scale gap is what breaks it. Keep shared spines across regions (edges, baselines and
columns that line up) and verify alignment against the rendered pixels rather than by eye.

## Choosing type

Ask what **role** the text plays (heading, label, copy, button, mono) and the font, size,
weight and line-height all follow from the
[type scale](/src/ranui/design-system/#typography). Don't pick raw px per instance.

A role is a tool, not a law: genuinely one-off decorative text (a gesture-flash overlay, an
active-link weight bump) is better off with its own component token than forced into the
nearest role.

## Depth: shadow and stacking

**Pick the shadow tier by what the element is** (in-flow surface, floating overlay, or
blocking dialog) and make sure it is actually perceptible. A shadow nobody can see has failed
its job, and an overlay that falls back to the card tier looks pinned to the page.

**Embedding ranui overlays in your own chrome.** The [z-index
ladder](/src/ranui/design-system/#stacking) starts at 1000 precisely so it clears ordinary page
chrome. A portaled overlay therefore needs no help from you. But a `position: fixed` overlay
that stays inside its own shadow DOM (`r-modal`'s dialog) only escapes as far as its nearest
ancestor **stacking context**, so if you wrap embedded content in anything that creates one
(`isolation`, `opacity < 1`, `transform`, `filter`, `will-change`), that wrapper has to be
elevated for the dialog to climb back out. Scope the escalation to when an overlay is
_actually_ open:

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

A blanket `z-index` on the wrapper elevates _everything_ inside it (including entirely static
content) over your sticky header for its whole scroll lifetime. That bug shipped on this very
site once. Match `closing` as well as `open`: the mask keeps painting for the length of its
transition after `open` is removed.

## Motion

The bigger the change, the more time it earns; below that threshold, don't animate. Hover and
active feedback is ~150ms, menus ~200ms, dialogs ~300ms, and a change that is already obvious
gets 0ms. Respect `prefers-reduced-motion`.

**Never let a palette property transition.** CSS cannot tell _why_ a color changed, so a
`transition` on `background-color`, `color`, `border-color`, `box-shadow`, `fill` or `stroke`
also fires when the **theme** flips, with every element fading at its own pace while the rest
of the page has already switched. Animate motion properties (`transform`, `opacity`, geometry)
instead. `transition: all` and bare shorthands like `transition: 0.2s` mean _all_, palette
properties included; both are banned in ranui's own styles and are a bad idea in yours.

## States and content

Every reachable state is part of the design: **hover, active, focus, disabled, loading, empty,
error**. Map them onto the ladder: hover → `bg-hover` / `border-hover`; active → `bg-active`;
disabled → `text-disabled` plus reduced opacity; focus → the focus ring.

Nothing non-interactive may look interactive. `r-card` only reacts to hover with the
`hoverable` attribute; leave it off for cards that don't click.

Copy is part of the system too:

- **Buttons** take an action **and** an object. ✅ "Delete member" ❌ "Delete", "OK".
- **Errors** say what happened, then how to fix it. ✅ "Build failed: the bundle exceeds the
  size limit. Reduce it or raise the limit." ❌ "Operation failed, please try again."
- **Confirmations and toasts** state the change, not the success. ✅ "Project deleted"
  ❌ "Successfully deleted" (the toast appearing already says it succeeded).
- Let context remove redundancy: a dialog titled "Delete project" does not need a button
  labelled "Delete project permanently, forever".

## Accessibility

- Meet **WCAG AA** contrast for text against its background.
- **Never signal state with color alone**: pair it with an icon, a label or text.
- Every interactive element keeps a **visible focus ring** (`--ran-focus-ring`, or
  `outline: 2px solid var(--ran-color-primary); outline-offset: 2px`). Never remove it for
  tidiness.
- **Everything is reachable by keyboard.** Nothing is mouse-only.
- Respect `prefers-reduced-motion` and `prefers-color-scheme`.

## Mouse and touch, narrow and wide

Neither input nor viewport is the secondary target.

- Drag, slider and gesture interactions use **Pointer Events** (`pointerdown` / `pointermove` /
  `pointerup` / `pointercancel`), never `mouse*` alone, paired with `touch-action: none` on the
  exact drag surface. CSS declaring `touch-action: none` with no pointer handler behind it is a
  broken control, not a harmless no-op.
- A **hover-only affordance needs a tap fallback**. `trigger="hover"` on `r-select` or
  `r-popover` degrades to click on touch devices; anything you build must do the same.
- Prefer **viewport-relative sizing** (`%`, `min()`, `max()`, `clamp()`, `vw`/`vh`, e.g.
  `min(560px, calc(100vw - 32px))`) over inventing a breakpoint. ranui has no shared
  breakpoint token, so every hard breakpoint is a one-off number someone has to maintain.
- **Never hide the only way to do something on mobile.** Reflow instead of `display: none`.
- **A measured position is only correct until the next reflow.** Anything derived from
  `getBoundingClientRect()` goes stale on resize, on container reflow, and (for a portaled
  panel) on scroll. Re-measure on those events, not only on the interaction that first
  triggered the measurement. Loading a page at a narrow width exercises the initial layout;
  it does not exercise _resizing into_ it, which is where this bug class actually appears.

## What the library enforces mechanically

Nine of these rules are checked by `pnpm -F ranui verify:design`, which CI runs on ranui's own
source: dark-unsafe color fallbacks, raw color literals, the spacing scale, the sizing scale,
mouse-only drag loops, `:host` display rules that break `hidden`, fallbacks naming undeclared
tokens, components querying their own shadow tree, and shadow trees built outside the
constructor. Known violations are ratcheted in a baseline file, so a new one cannot be added
and a fix cannot be silently undone.

That gate covers the library, not your application, but the failure modes it catches (a
fallback naming a token that does not exist; a color that only works in light mode) are exactly
the ones that look fine in review, so the same rules are worth applying to your own CSS.

## Checklist before shipping UI

- [ ] Primary task and primary action are unmistakable.
- [ ] Works in **light and dark**, at **narrow and wide** widths.
- [ ] Works with **mouse and touch**; any hover trigger has a tap fallback.
- [ ] All states exercised: hover, active, focus, disabled, loading, empty, error.
- [ ] Keyboard and focus verified; focus visible everywhere.
- [ ] Edge cases: long text, large numbers, both locales.
- [ ] Spacing from the scale, type by role, color from semantic tokens.
- [ ] No palette property in a `transition`; no `transition: all`.
- [ ] Copy names the object; nothing signals state by color alone.
