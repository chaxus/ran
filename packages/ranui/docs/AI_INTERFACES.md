# AI interfaces — application decisions

Use this guide for AI chat, document assistants and workspaces with tools or generated results.
It supplements [DESIGN.md](./DESIGN.md), especially §§11–12; that file remains the visual
standard. These are host application recommendations, **not new ranui APIs or guarantees**.
Choose the interaction from the user's task and the application's actual capabilities.

## Read only the owner you need

| Decision                                                               | Owner                                                                     |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Hierarchy, flat composition, colour, spacing, focus and motion         | [DESIGN.md](./DESIGN.md)                                                  |
| Component state, events, lifecycle and testing                         | [CODING.md](./CODING.md)                                                  |
| Exact component attributes, events, slots and parts                    | [COMPONENTS.md](./COMPONENTS.md), generated from source                   |
| Available component CSS variables                                      | [style-tokens-public.md](./style-tokens-public.md), generated from source |
| Component implementation recipes                                       | [CLAUDE.md](../CLAUDE.md)                                                 |
| Provider calls, queues, credentials, persistence and document mutation | Host application; specify the contract before styling                     |

## Start from the task, then reduce the chrome

An assistant can answer a question, transform selected content or produce a reviewable result.
Make the active scope and destination visible before sending: “Selected text · 89 characters”
and “Changes stay on this device” answer different questions. Show only the relevant facts.
Do not repeat a privacy paragraph beneath every control and response.

Apply DESIGN's flat composition to the whole workspace, not just an isolated component:

- Give the composer one boundary. Avoid a bordered card around a bordered input around buttons.
- Let transcript text sit on the page. Reserve surfaces for distinct objects and actual overlays.
- Use one compact status line, one collapsed queue summary and quiet actions beside their result.
- Use alignment, type and spacing for hierarchy; a section heading does not need its own fill.
- Spend the primary treatment on the next consequential action in each task region.
  Repeated secondary commands should not all look like primary calls to action.

Progressive disclosure removes detail, not the only route to an action. Reveal secondary
result controls on hover **and keyboard focus**, with a persistent tap path on coarse input.
Keep essential recovery and pending approval visible. Do not conceal an error behind a chevron.

## Composer, running work and queue

Specify these behaviours before choosing icons. Labels below describe semantics; they are not
fixed library copy or a required layout.

| State              | Main action                    | Other behaviour                                                                                |
| ------------------ | ------------------------------ | ---------------------------------------------------------------------------------------------- |
| Empty, ready       | Send unavailable               | Keep context/source controls usable; explain missing prerequisites beside the relevant control |
| Draft, ready       | Send request                   | A click or explicit submit sends exactly once and preserves context identity                   |
| Running, no draft  | Stop generation                | Stops the active request; queued work and existing output follow an explicit policy            |
| Running, new draft | Queue request, if supported    | Stop remains independently reachable; never silently replace or cancel the active request      |
| Queue paused       | Resume queue                   | No automatic dispatch; editing a pending item must not resume it                               |
| Failed request     | Retry request or Restore draft | Retry dispatches again; Restore only repopulates the composer and sends nothing                |

If queueing is unsupported, preserve the draft while work runs and make that limitation clear.
When Send and Stop coexist, give each an accessible name and stable position; do not use two
equally loud unlabeled squares. Changing an action must not unexpectedly move keyboard focus.
Keep disabled controls quiet on hover and ensure they cannot dispatch.

Use one summary such as “2 queued” or “Paused · 2 queued” above the composer. Collapse the list
by default when its details are unnecessary. Expand into rows, not nested cards. Each row
needs a short request excerpt and contextual Edit, Remove and, only when supported, Send now.
State whether Send now waits, preempts or runs concurrently; it must not secretly interrupt.
Show preparation as a row state instead of a second large panel with three disabled buttons.

When a row is removed or sent, move focus to the next meaningful row action or queue toggle.
Collapsing a list that contains focus returns focus to its toggle. Opening queue editing must
preserve the current composer draft; cancellation restores it. Resume never discards drafts.

Keep typing stable across streaming updates and context changes:

- Enter submits only outside IME composition; check composition state and `isComposing`.
  Preserve the chosen newline shortcut and expose it where useful.
- Dictation updates the draft and never auto-sends. Preserve text that existed before capture.
- Do not rebuild the focused input on each stream delta, resize or queue update.
- Follow the transcript only while the reader is pinned to the latest content. Scrolling away
  suspends following; provide “Jump to latest” without stealing focus or reading position.
- Cancel obsolete work and reject late responses by request/context identity. A stopped or
  older request must not overwrite a newer result or a different document's state.

`r-conversation` exposes `pinned` and `pinnedchange` for following behaviour; consult its current
contract. `r-markdown` can render streaming prose. Neither component owns provider requests,
queue policy, document identity or application draft persistence.

## Progress and failure that explain what happened

Use a truthful phase (“Reading selected text”, “Generating”, “Waiting for service”) when the
system knows it. A spinner means activity, not a percentage. Show a percentage only with a real
measurable denominator. Elapsed time is secondary information; do not invent completion estimates.
Announce meaningful phase changes accessibly without announcing every token or timer tick.

An error answers **what failed, whether anything changed, and what can happen next**.
For example: “The service did not respond. Your draft is saved. Retry the request.” Only promise
saved content when persistence succeeded. Surface storage failures separately and preserve the
in-memory draft. Keep technical diagnostics in an optional detail area, without credentials.

| Condition                                     | Useful recovery                                                     | Avoid                                                                  |
| --------------------------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| No readable document text                     | Choose another source, or ask without document context if supported | Treating an ordinary chat question as necessarily requiring a document |
| Network interrupted                           | Keep draft/partial output; retry when reachable                     | Clearing the composer or claiming the whole application is unavailable |
| Service rejection, quota or unavailable model | Explain the category; offer relevant service/model settings         | Repeated automatic retries for a configuration or permission problem   |
| User stopped work                             | Mark it stopped; keep recoverable output                            | Red failure styling or automatic queue restart                         |
| Context changed before completion             | Identify stale output; regenerate against current context           | Applying it to the new selection silently                              |

Avoid duplicate error rows and toasts for one failure. Keep the failed request tied to its
recovery, so restoring the draft cannot appear to have sent it. For a potentially mutating
operation, retry only after determining whether the first attempt committed; use the host's
deduplication/idempotency contract where supported. Never equate a transport timeout with rollback.

## Capabilities, model settings and offline use

Derive the interface from capability and state, not a single `connected` boolean:

| State                          | What the user should understand                                                        |
| ------------------------------ | -------------------------------------------------------------------------------------- |
| Unconfigured                   | A provider/model must be chosen; no working connection exists yet                      |
| Configured, unverified         | Settings are saved; no successful connection check has established availability        |
| Verified                       | A real check succeeded for this configuration; record when it was checked              |
| Authorization required/expired | The account grant is missing or expired; reconnect without discarding saved content    |
| Service unreachable            | The chosen service cannot currently be reached; saved settings are not proof of health |
| Device offline                 | Network operations are unavailable; on-device capabilities may still work              |

Invalidate verification when relevant endpoint, model, credential or account settings change.
Browser online/offline events are hints, not proof that a particular service is reachable.
Do not claim “Connected” merely because configuration was written to storage.

Show settings for the selected execution path. Cloud mode exposes endpoint, model and credentials;
local mode exposes supported device, download, cache and execution controls. Hide irrelevant
local-only advanced fields in cloud mode, including stale local download/cache status messages.
Keep a path back to the other mode and preserve its configuration when switching.
Show the data destination before a request; price/account limits belong to the selected service.
Do not imply a custom API endpoint is an account connector or that saving a key verifies it.

Offline, evaluate each capability separately:

- Keep saved conversations, artifacts, drafts, previews, exports and local editing available
  when their data and implementation are present. Do not hide already saved content.
- Offer on-device generation only if its runtime and required model files are actually available;
  cached weights alone may not be sufficient. Explain a missing download when it is actionable.
- Hide network-only discovery/promotion that adds no useful route offline. For an existing
  connected source or an attempted network action, show its unavailable state and recovery.
- Do not auto-send queued content on reconnection unless the user chose that policy.
  Restore a deliberate continuation point and retain any queue pause.

## Connectors and artifacts: host-owned boundaries

ranui supplies presentation primitives. It does not supply a Google OAuth deployment, credential
vault, connector backend, artifact store or document mutation policy. A host must own these and
must describe its actual guarantees; a polished connection screen cannot replace authorization.

For each connector, distinguish account authorization, selected source access and per-request use.
Ask for only the required permissions; explain what is read or written and where data goes before
authorization or disclosure. Make account identity, reconnect and revoke/disconnect discoverable.
Disconnect stops future access; explain separately what happens to imported or saved copies.
Credentials stay out of transcripts, artifacts, URLs and diagnostic messages.

Preview selected sources with provenance and freshness. Removing a source affects future requests;
do not rewrite historical evidence. Permission errors, stale sources and offline cached copies
need different states. Treat fetched content as untrusted input, not authorization to execute tools.
Keep write operations and their destination explicit, with review/confirmation suited to impact.

An artifact is a durable, reviewable result with an identity, not another boxed chat bubble:

1. Show a concise result summary and open the content in a suitable preview/workspace.
2. Keep Copy, Export, Compare or Apply local to that result. Offer only operations the host supports.
3. Separate previewing from applying. Name the destination and scope before document mutation.
4. Track the source revision and artifact revision. If the document changed, compare/rebase or
   regenerate before applying; never overwrite newer edits silently.
5. Report applied state only after the host confirms the write. Provide Undo when supported,
   preserving the host's history and revision rules; do not advertise an undo path that cannot work.

Result actions may be quiet, but focus, disabled/busy state and feedback must remain perceptible.
A search result highlights literal matches in titles/snippets with safe text nodes or equivalent
escaping; do not inject the query as HTML. Keep enough surrounding context to explain the match.

## Density uses real tokens, scoped to the product

Foundation spacing, intrinsic sizing and hit targets have different jobs. A compact visual icon
may sit inside a larger native button target; measure the actual clickable box, focus ring and
adjacent gaps. Choose target dimensions for the product's input/accessibility requirements.
Do not mandate one application's control sizes across every ranui component.

When repeated roles need a product density layer, define host-owned semantic aliases once and
derive them from real foundation tokens. This example is application CSS, not a new `--ran-*` API
or a universal size prescription. Apply it to native command buttons; use generated component
variables/parts when styling custom elements.

```css
.assistant {
  --app-command-target: var(--ran-size-7);
  --app-command-gap: var(--ran-space-2);
  --app-region-gap: var(--ran-space-4);
  color: var(--ran-color-text);
}
.assistant-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--app-command-gap);
}
.assistant-command {
  min-inline-size: var(--app-command-target);
  min-block-size: var(--app-command-target);
  border: 0;
  border-radius: var(--ran-radius-sm);
  background: transparent;
  color: inherit;
  font: inherit;
}
.assistant-command:enabled:hover {
  background: var(--ran-color-bg-hover);
}
.assistant-command:focus-visible {
  box-shadow: var(--ran-focus-ring);
}
.assistant-command:disabled {
  color: var(--ran-color-text-disabled);
}
```

Give icon-only buttons an accessible name. Apply the region gap to the host layout as needed.
Choose and verify larger targets for coarse input; do not enlarge every visible icon or reserve
empty space for controls with `hidden`. Document legitimate geometry/optical offsets instead of
forcing viewport dimensions, hairlines or artwork into a spacing token.

## Implementation and verification

Keep host state owners separate: request lifecycle/queue, capability/configuration, source context,
artifact revisions and view composition. Views project state and dispatch commands; they should
not each own another provider client or copied request flags. Extract shared behaviour after a
real second use. Follow CODING for component lifecycle, cleanup and event contracts.

Use public attributes, events, slots, variables and parts. Do not reach into private shadow roots.
A keyboard-safe primitive is not proof that the composed dialog is keyboard-safe: a focus trap
may not discover a nested custom element's closed-shadow button. Test the actual slotted footer,
initial focus, Tab/Shift+Tab loop, Escape/Cancel, Enter activation and focus restoration. If the
public composition cannot support this, fix the integration/component or use native buttons in
the supported slot; do not patch private internals or add misleading host tab stops.

| Evidence layer | Minimum relevant regression                                                                                                   |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Unit/state     | Queue pause/resume, stop/late responses, context identity, restore vs retry, capability changes, stale revisions              |
| Integration    | Composer draft survives queue/source/settings changes; one error/recovery; composed overlay keyboard path                     |
| Real browser   | Computed dimensions/baselines/overflow, real target boxes, focus restoration, disabled hover, scroll following and IME        |
| Cross-surface  | Home, history/search, assistant, model settings, sources/connectors, artifacts/review, confirmations and error/empty pages    |
| Variant matrix | Light/dark, narrow/wide and resize, coarse input/keyboard, longest translation/RTL, reduced motion, offline/failed/stale work |

Static token/link audits catch silent drift but cannot prove CSS won the cascade, a ring fits,
or a button is reachable. Inspect the rendered result and record screenshots plus measured
geometry where relevant. Test the immutable preview for the reviewed commit and inspect all CI
checks. Report unverified external prerequisites (such as undeployed OAuth) explicitly.

## Copyable agent brief

> Task and user outcome: …
> Read DESIGN §§11–12 and the relevant sections of AI_INTERFACES; look up exact APIs/tokens.
> Identify state owners, source/destination, queue/stop/retry semantics and capability limits.
> Propose the smallest flat composition and a token mapping; preserve drafts and reading position.
> Implement through public contracts. Add regression coverage at the layer where the defect occurs.
> Verify affected states/surfaces, themes, widths, keyboard/touch and failure/offline paths.
> Report the changed behaviour, measured/browser evidence, CI head and remaining prerequisites.
