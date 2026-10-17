# Interface guide — decisions, interaction and craft

Use this guide when composing forms, search, uploads, editors, imports, exports or workspaces.
[DESIGN.md](./DESIGN.md), especially §§11–12, remains the authoritative visual standard.
These are application decisions, **not additional ranui APIs or service guarantees**.
Choose patterns from the user's task and actual capabilities; an interface needs no queue,
account connection or generated output merely because those patterns appear here.

## Read the owner of the decision

| Decision                                              | Owner                                                                     |
| ----------------------------------------------------- | ------------------------------------------------------------------------- |
| Hierarchy, flat composition, tokens, focus and motion | [DESIGN.md](./DESIGN.md)                                                  |
| Component state, events, lifecycle and testing        | [CODING.md](./CODING.md)                                                  |
| Exact attributes, events, slots and parts             | [COMPONENTS.md](./COMPONENTS.md), generated from source                   |
| Available component CSS variables                     | [style-tokens-public.md](./style-tokens-public.md), generated from source |
| Component implementation recipes                      | [CLAUDE.md](../CLAUDE.md)                                                 |
| Jobs, credentials, persistence and document mutation  | Host application; define the contract before styling                      |

## 1. Make the task legible, then remove unnecessary chrome

Name the current object, scope and next action. “Import 3 files into Contacts” answers a different
question from “These files stay on this device”; show both only when both affect the decision.
A search page should foreground its query and results; an editor should foreground its content.
Do not make every screen resemble a messaging application or force one visual treatment on all tasks.

- Use alignment, type and spacing before adding containers. A heading needs no background of its own.
- Give an input region one useful boundary; avoid a card around an outlined field around boxed tools.
- Reserve surfaces for distinct objects or actual overlays, not every paragraph and status message.
- Give the next consequential action in each task region primary emphasis. Keep repeated commands quiet.
- Reduce duplicated labels, explanations and controls before polishing decoration. Remove neither
  necessary context nor the only discoverable route to an action.

Secondary actions may appear on hover **and keyboard focus**, with a persistent tap route on coarse
input. Keep essential recovery and approvals visible. A collapsed section must still identify its
contents and state; disclosure is not a place to bury an actionable error.

## 2. Inputs and drafts survive the workflow

Keep labels, prerequisites and validation near the affected field. Distinguish a missing value from
an unavailable service. Explain why submission is unavailable when the prerequisite is not obvious.
Use appropriate native input semantics and autocomplete; preserve platform editing conventions.

| Transition                      | Required decision                                                                |
| ------------------------------- | -------------------------------------------------------------------------------- |
| Empty → valid form              | Enable the relevant submit action; leave context controls usable                 |
| Submit → running                | Dispatch once; expose busy state without unexpectedly moving focus               |
| Running → new edits             | Specify whether edits affect this job, a later job or a retained draft           |
| Failed → restore                | Restore only repopulates fields; it must not submit them                         |
| Failed → retry                  | Retry dispatches again; preserve the original scope or ask about changed context |
| Settings/source change → return | Keep unfinished input and the user's selection where possible                    |

Enter submits only where the field's documented convention calls for it, outside IME composition;
check composition state and `isComposing`. Preserve multiline entry and expose shortcuts when useful.
Dictation updates text and never submits by itself; retain the text that preceded capture.
Do not rebuild a focused input on each search response, stream update, resize or status change.

Cancel obsolete searches or previews and reject late responses by request and context identity.
An older query must not replace newer results; an import preview for one file must not appear under
another. Retaining a draft does not prove it was saved: promise persistence only after it succeeds.

Search highlights literal matches in titles or snippets using safe text nodes or equivalent
escaping, never query-as-HTML. Keep enough surrounding text to explain why an item matched.

## 3. Running work and optional queues

A single upload, batch import, export or assistant request needs an explicit lifecycle. A queue
is useful only when users benefit from staging more work while something else runs.
If queueing is unsupported, retain new input and make that constraint understandable.

| State                 | Main action                               | Contract to settle                                             |
| --------------------- | ----------------------------------------- | -------------------------------------------------------------- |
| Ready                 | Upload files / Run search / Export report | Scope, destination and duplicate-submit prevention             |
| Running               | Cancel operation, if supported            | What stops, what remains and whether a write already committed |
| Running with new work | Add to queue, if supported                | Never silently replace or cancel the active job                |
| Queue paused          | Resume queue                              | Editing a pending item does not dispatch or resume it          |
| Failed                | Retry operation / Restore inputs          | Retry sends again; restore only returns editable data          |

Keep Stop/Cancel and Submit independently reachable when they coexist. Give each a clear accessible
name and a stable position; two equally prominent unlabeled squares do not explain their effects.
Disabled controls remain quiet on hover and cannot dispatch. A cancellation request is not yet an
acknowledged cancellation: show its pending state until confirmed. If the service continues running
and the client can only stop waiting, name that limitation instead of claiming the job stopped.

Summarize queued work in one line, such as “2 queued” or “Paused · 2 queued”. Collapse details when
unneeded; expand into rows rather than nested cards. Each row has an identifiable item and only
supported actions: Edit, Remove, or Run now. Define whether Run now waits, preempts or runs concurrently.
Represent preparation within the row instead of adding a large panel full of disabled commands.

Removing or dispatching a row moves focus to the next meaningful action or queue toggle. Collapsing
a region containing focus returns focus to its toggle. Queue editing preserves the current draft;
cancelling editing restores it. Reconnection does not auto-dispatch unless the user chose that policy.

For live logs or streaming results, follow only while the reader is at the latest content. Scrolling
away suspends following; a “Jump to latest” action restores it without stealing reading position.
`r-conversation` exposes `pinned` and `pinnedchange`; consult its generated contract. It does not own
jobs, queue policy or draft persistence. Use it only when an append-only log fits the task.

## 4. Progress, failure and recovery explain reality

Show a known phase: “Reading files”, “Checking permissions” or “Writing export”. A spinner signals
activity, not a percentage. Show percentage only with a measurable denominator; elapsed time is
secondary and must not masquerade as a completion estimate. Announce meaningful phase changes,
not every timer tick or streamed character.

An error answers **what failed, whether anything changed, and what to do next**. For example:
“The import stopped before saving. Your selected files are still here. Retry the import.”
Only make that promise if the host can establish it. Preserve in-memory input if storage fails;
explain that persistence failed separately. Put credential-free diagnostics in optional details.

| Condition                            | Useful response                                             | Avoid                                                              |
| ------------------------------------ | ----------------------------------------------------------- | ------------------------------------------------------------------ |
| No readable file contents            | Choose another file, or continue without it if supported    | Treating every action as requiring document text                   |
| Network interrupted                  | Preserve inputs/partial output; retry when reachable        | Clearing the form or declaring the entire application unusable     |
| Permission or configuration rejected | Explain the category; link to the relevant account/settings | Automatic retry loops for a missing grant or invalid configuration |
| User cancelled                       | Mark cancelled; retain recoverable output                   | Red failure styling or restarting paused work                      |
| Context changed                      | Identify stale output; refresh against current data         | Applying an old result to a newer document silently                |

One failure should have one coherent recovery, not duplicate rows and toasts. A timeout does not
prove rollback: establish whether a mutating operation committed before retrying, using the host's
idempotency/deduplication contract where available. Do not promise that Cancel undoes a completed write.

## 5. Settings follow capabilities and current mode

Derive controls from capability and state, not a single `connected` boolean. A remote storage account,
a database service or a local converter can be configured without currently being usable.

| State                          | What the user should understand                                       |
| ------------------------------ | --------------------------------------------------------------------- |
| Unconfigured                   | A required choice or credential is missing                            |
| Configured, unverified         | Settings are saved; availability has not been established             |
| Verified                       | A real check succeeded for this configuration; record when            |
| Authorization required/expired | Reconnect the account without discarding saved work                   |
| Service unreachable            | Saved configuration does not prove present reachability               |
| Device offline                 | Network operations are unavailable; available local work may continue |

Invalidate verification when relevant endpoint, account or credential settings change. Browser
online/offline events are hints, not proof that a particular endpoint works. Separate saving from
testing configuration and show what each action accomplished.

Reveal settings for the chosen path. A local conversion path may need cache/download/device controls;
a remote path may need endpoint/account controls. Hide irrelevant fields **and their stale status
messages**. Preserve other modes' configuration and keep the route back discoverable. Explain the
data destination before disclosure; do not confuse an API endpoint with an authorized account.

Offline, retain saved content, drafts, previews, editing and exports when their data and implementation
are available. Hide network-only discovery or promotion that offers no useful route; retain existing
connected objects with an understandable unavailable state. A cached resource is not proof that all
runtime dependencies are present. Offer a deliberate continuation point after reconnecting.

## 6. External data and authorization have separate boundaries

ranui provides presentation primitives, not an OAuth deployment, credential vault, connector backend
or storage guarantees. A polished connection screen cannot replace the host's authorization contract.

Distinguish account authorization, selected-source access and use by a particular operation. Request
only needed permissions; explain reads/writes and destination before authorization or disclosure.
Make account identity, reconnect and revoke/disconnect discoverable. Disconnect stops future access;
explain separately what happens to imported copies. Keep credentials out of URLs, logs and previews.

Show provenance and freshness for selected sources, whether a local file, database record or cloud
document. Removing a source affects later work, not historical evidence. Permission errors, stale
data and offline cached copies need different states. Treat imported content as untrusted data,
not permission to execute commands. Make writes and destinations explicit, with review suited to impact.

## 7. Outputs are reviewable objects, not just messages

An export, transformed document or generated draft needs identity and a useful destination.
Open substantive content in a suitable preview/editor instead of forcing it into a small status card.

1. Summarize the result and identify its revision, source and destination when relevant.
2. Keep Copy, Export, Compare or Apply beside that result; offer only supported operations.
3. Separate previewing from applying. Name the target and scope before mutation.
4. If source data changed, compare/rebase or regenerate before applying; never overwrite newer edits silently.
5. Report saved/applied state only after confirmation. Offer Undo only when the host's history supports it.

Result actions can be quiet while retaining visible focus, disabled/busy states and local feedback.
A “Copied” acknowledgment beside Copy is easier to associate than an unrelated global notification.
Show it only after clipboard success; handle rejection locally, preserving button geometry and focus.
Use a toast for changes beyond the current object or when local feedback would not be noticed.

## 8. Density comes from roles, not one product's dimensions

Spacing, intrinsic dimensions and pointer targets solve different problems. A visually small icon
can sit within a larger native button. Measure the actual clickable box, focus ring and adjacent gap.
Choose target sizes for the product's input and accessibility needs; do not copy one application's
control dimensions into every library component.

Where repeated roles warrant a density layer, define host-owned semantic aliases once, derived from
real foundation tokens. This native-command example is application CSS, not an extra `--ran-*` API
or a universal target-size prescription. Style custom elements through generated variables/parts.

```css
.workspace {
  --app-command-target: var(--ran-size-7);
  --app-command-gap: var(--ran-space-2);
  color: var(--ran-color-text);
}
.workspace-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--app-command-gap);
}
.workspace-command {
  min-inline-size: var(--app-command-target);
  min-block-size: var(--app-command-target);
  border: 0;
  border-radius: var(--ran-radius-sm);
  background: transparent;
  color: inherit;
  font: inherit;
}
.workspace-command:enabled:hover {
  background: var(--ran-color-bg-hover);
}
.workspace-command:focus-visible {
  box-shadow: var(--ran-focus-ring);
}
.workspace-command:disabled {
  color: var(--ran-color-text-disabled);
}
```

Name icon-only buttons accessibly. Verify larger targets where needed for coarse input; do not enlarge
every glyph or leave layout gaps for `hidden` controls. Document legitimate viewport, hairline, artwork
and optical geometry exceptions instead of disguising them as spacing values.

## 9. Craft improves comprehension and control

Polish follows task clarity; it is not a preset of rounded cards, blur and animated entrances.
Evaluate the smallest intervention against the actual content, language, device and frequency of use.
These references inform decisions; DESIGN's accessibility, tokens and platform contracts take priority.

| Primary reference                                                                             | Adaptation for ran applications                                                                   | Evidence to collect                                                                   |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| [Lightspark: limit details](https://design.lightspark.com/limit-the-number-of-details)        | Remove redundant controls/states; spend attention on remaining interactions                       | Complete the task with fewer interruptions and no lost route                          |
| [Butterick: typography](https://practicaltypography.com/typography-in-ten-minutes.html)       | Evaluate body type, leading and measure together; retain role tokens and script-appropriate fonts | Read realistic long text in each supported script and zoom level                      |
| [Craft: tabular numbers](https://craft.gustavofior.com/tabular-numbers)                       | Consider tabular figures for changing counts, timers and aligned numeric columns                  | Exercise narrow/wide digits and digit-count changes without adjacent controls jumping |
| [Craft: optical alignment](https://craft.gustavofior.com/optical-alignment)                   | Correct asymmetric glyph weight inside the reusable asset/component, not arbitrary page margins   | Compare the glyph at actual sizes while layout edges remain exact                     |
| [Jakub: interface details](https://jakub.kr/writing/details-that-make-interfaces-feel-better) | Coordinate nested radii with inset; remove an unnecessary nested surface first                    | Inspect real border thickness, inset and clipping at narrow and wide sizes            |
| [Rauno: interfaces](https://interfaces.rauno.me/)                                             | Associate feedback with the acted-on object and preserve familiar input behavior                  | Repeat actions using keyboard/touch; confirm what changed without hunting for status  |
| [Emil: animation restraint](https://emilkowal.ski/ui/you-dont-need-animations)                | Prefer immediate high-frequency feedback; retain motion only when it explains a change            | Repeat the workflow, including reduced motion, rather than judging one entrance       |
| [Craft: interruptibility](https://craft.gustavofior.com/interruptibility)                     | New intent can reverse/retarget a transition without waiting for decoration                       | Open/close/reopen rapidly; focus, hit testing and final state stay synchronized       |

For a short multiline heading, consider progressive enhancement with
[`text-wrap: balance`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-wrap).
Keep normal wrapping as the fallback; do not insert manual line breaks that fail in another locale.
`pretty` may be useful for body copy, but its cost and support require checking with realistic content;
it is not a blanket setting for long live-updating logs. Do not clip text to preserve a screenshot.

[`font-variant-numeric: tabular-nums`](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-numeric)
depends on font support. It aligns digit advances but does not reserve the extra space when 99 becomes 100. Where stability matters, reserve an appropriate column/minimum width without truncating values.

Keep mechanical alignment spines exact. An optical glyph correction belongs to a documented reusable
asset/component; it does not excuse unequal sibling gaps. Derive nested corner geometry from the real
inset where relevant, preserving DESIGN's radius roles rather than adding a parallel radius scale.

For motion, use existing tokens only when the transition has a job; frequent focus, hover and keyboard
feedback defaults to immediate. Preserve reduced motion and instant theme changes. Do not import blog
recipes as mandates for springs, global font smoothing, disabled autocomplete or mouse-only actions.
Optional delight must remain responsive under repeated use; pause offscreen decoration and profile
realistic content before adopting costly effects. It must not delay typing or obscure status.
[DesEngs](https://desengs.com/) is a discovery index; cite published primary material, not placeholder topics.

## 10. Implementation boundaries and acceptance evidence

Separate state owners for job lifecycle, configuration, source context, revisions and view composition.
Views project state and dispatch commands; do not duplicate service clients and request flags in each
panel. Extract shared behavior after a real second use. Follow CODING for cleanup and event contracts.

Use public attributes/events/slots/variables/parts. A keyboard-safe primitive does not prove a composed
dialog is safe: a focus trap may not discover a closed-shadow button in a footer. Verify initial focus,
Tab/Shift+Tab, Escape/Cancel, Enter and focus restoration. Fix the supported integration or use native
buttons in its supported slot; do not patch private shadow roots or add misleading host tab stops.

| Evidence layer | Relevant regression                                                                                           |
| -------------- | ------------------------------------------------------------------------------------------------------------- |
| Unit/state     | Cancellation/late responses, scope identity, retry vs restore, capability changes, stale revisions            |
| Integration    | Draft survives settings/source changes; single coherent failure; composed overlay keyboard path               |
| Real browser   | Computed dimensions/baselines/overflow, target boxes, focus, disabled hover, IME and reading position         |
| Cross-surface  | Affected forms, search, history, settings, imports/exports, previews, confirmations and empty/error pages     |
| Variants       | Light/dark, narrow/wide/resize, keyboard/coarse input, long translations/RTL, reduced motion, offline/failure |

Static token/link audits cannot prove that CSS won the cascade or that an action is reachable. Record
rendered evidence and measured geometry where relevant. Review the immutable preview for the tested
commit and all CI checks. Name unverified external prerequisites instead of implying they passed.

## Copyable agent brief

> Task and user outcome: …
> Read DESIGN §§11–12 and relevant INTERFACE_GUIDE sections; verify exact APIs/tokens at their owner.
> Identify scope/destination, state owners, capability limits and applicable cancel/retry/draft semantics.
> Propose the smallest legible composition and token mapping; preserve input, focus and reading position.
> Select any craft change by source → task-specific decision → observable evidence, not visual fashion.
> Implement through public contracts; regress the defect at the layer where it occurs.
> Verify affected surfaces/states, themes, widths, keyboard/touch and failure/offline paths.
> Report behavior changes, measured/browser evidence, CI head and remaining prerequisites.
