# Ran Design

A one-page checklist for anyone, person or coding agent, building the interface of a web product.
Use it before you start, while you build, and before you hand a change back. It assumes the product
already has tokens and components; it is about using them well.

**MUST** marks a defect a user can observe, and nothing else is a MUST. **SHOULD** is a starting
point, not a limit: depart from it whenever the work is better for it, and say why. Items marked **(checked)** are enforced by a test in this repository; the table at the end says
which one. Everything else needs your eyes in a real browser.

ranui's [implementation adapter](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/adapters/DESIGN.md) maps these items to ranui's tokens,
stacking tiers and component specifics.

## Before you start

Answer three questions before you change what a page shows; for a page or region you are building or
restructuring, write the answers down:

1. What does the reader need to see on arrival?
2. What else must be visible for that to make sense?
3. What do they do next?

A page has one primary model and one primary action per region. Choose the layout from the reader's
question: compare → table, recognise and open → list, one object's state → sectioned detail, stages
→ step flow, what happened → timeline, continuous text → document. Put identity and status first,
the primary action in the title region, and feedback beside the action that caused it.

Name the surface's mode, because it decides how much expression the page can spend. A tool
(dashboards, settings, editors) and a document (docs, articles, changelogs) spend it on precision and
restraint, in patterns the reader already knows; a page that persuades (a landing or pricing page) can
commit to a bold point of view, carried by one signature idea it will be remembered for rather than
several effects competing for the same attention. The mode comes from the surface, not the product: a tool's landing page
persuades, its documentation reads.

## The five-second test

From Steve Krug's _Don't Make Me Think_: show the first screen to someone for five seconds, hide it,
and ask what the page is, who it is for and what they would do next. If they cannot answer, the
hierarchy has failed, whatever the details look like.

- The page name is a single, visible heading on the first screen at 320px and at desktop width.
  **(checked)**
- One thing leads. Squint: the screen should reduce to two or three masses of clearly different size.
- The primary action is a real button or link on the first screen, named for what it does.

## The trunk test

Also from Krug: drop a reader on any page, as if they had been carried there in a car boot. They
MUST be able to answer, without scrolling:

- **Which site is this?** A site identity that links home. **(checked)**
- **Which page am I on?** One page heading, matching the link they followed. **(checked: one heading)**
- **What are the main sections?** The primary navigation, in the header or one tap away in a
  drawer. **(checked)**
- **Where am I in them?** The current section and page are marked, not only by colour.
  **(checked: `aria-current`)**
- **How can I search?** Search is visible or one tap away where the site has it. **(checked)**

## Visual language

- Emphasis is a budget: colour, weight, badges and elevation are rare, so they mean something.
- Reach for spacing, alignment and weight before a border, fill or shadow. Every remaining boundary
  has a job you can name.
- Spacing comes from a 4px scale, and a smaller gap means a closer relationship: 4px inside one
  control, 8px between related controls, 16px between groups, 24–32px between regions. Hidden
  content leaves no gap. **(checked: off-scale spacing)**
- Colours come from tokens and work in both themes; state is never shown by colour alone.
  **(checked: raw colours and light-only fallbacks)**
- MUST: text meets WCAG AA contrast (4.5:1, large text 3:1) on the real composition, in both themes.
  The first paint already follows the reader's theme; nothing flashes light before going dark.
- Nested corners use **inner radius = outer radius − inset**. When that leaves 2px or less, give the
  inner shape its own radius, or remove the inner box.

![A card with radius 16, an inset panel 8px inside it with radius 8, and a button 4px inside that with radius 4, their corner arcs sharing one centre; beside it, an inner panel that keeps radius 16 makes the band swell from 8px on the edges to about 11px at the corner](./assets/radius-nesting.svg)

- Name the alignment spines, and put headings, rows, actions and empty states on them. Follow the
  left edges of the text blocks down the page: two or three positions, reused on purpose.

![Three vertical alignment spines through a page: navigation, content and nested form labels, with headings, rows, actions and the empty state all sitting on their declared spine](./assets/alignment-spines.svg)

- Use few type sizes, far apart. Body text keeps a measure of about 45–75 characters and a leading of
  at least 1.5; text a reader needs is never below 12px. **(checked)**
- A heading has more space above it than below, so it binds to what it introduces. **(checked)**
  Headings wrap with `text-wrap: balance`, paragraphs with `text-wrap: pretty`.
- The surfaces the browser draws still carry the design: text selection, the caret, focus rings,
  scrollbars and the numerals in tables (`tabular-nums`). Theme them from the tokens.

- Decoration is a decision, not a default. When an eyebrow label, a gradient, a glow or a card around
  everything appears, check that it does a job on this page; remove it if it only fills space.

## Layout

- MUST: no horizontal page scroll at 320px; wide tables and code scroll inside their own box.
  **(checked)**
- MUST: nothing shifts on load, on a status change, or when a late component registers. Reserve
  the box for anything that loads or appears later. **(checked: shift on load, Chromium)**
- MUST: text, headings, values and navigation are readable on first paint, without script and
  without animation. **(checked on the home page)**
- A component's box contains everything it paints. Rotated, fanned or offset parts stay inside it.
- MUST: text and values are never clipped. If something must truncate, the full value stays
  reachable (a tooltip, an expanded row, the detail page).
- Actions stay reachable without hover, and at every width.

## Interaction

- MUST: every action works with keyboard, touch and pointer. Focus is always visible, follows
  reading order, and returns to the trigger when an overlay closes. **(checked: visible focus on the
  first tab stops of key pages)**
- MUST: touch and pointer targets are at least 24×24px, or spaced so a 24px circle around each does
  not touch its neighbours (WCAG 2.5.8). Links inside running text are exempt. **(checked)**
- MUST: input is never lost. Drafts, focus, caret and reading position survive updates, failures and
  animation. Do not replace an input someone is typing in.
- Validation sits on the field; one activation sends once; success appears only after it is
  confirmed; a failure keeps every entry and says how to recover.
- Each async result is tied to the request that produced it, so a late answer never overwrites a
  newer one, and a background update never moves focus.
- A modal is for a short confirmation or one answer the task cannot continue without, not a place to
  navigate; transient context belongs in a popover, peer views of one object in tabs, and a second
  task on its own page.
- A modal dialog keeps focus inside it until it closes. Enter never submits while an input method is
  still composing text.
- Selection looks different from hover. A link navigates; a button changes state.

## Motion

![Three position-over-time curves: entering decelerates over 250–400ms and settles on the target without passing it; leaving accelerates over 150–200ms; a third curve, marked as one to avoid, overshoots the target and comes back](./assets/motion-curves.svg)

- Feedback (hover, focus, press) is 0–100ms. Entering is 250–400ms and decelerates without
  overshoot; leaving is 150–200ms and accelerates. Theme switches are not animated.
- Controls and content settle without bounce or elastic easing; a page that persuades may spend one
  expressive moment.
- Prefer `transform` and `opacity`; neighbours make room by transform (FLIP). Never animate layout
  (`height`, `padding`, `max-height`, `top`, `left`), which reflows the page every frame, and never use
  `transition: all`.
- MUST: under reduced motion nothing travels or keeps running; at most a short fade. **(checked)**
- Motion is interruptible and reverses cleanly. Watch it as a recording, not a still.

## Words

From Krug again: remove half the words, then half of what is left.

- Name actions for what they do ("Send invite", not "Submit"). No welcome text or instructions that
  restate the layout.
- Keep what adds a decision, constraint or consequence: accessible names, field labels, units,
  errors and risk disclosures.
- Errors say what happened and what to do next, beside the thing that failed.
- Say the product's own thing. Generic marketing words (empower, seamless, next-generation) and
  dashes used for rhythm read as copy nobody wrote.
- Sentence case. Try long text, large numbers and every locale the product ships.

## Verifying a change

- Open the change in a real browser, in both themes, at 320px and at desktop width, and walk it with
  the keyboard. Exercise the states it touched: hover, focus, disabled, loading, empty, error.
- Judge from screenshots, not from the code you wrote: you will read your intentions into the code.
- Run the five-second and trunk tests on any page whose structure changed.
- Report what you observed, what you only inferred and what you could not check. Do not call your own
  review acceptance.
- Rank findings so the reader fixes the right thing first: **P0** blocks use (lost input, unreadable
  text, an unreachable action), **P1** breaks a MUST, **P2** departs from a SHOULD without a reason,
  **P3** is polish.
- Write each fix as values, not adjectives: "48px to `clamp(40px, 6vw, 72px)`", not "bigger".

## What the checks cover

| Item                                                     | Check                                                 |
| -------------------------------------------------------- | ----------------------------------------------------- |
| Raw colours, light-only fallbacks, off-scale spacing     | `verify:design` (static, configured packages)         |
| Measure, leading, text size, heading spacing             | `packages/docs/test/browser/design-checklist.spec.ts` |
| No horizontal scroll; navigation reachable; still motion | `packages/docs/test/browser/site-layout.spec.ts`      |
| Five-second heading, trunk test, targets, focus, shift   | `packages/docs/test/browser/design-checklist.spec.ts` |
| Readable without script or entrance motion               | `packages/docs/test/browser/layout-audit.spec.ts`     |
