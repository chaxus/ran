# Optional workflow patterns

These recipes apply **only when the task benefits from them**. An ordinary form, search page or
editor does not need queues, account connections or version history by default.
[DESIGN.md](./DESIGN.md) owns appearance; [INTERACTION.md](./INTERACTION.md) owns general behavior.
[CODING.md](./CODING.md) owns component engineering. These are host application decisions,
not additional ranui APIs, storage guarantees or bundled services.

For each selected recipe, establish what the application supports before choosing controls. Keep
the state for jobs, configuration, selected sources and revisions in their existing owners. Views
read that state and dispatch commands instead of duplicating service clients and request flags
in each panel.

## 1. Batch work and queues

**Use when:** people benefit from staging another import, upload or export while work runs.
**Host contract:** dispatch, preparation, concurrency/preemption, cancellation acknowledgment,
partial writes, duplicate prevention and persistence. Without queue support, retain new input
and explain the constraint instead of silently replacing the active job.

| State                 | Main action                  | Contract to settle                                     |
| --------------------- | ---------------------------- | ------------------------------------------------------ |
| Ready                 | Upload files / Export report | Scope, destination and duplicate-submit prevention     |
| Running               | Cancel, if supported         | What stops, what remains and whether a write committed |
| Running with new work | Add to queue, if supported   | Never silently replace or cancel the active job        |
| Queue paused          | Resume queue                 | Editing a pending item does not dispatch or resume it  |
| Failed                | Retry / Restore inputs       | Use the distinct outcomes in INTERACTION §5            |

Summarize queued work in one line, such as “2 queued” or “Paused · 2 queued”. Collapse details when
unneeded; expand into rows rather than nested cards. Each row has an identifiable item and only
supported actions: Edit, Remove, or Run now. Define whether Run now waits, preempts or runs concurrently.
Represent preparation within the row instead of adding a large panel full of disabled commands.

Queue editing preserves the current draft; cancelling editing restores it. Reconnection does not
auto-dispatch unless the user chose that policy. Apply [general focus and cancel rules](./INTERACTION.md)
when removing a row, collapsing the queue or stopping work.

## 2. Capability-aware settings and offline work

**Use when:** a task offers distinct providers, modes, devices or network-dependent capabilities.
**Host contract:** configuration storage, a real verification operation, reachability and local
runtime dependencies. Saving configuration and checking availability must be separate outcomes.

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
messages**. Settings headers, field groups, account rows and unavailable/empty states retain the
named content and navigation spines from [DESIGN's alignment contract](./DESIGN.md#alignment-is-structure-not-polish).
Keep a title/menu command content-hugging; a separate track absorbs header filler. Count nested
panel and control padding through to visible labels before declaring regions aligned. Preserve other modes' configuration and keep the route back discoverable. Explain the
data destination before disclosure; do not confuse an API endpoint with an authorized account.

Offline, retain saved content, drafts, previews, editing and exports when their data and implementation
are available. Hide network-only discovery or promotion that offers no useful route; retain existing
connected objects with an understandable unavailable state. A cached resource is not proof that all
runtime dependencies are present. Offer a deliberate continuation point after reconnecting.

## 3. Account connections and external sources

**Use when:** work reads or writes data outside its current object, whether local or remote.
**Host contract:** authorization scopes, identity, access checks, revocation, credentials,
provenance and imported-copy retention. An endpoint address does not establish account access.

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

## 4. Results, previews and revisions

**Use when:** an export, transformed document or draft has an identity and destination beyond a
transient status message. Prefer a suitable preview/editor for substantive content.
**Host contract:** result/revision identity, source version, target scope, commit acknowledgment,
conflict handling and any reversible history. Do not offer Compare, Apply or Undo without support.

1. Summarize the result and identify its revision, source and destination when relevant.
2. Keep supported Copy, Export, Compare or Apply actions beside the relevant result.
3. Separate previewing from applying. Name the target and scope before mutation.
4. If source data changed, compare/rebase or regenerate before applying; never overwrite newer edits silently.
5. Confirm saved/applied state and recoverable output under [the interaction standard](./INTERACTION.md).

## Applying a recipe

Keep only the states and actions the host can honor. Verify its relevant transitions: paused work
stays paused, changed configuration invalidates verification, source removal affects future work,
and stale revisions cannot overwrite new edits. Include interrupted/offline work when relevant.
A polished screen cannot substitute for a missing service contract; state that prerequisite clearly.
