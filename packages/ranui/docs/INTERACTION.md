# Interaction standard

This file owns **observable behavior**, independent of the screen's domain or visual treatment.
[DESIGN.md](./DESIGN.md) owns appearance; [CODING.md](./CODING.md) owns implementation.
Use [WORKFLOW_PATTERNS.md](./WORKFLOW_PATTERNS.md) only for a relevant multi-step task.
No workflow infrastructure is implied by these general rules.

## 1. Inputs, drafts and intent

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

The latest intent remains authoritative: an older query must not replace newer results, and an
import preview for one file must not appear under another. [CODING §3](./CODING.md#3-state-and-ownership)
owns the async identity and cancellation mechanisms. Retaining a draft does not prove it was saved:
promise persistence only after it succeeds.

Search highlights literal matches in titles or snippets using safe text nodes or equivalent
escaping, never query-as-HTML. Keep enough surrounding text to explain why an item matched.

## 2. Reachable controls and predictable focus

Use native semantics and supported component contracts. Name icon-only actions accessibly.
Secondary actions may appear on hover **and keyboard focus**, with a persistent tap route on
coarse input. Keep essential recovery visible. Disabled controls remain quiet on hover and
cannot dispatch. Preserve a stable target box and focus ring as labels or status change.

Use public attributes/events/slots/variables/parts. A keyboard-safe primitive does not prove a composed
dialog is safe: a focus trap may not discover a closed-shadow button in a footer. Verify initial focus,
Tab/Shift+Tab, Escape/Cancel, Enter and focus restoration. Fix the supported integration or use native
buttons in its supported slot; do not patch private shadow roots or add misleading host tab stops.

A collapsed region must still identify its contents and state; disclosure must not hide an
unresolved actionable error. Collapsing a region containing focus returns focus to its toggle.
Use the collapsed summary to help readers decide whether to expand. When the expanded body
already displays that content, omit the repeated summary and keep the title and state visible.
Removing the focused object moves focus to the next meaningful action or a stable parent control.
Do not move focus merely because a background request completed.

## 3. Feedback and reading position

Associate feedback with the object acted on. A “Copied” acknowledgment beside Copy is easier
to associate than an unrelated global notification. Show it only after clipboard success; handle
rejection locally, preserving button geometry and focus. Use a toast for changes beyond the current
object or when local feedback would not be noticed. Do not announce every streamed character.
Bind async feedback to the operation's source snapshot. If code changes while Copy is pending,
the older completion must not mark the new content “Copied”; clear or identify stale feedback.
Verify delayed success and failure across an intervening stream update, not just an isolated delay.

For live logs or streaming results, follow only while the reader is at the latest content. Scrolling
away suspends following; a “Jump to latest” action restores it without stealing reading position.
`r-conversation` exposes `pinned` and `pinnedchange`; consult [its generated contract](./COMPONENTS.md).
It does not own jobs or persistence. Use it only when an append-only log fits the task.

## 4. Progress, failure and recovery

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

## 5. Cancel, retry and completion are different outcomes

Keep Cancel and Submit independently reachable when both are supported, with clear accessible
names and stable positions. A cancellation request is not an acknowledged cancellation: show its
pending state until confirmed. If the service keeps running and the client can only stop waiting,
name that limitation instead of claiming the job stopped. Distinguish cancellation from failure.

Retry dispatches work again; Restore only repopulates editable inputs. Do not silently broaden scope
or switch destinations on retry. Confirm a completed write before reporting saved/applied success;
retain recoverable partial output. Offer Undo only when the host can actually reverse the operation.

## 6. Verify what a person can observe

Choose evidence by the defect, rather than requiring every possible test for a small change:

| Evidence layer | Relevant regression                                                                         |
| -------------- | ------------------------------------------------------------------------------------------- |
| Unit/state     | Cancellation, late responses, scope identity and retry versus restore                       |
| Integration    | Draft survives a context round trip; one coherent failure; overlay keyboard path            |
| Real browser   | Computed dimensions/baselines/overflow, target boxes, focus, disabled hover and IME         |
| Cross-surface  | Affected forms, search, history, settings, import/export, previews and confirmations        |
| Variants       | Relevant themes, widths, resize, keyboard/coarse input, translations/RTL and reduced motion |

Include offline/failure paths when the task depends on external work. Static audits cannot prove
focus restoration, the winning cascade or preserved reading position. Report the tested commit and
remaining external prerequisites. Library contributors use [CODING's checklist](./CODING.md#checklist-before-opening-a-pull-request);
consumer applications use the host's relevant commands, not ranui's source-checkout commands.
