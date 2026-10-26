<!-- Generated from design/DESIGN.md; edit the source, then run sync:agent-plugin. -->

# Ran Design

Design methods for the host product and its existing technology. Read only the relevant
sections through [the task index](./INTERFACE_GUIDE.md). Library tokens and API mechanics belong
to their implementation adapter, not this portable method.

Each rule carries an ID and a level. **MUST** is a defect when broken and names its proof;
**SHOULD** is the default, and a deviation states its reason for that case; **MAY** is optional.
The [rule index](./RULES.md) lists every graded rule with its proof.

## 1. Color — a state ladder, not a palette

- **D-COLOR-1 · SHOULD** Choose semantic roles for content, surfaces, boundaries, actions and status.
- **D-COLOR-2 · SHOULD** Define default, hover, active, disabled and focus states together.
- **D-COLOR-3 · SHOULD** Resolve light/dark values through the host’s authoritative tokens, and verify
  contrast in the actual composition.

Brand accents are contextual.

## 2. Spacing — a limited, rhythmic scale

- **D-SPACE-1 · SHOULD** Use the host’s existing spacing scale.
- **D-SPACE-2 · SHOULD** Use tight gaps to group related parts and larger gaps to separate tasks or
  regions.
- **D-SPACE-3 · SHOULD** Establish inside padding before outside gaps.
- **D-SPACE-4 · SHOULD** Do not copy a reference product’s dimensions without evaluating content, density
  and input method.

## 3. Typography — choose a role, not a size

- **D-TYPE-1 · SHOULD** Choose heading, label, body, action and code roles with coherent size, weight and
  line height, and keep a single authority for each role.
- **D-TYPE-2 · SHOULD** Verify actual scripts, fallback metrics and long content.
- **D-TYPE-3 · SHOULD** Establish hierarchy with typography before decorative containers.

## 4. Radius & elevation

- **D-ELEV-1 · SHOULD** Coordinate nested corner radii with their real inset: inner radius = outer radius −
  inset. When the result is 2px or less, the shapes no longer read as concentric; give the inner shape its
  own role radius, or none.

A 16px card with 8px of padding gives its inner panel an 8px radius. The same card with 16px of padding
leaves nothing to carry over, so the panel takes whatever its own role uses.

- **D-ELEV-2 · SHOULD** Use elevation to explain a floating layer, not importance, through the host’s
  stacking roles, and verify overlays against surrounding chrome.

## 5. Motion — prefer none

Timing below is a starting heuristic.

- **D-MOTION-1 · SHOULD** Use the host system’s motion tokens and verify frequency, continuity and reduced
  motion in the actual task.

| Duration | Use                                                                     |
| -------- | ----------------------------------------------------------------------- |
| 0ms      | Frequent hover, focus and keyboard feedback; changes already understood |
| ~150ms   | Optional, purposeful small motion, not a mandatory hover delay          |
| ~200ms   | Menu/popover motion when it clarifies the layer change                  |
| ~300ms   | Dialog motion when orientation benefits from it                         |

**Principle:** purpose and frequency determine whether motion earns time.

- **D-MOTION-2 · SHOULD** Default repeated interaction to immediate feedback; a larger change is not
  automatically a reason to animate.
- **D-MOTION-3 · SHOULD** Use existing tokens for purposeful motion and keep it quick and interruptible.
  Reduced motion is graded under D-MOTION-10 and D-ACCESS-5.

### Functional motion contract

- **D-MOTION-4 · SHOULD** Specify the trigger, state change and destination before choosing an effect.
- **D-MOTION-5 · MUST** Motion preserves unrelated content, drafts and reading position. _Proof: recording_
- **D-MOTION-6 · SHOULD** Give sibling components with the same interaction meaning a shared motion
  language; consistency does not require every component to animate.
- **D-MOTION-7 · MUST** When motion is used, a new intent can interrupt or reverse it from the current
  presentation, without a jump, stale completion or duplicate activation. _Proof: recording_
- **D-MOTION-8 · MUST** Feedback stays immediate; animation is not an input lock. _Proof: recording_
- **D-MOTION-9 · SHOULD** During insertion/removal, avoid visibly squeezing text or passing exiting controls
  across live actions; coordinate opacity and layout so the result stays readable.
- **D-MOTION-10 · MUST** Reduced motion retains a visible, understandable final state. _Proof: browser_
- **D-MOTION-11 · MAY** Use a spring; it need not overshoot.

See the optional [component craft research](./REFERENCE_RESEARCH.md#component-craft-设计垂点--wxaddesign)
for examples and limits, and [temporal acceptance](./ACCEPTANCE.md#review-motion-over-time) for proof.

- **D-MOTION-12 · SHOULD** Let theme palettes settle coherently. Avoid implicit palette fades or
  `transition: all`; opt in explicitly only where the host intends and verifies a coordinated effect.
- **D-MOTION-13 · MUST** Factual values and readable content are shown immediately on return to a working
  surface, without animated counts. _Proof: browser_
- **D-MOTION-16 · SHOULD** Do not replay decorative title entrances on each return to a working surface.
- **D-MOTION-17 · SHOULD** Choose entrance motion by what a region holds, from the table below. Stagger in
  reading order inside one region, not across the page.

| Region holds                                                  | Entrance                                                                           | Afterwards                                                     |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Text, headings, values, forms, navigation, calls to action    | None: present on first paint (D-MOTION-13)                                         | None                                                           |
| A decorative visual beside text: an icon set, diagram, sketch | Transform only, once, the first time it scrolls into view; none if visible at load | An explanatory loop may run while it is on screen (D-CRAFT-19) |
| A product mockup or live demo                                 | None for its content; a loading demonstration may move (D-MOTION-14)               | Driven by the reader's own interaction                         |
| A status indicator                                            | None                                                                               | A pulse only while the activity is live (D-MOTION-15)          |

With reduced motion every region starts in its final state (D-MOTION-10).

- **D-MOTION-14 · MAY** A loading demonstration may move to demonstrate loading.
- **D-MOTION-15 · MUST** A status pulse appears only while the activity is live. _Proof: review_

## 6. Content — copy is part of the system

- **D-COPY-1 · SHOULD** Buttons name the outcome. Include the object when context does not establish it:
  "Deploy project", "Delete member". In a clearly named object or dialog, "Save" or "Delete" is sufficient;
  avoid generic "OK". See [contextual wording](#words-are-part-of-the-interface).
- **D-COPY-2 · SHOULD** Errors say **what happened**, then **how to fix it**. ✅ "Build failed: the bundle
  exceeds the size limit. Reduce it or raise the limit." ❌ "Operation failed, please try again."
- **D-COPY-3 · SHOULD** Confirmations and toasts state the completed **change**. ✅ "Project deleted".
  ❌ "Operation successful".
- **D-COPY-4 · MUST** Show completion feedback only after the operation is confirmed. _Proof: unit, browser_
- **D-COPY-5 · SHOULD** Be specific; every sentence removes guesswork rather than adding it.

## 7. Accessibility — the system serves everyone

- **D-ACCESS-1 · MUST** Text keeps sufficient contrast with its background (**WCAG AA**). _Proof: browser_
- **D-ACCESS-2 · MUST** Never signal state with color alone; pair it with an icon or text (e.g. ✓ / ✕ labels,
  not just green/red). _Proof: review_
- **D-ACCESS-3 · MUST** Every interactive element has a **visible focus ring** appropriate to its surface;
  never remove it for "cleanliness". _Proof: browser_
- **D-ACCESS-4 · MUST** **Full keyboard navigation**: nothing is mouse-only. _Proof: browser_
- **D-ACCESS-5 · MUST** Respect `prefers-reduced-motion`. _Proof: browser_
- **D-ACCESS-6 · MUST** When the host supports both schemes, the initial render follows
  `prefers-color-scheme`. _Proof: browser_

## 8. Input & viewport — mobile and desktop, both

- **D-INPUT-1 · MUST** Support mouse, keyboard and touch at narrow and wide widths. _Proof: browser_
- **D-INPUT-2 · MUST** Reflow controls instead of hiding the only route to an action. _Proof: browser_
- **D-INPUT-3 · MUST** A hover affordance has a click/tap alternative. _Proof: browser_
- **D-INPUT-4 · MUST** Drags use Pointer Events, including cancellation. _Proof: browser_
- **D-INPUT-5 · MUST** Scope `touch-action` to the actual drag surface and pair it with a real handler;
  ordinary scrolling keeps working elsewhere. _Proof: browser_
- **D-INPUT-6 · SHOULD** Prefer content/viewport-relative bounds (`min()`, `max()`, `clamp()`) to arbitrary
  breakpoints.
- **D-INPUT-7 · SHOULD** Use existing host breakpoints, and introduce a justified shared role only when
  repeated needs emerge.

A measured position becomes stale after resize, container reflow or scroll.

- **D-INPUT-8 · SHOULD** Exercise resizing into a narrow layout, not only loading there.
- **D-INPUT-9 · MUST** Overlay placement tracks its trigger while open. _Proof: browser_

The host owns lifecycle mechanics; [ranui engineering](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/CODING.md#3-state-and-ownership) is one implementation adapter.

- **D-INPUT-10 · SHOULD** Test actual pointer/touch gestures, hover fallback and keyboard routes where
  affected; checking two color schemes does not establish input parity.

## 9. Composition — the page, not the component

- **D-COMP-1 · SHOULD** Choose the page structure in §10 first; then compose its components with these
  rules.

### Style coherence across components and pages

- **D-COMP-2 · SHOULD** Before implementation, record a short design brief in the existing task note or
  product design owner. Use the existing system; a small fix only needs the affected decisions.
  The brief settles each applicable decision in the table below (D-COMP-2).

"Premium", "modern" or "like Claude" is a direction to investigate, not an implementable specification.

| Decision           | What the brief settles                                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| Task and hierarchy | The real content, primary action and first reading focus; what can recede or disappear.                                        |
| Proportion         | Type roles/line heights, text measure, control density, icon weight and alignment spines using host tokens.                    |
| Surface language   | Which regions need containment, nested radius/inset relationships, semantic accent and elevation roles.                        |
| State composition  | A representative default plus long content, pending/failure and narrow input paths; include combined states.                   |
| Motion             | The state change it explains, trigger and frequency, interruption/reverse behavior and reduced-motion result; "none" is valid. |
| Reference decision | Where a reference is used, link its source, the principle adopted and the adaptation the host task needs.                      |
| Acceptance         | The observable result and actual views/recordings that can demonstrate or reject it.                                           |

- **D-COMP-4 · SHOULD** Reuse the brief across sibling components and docs chrome; change emphasis
  according to the task.

Uniformity does not mean equal-sized controls or boxed sections everywhere.

- **D-COMP-5 · SHOULD** Keep an expressive demo visibly distinct from its documentation chrome.
- **D-COMP-6 · SHOULD** Update the brief before changing the visual direction; do not silently rewrite the
  standard to justify an implementation that failed review.
- **D-COMP-7 · SHOULD** Compare a representative composed still with different real content before
  animating it, then inspect the state change and return path at normal speed.

A shared color alone cannot reconcile inconsistent proportions, icon weight, containment or motion.

- **D-COMP-8 · SHOULD** When an example looks imported from another product, fix that relationship at its
  owning token/component/style rather than adding a page-specific patch.
- **D-COMP-9 · SHOULD** Keep reference observations and validation limits in the optional
  [research index](./REFERENCE_RESEARCH.md#style-coherence-and-transition-research).

### Structure before containers

- **D-BOX-1 · SHOULD** **Reach for spacing, alignment, weight and a hairline before a box.**

A container is a claim that its contents are a separate object. Most regions need a background, a
hairline and intentional spacing — nothing more.

- **D-BOX-2 · SHOULD** Reserve a box for **a genuinely separate object**: a live demo stage, an overlay, a
  panel that floats. Not for a code block, a table, a list row, a previous/next link, or a cell in a
  gallery.
- **D-BOX-3 · SHOULD** **Avoid redundant nested containers and doubled padding.** A card inside a padded
  panel does not need another decorative frame or inset.
- **D-BOX-4 · SHOULD** Keep functionally required nested controls or surfaces, and coordinate their radii
  with the actual inset; containment alone is not a reason to add a box.
- **D-BOX-5 · SHOULD** **Every persistent boundary needs a distinct job.** Start with headings, alignment
  and proximity to group content. Add a border, surface fill or elevation only when that structure leaves
  a real boundary unclear.
- **D-BOX-6 · SHOULD** Do not repeat the same grouping with a panel frame, a nested card, row rules and
  another inset at the same time.

Faint lines are still extra hierarchy; reducing their contrast or shortening them leaves a redundant
enclosure redundant.

The table below applies D-BOX-5 and D-BOX-8.

- **D-BOX-8 · MUST** Keep keyboard focus and persistent selection cues; never remove them to make the
  resting layout quieter. _Proof: browser_

| Boundary                | Keep when it communicates                                               | Remove when it only repeats                                                    |
| ----------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Field/control frame     | Where values can be entered or a selection made                         | A decorative wrapper around already legible commands                           |
| Region frame or divider | An independent viewport, resize boundary or major change of task        | A title and gap that already make the same group clear                         |
| Nested surface          | A distinct floating layer, preview, drop target or interaction boundary | Another container inside an established settings pane                          |
| Focus/selection outline | Keyboard focus or persistent selection state                            | Keep this state cue even when the resting layout would look quieter without it |

- **D-BOX-9 · SHOULD** Review the full pane or page, not only the cropped group. For every remaining stable
  outline, fill or separator, name the relationship or interaction it communicates and check what becomes
  ambiguous if it is removed.

A frame is optional; a reachable, recognisable control is not.

### Emphasis is a budget

**Colour, weight, badges, fills and elevation are scarce.** If everything is emphasised,
nothing reads as important.

- **D-COMP-10 · SHOULD** Establish priority with structure and proximity first, and spend emphasis on the
  one thing that deserves it.

**Elevation explains stacking, not importance.**

- **D-ELEV-3 · SHOULD** Reserve shadows for surfaces that genuinely float above content: popovers, menus,
  dialogs, notifications. Do not shadow every card.

### Spacing carries meaning

The scale in §2 is not only a rhythm; each step states a relationship.

Choose the step by what the gap _means_ (D-SPACE-2):

| Relationship             | Relative spacing                |
| ------------------------ | ------------------------------- |
| Parts of one control     | Tightest deliberate gap         |
| Closely related controls | Compact group gap               |
| One content group        | Group rhythm                    |
| Separate groups          | Larger separation               |
| Major region boundary    | Strongest deliberate separation |

**Inside before outside:** a component's own padding is decided before the gap between
components (D-SPACE-3). **Smaller gap means tighter relationship** — that is the only thing vertical
rhythm communicates.

- **D-SPACE-6 · SHOULD** Do not undo a gap's relationship with a decorative divider.

### Vertical rhythm across sibling views

- **D-SPACE-7 · SHOULD** Repeat relationships, not fixed heights. Choose title/description, field/hint,
  group and region gaps from the host scale according to their relationship.

These are composition decisions, not universal component dimensions.

- **D-SPACE-8 · SHOULD** Let translations grow naturally, and leave no vacant row for a missing
  description.
- **D-SPACE-9 · SHOULD** Give each gap one owner: parent stack or explicit child margin. Reset authored
  local heading/paragraph margins rather than adding them to the parent's gap.
- **D-SPACE-10 · SHOULD** Account for owned control padding, collapsing margins and inline baseline space;
  do not compensate with transforms or smaller type.
- **D-SPACE-11 · SHOULD** Place hints with the field/action they explain.
- **D-SPACE-12 · MUST** Hidden helpers leave no accidental gap. _Proof: browser_
- **D-SPACE-16 · SHOULD** A reserved async status line has a stated purpose and bounds.
  Measure both axes after content settles; [ACCEPTANCE](./ACCEPTANCE.md) grades this as V-PROOF-6.

`next.top - previous.bottom` measures frame separation, not glyph/line-box space.

- **D-SPACE-14 · SHOULD** Keep leading, padding and hairlines distinct: 16px padding plus a 1px rule is
  not a 17px spacing token.
- **D-SPACE-15 · SHOULD** Use independent expectations and exercise wrapping, resizing, helper/error
  visibility and relevant density.

[ACCEPTANCE](./ACCEPTANCE.md#browser-proof) owns settling and mutation checks for doubled margins,
phantom rows and text-only drift.

### The measure governs text, not the column

- **D-TYPE-4 · SHOULD** **Choose a readable measure for the actual script and font.**

For Latin prose, 60–75 characters per line is a starting heuristic, not a universal range for every
writing system.

- **D-TYPE-5 · SHOULD** Review realistic text at supported widths, zoom levels and font fallbacks; CJK and
  mixed-script text need their own judgment.

[WCAG visual presentation](https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html)
also distinguishes CJK in its Level AAA criterion; it is not a mandatory library default.

- **D-TYPE-6 · SHOULD** Let a table, code fence, demo stage or image retain the width its content needs.
  Cap the text elements, not the column that holds them.
- **D-TYPE-7 · SHOULD** **Declare the measure in `rem`, never `em`.**

`em` resolves against the element's own font-size, so the larger the type, the longer the line —
exactly backwards.

- **D-TYPE-8 · SHOULD** **Build hierarchy out of type before reaching for a box.**

One step of size and one step down in colour turns a title and its first sentence into a title and a
deck, with no new container and no new border.

### If the layout says two things are one object, the spacing must agree

**A shared border, a shared radius and a gap between them are a contradiction.**

- **D-ALIGN-1 · SHOULD** Decide whether the elements are one object or two, and make every property say
  the same thing.
- **D-ALIGN-2 · SHOULD** **When a value must equal another value, name it.** A gap that a child has to
  subtract is not a literal in two places; it is one custom property referenced twice.

### Reserve a column only when its content exists

**A column declared unconditionally is still a column, even on the pages that have nothing
to put in it.**

- **D-ALIGN-3 · SHOULD** Condition the track on the element actually being there (`:has()`), not on a
  page type you assume implies it.

### Alignment is structure, not polish

- **D-ALIGN-4 · SHOULD** **Name each alignment spine and the geometry it aligns.** State which siblings
  share each one; include headers, body copy, rows, actions and empty/loading/error content.

A page content spine, navigation column and nested form-label spine can differ intentionally.

- **D-ALIGN-5 · SHOULD** A back button plus gap may establish a separate title column: do not silently
  treat that title as aligned to body text.
- **D-ALIGN-6 · MUST** A missing optional icon or badge never moves labels out of their declared column.
  _Proof: browser_
- **D-ALIGN-7 · SHOULD** A nested level returns exactly to its parent's spine when it ends.
  Compare the right boxes. These are separate measurements, even when they happen to coincide; measuring the
  defect's layer is graded in [ACCEPTANCE](./ACCEPTANCE.md) as V-PROOF-10.

| Geometry      | What to measure                                                                                   |
| ------------- | ------------------------------------------------------------------------------------------------- |
| Frame         | The wrapper/host border box from `getBoundingClientRect()`                                        |
| Content       | The inner edge after the actual border and padding, including nested wrappers                     |
| Text          | A DOM `Range` around the rendered label's text nodes; use first/last line rectangles for wrapping |
| Icon viewport | The SVG/viewbox or image box; painted glyph ink may be asymmetric inside it                       |
| Hit area      | The actual event target and its hover/focus surface; verify points near its edges                 |

A button frame aligned with a paragraph does not prove its text is aligned: internal padding can
move the label while the frame stays fixed. `Range` gives typographic geometry, not exact glyph ink.

- **D-ALIGN-9 · SHOULD** Inspect optical glyph corrections separately.
  For web components, measure the host, documented shadow parts and slotted text through supported test
  seams. V-PROOF-11 in [ACCEPTANCE](./ACCEPTANCE.md) owns this, including the ban on production shadow queries
  and on assuming document CSS crosses the boundary.
- **D-ALIGN-11 · SHOULD** **Keep a header command's hit zone separate from layout filler.** A title/menu
  trigger hugs its content plus deliberate padding, bounded by the available width. Let a separate
  flex/grid track absorb remaining space.
- **D-ALIGN-12 · SHOULD** Define truncation/wrapping and adjacent action behavior for long translations.
- **D-ALIGN-13 · MUST** The title trigger's hit area does not span unused header space (for example through
  `flex: 1` on the title button) unless D-ALIGN-14 applies. _Proof: browser_
- **D-ALIGN-14 · SHOULD** A row that intentionally selects its whole width is a different role; record
  that contract explicitly.
- **D-ALIGN-15 · MAY** Coarse-pointer targets may grow larger.
- **D-ALIGN-22 · SHOULD** A grown target's hover fill stays on the control's own content, not across unrelated
  content.
- **D-ALIGN-16 · SHOULD** **Count every inset from the shared ancestor to the visible text.** Parent
  padding, nested panel padding, a control's internal padding, borders and navigation columns all
  contribute.
- **D-ALIGN-17 · SHOULD** Remove a redundant inset at its owner instead of cancelling it with an
  unexplained negative margin.
- **D-ALIGN-18 · SHOULD** Empty states retain their region's content spine and width; extra breathing room
  never introduces a second left edge or makes a compact action fill the region.
- **D-ALIGN-19 · SHOULD** Keep product-specific insets and target sizes as application aliases, not new
  foundation values or universal component defaults.
- **D-ALIGN-20 · SHOULD** **When two layout edges or gaps are meant to be equal, a one-pixel difference is a
  defect.** Optical glyph correction (D-ALIGN-21) is the only tolerance.
- **D-ALIGN-21 · SHOULD** Treat optical correction for an asymmetric glyph as a separate, documented
  asset/component decision, reused at supported sizes while sibling gaps, baselines and spines stay exact.

Optical correction is not permission to nudge page margins until a screenshot looks balanced.

### Selection, links and other semantic lies

- **D-SEM-1 · MUST** **Selection is persistent state and never looks like hover.** _Proof: browser_

Hover is transient; if the current item is marked with the same fill hover uses, the interface has two
names for one appearance.

- **D-SEM-2 · MUST** **Action and link roles remain distinguishable.** _Proof: browser_
- **D-SEM-3 · SHOULD** Verify inline links against surrounding prose, including themes where action and
  body colors happen to match.

**A link leaves; a button acts.**

- **D-SEM-4 · MUST** Anything that changes application state is a button, whatever it looks like.
  _Proof: review, browser_
- **D-SEM-5 · SHOULD** A button-shaped link carries no underline.

### Command hierarchy in constrained panes

- **D-CMD-1 · SHOULD** **Remove redundant group enclosures without erasing control affordance.**

Headings, alignment and proximity establish groups inside a settings pane; by themselves they leave an
icon and label without a clickable look.

- **D-CMD-2 · SHOULD** Use flat rows when a recognizable menu/list pattern already conveys action; do not
  require them in every context.
- **D-CMD-3 · SHOULD** Give a standalone command that needs it its own restrained button surface or
  functional stroke, visible before hover in every supported theme.
- **D-CMD-4 · SHOULD** Let a button's own shape identify its target; an enclosing card, muted group fill
  and row rules still pass the distinct-boundary test (D-BOX-5).
- **D-CMD-5 · MUST** Initial discovery does not rely on hover, pointer cursors, verb labels or keyboard
  focus alone. _Proof: browser_
- **D-CMD-6 · SHOULD** Inspect the resting full pane with the pointer away, including touch use.
- **D-CMD-7 · MUST** Hover, press, disabled and keyboard focus stay distinguishable after the control is
  discovered. _Proof: browser_
- **D-CMD-8 · SHOULD** Wrap long translated labels inside one command column instead of a ragged horizontal
  button cloud.
- **D-CMD-9 · MUST** Do not add navigation chevrons to immediate commands. _Proof: review_
- **D-CMD-10 · SHOULD** Declare which visible columns are shared with adjacent checkboxes or controls:
  measure icon/checkbox edges and text Ranges, not only button rectangles or alignment within the command
  group.
- **D-CMD-11 · MAY** A hit target may extend into an owned gutter to preserve those columns; name the
  extension.
- **D-CMD-12 · MUST** An extended hit target stays inside its pane, does not overlap other targets, and
  keeps focus visible. _Proof: browser_
- **D-CMD-13 · SHOULD** Separate destructive commands from recovery and transfer actions.
- **D-CMD-14 · SHOULD** Let a danger label and icon communicate intent without a large red outline on
  every resting command; reserve the strongest danger fill for explicit confirmation.
- **D-CMD-15 · MUST** Destructive commands keep confirmation, cancellation, focus return and busy guards.
  _Proof: browser_
- **D-CMD-16 · SHOULD** Accept a command pane against its resting state, not only its hover state.

Acceptance covers resting discoverability, declared shared columns, full-pane boundary hierarchy, target
bounds, label clipping, contrast and interaction states.

- **D-CMD-17 · SHOULD** Inspect the actual render as well: an automated surface-difference check catches
  invisible control fills but does not prove that users recognize the action.
- **D-CMD-18 · SHOULD** Reuse foundation roles and coarse-input target requirements; this guidance changes
  no component defaults.

### One product, one token set

- **D-TOKEN-1 · SHOULD** Use the product’s authoritative semantic tokens. Aliases may improve readability,
  but resolve from that source rather than inventing a competing palette.
- **D-TOKEN-2 · SHOULD** Coordinate third-party components through supported theme APIs and verify the
  composed result.

### Density follows control roles

Spacing, intrinsic dimensions and hit targets solve different problems. A small glyph can have
a larger native button target.

- **D-TOKEN-3 · SHOULD** Measure actual hit bounds, focus and adjacent gaps.
- **D-TOKEN-4 · SHOULD** Derive repeated host aliases from foundation tokens, not one application's
  dimensions copied across the library.
- **D-TOKEN-5 · SHOULD** Choose target bounds for the actual input method without enlarging every glyph or
  reserving space for hidden controls. Use supported public theme APIs.
- **D-TOKEN-6 · MUST** Name icon-only controls accessibly. _Proof: browser_
- **D-TOKEN-7 · SHOULD** Document legitimate viewport, hairline, artwork and optical geometry exceptions.

### Evaluate craft through evidence

Polish follows task clarity, not a preset of cards, blur or entrances.

- **D-CRAFT-1 · SHOULD** Choose a deliberate visual direction using realistic objects, copy and states; a
  generic empty shell cannot establish product quality.

Working interfaces need sustained reading and frequent actions; marketing pages may need a different
composition.

- **D-CRAFT-2 · SHOULD** Evaluate the smallest intervention against real content, language, device and
  repeated use.

Primary references answer specific questions:
[Linear hierarchy](https://linear.app/now/behind-the-latest-design-refresh),
[Geist typography](https://vercel.com/geist/typography),
[optical alignment](https://craft.gustavofior.com/optical-alignment) and
[interruptibility](https://craft.gustavofior.com/interruptibility).

- **D-CRAFT-3 · SHOULD** Adapt their principles with the host’s tokens and actual capabilities; do not
  copy a product's pixel sizes or import recipes as rules.
- **D-CRAFT-4 · SHOULD** Treat references as inputs to decisions, not additional instruction sets; for
  example, [Don't Make Me Think](https://sensible.com/dont-make-me-think/) informs scanning, hierarchy and
  clear choices.

[taste-skill](https://github.com/leonxlnx/taste-skill) informs deliberate direction and critique;
[ryugi](https://github.com/Innei/ryugi) informs executable work and fresh evidence.

- **D-CRAFT-5 · SHOULD** A stylistic preference needs context; a requirement identifies the task or
  observable contract it protects.
- **D-CRAFT-6 · SHOULD** Choose references by the job they support: logo/app identity, marketing
  composition and frequent working interactions solve different problems.
- **D-CRAFT-7 · SHOULD** Record the observed pattern and its adaptation; verify the result with real
  content.

The optional [research index](./REFERENCE_RESEARCH.md) maps sources to questions and demonstrates this
translation without adding another rule set.

- **D-CRAFT-8 · SHOULD** When direction is unresolved, compare two small real-host variants with the same
  content, width and theme, changing one dimension at a time. Explain what each difference does for the
  task.

A clear direction or small correction proceeds directly; there is no mandatory approval ritual.

- **D-CRAFT-9 · SHOULD** Balance short headings progressively with `text-wrap: balance`, preserving normal
  wrapping.
- **D-CRAFT-10 · MUST** Headings contain no locale-dependent manual line breaks and are not clipped to
  preserve a screenshot. _Proof: browser_
- **D-CRAFT-11 · SHOULD** Check cost and support before using `pretty` on long live content.
- **D-CRAFT-12 · SHOULD** Use tabular figures to stabilize digit advances if the font supports them.
- **D-CRAFT-13 · SHOULD** Reserve a meaningful column for digit-count changes such as 99 → 100.
- **D-CRAFT-14 · MUST** A digit-count change never truncates the value. _Proof: browser_
- **D-CRAFT-15 · SHOULD** Correct asymmetric glyphs in a reusable asset/component, preserving exact layout
  spines.
- **D-CRAFT-16 · SHOULD** Derive nested corner geometry from actual inset; remove an unnecessary nested
  surface first.
- **D-CRAFT-17 · SHOULD** Give motion a job: immediate frequent feedback, interruptible transitions,
  reduced motion and instant themes. See §5.
- **D-CRAFT-18 · MUST** Optional delight never delays typing or obscures status. _Proof: recording_
- **D-CRAFT-19 · SHOULD** Pause offscreen decoration and profile realistic content before adopting costly
  effects.

### Words are part of the interface

- **D-COPY-6 · SHOULD** Avoid unnecessary secondary labels and descriptions. Let the layout do the
  explaining.
- **D-COPY-7 · SHOULD** A heading, grouping, proximity or obvious control needs no other sentence
  repeating its purpose.
- **D-COPY-8 · SHOULD** Remove copy with no new decision, constraint or consequence; do not replace it
  with a decorative badge or tooltip.
- **D-COPY-9 · MUST** Preserve accessible names, field labels, units, errors and risk disclosures.
  _Proof: browser_
- **D-COPY-10 · SHOULD** Preserve useful first-use guidance, and test whether the task remains
  understandable.
- **D-COPY-11 · SHOULD** Let context carry context: `Users` rather than `User Management`; do not repeat a
  dialog's question in its body.
- **D-COPY-12 · SHOULD** Name results (`Save`, `Move`, `Delete`), not gestures (`Click to save`). Include
  the object only when context does not establish it.
- **D-COPY-13 · MUST** `Cancel` leaves without committing. _Proof: browser_
- **D-COPY-14 · SHOULD** Use sentence case, no period on short labels, and a period on explanatory
  sentences.
- **D-COPY-15 · SHOULD** Use one `…` when an action needs more input before completing; reserve ALL CAPS
  for short statuses, eyebrows and acronyms.

### Review checklist for a composed surface

- **D-REVIEW-1 · SHOULD** Apply these questions to the affected surface and reachable changed states.
  Skip irrelevant variants; a small patch does not require redesigning unrelated pages. A "no" within
  scope is a finding.

1. Can a new reader recognise the purpose and the primary action without guessing?
2. Does every control's label, state and result describe one consistent outcome?
3. Is emphasis scarce — does the core thing get the weight while colour, badges and primary buttons stay rare?
4. Could this do less: any entry point, option or state removable without weakening the task?
5. Are named spines exact at the visible text/content layer, including nested and empty states, with intentional navigation columns and no doubled padding?
6. Do adjacent controls share their declared icon/text columns?
7. Are title hit zones content-hugging?
8. Do repeated vertical relationships use consistent gaps with one owner, including wrapped copy and hidden helper/error content?
9. Is running text comfortable in its actual scripts, fonts and zoom levels, and is everything that is **not** running text free of that measure cap?
10. Does every element that looks like part of one object agree — border, radius **and** spacing — and does every reserved column actually have content? Does each persistent frame, fill or divider communicate a distinct boundary instead of nesting the same group again?
11. Does it hold in relevant changed states: empty, loading, failure, long translations, narrow width, supported themes, reduced motion and **RTL**, where affected?
12. For layout or interaction changes, has the affected surface been checked in a real browser at the relevant widths and themes? Are standalone actions recognizable before hover, including touch use, without redundant group enclosures?

A happy-path screenshot does not prove keyboard behavior, focus, dynamic content,
resizing or failure recovery.

- **D-REVIEW-2 · SHOULD** Follow [ACCEPTANCE](./ACCEPTANCE.md) for independent expectations, actual
  runtime/capture identity, browser measurements and separate automated, agent and human results.

The source-only [browser example](https://github.com/chaxus/ran/blob/main/packages/ranui/test/e2e/layout-contract.md)
contains setup commands and test utility details; they are not public package APIs.

## 10. Information architecture — the shape before the composition

- **D-IA-1 · SHOULD** Choose structure before composition for information-dense consoles, dashboards and
  workbenches.

Complete API data is not a page design: the reader still needs a clear order for understanding
objects, their state and relationships, then acting.

- **D-IA-2 · SHOULD** Give single-conversion and landing pages their own task structure rather than a
  dense-console template.

### Answer three questions before naming a component

- **D-IA-3 · SHOULD** Settle all three answers before choosing components.

1. **What does the reader need to see on arrival?** That is the primary information.
2. **What else has to be visible for it to make sense?** Related resources, related models, context.
3. **What do they do next?** Judge, act, or keep thinking.

- **D-IA-4 · SHOULD** **A page has exactly one primary model.** Supporting models may help the reader
  understand or operate it; they may not compete for the first screen.
- **D-IA-5 · SHOULD** Prefer a clear, unambiguous next choice over an arbitrary click budget. Test whether
  readers recognize the next action, not merely whether the destination is reachable.

### The shape follows the task, not the payload

- **D-IA-6 · SHOULD** Choose a skeleton from the reader's question, not an API array or route ID, using
  the table below.

| Task                                          | Useful shape                                             |
| --------------------------------------------- | -------------------------------------------------------- |
| Compare values/differences                    | Table or diff                                            |
| Recognize/open a resource                     | List; image grid only when images identify it            |
| Understand one object's current state         | Sectioned detail                                         |
| Understand ownership/dependencies             | Tree or adjacency list; graph only when the path matters |
| Plan the next step / move work through stages | Step flow / kanban when moving is the actual work        |
| Audit what happened, when and by whom         | Timeline or trace drill-down                             |
| Discuss or read continuous text               | Thread or document                                       |
| Judge health, trends or anomalies             | Status wall or dashboard                                 |
| Find occupancy/conflicts or location          | Calendar or map/canvas                                   |
| Work on the next item / change rules          | Master-detail workbench / configuration form             |

- **D-IA-7 · SHOULD** Do not confuse historical events with future steps, a filter with kanban, or ordered
  prose with a field grid. A date alone does not justify a calendar.
- **D-IA-8 · SHOULD** Ship multiple views only when each serves a distinct task worth its
  filter/state/action maintenance.

### Each kind of information has a place

- **D-IA-9 · SHOULD** Lead with identity and status in the title or summary region, and keep actions,
  feedback and evidence beside their subject, as the table below lays out.

| Information   | Belongs                                                      | Wrong place                              |
| ------------- | ------------------------------------------------------------ | ---------------------------------------- |
| Identity      | Title, object summary                                        | The last column, or behind a tab         |
| Status        | Title or summary region                                      | Findable only in a detail field          |
| Attributes    | Detail body, grouped as people think about it                | Flattened in API field order             |
| Relationships | Own region or tab; ownership, dependency, reference distinct | Mixed into the attribute table           |
| Changes       | Diff region, timeline                                        | Shown as the new value only              |
| Evidence      | Beside the judgement, expandable                             | A log page elsewhere                     |
| Actions       | Primary in the title region, the rest beside their object    | Buried under "more"                      |
| Feedback      | Beside the action, keeping task context                      | A global toast detached from its subject |

- **D-IA-10 · SHOULD** **Every fact has exactly one authoritative location.** Elsewhere shows a summary or
  an entry point that links back to it.
- **D-IA-11 · SHOULD** Follow the default reading order: page identity → current status or exception →
  primary task and primary action → the information the judgement needs → relationships, changes,
  evidence → secondary information and low-frequency actions.
- **D-IA-12 · SHOULD** **One primary action per task region**, and it is the most likely next step, not
  the most destructive one (§9, "Emphasis is a budget", governs how much weight it may take).

### Density is effective information, not controls per inch

Tightening spacing raises visual density and leaves effective density where it was. Removing
irrelevant fields and putting the comparison in one place raises the real thing.

- **D-IA-13 · SHOULD** **Use at most two adjacent density levels on one page**: spacious for first use and
  risky confirmation, standard for most lists and details, compact for expert workbenches.
- **D-IA-14 · MAY** Container padding and line height may tighten.
- **D-IA-15 · MUST** Readable body text, a visible focus ring and pointer target size do not shrink with
  density (§7, §8). _Proof: browser_

### Containers do not fix structure

- **D-IA-16 · SHOULD** **One contextual return per view.** Do not show an outer “Back to chat” and an
  inner “Back to artifacts” together.
- **D-IA-17 · SHOULD** The detail view returns to its immediate parent.
- **D-IA-18 · MUST** Ancestors remain reachable through the route hierarchy or clearly named breadcrumbs.
  _Proof: browser_
- **D-IA-19 · SHOULD** Verify the full journey, including focus return and long translated destination
  names.
- **D-IA-27 · MUST** Returning to the parent restores focus to the originating item. _Proof: browser_
- **D-IA-20 · MUST** If text does not fit, reflow or use a meaningful shorter destination; an ellipsis or
  tooltip never hides the only destination cue. _Proof: browser_
- **D-IA-21 · SHOULD** Choose one composition for the parent context. Do not add a breadcrumb merely to
  relabel a redundant return shortcut, or repeat that parent as an inert crumb above its return command.

When returning through the parent already reaches the ancestor, that journey preserves access
without adding another detail-header row.

- **D-IA-22 · SHOULD** Use breadcrumbs when the hierarchy itself helps the task.

**A modal is not a navigation layer.**

- **D-IA-23 · SHOULD** Give a route to anything needing a copyable link, history, a side-by-side
  comparison, or work that survives a refresh.
- **D-IA-24 · SHOULD** Reserve a modal for a short confirmation or a single field, a popover or menu for
  transient context, and a disclosure row for progressive disclosure.
- **D-IA-25 · SHOULD** **Tabs carry peer views of one object** — its conversation, its checks, its diff —
  never unrelated modules; that is navigation's job.
- **D-IA-26 · SHOULD** If the chosen library lacks a suitable primitive, use existing semantic elements
  and host tokens; verify the required interaction rather than inventing unsupported APIs.

## Verification checklist (before shipping UI)

- **D-VERIFY-1 · SHOULD** Select checks for the affected surface, supported variants and changed behavior;
  do not create unrelated flows merely to satisfy the list.

Repository CI still runs its complete gates.

- **D-VERIFY-2 · SHOULD** Primary task and primary action are unmistakable.

Affected layout/theme changes work at relevant **narrow and wide** widths and supported themes (D-INPUT-1).
Mouse and touch both work: drags use Pointer Events and any `trigger="hover"` has a tap fallback (D-INPUT-3,
D-INPUT-4). Keyboard and visible focus are covered by D-ACCESS-3 and D-ACCESS-4.

- **D-VERIFY-5 · SHOULD** Exercise all changed **states** (hover, active, focus, disabled, loading, empty,
  error).
- **D-VERIFY-7 · SHOULD** Cover relevant edge cases: long text, large numbers and the host's supported
  scripts/locales.
- **D-VERIFY-8 · SHOULD** Spacing comes from the scale; type uses a role; color uses semantic tokens.
- **D-VERIFY-9 · SHOULD** Run the host’s applicable checks and inspect actual browser evidence.
- **D-VERIFY-10 · SHOULD** Copy follows §6.

Color-only state signals are covered by D-ACCESS-2.

- **D-VERIFY-12 · SHOULD** For a dense surface: one primary model, the skeleton chosen from the question
  rather than the payload, and every fact with one authoritative location (§10).
