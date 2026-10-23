<!-- Generated from design/DESIGN.md; edit the source, then run sync:agent-plugin. -->

# Ran Design

Design methods for the host product and its existing technology. Read only the relevant
sections through [the task index](./INTERFACE_GUIDE.md). Library tokens and API mechanics belong
to their implementation adapter, not this portable method.

## 1. Color — a state ladder, not a palette

Choose semantic roles for content, surfaces, boundaries, actions and status. Define default,
hover, active, disabled and focus states together. Resolve light/dark values through the host’s
authoritative tokens; verify contrast in the actual composition. Brand accents are contextual.

## 2. Spacing — a limited, rhythmic scale

Use the host’s existing spacing scale. Tight gaps group related parts; larger gaps separate
tasks or regions. Establish inside padding before outside gaps. Do not copy a reference
product’s dimensions without evaluating content, density and input method.

## 3. Typography — choose a role, not a size

Choose heading, label, body, action and code roles with coherent size, weight and line height.
Verify actual scripts, fallback metrics and long content. Typography establishes hierarchy
before decorative containers. Keep a single authority for each role.

## 4. Radius & elevation

Coordinate nested corner radii with their real inset. Elevation explains a floating layer,
not importance; use the host’s stacking roles and verify overlays against surrounding chrome.

## 5. Motion — prefer none

Timing below is a starting heuristic. Use the host system’s motion tokens and verify frequency, continuity and reduced motion in the actual task.

| Duration | Use                                                                     |
| -------- | ----------------------------------------------------------------------- |
| 0ms      | Frequent hover, focus and keyboard feedback; changes already understood |
| ~150ms   | Optional, purposeful small motion, not a mandatory hover delay          |
| ~200ms   | Menu/popover motion when it clarifies the layer change                  |
| ~300ms   | Dialog motion when orientation benefits from it                         |

**Principle:** purpose and frequency determine whether motion earns time. Repeated interaction defaults
to immediate feedback; a larger change is not automatically a reason to animate. Use existing tokens
for purposeful motion, keep it quick and interruptible, and respect `prefers-reduced-motion`.

### Functional motion contract

Specify the trigger, state change and destination before choosing an effect. Preserve unrelated
content, drafts and reading position. Sibling components with the same interaction meaning should
share a motion language; consistency does not require every component to animate.

When motion is useful, allow a new intent to interrupt or reverse it from the current presentation,
without a jump, stale completion or duplicate activation. Keep feedback immediate; animation is not
an input lock. During insertion/removal, avoid visibly squeezing text or passing exiting controls
across live actions; coordinate opacity and layout so the result stays readable. Reduced motion
must retain a visible, understandable final state. A spring is optional and need not overshoot.

See the optional [component craft research](./REFERENCE_RESEARCH.md#component-craft-设计垂点--wxaddesign)
for examples and limits, and [temporal acceptance](./ACCEPTANCE.md#review-motion-over-time) for proof.

Theme palettes should settle coherently. Avoid implicit palette fades or `transition: all`;
explicitly opt in only where the host intends and verifies a coordinated effect.

## 6. Content — copy is part of the system

- **Buttons:** name the outcome. Include the object when context does not establish it: "Deploy project", "Delete member". In a clearly named object or dialog, "Save" or "Delete" is sufficient; avoid generic "OK". See [contextual wording](#words-are-part-of-the-interface).
- **Errors:** say **what happened**, then **how to fix it**. ✅ "Build failed: the bundle exceeds the size limit. Reduce it or raise the limit." ❌ "Operation failed, please try again."
- **Confirmations / toasts:** state the completed **change**. ✅ "Project deleted". ❌ "Operation successful". Show completion feedback only after the operation is confirmed.
- Be specific; every sentence should remove guesswork, not add it.

## 7. Accessibility — the system serves everyone

- Maintain sufficient text-to-background contrast (**WCAG AA**).
- **Never signal state with color alone** — pair it with an icon or text (e.g. ✓ / ✕ labels, not just green/red).
- Every interactive element has a **visible focus ring** appropriate to its surface. Never remove it for "cleanliness".
- **Full keyboard navigation** — nothing is mouse-only.
- Respect `prefers-reduced-motion` and `prefers-color-scheme`.

## 8. Input & viewport — mobile and desktop, both

- Support mouse, keyboard and touch at narrow and wide widths. Reflow controls instead of
  hiding the only route to an action. A hover affordance needs a click/tap alternative.
- Drags use Pointer Events including cancellation; scope `touch-action` to the actual drag
  surface and pair it with a real handler. Preserve ordinary scrolling elsewhere.
- Prefer content/viewport-relative bounds (`min()`, `max()`, `clamp()`) to arbitrary
  breakpoints. Use existing host breakpoints or introduce a justified shared role only when repeated needs emerge.
- A measured position becomes stale after resize, container reflow or scroll. Exercise
  resizing into a narrow layout, not only loading there. Overlay placement must track its
  trigger while open. The host owns lifecycle mechanics; [ranui engineering](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/CODING.md#3-state-and-ownership) is one implementation adapter.
- Test actual pointer/touch gestures, hover fallback and keyboard routes where affected;
  checking two color schemes does not establish input parity.

## 11. Composition — the page, not the component

Choose the page structure in §12 first; then compose its components with these rules.

### Style coherence across components and pages

Before extending a surface, state a short style brief using the existing system: type roles and
line heights, control density, radius/inset relationships, surface/elevation roles, semantic accent
usage and motion character. Reuse these decisions across sibling components and docs chrome;
change emphasis according to the task. Uniformity does not mean equal-sized controls or boxed
sections everywhere. An expressive demo must remain visibly distinct from its documentation chrome.

Compare a representative composed still with different real content before animating it. Then
inspect the state change and return path at normal speed. A shared color alone cannot reconcile
inconsistent proportions, icon weight, containment or motion. When an example looks imported from
another product, fix that relationship at its owning token/component/style rather than adding a
page-specific patch. Keep reference observations and validation limits in the optional
[research index](./REFERENCE_RESEARCH.md#style-coherence-and-transition-research).

### Structure before containers

**Reach for spacing, alignment, weight and a hairline before a box.** A container is a
claim that its contents are a separate object. Most regions need a background, a hairline
and intentional spacing — nothing more.

**A box is for a genuinely separate object** — a live demo stage, an overlay, a panel that
floats. Not for a code block, a table, a list row, a previous/next link, or a cell in a
gallery.

**Avoid redundant nested containers and doubled padding.** A card inside a padded panel
does not need another decorative frame or inset. Keep functionally required nested controls or
surfaces, and coordinate their radii with the actual inset; containment alone is not a reason to add a box.

**Every persistent boundary needs a distinct job.** Start with headings, alignment and proximity
to group content. Add a border, surface fill or elevation only when that structure leaves a real
boundary unclear. Do not repeat the same grouping with a panel frame, a nested card, row rules
and another inset at the same time. Faint lines are still extra hierarchy; reducing their contrast
or shortening them does not justify a redundant enclosure.

| Boundary                | Keep when it communicates                                               | Remove when it only repeats                                           |
| ----------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Field/control frame     | Where values can be entered or a selection made                         | A decorative wrapper around already legible commands                  |
| Region frame or divider | An independent viewport, resize boundary or major change of task        | A title and gap that already make the same group clear                |
| Nested surface          | A distinct floating layer, preview, drop target or interaction boundary | Another container inside an established settings pane                 |
| Focus/selection outline | Keyboard focus or persistent selection state                            | Never remove this state cue merely to make the resting layout quieter |

Review the full pane or page, not only the cropped group. For every remaining stable outline,
fill or separator, name the relationship or interaction it communicates and check what becomes
ambiguous if it is removed. A frame is optional; a reachable, recognisable control is not.

### Emphasis is a budget

**Colour, weight, badges, fills and elevation are scarce.** If everything is emphasised,
nothing reads as important. Establish priority with structure and proximity first, and
spend emphasis on the one thing that deserves it.

**Elevation explains stacking, not importance.** Shadows belong to surfaces that genuinely
float above content — popovers, menus, dialogs, notifications. Do not shadow every card.

### Spacing carries meaning

The scale in §2 is not only a rhythm; each step states a relationship. Choose the step by
what the gap _means_:

| Relationship             | Relative spacing                |
| ------------------------ | ------------------------------- |
| Parts of one control     | Tightest deliberate gap         |
| Closely related controls | Compact group gap               |
| One content group        | Group rhythm                    |
| Separate groups          | Larger separation               |
| Major region boundary    | Strongest deliberate separation |

**Inside before outside:** a component's own padding is decided before the gap between
components. **Smaller gap means tighter relationship** — that is the only thing vertical
rhythm communicates, so do not undo it with a decorative divider.

### Vertical rhythm across sibling views

Repeat relationships, not fixed heights. Choose title/description, field/hint, group and region gaps
from the host scale according to their relationship. These are composition decisions, not universal
component dimensions. Translations grow naturally; missing descriptions leave no vacant row.

Give each gap one owner: parent stack or explicit child margin. Reset authored local heading/
paragraph margins rather than adding them to the parent's gap. Account for owned control padding,
collapsing margins and inline baseline space; do not compensate with transforms or smaller type.
Place hints with the field/action they explain. Hidden helpers leave no accidental gap; a reserved
async status line needs a stated purpose and bounds.

Measure both axes after content settles. `next.top - previous.bottom` measures frame separation,
not glyph/line-box space. Keep leading, padding and hairlines distinct: 16px padding plus a 1px
rule is not a 17px spacing token. Use independent expectations and exercise wrapping, resizing,
helper/error visibility and relevant density. [ACCEPTANCE](./ACCEPTANCE.md#browser-proof) owns
settling and mutation checks for doubled margins, phantom rows and text-only drift.

### The measure governs text, not the column

**Choose a readable measure for the actual script and font.** For Latin prose, 60–75
characters per line is a starting heuristic, not a universal range for every writing system.
Review realistic text at supported widths, zoom levels and font fallbacks; CJK and mixed-script
text need their own judgment. [WCAG visual presentation](https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html)
also distinguishes CJK in its Level AAA criterion; it is not a mandatory library default.
A table, code fence, demo stage or image should retain the width its content needs.
Cap the text elements, not the column that holds them.

**Declare the measure in `rem`, never `em`.** `em` resolves against the element's own
font-size, so the larger the type, the longer the line — exactly backwards.

**Build hierarchy out of type before reaching for a box.** One step of size and one step
down in colour turns a title and its first sentence into a title and a deck, with no new
container and no new border.

### If the layout says two things are one object, the spacing must agree

**A shared border, a shared radius and a gap between them are a contradiction.** Decide
whether the elements are one object or two, and make every property say the same thing.

**When a value must equal another value, name it.** A gap that a child has to subtract is
not a literal in two places; it is one custom property referenced twice.

### Reserve a column only when its content exists

**A column declared unconditionally is still a column, even on the pages that have nothing
to put in it.** Condition the track on the element actually being there (`:has()`), not on
a page type you assume implies it.

### Alignment is structure, not polish

**Name each alignment spine and the geometry it aligns.** A page content spine, navigation
column and nested form-label spine can differ intentionally. State which siblings share each one;
include headers, body copy, rows, actions and empty/loading/error content. A back button plus gap
may establish a separate title column: do not silently treat that title as aligned to body text.
A missing optional icon or badge must not move labels out of their declared column. A nested level
returns exactly to its parent's spine when it ends.

Compare the right boxes. These are separate measurements, even when they happen to coincide:

| Geometry      | What to measure                                                                                   |
| ------------- | ------------------------------------------------------------------------------------------------- |
| Frame         | The wrapper/host border box from `getBoundingClientRect()`                                        |
| Content       | The inner edge after the actual border and padding, including nested wrappers                     |
| Text          | A DOM `Range` around the rendered label's text nodes; use first/last line rectangles for wrapping |
| Icon viewport | The SVG/viewbox or image box; painted glyph ink may be asymmetric inside it                       |
| Hit area      | The actual event target and its hover/focus surface; verify points near its edges                 |

A button frame aligned with a paragraph does not prove its text is aligned: internal padding can
move the label while the frame stays fixed. `Range` gives typographic geometry, not exact glyph ink;
inspect optical glyph corrections separately. For web components, measure the host, documented shadow parts and slotted text through supported
test seams; do not add production shadow queries or assume document CSS crosses the boundary.

**Keep a header command's hit zone separate from layout filler.** A title/menu trigger should hug
its content plus deliberate padding, bounded by the available width. Let a separate flex/grid track
absorb remaining space. Define truncation/wrapping and adjacent action behavior for long translations.
Do not make an entire unused header strip clickable merely by giving the title button `flex: 1`.
A row that intentionally selects its whole width is a different role; record that contract explicitly.
Coarse-pointer targets may grow without stretching the hover fill across unrelated content.

**Count every inset from the shared ancestor to the visible text.** Parent padding, nested panel
padding, a control's internal padding, borders and navigation columns all contribute. Remove a
redundant inset at its owner instead of cancelling it with an unexplained negative margin. Empty
states retain their region's content spine and width; extra breathing room must not introduce a
second left edge or make a compact action fill the region. Product-specific insets and target sizes
remain application aliases, not new foundation values or universal component defaults.

**When two layout edges or gaps are meant to be equal, a one-pixel difference is a defect.**
Optical correction for an asymmetric glyph is a separate, documented asset/component decision:
reuse the correction at supported sizes while preserving exact sibling gaps, baselines and alignment
spines. It is not permission to nudge page margins until a screenshot looks balanced.

### Selection, links and other semantic lies

**Selection is persistent state and must not look like hover.** Hover is transient; if the
current item is marked with the same fill hover uses, the interface has two names for one
appearance.

**Action and link roles remain distinguishable.** Verify inline links against surrounding prose,
including themes where action and body colors happen to match.

**A link leaves; a button acts.** Anything that changes application state is a button,
whatever it looks like. Do not style a command as a link to make it quiet, and do not let
a button-shaped link keep an underline.

### Command hierarchy in constrained panes

**Remove redundant group enclosures without erasing control affordance.** Headings,
alignment and proximity establish groups inside a settings pane; they do not automatically
make an icon and label look clickable. Do not require flat rows in every context. Use them
when a recognizable menu/list pattern already conveys action. Standalone commands may need
their own restrained button surface or functional stroke, visible before hover in every
supported theme. A button's own shape identifies its target; an enclosing card, muted group
fill and row rules must still pass the distinct-boundary test above.

Do not rely on hover, pointer cursors, verb labels or keyboard focus alone for initial
discovery. Inspect the resting full pane with the pointer away, including touch use. Keep
hover, press, disabled and keyboard focus distinguishable after the control is discovered.
Long translated labels may wrap inside a single command column rather than creating a
ragged horizontal button cloud. Do not add navigation chevrons to immediate commands.

Declare which visible columns are shared with adjacent checkboxes or controls: measure
icon/checkbox edges and text Ranges, not only button rectangles or alignment within the
command group. A hit target may extend into an owned gutter to preserve those columns;
name the extension, keep it inside its pane and verify non-overlap and focus visibility.

Separate destructive commands from recovery and transfer actions. A danger label and icon
can communicate intent without a large red outline on every resting command; reserve the
strongest danger fill for explicit confirmation. Keep confirmation, cancellation, focus
return and busy guards. Acceptance covers resting discoverability, declared shared columns,
full-pane boundary hierarchy, target bounds, label clipping, contrast and interaction states.
An automated surface-difference check catches invisible control fills but does not prove
that users recognize the action: inspect the actual render as well. Reuse foundation roles
and coarse-input target requirements; this guidance changes no component defaults.

### One product, one token set

Use the product’s authoritative semantic tokens. Aliases may improve readability, but resolve
from that source rather than inventing a competing palette. Coordinate third-party components
through supported theme APIs and verify the composed result.

### Density follows control roles

Spacing, intrinsic dimensions and hit targets solve different problems. A small glyph can have
a larger native button target. Measure actual hit bounds, focus and adjacent gaps; derive repeated
host aliases from foundation tokens, not one application's dimensions copied across the library.

Choose target bounds for the actual input method without enlarging every glyph or reserving
space for hidden controls. Use supported public theme APIs. Name icon-only controls accessibly
and document legitimate viewport, hairline, artwork and optical geometry exceptions.

### Evaluate craft through evidence

Polish follows task clarity, not a preset of cards, blur or entrances. Choose a deliberate
visual direction using realistic objects, copy and states; a generic empty shell cannot establish
product quality. Working interfaces need sustained reading and frequent actions; marketing pages
may need a different composition. Evaluate the smallest intervention against real content, language,
device and repeated use. Primary references answer
specific questions: [Linear hierarchy](https://linear.app/now/behind-the-latest-design-refresh),
[Geist typography](https://vercel.com/geist/typography),
[optical alignment](https://craft.gustavofior.com/optical-alignment) and
[interruptibility](https://craft.gustavofior.com/interruptibility). Adapt their principles with
the host’s tokens and actual capabilities; do not copy a product's pixel sizes or import recipes as rules.
[Don't Make Me Think](https://sensible.com/dont-make-me-think/) informs scanning, hierarchy and
clear choices; [taste-skill](https://github.com/leonxlnx/taste-skill) informs deliberate direction
and critique; [ryugi](https://github.com/Innei/ryugi) informs executable work and fresh evidence.
These references inform decisions, not additional instruction sets. A stylistic preference needs
context; a requirement must identify the task or observable contract it protects.

Choose references by the job they support: logo/app identity, marketing composition and frequent
working interactions solve different problems. Record the observed pattern and its adaptation;
verify the result with real content. The optional [research index](./REFERENCE_RESEARCH.md) maps
sources to questions and demonstrates this translation without adding another rule set.

When direction is unresolved, compare two small real-host variants with the same content, width
and theme, changing one dimension at a time. Explain what each difference does for the task.
A clear direction or small correction proceeds directly; there is no mandatory approval ritual.

- Balance short headings progressively with `text-wrap: balance`, preserving normal wrapping.
  Do not insert locale-dependent manual breaks or clip text to preserve a screenshot. Check cost
  and support before using `pretty` on long live content.
- Tabular figures stabilize digit advances if the font supports them; reserve a meaningful
  column for digit-count changes such as 99 → 100 without truncating values.
- Correct asymmetric glyphs in a reusable asset/component, preserving exact layout spines.
  Derive nested corner geometry from actual inset; remove an unnecessary nested surface first.
- Motion needs a job: immediate frequent feedback, interruptible transitions, reduced motion and
  instant themes. Optional delight must not delay typing or obscure status. Pause offscreen
  decoration and profile realistic content before adopting costly effects. See §5.

### Words are part of the interface

Avoid unnecessary secondary labels and descriptions. Let the layout do the explaining.
A heading, grouping, proximity or obvious control should not need another sentence repeating
its purpose. Remove copy with no new decision, constraint or consequence; do not replace it
with a decorative badge or tooltip. Preserve accessible names, field labels, units, errors,
risk disclosures and useful first-use guidance. Test whether the task remains understandable.

Let context carry context: `Users` rather than `User Management`; do not repeat a dialog's
question in its body. Name results (`Save`, `Move`, `Delete`), not gestures (`Click to save`).
Include the object only when context does not establish it. `Cancel` leaves without committing.
Use sentence case, no period on short labels, and a period on explanatory sentences.
Use one `…` when an action needs more input before completing; reserve ALL CAPS for short
statuses, eyebrows and acronyms.

### Review checklist for a composed surface

Apply these questions to the affected surface and reachable changed states. Skip irrelevant variants;
a small patch does not require redesigning unrelated pages. A "no" within scope is a finding:

1. Can a new reader recognise the purpose and the primary action without guessing?
2. Does every control's label, state and result describe one consistent outcome?
3. Is emphasis scarce — does the core thing get the weight while colour, badges and
   primary buttons stay rare?
4. Could this do less: any entry point, option or state removable without weakening the task?
5. Are named spines exact at the visible text/content layer, including nested and empty states,
   with intentional navigation columns and no doubled padding? Do adjacent controls share their declared
   icon/text columns? Are title hit zones content-hugging? Do repeated vertical relationships use
   consistent gaps with one owner, including wrapped copy and hidden helper/error content?
6. Is running text comfortable in its actual scripts, fonts and zoom levels, and is
   everything that is **not** running text free of that measure cap?
7. Does every element that looks like part of one object agree — border, radius **and**
   spacing — and does every reserved column actually have content? Does each persistent frame,
   fill or divider communicate a distinct boundary instead of nesting the same group again?
8. Does it hold in relevant changed states: empty, loading, failure, long translations, narrow
   width, supported themes, reduced motion and **RTL**, where affected?
9. For layout or interaction changes, has the affected surface been checked in a real browser
   at the relevant widths and themes? Are standalone actions recognizable before hover, including
   touch use, without redundant group enclosures?

A happy-path screenshot does not prove keyboard behavior, focus, dynamic content,
resizing or failure recovery. Follow [ACCEPTANCE](./ACCEPTANCE.md) for independent expectations,
actual runtime/capture identity, browser measurements and separate automated, agent and human
results. The source-only [browser example](https://github.com/chaxus/ran/blob/main/packages/ranui/test/e2e/layout-contract.md)
contains setup commands and test utility details; they are not public package APIs.

## 12. Information architecture — the shape before the composition

Choose structure before composition for information-dense consoles, dashboards and workbenches.
Complete API data is not a page design: the reader still needs a clear order for understanding
objects, their state and relationships, then acting. Single-conversion and landing pages need
their own task structure rather than a dense-console template.

### Answer three questions before naming a component

1. **What must the reader see on arrival?** That is the primary information.
2. **What else has to be visible for it to make sense?** Related resources, related models,
   context.
3. **What do they do next?** Judge, act, or keep thinking.

**A page has exactly one primary model.** Supporting models may help the reader understand or
operate it; they may not compete for the first screen. Prefer a clear, unambiguous next choice
over an arbitrary click budget. Test whether readers recognize the next action, not merely
whether the destination is reachable.

### The shape follows the task, not the payload

Choose a skeleton from the reader's question, not an API array or route ID:

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

Do not confuse historical events with future steps, a filter with kanban, or ordered prose
with a field grid. A date alone does not justify a calendar. Ship multiple views only when
each serves a distinct task worth its filter/state/action maintenance.

### Each kind of information has a place

| Information   | Belongs                                                      | Must not end up                          |
| ------------- | ------------------------------------------------------------ | ---------------------------------------- |
| Identity      | Title, object summary                                        | The last column, or behind a tab         |
| Status        | Title or summary region                                      | Findable only in a detail field          |
| Attributes    | Detail body, grouped as people think about it                | Flattened in API field order             |
| Relationships | Own region or tab; ownership, dependency, reference distinct | Mixed into the attribute table           |
| Changes       | Diff region, timeline                                        | Shown as the new value only              |
| Evidence      | Beside the judgement, expandable                             | A log page elsewhere                     |
| Actions       | Primary in the title region, the rest beside their object    | Buried under "more"                      |
| Feedback      | Beside the action, keeping task context                      | A global toast detached from its subject |

**Every fact has exactly one authoritative location.** Elsewhere shows a summary or an entry
point that links back to it.

Default reading order — page identity → current status or exception → primary task and primary
action → the information the judgement needs → relationships, changes, evidence → secondary
information and low-frequency actions. **One primary action per task region**, and it is the
most likely next step, not the most destructive one (§11, "Emphasis is a budget", governs how
much weight it may take).

### Density is effective information, not controls per inch

Tightening spacing raises visual density and leaves effective density where it was. Removing
irrelevant fields and putting the comparison in one place raises the real thing.

**Use at most two adjacent density levels on one page** — spacious for first use and risky
confirmation, standard for most lists and details, compact for expert workbenches. Container
padding and line height may tighten; readable body text, a visible focus ring and pointer
target size may not (§8).

### Containers do not fix structure

**One contextual return per view.** Do not show an outer “Back to chat” and an inner
“Back to artifacts” together. The detail view returns to its immediate parent; ancestors remain
reachable through the route hierarchy or clearly named breadcrumbs. Verify the full journey,
including focus return and long translated destination names. If text does not fit, reflow or
use a meaningful shorter destination; an ellipsis or tooltip must not hide the only destination cue.
Choose one composition for the parent context. Do not add a breadcrumb merely to relabel a
redundant return shortcut, or repeat that parent as an inert crumb above its return command.
When returning through the parent already reaches the ancestor, that journey preserves access
without adding another detail-header row. Use breadcrumbs when the hierarchy itself helps the task.

**`r-modal` is not a navigation layer.** Anything needing a copyable link, history, a
side-by-side comparison, or work that survives a refresh gets a route. Reserve the modal for a
short confirmation or a single field, `r-popover` / `r-dropdown` for transient context, and
`r-disclosure-row` for progressive disclosure.

**`r-tabs` carries peer views of one object** — its conversation, its checks, its diff — never
unrelated modules; that is navigation's job.

If the chosen library lacks a suitable primitive, use existing semantic elements and host tokens;
verify the required interaction rather than inventing unsupported APIs.

## Verification checklist (before shipping UI)

Select checks for the affected surface, supported variants and changed behavior; do not create
unrelated flows merely to satisfy the list. Repository CI still runs its complete gates.

- [ ] Primary task and primary action are unmistakable.
- [ ] Affected layout/theme changes work at relevant **narrow and wide** widths and supported themes.
- [ ] Works with **mouse and touch** — any drag/gesture uses Pointer Events, not mouse-only; any
      `trigger="hover"` has a tap fallback.
- [ ] All changed **states** exercised (hover, active, focus, disabled, loading, empty, error).
- [ ] **Keyboard / focus** behavior verified; visible focus everywhere.
- [ ] Relevant edge cases: long text, large numbers and the host's supported scripts/locales.
- [ ] Spacing comes from the scale; type uses a role; color uses semantic tokens.
- [ ] Run the host’s applicable checks and inspect actual browser evidence.
- [ ] Copy follows §6; nothing signals state by color alone (§7).
- [ ] For a dense surface: one primary model, the skeleton chosen from the question rather
      than the payload, and every fact with one authoritative location (§12).
