<!-- Generated from design/DESIGN.md; edit the source, then run sync:agent-plugin. -->

# Ran Design

This guide is for people and coding agents who build the interface of a web product, whatever the
stack. It describes how a screen should be structured, how it should look, how it should behave
under input, how it should move, and how to prove that a change works. It assumes you are working
inside an existing product with its own tokens and components; it tells you how to use them well,
not which ones to pick.

Three words carry weight. **MUST** marks a requirement whose violation a user can observe: a lost
draft, a focus that disappears, text you cannot read. Breaking one is a defect. **SHOULD** is the
default; depart from it when the case in front of you gives a concrete reason, and say what that
reason is. **MAY** is an option. Everything else is explanation.

A few rules are checked by machine: `verify:design` flags light-only colour fallbacks, raw colours,
off-scale spacing, drags without Pointer Events, a broken `hidden` attribute and a handful of
component-construction mistakes. Most of this guide cannot be checked statically. Layout, focus,
motion and contrast are only proven in a real browser, at real widths, in both themes.

ranui's [implementation adapter](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/adapters/DESIGN.md) maps these methods to
ranui's tokens, stacking tiers and component specifics. This guide stays library-agnostic.

## Principles

**The task comes first.** Decide what the reader needs to see, understand and do before choosing a
single component.

**Structure before decoration.** Spacing, alignment and type weight group content; borders, fills
and shadows are for boundaries that structure alone leaves unclear.

**Emphasis is a budget.** Colour, weight, badges and elevation only work when they are rare, so
spend them on the one thing that matters.

**State is visible and honest.** The screen shows what is actually true: selected, pending, failed,
saved. It never claims success early or hides an unresolved error.

**Input is never lost.** Drafts, focus, caret position and reading position survive updates,
failures, mode switches and animation.

**Every path works without a mouse.** Keyboard, touch and narrow screens reach every action that a
pointer at a wide width can reach.

**Motion explains a change, then gets out of the way.** It is short, interruptible and driven by
state, and the interface reads correctly with motion turned off.

**The box owns what it paints.** A component's layout box contains everything it draws and is
reserved before the component finishes loading, so nothing jumps or spills.

**Proof is observed, not assumed.** A change is done when someone has watched it work in a real
browser; a passing type check or a tidy screenshot is not that.

## Start from the task

Before drawing anything, write a short brief in the task note or design owner that already exists.
A small fix only needs the decisions it touches. "Premium", "modern" or "like product X" is a
direction to investigate, not a specification.

Answer three questions first:

1. **What does the reader need to see on arrival?** That is the primary information.
2. **What else has to be visible for it to make sense?** Related objects, context, status.
3. **What do they do next?** Judge, act, or keep reading.

A page has one primary model. Supporting information helps the reader understand or operate it; it
does not compete for the first screen. A complete API payload is not a page design: the reader still
needs an order for understanding objects, their state and their relationships, and then acting.

Then settle the parts of the brief that apply:

| Decision           | What to settle                                                                                  |
| ------------------ | ----------------------------------------------------------------------------------------------- |
| Task and hierarchy | The real content, the primary action, the first reading focus, and what can recede              |
| Shape              | Which layout answers the reader's question (see below)                                          |
| States             | Default, empty, loading, failure, long content, narrow width, and combinations of these         |
| Surfaces           | Which regions really need a boundary, and how nested radii and insets relate                    |
| Motion             | Which change it explains, its trigger and frequency, how it reverses, what reduced motion shows |
| Acceptance         | What you will observe in the browser that would prove or reject the change                      |

Choose the shape from the reader's question, not from the data's structure:

| The reader wants to…                  | Useful shape                                           |
| ------------------------------------- | ------------------------------------------------------ |
| Compare values or differences         | Table or diff                                          |
| Recognise and open a resource         | List; an image grid only when images identify items    |
| Understand one object's current state | Sectioned detail                                       |
| Understand ownership or dependencies  | Tree or adjacency list; a graph only when paths matter |
| Move work through stages              | Step flow, or a board when moving items is the work    |
| Audit what happened, when and by whom | Timeline                                               |
| Read or discuss continuous text       | Document or thread                                     |
| Judge health or spot anomalies        | Status overview                                        |
| Work through items one after another  | Master-detail                                          |

Do not confuse historical events with future steps, a filter with a board, or prose with a field
grid. A date alone does not justify a calendar. Ship several views of the same data only when each
serves a distinct task worth maintaining.

Put each kind of information where readers look for it. Identity and status belong in the title
or summary, not in the last column or behind a tab. Attributes are grouped the way people think
about them, not in API field order. Evidence sits beside the judgement it supports. The primary
action sits in the title region and the rest sit beside their object. Feedback appears beside the
action that caused it. Every fact has one authoritative location; other places show a summary
that links back.

The default reading order is: identity, then current status or exception, then the primary task
and action, then the information that judgement needs, then relationships, history and evidence,
then secondary information and rare actions.

## Visual language

### Hierarchy and the emphasis budget

Build hierarchy from type and position before reaching for a container. One step up in size and one
step down in colour turn a title and its first sentence into a title and a deck, with no box and no
border.

Treat colour, weight, badges, filled buttons and shadows as scarce. If everything is emphasised,
nothing is. Each task region gets at most one primary action, and it is the most likely next step,
not the most destructive one.

Reach for spacing, alignment, weight and a hairline before a box. A container is a claim that its
contents are a separate object. Reserve one for things that really are separate: a live demo, an
overlay, a floating panel. A code block, a table, a list row or a gallery cell does not need its own
card. Avoid nesting the same grouping twice: a panel frame, a card inside it, rules between rows
and another inset all saying "this is a group" is four boundaries doing one job.

Every persistent boundary should have a distinct job. For each remaining outline, fill or divider,
name the relationship it communicates and check what becomes ambiguous if you remove it. Keep it
when it marks where values can be entered, an independent scrolling region, a floating layer or a
drop target. Remove it when a heading and a gap already make the same group clear. Making a
redundant line fainter does not make it less redundant.

Focus rings and selection markers are never removed to make a resting layout look quieter.

### Colour and themes

Assign colour by role, not by hue: text and secondary text, surfaces, boundaries, actions and
status. Define default, hover, pressed, disabled and focus states together, as one ladder, so
they stay distinguishable from each other.

Text MUST meet WCAG AA contrast against its actual background, in every supported theme. Check
the composed result, not the token pair in isolation: text on a tinted status fill, on an image,
on a checked control or in a loading state is where contrast fails in practice.

State MUST NOT be signalled by colour alone. Pair it with an icon, text or shape: a failed check
shows a cross and the word "Failed", not only a red dot.

When the product supports light and dark, the first paint MUST follow `prefers-color-scheme` or the
stored preference, with no flash of the wrong theme. Both themes are first-class; review every
change in both.

Use the product's authoritative semantic tokens. Aliases may improve readability but resolve from
that source; never build a parallel palette. A raw colour in a component means that value will not
follow the theme, and a fallback that is a light-only literal breaks dark mode as soon as the token
is missing. `verify:design` flags both, as well as fallbacks that name a token the theme never
defines (an undefined custom property silently drops the whole declaration).

Brand accents are contextual. Use them where they identify the product, not as a general-purpose
highlight.

### Spacing as relationships

Spacing comes from a 4px scale, and each step states a relationship. A smaller gap means a tighter
relationship; that is all vertical rhythm communicates.

| Relationship                                 | Step |
| -------------------------------------------- | ---- |
| Parts of one control (icon and label)        | 4px  |
| Closely related controls (a button row)      | 8px  |
| Lines within one content group (a list item) | 12px |
| Separate groups (form groups)                | 16px |
| Related subsections                          | 24px |
| Major regions                                | 32px |

Larger steps (40, 64, 96px) separate page-level regions where the relationship warrants it. Do not
invent in-between values such as 20px or 28px; a limited set is what makes rhythm visible.
`verify:design` flags spacing written as a literal length instead of a scale token, and intrinsic
dimensions (width, height, font size, radius) drawn from the spacing scale instead of a sizing scale.

A few habits keep spacing honest:

- Decide a component's own padding before the gaps between components.
- Give each gap one owner: either the parent's `gap` or the child's margin, never both. Reset
  default heading and paragraph margins rather than adding them to a parent gap.
- Keep leading, padding and hairlines distinct. 16px of padding plus a 1px rule is not a 17px step.
- Repeat relationships, not fixed heights. Title-to-description, field-to-hint and group-to-group
  gaps should match across sibling views; their content can still grow.
- Place hints and errors with the field they explain.
- Do not undo a gap's meaning with a decorative divider.

Hidden optional content MUST leave no gap behind. A missing description, a hidden helper or an
empty error slot leaves no blank row. If a component styles its host's `display`, it must keep the
standard `hidden` attribute working; `verify:design` checks this.

If two things are one object, every property must agree. A shared border, a shared radius and a gap
between them are a contradiction. When one value must equal another, name it once as a custom
property and reference it twice, instead of writing the same literal in two places.

Reserve a column only when its content exists. A track declared unconditionally is still a column
on the pages that have nothing to put in it; condition it on the element being present (for example
with `:has()`).

### Radius and nesting

Nested corners look concentric only when the inner radius accounts for the inset between the two
shapes: **inner radius = outer radius − gap**. A 16px card with 8px of padding gives its inner panel
an 8px radius. The same card with 16px of padding leaves nothing to carry over; when the result is
2px or less, the shapes no longer read as concentric, so give the inner shape its own role radius,
or none.

![A card with radius 16, an inset panel 8px inside it with radius 8, and a button 4px inside that with radius 4, their corner arcs sharing one centre; beside it, an inner panel that keeps radius 16 makes the band swell from 8px on the edges to about 11px at the corner](./assets/radius-nesting.svg)

Before tuning nested radii, ask whether the nested surface needs to exist. Removing an unnecessary
inner box is usually better than perfecting its corners.

### Alignment

Alignment is structure, not polish. Name each alignment spine and the elements that share it:
headings, body text, list rows, actions, and the empty, loading and error content that replaces
them. A page content spine, a navigation column and a nested form-label spine can differ on
purpose; a back button and its gap may establish a separate title column. What matters is that
the difference is intended.

![Three vertical alignment spines through a page: navigation, content and nested form labels, with headings, rows, actions and the empty state all sitting on their declared spine](./assets/alignment-spines.svg)

- Measure the layer that matters. A button frame aligned with a paragraph does not prove its label
  is aligned, because internal padding moves the text. Compare text against text.
- Count every inset from the shared ancestor to the visible text: parent padding, nested panel
  padding, the control's own padding and borders.
- Remove a redundant inset where it is declared, rather than cancelling it with a negative margin.
- A nested level returns exactly to its parent's spine when it ends.
- A missing optional icon or badge should not push labels out of their column; reserve the icon
  slot or align the label to the column regardless.
- Empty states keep their region's spine and width. Extra breathing room never introduces a second
  left edge.
- When two edges or gaps are meant to be equal, a one-pixel difference is a defect. Optical
  correction for an asymmetric glyph (a play triangle, for instance) is the only tolerance, and it
  belongs in the icon asset, not in a page margin nudged until a screenshot looks balanced.

### Density

Density is effective information per screen, not controls per inch. Tightening spacing raises
visual density and leaves effective density where it was; removing irrelevant fields and putting a
comparison in one place raises the real thing.

Use at most two adjacent density levels on one page: spacious for first use and risky
confirmation, standard for most lists and details, compact for expert workbenches. Padding and line
height may tighten. Body text size, a visible focus ring and pointer target size MUST NOT shrink
with density.

Spacing, intrinsic size and hit area solve different problems. A small glyph can sit in a larger
target. Choose target bounds for the actual input method (coarse pointers need more) without
enlarging every icon. An enlarged target's hover fill stays on the control itself, not across
neighbouring content. Keep product-specific insets and target sizes as application aliases, not as
new foundation values.

### Surfaces and elevation

Elevation explains stacking, not importance. Shadows belong to surfaces that float above content:
popovers, menus, dialogs, notifications. Do not shadow every card to make it feel important. A
floating layer's shadow should clearly lift it off the page in both themes; a card-level shadow on
a menu makes it look like part of the page.

A product needs one ordered set of stacking layers: page content, sticky chrome, popovers and
menus, dialogs, then notifications on top. A menu opened inside a dialog MUST appear above that
dialog; a toast MUST appear above both. Put the stacking value on the element that is actually
positioned, and raise an enclosing wrapper only while its overlay paints, including its exit.

### Type and icons

Choose a type role, not a size. Heading, label, body, button and code roles each have one coherent
size, weight and line height, and one owner. Sizes come from tokens in `rem` so that browser text
settings scale them; never fix body text in `px` that ignores the reader's settings.

- Choose a readable measure for the actual script and font. For Latin prose, 60–75 characters per
  line is a starting point; CJK and mixed scripts need their own judgement. Declare the measure in
  `rem`, never `em`: `em` grows with the element's own font size, so larger type would get longer
  lines.
- Cap text elements, not the column. A table, code block, demo or image keeps the width its content
  needs.
- Balance short headings with `text-wrap: balance`. Headings contain no manual line breaks, which
  only work in the locale they were written for.
- Text MUST NOT be clipped to keep a layout tidy. Headings, labels, identifiers and navigation
  destinations reflow or use a meaningful shorter form; an ellipsis or tooltip never hides the only
  cue to where a link goes.
- Use tabular figures for numbers that change, and reserve room for a digit-count change (99 to
  100). A value MUST NOT be truncated when it gains a digit.
- Check real copy: long translations, fallback fonts, browser zoom.

Icons share one stroke weight and optical size per context, align to the text they accompany, and
never carry meaning alone without an accessible name or a visible label.

## Layout

### Shells

Most product screens are one of a few shells: a navigation rail or sidebar beside a content
region; a header over a single column; master-detail with a list beside the selected item. Pick the
shell from the task and keep it stable across the product, so readers learn where things live.

Navigation gives one contextual return per view. Do not show an outer "Back to project" and an
inner "Back to files" together. A detail view returns to its immediate parent, ancestors stay
reachable through the route hierarchy or breadcrumbs, and returning to a parent puts focus back on
the item the reader came from.

A modal is not a navigation layer. Anything that needs a shareable link, history, side-by-side
comparison or survival across a refresh gets a route. Reserve a modal for a short confirmation or a
single field, a popover or menu for transient context, and a disclosure for progressive detail.
Tabs hold peer views of one object, never unrelated modules.

### Reading measure

Running text is capped at a comfortable measure; everything that is not running text is free of
that cap. A wide table beside a narrow paragraph is correct. A paragraph stretched across a 1600px
monitor is not.

### Narrow widths

Every screen works from 320px up. At 320–375px, every action MUST remain reachable: controls reflow
or move into an overflow menu, but the only route to an action is never hidden. The page MUST NOT
scroll horizontally at those widths, unless a specific region (a wide table, a code block) scrolls
on its own.

Prefer content-relative bounds (`min()`, `max()`, `clamp()`, container queries) to arbitrary
breakpoints, and reuse the product's breakpoints when you need one. Test by resizing into a narrow
layout, not only by loading there: measured positions go stale after resize, reflow and scroll.

### No layout shift

Content does not move after it first appears unless the reader caused it.

- A component that is registered or hydrated late MUST have its box reserved before it is defined.
  An undefined custom element renders as an empty inline box; give it a placeholder size from the
  same tokens the real component uses (for example `my-element:not(:defined) { display: block;
min-height: var(--control-height); }`), so the upgrade fills space that already exists.
- Images, embeds and media declare their dimensions or aspect ratio.
- A status change MUST NOT resize its control. A button whose label changes from "Copy" to "Copied"
  or shows a spinner keeps its width, height and focus ring position.
- An asynchronous status line that may appear later reserves its space with a stated purpose and
  bounds, or appears where it pushes nothing.

### Visible without script or animation

Text, headings, values, forms and navigation MUST be readable on first paint. They never wait on an
animation, an intersection observer or a script to become visible. If the script fails or reduced
motion is on, the content is already there. Entrance effects are for decorative visuals beside the
text, run once, and are skipped when the visual is already on screen at load. Factual values are
shown immediately on return to a working screen, not counted up again.

### Boxes contain what they paint

A component's layout box MUST contain everything it draws. Rotated, fanned or offset children
reserve their full reach inside the component's box; they never spill over neighbours, and they
never cause horizontal scrolling at 320–375px. If a decoration has to extend beyond the box, the box
grows or the decoration is clipped on purpose.

Position rotated decorations against the right axis. Percentages in `translate()` refer to the
element's own size, not its container's, so `translate(-50%)` centres an element on a point; it
does not move it half-way across its parent. Rotate around a deliberate `transform-origin`, then
measure the painted bounds in the browser rather than trusting the arithmetic.

## Components and composition

### Compose before inventing

Start with the product's existing components and native HTML elements. Most new needs are a
composition of existing pieces: a list of rows, a disclosure, a menu, a form. Build something new
only when the composition cannot express the required behaviour, and then use native semantics
(`button`, `a`, `input`, `dialog`, `details`) underneath. Never patch a component's private internals;
integrate through its public attributes, events, slots, CSS variables and parts.

Uniformity does not mean equal-sized controls or boxed sections everywhere. Sibling components
share proportions, icon weight, containment and motion language; a shared colour alone cannot
reconcile them.

### Actions reachable without hover

Discovering an action MUST NOT depend on hover. A secondary action revealed on hover is also
revealed on keyboard focus within the row, and has a persistent route on touch screens (always
visible, or in a visible overflow menu). Essential recovery actions such as Retry or Restore stay
visible.

A standalone command needs a recognisable shape before hover: its own restrained button surface or
stroke, visible in both themes. Flat rows are fine where a recognisable menu or list pattern already
says "these are actions". Review a command pane with the pointer away from it.

Once discovered, hover, pressed, disabled and focus states stay distinguishable. A disabled control
MUST NOT dispatch, and it stays quiet on hover.

Separate destructive commands from recovery and transfer actions. Let a danger label and icon carry
intent; keep the strongest danger fill for the confirmation step. A destructive command keeps its
confirmation, its cancel path, focus return and a guard against double activation.

### Buttons and links

A link leaves; a button acts. Anything that changes application state MUST be a `button` (or have
the button role and keyboard behaviour), whatever it looks like. Anything that navigates to a URL is
a link, so it can be opened in a new tab and copied. The two stay visually distinguishable; check
inline links against surrounding prose in themes where action and body colours are close. A
button-shaped link carries no underline. Navigation chevrons belong on things that navigate, not on
commands that act immediately.

Every icon-only control MUST have an accessible name.

### Overlays

Popovers, menus, tooltips and dialogs share a contract:

- **Stacking.** Overlays follow the product's layer order, so a select opened inside a dialog
  appears above it and notifications sit above everything.
- **Follow the trigger.** An open overlay MUST track its trigger through scroll, resize and reflow.
  It never floats away from what opened it, and it never animates out from a stale position.
- **Dialog focus.** A dialog MUST place initial focus inside itself, keep Tab and Shift+Tab within
  it, close on Escape and Cancel, and return focus to the element that opened it. A keyboard-safe
  primitive does not make a composed dialog safe; test the composition.
- **Escape.** Escape closes the topmost layer only, and does not also trigger the layer beneath.
- **Dismissal.** Clicking outside closes a menu or popover, not a dialog with unsaved input.

### Selection is not hover

Selection is persistent state; hover is transient. Selection MUST NOT look like hover. If the
current item uses the same fill as hover, the interface has two meanings for one appearance, and
the current item vanishes from view as soon as the pointer moves nearby.

Hover feedback is one fill that wraps the label it belongs to, with its own padding. It does not
stretch across empty header space or neighbouring content. A title or menu trigger hugs its
content; a separate layout track absorbs the remaining width. A row that deliberately selects across
its whole width is a different role and says so.

Group headers that toggle a section respond to hover with ink (text and icon colour), not with the
navigation fill used by destinations. That keeps "this opens a group" visibly different from "this
takes you somewhere".

### Common web habits

| Common web habit                                   | Better default                                                         |
| -------------------------------------------------- | ---------------------------------------------------------------------- |
| Row actions that appear only on hover              | Actions visible on focus within the row and reachable on touch         |
| A command styled as a link                         | A `button` with a restrained surface; links only for navigation        |
| Animating `height` or `max-height` to open a panel | Reserve or measure the box; animate `transform` and `opacity` only     |
| A spinner for an action that completes instantly   | Immediate feedback; show progress only when work takes noticeable time |
| A red or green dot as the only status signal       | Colour plus an icon or a word                                          |
| Fixed `px` font sizes                              | `rem`-based type roles that follow the reader's text settings          |
| `transition: all` on components                    | Transitions listed per property; no palette properties                 |
| The current page marked with the hover fill        | A distinct, persistent selection marker                                |
| A card and a shadow around every section           | Spacing, headings and a hairline; boxes only for separate objects      |
| A toast for every result                           | Feedback next to the object acted on                                   |
| A modal for a multi-step task                      | A route that survives refresh and can be linked                        |

## Interaction

### Inputs and drafts

- **One activation, one dispatch.** Submit MUST dispatch once per activation; a double click or a
  repeated Enter does not create two writes.
- **Composition is not submission.** Enter MUST NOT submit while an input method editor is
  composing (check `isComposing`). Enter submits only where the field's convention calls for it,
  and multiline entry keeps working. Dictation updates text and never submits by itself.
- **The latest intent wins.** An older response MUST NOT replace newer results: a slow search for
  "ab" never overwrites the results for "abc", and a preview for one file never appears under
  another. Tie each async result to the request that asked for it, and drop stale ones.
- **Never rebuild a focused input.** A search response, stream update, resize or status change
  MUST NOT replace the element the reader is typing in. Focus, caret, selection and value stay put.
- **Drafts survive.** Unsent input MUST survive a failed save, a lost connection, a mode switch,
  an expired session and a round trip to settings. A retained draft is not a saved one; say which
  it is.
- **Restore is not retry.** Restore repopulates fields without submitting. Retry dispatches again
  with the original scope and destination, never a silently broadened one.
- **Escape user text.** Search highlights are built from text nodes, never by inserting the query
  as HTML.

Use native input types and `autocomplete`, keep platform editing shortcuts working, and keep labels,
prerequisites and validation messages next to the field they affect. Distinguish "you have not
filled this in" from "the service is unavailable", and explain why submit is disabled when the
reason is not obvious.

### Focus

Every interactive element MUST show a visible focus ring when focused from the keyboard, and
everything MUST be reachable and operable from the keyboard: Tab reaches it, Enter or Space
activates it. A component does not add tab stops that lead nowhere or duplicate an inner control.

Focus never falls back to the page body by accident:

- Collapsing a region that contains focus MUST return focus to its toggle.
- Removing the focused item moves focus to the next meaningful item or a stable parent control.
- Closing an overlay returns focus to its trigger.
- A background request completing MUST NOT move focus.

A collapsed region still names its contents and state, and collapsing never hides an unresolved
error.

### Feedback and recovery

Success MUST be shown only after the operation is confirmed. "Saved" appears after the server
acknowledges the write; "Copied" appears after the clipboard call resolves. Feedback belongs to the
operation that produced it: if content changes while a copy is pending, the old completion does not
mark the new content as copied.

Show feedback beside the object acted on. A "Copied" label next to the copy button is easier to
connect than a toast in a corner; use a toast for changes beyond the current object or feedback
that would otherwise be missed. One failure gets one coherent recovery, not a row error plus a
toast plus a banner.

Errors say what failed, whether anything changed, and what to do next. "The import stopped before
saving. Your selected files are still here. Retry the import." Promise only what the product can
establish. Credential-free diagnostics can go behind a details disclosure.

Name a known phase ("Reading files", "Writing export") rather than showing only a spinner, and
announce phase changes, not timer ticks. Show a percentage only when there is a real denominator.

Cancel, retry and completion are different outcomes:

- `Cancel` MUST leave without committing anything.
- A cancellation request is not a confirmed cancellation. Show a pending state until the work has
  actually stopped; if the client can only stop waiting, say that.
- Cancellation is not failure and is not styled as one.
- A timeout does not prove nothing happened. Find out whether a write committed before retrying,
  using the product's idempotency or deduplication mechanism where it has one.
- Offer Undo only when the operation can actually be reversed.

| Condition                     | Useful response                                      | Avoid                                      |
| ----------------------------- | ---------------------------------------------------- | ------------------------------------------ |
| Network interrupted           | Keep inputs and partial output; retry when reachable | Clearing the form                          |
| Permission or config rejected | Name the category; link to the relevant setting      | Automatic retry loops                      |
| User cancelled                | Mark cancelled; keep recoverable output              | Red failure styling                        |
| Context changed               | Mark output as stale; refresh against current data   | Applying an old result to a newer document |

### Streaming content

Live logs and streamed answers follow new content only while the reader is at the end. Scrolling
up MUST suspend following; new content arrives without moving what the reader is looking at, and a
"Jump to latest" control restores following. Do not announce every streamed character to assistive
technology; announce completion or meaningful chunks.

Clicks MUST NOT depend on smooth scrolling having finished. A click that scrolls to an anchor or
selects an item takes effect at once; the scroll animation is presentation. Test these paths with
reduced motion on, where smooth scrolling is instant and races become visible.

## Motion

Motion explains where something came from and where it went. Frequent feedback (hover, focus,
press, typing) is immediate or nearly so. A larger change is not automatically a reason to animate;
"no motion" is a valid design.

![Three position-over-time curves: entering decelerates over 250–400ms and settles on the target without passing it; leaving accelerates over 150–200ms; a third curve, marked as one to avoid, overshoots the target and comes back](./assets/motion-curves.svg)

| Purpose                                | Duration                     | Curve                            |
| -------------------------------------- | ---------------------------- | -------------------------------- |
| Hover, focus, press feedback           | 0–100ms                      | Linear or none                   |
| Element entering (menu, panel, dialog) | 250–400ms                    | Decelerate, no overshoot         |
| Element leaving                        | 150–200ms                    | Accelerate                       |
| Siblings moving to make room           | Same as the entering element | Decelerate, via transform (FLIP) |
| Theme switch                           | None                         | —                                |
| Reduced motion                         | ~100–150ms                   | Opacity fade only, no travel     |

The rules:

- **Animate only `transform` and `opacity`.** Never animate `height`, `padding`, `margin` or
  `max-height` to show or hide something; those reflow the page every frame and squeeze text as it
  goes. Reserve or measure the final box, then move and fade into it.
- **Siblings move by transform.** When an item is inserted or removed, neighbours move with FLIP:
  record their old positions, apply the new layout, then animate from the old position to zero with
  a transform. Do not let them jump or reflow frame by frame.
- **Entering decelerates, leaving accelerates.** Things arrive quickly and settle; they leave
  faster than they arrived. No overshoot by default. Bounce or spring overshoot is an explicit
  opt-in for a specific, playful moment, never a library default.
- **Interruptible and state-driven.** A new intent MUST be able to interrupt or reverse a running
  transition from where it currently is, without a jump, a stale completion or a duplicate event.
  Drive transitions from state (a class or attribute that reflects open or closed), and finish them
  on `transitionend` or `animationend` for that element; never on a `setTimeout` that races the
  CSS. Reopening during an exit simply reverses.
- **Animation is not an input lock.** Typing, clicking and keyboard navigation work during a
  transition. Optional delight never delays input or hides status.
- **Motion preserves context.** Animation MUST NOT clear drafts, move focus, or change the reader's
  scroll position.
- **Reduced motion keeps meaning.** Under `prefers-reduced-motion: reduce`, motion MUST NOT travel:
  keep a short fade, or none, so the change is still noticeable and the final state is visible.
  Every region starts in its final state.
- **Themes do not fade.** A theme switch is instant. Do not list palette properties (`color`,
  `background-color`, `border-color`, `fill`) in component transitions, and never use
  `transition: all`: any palette property in a transition also fades on a theme switch, each
  component at its own speed while the page has already flipped.
- **Pulses mean live.** A status pulse appears only while the activity is actually running.
- **Pause what is off screen.** Decorative loops stop when out of view; profile costly effects with
  real content before adopting them.

Sibling components with the same interaction meaning share one motion language. That does not
require every component to animate.

### View transitions

The View Transitions API lifts each named element into its own snapshot layer above the page. A
lifted element escapes its parent's `overflow` clip and rounded corners for the duration of the
transition, so an element that is clipped in the steady state will briefly paint outside its
container. Only give a `view-transition-name` to elements that are fully visible in both the old
and new states, and keep names unique on the page. Test view transitions with reduced motion, where
they should collapse to a fade or nothing.

## Words

### Words are part of the interface

Copy that adds a decision, a constraint or a consequence stays. Copy that repeats what the layout
already says goes.

- Avoid unnecessary secondary labels and descriptions; let the layout do the explaining. A heading,
  grouping or obvious control does not need a sentence repeating its purpose.
- Do not replace removed copy with a decorative badge or tooltip.
- Accessible names, field labels, units, errors and risk disclosures MUST be kept. Quieting a
  screen never removes them. Keep useful first-use guidance, and check that the task is still
  understandable without the copy you cut.
- Let context carry context: "Users", not "User management", inside an admin area. Do not repeat a
  dialog's question in its body.
- Buttons name the result, not the gesture: "Save", "Move", "Delete", not "Click to save" or "OK".
  Include the object when context does not establish it: "Delete member", "Deploy project".
- Errors say what happened, then how to fix it: "Build failed: the bundle exceeds the size limit.
  Reduce it or raise the limit." Not "Operation failed, please try again."
- Confirmations state the completed change: "Project deleted", not "Success".
- Sentence case. No period on short labels; a period on full sentences.
- One ellipsis (…) on a command that needs more input before it completes, such as "Rename…".
- All caps only for short status tags, eyebrows and acronyms.
- Translations grow. Leave room for longer labels; wrap long labels within one column rather than
  letting a row of buttons turn ragged.

## Product patterns

These patterns apply only when the task needs them. An ordinary form or search page does not need a
queue, an account connection or version history. Before choosing controls for any of them,
establish what the product actually supports, and offer only the actions it can honour. A polished
screen does not substitute for a missing service.

Keep job, configuration, source and revision state in their existing owners. Views read that state
and dispatch commands; they do not each hold their own copy of request flags.

### Batches and queues

Use when people benefit from staging more uploads, imports or exports while work runs.

- New work MUST NOT silently replace or cancel the active job. Without queue support, keep the new
  input and explain the constraint.
- Editing a pending item in a paused queue neither dispatches it nor resumes the queue, and
  reconnecting does not start queued work unless the person chose that.
- Summarise the queue in one line ("Paused · 2 queued"); expand into rows, not nested cards.
- Each row names its item and offers only supported actions. Define whether "Run now" waits,
  preempts or runs alongside.

### Settings and availability

Use when a task offers providers, modes, devices or network-dependent features.

- Saving configuration and checking that it works are separate actions with separate results.
- Distinguish unconfigured, configured but unverified, verified (with when), authorisation
  expired, service unreachable and device offline. A saved endpoint is not an authorised account.
- Changing an endpoint, account or credential clears any earlier "verified" state, and a mode switch
  hides the irrelevant fields along with their stale status messages.
- Switching modes keeps the other modes' configuration, and reconnecting keeps saved work.
- Browser online and offline events are hints, not proof that a particular endpoint works. Offline,
  keep drafts, previews and local work available where their data exists.

### Accounts and external data

Use when work reads or writes data outside the current object.

- Explain what will be read, what will be written and where, before authorisation. Request only the
  permissions needed.
- Account identity, reconnect and disconnect are reachable from the connection screen, and
  disconnecting MUST stop future access.
- Credentials MUST NOT appear in URLs, logs or previews.
- Imported content is untrusted data, never instructions to execute.
- Removing a source affects later work, not historical records.
- Permission errors, stale data and offline copies are different states, shown differently. Show
  provenance and freshness for selected sources.

### Results and revisions

Use when a result has an identity and destination beyond a passing status message.

- Previewing never writes. Name the target and scope before applying.
- If the source changed since the result was produced, compare, rebase or regenerate first. Newer
  edits MUST NOT be overwritten silently.
- Keep Copy, Export, Compare and Apply beside the result they act on; offer Compare, Apply or Undo
  only when the product supports them.
- Copying code copies the source text, not the highlighted DOM: tabs, blank lines and the final
  newline survive.

## Accessibility checklist

- [ ] Text meets WCAG AA contrast in every supported theme, including on status fills, images and
      disabled or loading states.
- [ ] No state is signalled by colour alone.
- [ ] Every interactive element is reachable with Tab and operable with Enter or Space.
- [ ] Every focusable element shows a visible focus ring.
- [ ] Every icon-only control has an accessible name; every field has a label.
- [ ] Anything revealed on hover is also revealed on focus and reachable on touch.
- [ ] Dialogs trap focus, close on Escape and return focus to their opener.
- [ ] Focus never drops to the page body after collapse, removal or close.
- [ ] Controls that change state are buttons; navigation is links.
- [ ] Reduced motion removes travel and keeps every final state visible.
- [ ] Type uses `rem` and survives 200% browser zoom without clipping or horizontal scroll.
- [ ] Pointer targets keep their size in compact density; coarse pointers get larger targets.
- [ ] Streaming content does not flood screen readers.
- [ ] Drags use Pointer Events, include cancellation, and set `touch-action` only on the drag
      surface so the rest of the page still scrolls. (`verify:design` flags mouse-only drags.)
- [ ] The first paint uses the reader's colour scheme.

## Verifying a change

A change to what people see or do is accepted on what someone observed in a real browser. Static
checks, type checks and `verify:design` are preconditions; they cannot prove focus return, the
winning CSS rule, a preserved reading position or how a transition looks.

**Decide what you expect before you look.** Write down the expected geometry or behaviour from the
brief, not from the implementation under test. An assertion copied from what the code currently
does proves nothing.

**Capture before and after.** When fixing a visible defect, reproduce it in the running product
first, then capture the same state after the fix, looking at the full pane with realistic content
and its surrounding chrome, not a cropped component.

**Walk the states that changed.** Default, hover, pressed, focus, disabled, loading, empty, error,
long content and large numbers, as far as the change touches them. Include the combined states:
a long translated label in an error state at narrow width.

**Check the variants.**

- Both themes, including a theme switch while the screen is open.
- 320px width, by resizing down to it, not only loading there. Confirm no horizontal scroll and
  every action reachable.
- The keyboard path: Tab through the change, activate with Enter and Space, open and close
  overlays, and confirm where focus lands.
- Touch or a coarse pointer, where hover is involved.
- Reduced motion: final states visible, nothing travels, clicks still land.
- First load with a cold cache, to catch layout shift from late-registering components.

**Measure, do not eyeball.** Wait for components to register, fonts to load and content to settle
before measuring; fail on missing or zero-size targets. Measure the layer that matters: a wrapper,
its content box, the rendered text (a DOM `Range`) and the actual hit target are different
measurements. When an assertion checks layout, prove it can fail: introduce the defect (move only
the label, add a doubled margin) and watch the check go red.

**Review motion over time.** A still frame cannot show a jump. Watch the transition at normal speed,
then sample it frame by frame (a recording, or reading `getBoundingClientRect()` on each animation
frame) to find discontinuities. Include the reverse path and an interruption: trigger, then trigger
again before it finishes. Check the final state, focus, event count and scroll position separately
from the animation.

**Report honestly.** Never claim what was not observed. Keep three results apart: automated checks
(command output), the agent's own visual review, and a human decision. An agent's review is not a
user's acceptance, and a fixture passing is not the host product passing. Say which paths remain
unverified, and do not present an old capture as evidence for a newer build. A short note is enough:

> Runtime: build or commit, viewport, theme, locale.
> Automated: commands and results.
> Agent review: what was observed, and its limits.
> Human decision: not requested, pending, or the actual decision.
> Unverified: what was not checked.

## Guidance for coding agents

Do:

- Read the existing components, tokens and nearby screens before writing anything. Reuse what is
  there; match the product, not a reference product.
- State the task, the primary action, the state owner and the keyboard path before you edit.
- Check public APIs in source or generated docs. Never invent an attribute, event or token from a
  plausible name.
- Take spacing, colour, radius and type from tokens; run `verify:design` and the product's checks
  for the packages you touched.
- Reserve the box for anything that loads, registers or appears later.
- Animate with `transform` and `opacity`, finish on `transitionend`, and check reduced motion.
- Keep a focused input mounted across updates; update its surroundings instead.
- Tie each async result to the request that produced it.
- Open the change in a real browser, in both themes, at 320px and at desktop width, and walk it with
  the keyboard.
- Report what you observed, what you only inferred, and what you could not check.

Don't:

- Wrap every section in a card with a shadow to make it look finished.
- Hide row actions behind hover, or use a link for something that changes state.
- Animate `height`, `max-height` or `padding`, use `transition: all`, or wait on `setTimeout` for a
  transition to end.
- Add a spinner, a toast or a success message before the operation is confirmed.
- Replace the input someone is typing in when results arrive.
- Remove focus rings, labels or error text to make a screenshot quieter.
- Add spacing values off the scale, raw colours, or light-only fallbacks.
- Let a decoration overflow its component or cause horizontal scroll on a phone.
- Treat a good-looking screenshot as proof of focus, keyboard, motion or async behaviour.
- Mark your own review as "accepted" or "approved".

## Review checklist

1. Can a new reader recognise the purpose and the primary action without guessing?
2. Is emphasis scarce: one primary action per region, colour and badges rare?
3. Could it do less? Is any boundary, option, label or state removable without weakening the task?
4. Do gaps follow the scale and mean the same relationship everywhere, with no phantom rows?
5. Is text aligned to its declared spine, including nested, empty and error states?
6. Do nested radii agree with their insets, and does each remaining boundary have a job?
7. Does it work at 320px with no horizontal scroll and every action reachable?
8. Does anything shift on first load, on a status change, or when a late component registers?
9. Is every action reachable by keyboard and touch, with visible focus and correct focus return?
10. Is selection distinct from hover, and is every state shown truthfully (no early success)?
11. Do drafts, focus and reading position survive updates, failures and animation?
12. Does motion use transform and opacity only, reverse cleanly, and degrade to a fade under reduced
    motion?
13. Does it read correctly in both themes, with contrast checked on the real composition?
14. Has it been observed in a real browser, and does the report say what was and was not checked?
