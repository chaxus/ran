# UI acceptance — evidence and decisions

Use this contract for a changed visual or interaction outcome. [DESIGN](./DESIGN.md) owns
appearance and composition; [INTERACTION](./INTERACTION.md) owns observable behavior.
The [interface index](./INTERFACE_GUIDE.md) routes the task. Read only applicable sections.

## Agree on the observable result

Before editing, state the affected task, views/states and independent expectations in a short
work note. Name the relevant owner, supported public API and host capability limits. Select
widths, themes, languages and input paths from the actual change; do not invent unrelated work.
For composition, state content/text/icon spines, intentional navigation columns, hit bounds
and vertical relationships. Do not derive the expected value from the implementation under test.

Keep one rule owner. An API/token check verifies source contracts; an image comparison verifies
pixels; an agent run verifies whether guidance was followed. None substitutes for the others.
A fixture demonstrates its own result, not acceptance of a host application it did not render.

## Browser proof

Capture the actual running surface before the fix when reproducing a visible defect. After the
fix, capture the same relevant state and inspect the full pane with realistic copy and surrounding
chrome. A mockup, source diff, changed assertion or screenshot of an unrelated build is not proof.
Inspect the composition as well as the link count: relabeling a redundant return as a breadcrumb
can still repeat the same context and add an unnecessary header row. Trace ancestor reachability
through the parent before deciding another visible shortcut is needed.

- Wait for component registration, pending content, fonts and rendered frames before measuring.
  Fail on missing/zero-sized targets. Record any subpixel tolerance; keep it below a full CSS pixel
  for exact spines (the source example uses 0.5px).
- Measure the defect's layer: wrapper, inner content, rendered text Range, icon viewport and
  actual pointer target are different. A Range is not exact glyph ink. Account for shadow parts
  through supported test seams; do not introduce production shadow queries for acceptance.
- Exercise affected reflow, wrapped translations, optional content and input paths. A static
  screenshot cannot prove focus return, keyboard navigation, touch discovery, interruptibility
  or async settlement. Record a continuous interaction when the defect unfolds over time.
- For a layout assertion, prove it rejects the relevant defect: move only label text while the
  frame stays fixed, introduce a doubled margin/phantom helper, or expand a title target into
  filler. Confirm the mutation won the cascade, observe failure, restore and observe success.
  Use changes relevant to the task; do not repeat the entire example suite for a tiny fix.
- Verify raw data when changing presentation. For code, copy the source payload, not highlighted
  DOM text: preserve tabs, blank lines, final newline and streamed additions. Verify clipboard
  success/failure, native selection and long-line scrolling independently. Document browser
  selection normalization without allowing it to alter the raw clipboard payload.

The source-only [layout example](https://github.com/chaxus/ran/blob/main/packages/ranui/test/e2e/layout-contract.md)
contains runnable commands and geometry utilities. Consumers adapt its relationships to their
host; these helpers are not new ranui exports. CSS zoom stress does not establish native browser
zoom or text-size accessibility support. Say which paths remain unverified.

### Review motion over time

For changed motion, inspect a continuous action at normal speed, then replay slowly where a
transition breaks. Include activation, intermediate state, completion and the reverse path; repeat
or reverse input before completion. Verify the final state, focus, event count and reading position
independently of the animation. A slow replay helps diagnose discontinuity; it is not a frame-rate
benchmark. Reduced motion needs its own visible-state check, not just a shorter recording.

Report a temporal defect as `element → input → observed frame/state → expected continuity`.
Use one representative real task across affected siblings to detect inconsistent motion language;
check the full composition again after local fixes. Preserve failed iterations as diagnostics,
separate from accepted captures. These checks complement the existing evidence binding below.

## Walk through the task

For a changed workflow or composition, start with a realistic goal expressed without naming the
control to use. Complete it from the actual entry point through result, recovery and return, as
relevant. Record the first choice, any ambiguous label, hesitation or backtracking, and whether
the result makes the next step clear. A shorter click path is not useful if the choices are unclear.
Use realistic content, including a representative long or failing case, rather than a polished
empty state alone. Fix task structure and content hierarchy before adding decorative effects.

Report the most consequential observed problems (up to three), with the state and evidence that
show each one; do not invent findings to fill a quota. Repeat the affected path after correction.
An agent walkthrough can expose defects but is not a human usability study. When observing a real
participant, let them attempt the goal before explaining the interface; preserve that distinction
in the results below.

## Bind evidence to what actually ran

For each reviewed state, retain a compact record of:

- **Runtime:** tested source revision/build and relevant dirty inputs or their fingerprint;
  include shared styles/components and incoming data when they affect the result. A Git HEAD
  alone is insufficient if the running build or working tree differs.
- **Scope/environment:** affected view/group membership, route/state, viewport, theme, locale,
  browser and input or reduced-motion settings where relevant.
- **Media:** capture/recording locations and content identity (for example SHA-256), tied to
  that runtime and state. Keep before and after distinct; never overwrite the only before image.
- **Review:** what the automated check and agent inspection actually established, separate
  from any human decision and any unverified state.

A short Markdown record is enough; an existing manifest may supply these fields. Do not add a
new evidence service or configuration framework for an ordinary change. Keep hashes beside the
files or in a referenced manifest so the claimed binding can be checked independently.

**A review applies only to the evidence and runtime scope it inspected.** Replacing an image,
editing a recording, changing group membership or changing relevant runtime inputs makes the
affected review stale. After a shared style/component change, refresh every affected state,
rebuild if needed, then inspect the new evidence. Old captures may remain as history, not current
proof. A docs-only edit or unrelated source change does not invalidate identical runtime evidence;
record why its dependency scope is unaffected rather than recapturing everything by HEAD alone.

## Report authority truthfully

Keep these results separate, even in a one-paragraph report:

| Result              | Who/what can establish it                                                       | What it does not establish           |
| ------------------- | ------------------------------------------------------------------------------- | ------------------------------------ |
| Automated checks    | Fresh command output or browser assertions for the declared runtime             | Visual quality or a human decision   |
| Agent visual review | Agent inspected current captures and the affected interaction                   | User acceptance                      |
| Human decision      | An actual user's decision, with its message/action reference and evidence scope | Acceptance of later changed evidence |

Use explicit outcomes such as `automated: passed`, `agent review: passed with limits`,
`human: not requested`. If human review was requested and is outstanding, say `pending`;
if a user rejected it, preserve `rejected` and the finding until that user reviews the updated
scope. An agent may report its correction and fresh checks, but cannot invent a user decision
or clear a human rejection. Avoid an unattributed “accepted”, “approved” or “验收通过”.

User authorization controls whether to push, update a PR or take another external action.
This document adds no blanket human approval gate: finish and deliver authorized work while
reporting `not requested`/`pending` truthfully. Ask only when the actual authorization or a
necessary product decision is missing. Never label the agent's own visual check “user accepted”.

A minimal delivery note can be:

> Runtime and scope: build/source …; state/environment …; relevant input fingerprint …
> Evidence: before/after/interaction …; identities recorded in …
> Automated: commands/results …
> Agent review: observed outcome, remaining finding or limit …
> Human decision: not requested / pending / actual decision and reference …
> Unverified: …; authorized PR/update: …

## Regression of the guidance itself

For opt-in or task-authorized live evaluation of skill/routing/acceptance changes, use the source-only
[six agent scenarios](https://github.com/chaxus/ran/tree/main/plugins/ranui/evals).
Deterministic controls check the assessor without model calls; live runs require an available agent harness
and are not a mandatory gate for every prose edit. Freeze tasks, fixtures, tools and independent rubrics before live runs. Use fresh sessions with
matching model/settings; pin baseline and candidate guidance in separate workspaces. Retain
actual agent work, prompts, outcome checks and evidence. Record baseline passes as controls and
candidate failures as failures. Do not show workers the assessor's thresholds or repair patches.

Seeded-defect rejection/restoration checks establish the assessor's sensitivity. Only live agent
runs establish behavior on those tasks; prose matching, hand-authored answers or corrected test
expectations do not. Inspect visual judgment independently of mechanical checks. Report sample
size, tools and uncovered conditions; six successful tasks do not prove reliability across models.
