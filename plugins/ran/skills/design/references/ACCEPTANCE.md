<!-- Generated from design/ACCEPTANCE.md; edit the source, then run sync:agent-plugin. -->

# UI acceptance — evidence and decisions

Use this contract for a changed visual or interaction outcome. [DESIGN](./DESIGN.md) owns
appearance and composition; [INTERACTION](./INTERACTION.md) owns observable behavior.
The [interface index](./INTERFACE_GUIDE.md) routes the task. Read only applicable sections.

Each rule carries an ID and a level. **MUST** is a defect when broken and names its proof;
**SHOULD** is the default, and a deviation states its reason for that case; **MAY** is optional.
The [rule index](./RULES.md) lists every graded rule with its proof.

## Agree on the observable result

- **V-AGREE-1 · SHOULD** Before editing, settle the
  [design brief](./DESIGN.md#style-coherence-across-components-and-pages), and state the affected
  task, views/states and independent expectations in that same note.
- **V-AGREE-2 · SHOULD** Name the relevant owner, supported public API and host capability limits.
- **V-AGREE-3 · SHOULD** Select widths, themes, languages and input paths from the actual change,
  without inventing unrelated work.
- **V-AGREE-4 · SHOULD** For composition, state content/text/icon spines, intentional navigation
  columns, hit bounds and vertical relationships.
- **V-AGREE-5 · MUST** Do not derive the expected value from the implementation under test.
  _Proof: review_
- **V-AGREE-6 · SHOULD** Review in order: task/hierarchy, static composition, reachable combined
  states, then motion.
- **V-AGREE-7 · SHOULD** Do not add animation to compensate for unresolved proportions or unclear
  navigation.
- **V-AGREE-8 · SHOULD** When a review changes the intended design, update the existing brief first
  and identify the evidence that prompted it.

This is a decision record, not a new approval ceremony for work the user already authorized.

An API/token check verifies source contracts; an image comparison verifies pixels; an agent run
verifies whether guidance was followed.

- **V-AGREE-9 · SHOULD** Keep one rule owner.
- **V-AGREE-10 · MUST** Do not let one kind of check substitute for another: an API/token check, an
  image comparison and an agent run each establish only their own result. _Proof: review_
- **V-AGREE-11 · MUST** A fixture demonstrates its own result, not acceptance of a host application
  it did not render; do not claim it as host acceptance. _Proof: review_

## Browser proof

- **V-PROOF-1 · MUST** When reproducing a visible defect, capture the actual running surface before
  the fix. _Proof: browser_
- **V-PROOF-2 · MUST** After the fix, capture the same relevant state and inspect the full pane with
  realistic copy and surrounding chrome. _Proof: browser_
- **V-PROOF-3 · MUST** Do not offer a mockup, source diff, changed assertion or screenshot of an
  unrelated build as proof. _Proof: review_
- **V-PROOF-4 · SHOULD** Inspect the composition as well as the link count: relabeling a redundant
  return as a breadcrumb can still repeat the same context and add an unnecessary header row.
- **V-PROOF-5 · SHOULD** Trace ancestor reachability through the parent before deciding another
  visible shortcut is needed.
- **V-PROOF-6 · MUST** Wait for component registration, pending content, fonts and rendered frames
  before measuring. _Proof: browser_
- **V-PROOF-7 · MUST** Fail on missing or zero-sized targets. _Proof: browser_
- **V-PROOF-8 · MUST** Record any subpixel tolerance, and keep it below a full CSS pixel for exact
  spines (the source example uses 0.5px). _Proof: review_
- **V-PROOF-9 · MUST** For live overlays, verify that capture preserves the viewport and includes the
  full trigger/panel; a full-page screenshot can invalidate a crop by causing responsive reflow or
  portal repositioning. _Proof: browser_
- **V-PROOF-10 · MUST** Measure the defect's layer: wrapper, inner content, rendered text Range, icon
  viewport and actual pointer target are different. A Range is not exact glyph ink.
  _Proof: browser_
- **V-PROOF-11 · MUST** Account for shadow parts through supported test seams; do not introduce
  production shadow queries for acceptance. _Proof: review_
- **V-PROOF-12 · SHOULD** Exercise affected reflow, wrapped translations, optional content and input
  paths.
- **V-PROOF-13 · MUST** Do not use a static screenshot as proof of focus return, keyboard navigation,
  touch discovery, interruptibility or async settlement. _Proof: review_
- **V-PROOF-14 · MUST** Record a continuous interaction when the defect unfolds over time.
  _Proof: recording_
- **V-PROOF-15 · MUST** For a layout assertion, prove it rejects the relevant defect: move only label
  text while the frame stays fixed, introduce a doubled margin/phantom helper, or expand a title
  target into filler. _Proof: browser_
- **V-PROOF-16 · MUST** Confirm the mutation won the cascade, observe failure, restore and observe
  success. _Proof: browser_
- **V-PROOF-17 · SHOULD** Use mutations relevant to the task rather than repeating the entire example
  suite for a tiny fix.
- **V-PROOF-18 · MUST** Verify raw data when changing presentation. _Proof: browser, unit_
- **V-PROOF-19 · MUST** For code, copy the source payload, not highlighted DOM text: preserve tabs,
  blank lines, final newline and streamed additions. _Proof: unit_
- **V-PROOF-20 · MUST** Verify clipboard success/failure, native selection and long-line scrolling
  independently. _Proof: browser_
- **V-PROOF-21 · MUST** Document browser selection normalization without allowing it to alter the raw
  clipboard payload. _Proof: unit, review_

The source-only [layout example](https://github.com/chaxus/ran/blob/main/packages/ranui/test/e2e/layout-contract.md)
contains runnable commands and geometry utilities. Consumers adapt its relationships to their
host; these helpers are not new ranui exports.

- **V-PROOF-22 · MUST** Do not claim native browser zoom or text-size accessibility support from CSS
  zoom stress. _Proof: review_
- **V-PROOF-23 · MUST** Say which paths remain unverified. _Proof: review_

### Review motion over time

- **V-MOTION-1 · MUST** For changed motion, inspect a continuous action at normal speed, then replay
  slowly where a transition breaks. _Proof: recording_
- **V-MOTION-2 · MUST** Include activation, intermediate state, completion and the reverse path;
  repeat or reverse input before completion. _Proof: recording_
- **V-MOTION-3 · MUST** Verify the final state, focus, event count and reading position independently
  of the animation. _Proof: browser_
- **V-MOTION-4 · MUST** Use a slow replay to diagnose discontinuity, not as a frame-rate benchmark.
  _Proof: review_
- **V-MOTION-5 · MUST** Give reduced motion its own visible-state check, not just a shorter recording.
  _Proof: browser_
- **V-MOTION-6 · SHOULD** Report a temporal defect as
  `element → input → observed frame/state → expected continuity`.
- **V-MOTION-7 · SHOULD** Use one representative real task across affected siblings to detect
  inconsistent motion language.
- **V-MOTION-8 · SHOULD** Check the full composition again after local fixes.
- **V-MOTION-9 · SHOULD** Preserve failed iterations as diagnostics, separate from accepted captures.

These checks complement the existing evidence binding below.

## Walk through the task

- **V-WALK-1 · SHOULD** For a changed workflow or composition, start with a realistic goal expressed
  without naming the control to use.
- **V-WALK-2 · SHOULD** Complete the goal from the actual entry point through result, recovery and
  return, as relevant.
- **V-WALK-3 · SHOULD** Record the first choice, any ambiguous label, hesitation or backtracking, and
  whether the result makes the next step clear.

A shorter click path is not useful if the choices are unclear.

- **V-WALK-4 · SHOULD** Use realistic content, including a representative long or failing case,
  rather than a polished empty state alone.
- **V-WALK-5 · SHOULD** Fix task structure and content hierarchy before adding decorative effects.
- **V-WALK-6 · SHOULD** Report the most consequential observed problems (up to three), with the state
  and evidence that show each one.
- **V-WALK-7 · MUST** Do not invent findings to fill a quota. _Proof: review_
- **V-WALK-8 · SHOULD** Repeat the affected path after correction.
- **V-WALK-9 · MUST** Report an agent walkthrough as a defect search, not as a human usability study.
  _Proof: review_
- **V-WALK-10 · SHOULD** When observing a real participant, let them attempt the goal before
  explaining the interface, and preserve that distinction in the results below.

## Bind evidence to what actually ran

Each reviewed state gets a compact record with these fields:

- **V-FRESH-1 · MUST** Runtime: record the tested source revision/build and relevant dirty inputs or
  their fingerprint, including shared styles/components and incoming data when they affect the
  result. A Git HEAD alone is insufficient if the running build or working tree differs.
  _Proof: review_
- **V-FRESH-2 · MUST** Scope/environment: record affected view/group membership, route/state,
  viewport, theme, locale, browser and input or reduced-motion settings where relevant.
  _Proof: review_
- **V-FRESH-3 · MUST** Media: record capture/recording locations and content identity (for example
  SHA-256), tied to that runtime and state. _Proof: review_
- **V-FRESH-4 · MUST** Keep before and after distinct; never overwrite the only before image.
  _Proof: review_
- **V-FRESH-5 · MUST** Review: record what the automated check and agent inspection actually
  established, separate from any human decision and any unverified state. _Proof: review_
- **V-FRESH-6 · MAY** Use a short Markdown record; an existing manifest may supply these fields.
- **V-FRESH-7 · SHOULD** Do not add a new evidence service or configuration framework for an ordinary
  change.
- **V-FRESH-8 · MUST** Keep hashes beside the files or in a referenced manifest so the claimed binding
  can be checked independently. _Proof: review_

**A review applies only to the evidence and runtime scope it inspected.**

- **V-FRESH-9 · MUST** Treat the affected review as stale after replacing an image, editing a
  recording, changing group membership or changing relevant runtime inputs. _Proof: review_
- **V-FRESH-10 · MUST** After a shared style/component change, refresh every affected state, rebuild
  if needed, then inspect the new evidence. _Proof: browser, review_
- **V-FRESH-11 · MUST** Present no old capture as current proof. _Proof: review_
- **V-FRESH-12 · MUST** When keeping runtime evidence across a docs-only edit or unrelated source
  change, record why its dependency scope is unaffected. _Proof: review_

Old captures may remain as history. A docs-only edit or unrelated source change leaves identical
runtime evidence valid, so recapturing everything by HEAD alone is unnecessary.

## Report authority truthfully

| Result              | Who/what can establish it                                                       | What it does not establish           |
| ------------------- | ------------------------------------------------------------------------------- | ------------------------------------ |
| Automated checks    | Fresh command output or browser assertions for the declared runtime             | Visual quality or a human decision   |
| Agent visual review | Agent inspected current captures and the affected interaction                   | User acceptance                      |
| Human decision      | An actual user's decision, with its message/action reference and evidence scope | Acceptance of later changed evidence |

- **V-REPORT-1 · MUST** Keep these three results separate, even in a one-paragraph report.
  _Proof: review_
- **V-REPORT-2 · MUST** Claim each result only from the source the table above names, and never for
  what the table says it does not establish. _Proof: review_
- **V-REPORT-3 · SHOULD** Use explicit outcomes such as `automated: passed`,
  `agent review: passed with limits`, `human: not requested`.
- **V-REPORT-4 · MUST** If human review was requested and is outstanding, say `pending`.
  _Proof: review_
- **V-REPORT-5 · MUST** If a user rejected it, preserve `rejected` and the finding until that user
  reviews the updated scope. _Proof: review_
- **V-REPORT-6 · MUST** An agent may report its correction and fresh checks, but never invents a user
  decision or clears a human rejection. _Proof: review_
- **V-REPORT-7 · MUST** Avoid an unattributed “accepted”, “approved” or “验收通过”. _Proof: review_

User authorization controls whether to push, update a PR or take another external action.
This document adds no blanket human approval gate.

- **V-REPORT-8 · SHOULD** Finish and deliver authorized work while reporting
  `not requested`/`pending` truthfully.
- **V-REPORT-9 · SHOULD** Ask only when the actual authorization or a necessary product decision is
  missing.
- **V-REPORT-10 · MUST** Never label the agent's own visual check “user accepted”. _Proof: review_

A minimal delivery note can be:

> Runtime and scope: build/source …; state/environment …; relevant input fingerprint …
> Evidence: before/after/interaction …; identities recorded in …
> Automated: commands/results …
> Agent review: observed outcome, remaining finding or limit …
> Human decision: not requested / pending / actual decision and reference …
> Unverified: …; authorized PR/update: …

## Regression of the guidance itself

Deterministic controls check the assessor without model calls; live runs need an available agent
harness and are not a mandatory gate for every prose edit.

- **V-EVAL-1 · SHOULD** For opt-in or task-authorized live evaluation of skill/routing/acceptance
  changes, use the source-only
  [six agent scenarios](https://github.com/chaxus/ran/tree/main/plugins/ran/evals).
- **V-EVAL-2 · MUST** Freeze tasks, fixtures, tools and independent rubrics before live runs.
  _Proof: review_
- **V-EVAL-3 · MUST** Use fresh sessions with matching model/settings. _Proof: review_
- **V-EVAL-4 · MUST** Pin baseline and candidate guidance in separate workspaces. _Proof: review_
- **V-EVAL-5 · MUST** Retain actual agent work, prompts, outcome checks and evidence. _Proof: review_
- **V-EVAL-6 · MUST** Record baseline passes as controls and candidate failures as failures.
  _Proof: review_
- **V-EVAL-7 · MUST** Do not show workers the assessor's thresholds or repair patches.
  _Proof: review_

Seeded-defect rejection/restoration checks establish the assessor's sensitivity.

- **V-EVAL-8 · MUST** Claim behavior on those tasks only from live agent runs; prose matching,
  hand-authored answers or corrected test expectations are no evidence of it. _Proof: review_
- **V-EVAL-9 · MUST** Inspect visual judgment independently of mechanical checks. _Proof: review_
- **V-EVAL-10 · MUST** Report sample size, tools and uncovered conditions. _Proof: review_
- **V-EVAL-11 · MUST** Six successful tasks are no proof of reliability across models; do not claim
  it from them. _Proof: review_
