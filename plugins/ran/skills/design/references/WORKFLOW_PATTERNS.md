<!-- Generated from design/WORKFLOW_PATTERNS.md; edit the source, then run sync:agent-plugin. -->

# Optional workflow patterns

These recipes apply **only when the task benefits from them**. An ordinary form, search page or
editor does not need queues, account connections or version history by default.
[DESIGN.md](./DESIGN.md) owns appearance; [INTERACTION.md](./INTERACTION.md) owns general behavior.
The host owns engineering; [ranui engineering](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/CODING.md)
is an optional library adapter. These are host application decisions,
not additional component APIs, storage guarantees or bundled services.

Each rule carries an ID and a level. **MUST** is a defect when broken and names its proof;
**SHOULD** is the default, and a deviation states its reason for that case; **MAY** is optional.
The [rule index](./RULES.md) lists every graded rule with its proof.

- **W-RECIPE-1 · SHOULD** For each selected recipe, establish what the application supports before
  choosing controls.
- **W-RECIPE-2 · SHOULD** Keep the state for jobs, configuration, selected sources and revisions in
  their existing owners. Views read that state and dispatch commands instead of duplicating service
  clients and request flags in each panel.

## 1. Batch work and queues

**Use when:** people benefit from staging another import, upload or export while work runs.
**Host contract:** dispatch, preparation, concurrency/preemption, cancellation acknowledgment,
partial writes, duplicate prevention and persistence.

| State                 | Main action                  | Contract to settle                                          |
| --------------------- | ---------------------------- | ----------------------------------------------------------- |
| Ready                 | Upload files / Export report | Scope, destination and duplicate-submit prevention          |
| Running               | Cancel, if supported         | What stops, what remains and whether a write committed      |
| Running with new work | Add to queue, if supported   | The active job keeps running; new input is kept (W-QUEUE-2) |
| Queue paused          | Resume queue                 | Editing a pending item does not dispatch or resume it       |
| Failed                | Retry / Restore inputs       | Use the distinct outcomes in INTERACTION §5                 |

- **W-QUEUE-1 · SHOULD** Settle the contract for each state in the queue table above.
- **W-QUEUE-2 · MUST** New work never silently replaces or cancels the active job. Without queue
  support, retain the new input and explain the constraint. _Proof: unit_
- **W-QUEUE-3 · MUST** Editing a pending item in a paused queue neither dispatches it nor resumes the
  queue. _Proof: unit_
- **W-QUEUE-4 · SHOULD** Summarize queued work in one line, such as “2 queued” or “Paused · 2 queued”.
- **W-QUEUE-5 · SHOULD** Collapse queue details when unneeded; expand into rows rather than nested cards.
- **W-QUEUE-6 · MUST** Each row has an identifiable item and offers only supported actions: Edit, Remove,
  or Run now. _Proof: browser_
- **W-QUEUE-7 · SHOULD** Define whether Run now waits, preempts or runs concurrently.
- **W-QUEUE-8 · SHOULD** Represent preparation within the row instead of adding a large panel full of
  disabled commands.
- **W-QUEUE-9 · MUST** Queue editing preserves the current draft, and cancelling editing restores it.
  _Proof: unit_
- **W-QUEUE-10 · MUST** Reconnection does not auto-dispatch queued work unless the user chose that
  policy. _Proof: unit_
- **W-QUEUE-11 · SHOULD** Apply [general focus and cancel rules](./INTERACTION.md) when removing a row,
  collapsing the queue or stopping work.

## 2. Capability-aware settings and offline work

**Use when:** a task offers distinct providers, modes, devices or network-dependent capabilities.
**Host contract:** configuration storage, a real verification operation, reachability and local
runtime dependencies.

- **W-SETTINGS-1 · MUST** Saving configuration and checking availability are separate actions with
  separate outcomes, and each shows what it accomplished. _Proof: unit, browser_
- **W-SETTINGS-2 · SHOULD** Derive controls from capability and state, not a single `connected` boolean.

A remote storage account, a database service or a local converter can be configured without
currently being usable.

| State                          | What the user understands                                             |
| ------------------------------ | --------------------------------------------------------------------- |
| Unconfigured                   | A required choice or credential is missing                            |
| Configured, unverified         | Settings are saved; availability has not been established             |
| Verified                       | A real check succeeded for this configuration; record when            |
| Authorization required/expired | Reconnect the account without discarding saved work                   |
| Service unreachable            | Saved configuration does not prove present reachability               |
| Device offline                 | Network operations are unavailable; available local work may continue |

- **W-SETTINGS-3 · SHOULD** Make each state in the settings table above distinguishable to the user.
- **W-SETTINGS-4 · MUST** Reconnecting an account whose authorization is required or expired keeps saved
  work. _Proof: unit_
- **W-SETTINGS-5 · MUST** Invalidate verification when relevant endpoint, account or credential settings
  change. _Proof: unit_
- **W-SETTINGS-6 · SHOULD** Treat browser online/offline events as hints, not as proof that a particular
  endpoint works.
- **W-SETTINGS-7 · SHOULD** Reveal settings for the chosen path. A local conversion path may need
  cache/download/device controls; a remote path may need endpoint/account controls.
- **W-SETTINGS-8 · MUST** Hide irrelevant fields **and their stale status messages**. _Proof: browser_
- **W-SETTINGS-9 · SHOULD** Settings headers, field groups, account rows and unavailable/empty states
  retain the named content and navigation spines from
  [DESIGN's alignment contract](./DESIGN.md#alignment-is-structure-not-polish).
- **W-SETTINGS-10 · SHOULD** Keep a title/menu command content-hugging; a separate track absorbs header
  filler.
- **W-SETTINGS-11 · SHOULD** Count nested panel and control padding through to visible labels before
  declaring regions aligned.
- **W-SETTINGS-12 · MUST** Switching modes preserves the other modes' configuration. _Proof: unit_
- **W-SETTINGS-13 · SHOULD** Keep the route back to another mode discoverable.
- **W-SETTINGS-14 · SHOULD** Explain the data destination before disclosure.
- **W-SETTINGS-15 · MUST** A configured API endpoint is not presented as an authorized account.
  _Proof: review_
- **W-SETTINGS-16 · MUST** Offline, retain saved content and drafts when their data and implementation
  are available. _Proof: unit, browser_
- **W-SETTINGS-17 · SHOULD** Offline, keep previews, editing and exports available when their data and
  implementation are available.
- **W-SETTINGS-18 · SHOULD** Offline, hide network-only discovery or promotion that offers no useful
  route; retain existing connected objects with an understandable unavailable state.
- **W-SETTINGS-19 · SHOULD** Treat a cached resource as no proof that all runtime dependencies are
  present.
- **W-SETTINGS-20 · SHOULD** Offer a deliberate continuation point after reconnecting.

## 3. Account connections and external sources

**Use when:** work reads or writes data outside its current object, whether local or remote.
**Host contract:** authorization scopes, identity, access checks, revocation, credentials,
provenance and imported-copy retention. An endpoint address does not establish account access.

Presentation primitives supply no OAuth deployment, credential vault, connector backend
or storage guarantees. A polished connection screen cannot replace the host's authorization contract.

- **W-ACCOUNT-1 · SHOULD** Distinguish account authorization, selected-source access and use by a
  particular operation.
- **W-ACCOUNT-2 · SHOULD** Request only needed permissions.
- **W-ACCOUNT-3 · SHOULD** Explain reads, writes and destination before authorization or disclosure.
- **W-ACCOUNT-4 · MUST** Account identity, reconnect and revoke/disconnect are reachable from the
  connection UI. _Proof: browser_
- **W-ACCOUNT-5 · MUST** Disconnect stops future access. _Proof: unit_
- **W-ACCOUNT-6 · SHOULD** Explain separately what happens to imported copies on disconnect.
- **W-ACCOUNT-7 · MUST** Keep credentials out of URLs, logs and previews. _Proof: review_
- **W-ACCOUNT-8 · SHOULD** Show provenance and freshness for selected sources, whether a local file,
  database record or cloud document.
- **W-ACCOUNT-9 · MUST** Removing a source affects later work, not historical evidence. _Proof: unit_
- **W-ACCOUNT-10 · MUST** Permission errors, stale data and offline cached copies have different states.
  _Proof: unit_
- **W-ACCOUNT-11 · MUST** Treat imported content as untrusted data, not permission to execute commands.
  _Proof: review_
- **W-ACCOUNT-12 · MUST** Make writes and their destinations explicit before they happen.
  _Proof: browser_
- **W-ACCOUNT-13 · SHOULD** Suit the review step before a write to its impact.

## 4. Results, previews and revisions

**Use when:** an export, transformed document or draft has an identity and destination beyond a
transient status message.
**Host contract:** result/revision identity, source version, target scope, commit acknowledgment,
conflict handling and any reversible history.

- **W-REVISION-1 · SHOULD** Prefer a suitable preview/editor for substantive content.
- **W-REVISION-2 · MUST** Offer Compare, Apply or Undo only when the host supports it. _Proof: review_
- **W-REVISION-3 · SHOULD** Summarize the result and identify its revision, source and destination when
  relevant.
- **W-REVISION-4 · SHOULD** Keep supported Copy, Export, Compare or Apply actions beside the relevant
  result.
- **W-REVISION-5 · MUST** Separate previewing from applying, and name the target and scope before
  mutation. _Proof: browser_
- **W-REVISION-6 · MUST** If source data changed, compare/rebase or regenerate before applying; newer
  edits are never overwritten silently. _Proof: unit_
- **W-REVISION-7 · SHOULD** Confirm saved/applied state and recoverable output under
  [the interaction standard](./INTERACTION.md).

## Applying a recipe

- **W-APPLY-1 · MUST** Keep only the states and actions the host can honor. _Proof: review_
- **W-APPLY-2 · SHOULD** A polished screen cannot substitute for a missing service contract; state that
  prerequisite clearly.

The key transitions already carry MUST rules with unit proof: paused work stays paused (W-QUEUE-3),
changed configuration invalidates verification (W-SETTINGS-5), source removal affects only future
work (W-ACCOUNT-9), and stale revisions cannot overwrite new edits (W-REVISION-6). Their tests cover
interrupted and offline work where relevant.
