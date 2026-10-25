# Live guidance evaluation — 2026-10-22

Six paired tasks used fresh isolated native agent sessions, the same inherited model/settings,
and identical original fixture, task, tool and rubric inputs. Only the pinned guidance differed.
The baseline commit is `7544bce098586809cca783f21c70297b162aa260`; its tree equals the
follow-up's main base `dc92cb482d29f8f7ca4b3469e78600a0c3fa8ae4`.
[results.json](./results.json) records input/runtime/media identities and scoped outcomes.

| Scenario                            | Baseline mechanical / independent               | Initial candidate mechanical / independent | Separate fresh refinement |
| ----------------------------------- | ----------------------------------------------- | ------------------------------------------ | ------------------------- |
| 01 Text alignment                   | Pass / pass with limits                         | Pass / pass with limits                    | Not rerun                 |
| 02 Return navigation                | Fail / changes required                         | Pass / changes required                    | Pass / pass with limits   |
| 03 Narrow translated label          | Pass / clipping pass; destination wording limit | Pass / pass with limits                    | Not rerun                 |
| 04 Calm activity composition        | Pass / pass with limits                         | Pass / pass with limits                    | Not rerun                 |
| 05 Evidence after shared CSS change | Pass / pass with limits                         | Pass / pass with limits                    | Not rerun                 |
| 06 Code developer use               | Pass / pass with limits                         | Pass / stale copy completion reproduced    | Pass / pass with limits   |

The first candidate did **not** fully pass. Its detail header repeated an inert Project crumb
above Back to project; its delayed Copy completion showed stale success after a streamed update.
Those failures remain in the original screenshots and source patches. The existing general
composition/async-identity rules were insufficiently explicit for these agents. DESIGN now warns
against relabeling redundant navigation as breadcrumbs; INTERACTION supplies the Copy/stream
interleaving, and the skill routes copy/stream tasks to that owner. Fresh original-input reruns
with these scoped clarifications resolved the two observed failures. They are separate runs,
not edits to earlier outcomes. No frozen assertion or rubric was weakened.

Independent reviews are [navigation/effects](./independent-review-draft.md),
[remaining cases and reproduced race](./remaining-review.md), and
[refinements](./refinement-review.md). Mechanical checks do not replace composition review.
Baseline's single quiet activity frame and single code enclosure remain valid passing controls;
fewer borders alone does not establish a better design.

Each `<condition>-<scenario>.png` is an unchanged real-browser resting capture; the matching
`.patch` records the actual agent surface change against the original fixture. Metadata binds
these to runtime and input identities. The two `.webm` files are continuous real browser
recordings of the refined navigation and code interactions. Root review inspected decoded
frames at 0.6s, 1.8s and 3.0s and ran fresh browser checks; this is not a claim that a human
watched or accepted the recordings. Supplemental feedback captures preserve the initial race
and the independently guarded result. The full local report retains worker before/after,
interaction proof, reports and independent reproductions.

The original eight-tool hash was frozen for all live runs. Afterward, two unused imports were
removed; [tools-cleanup.patch](./tools-cleanup.patch) records that cosmetic delta. The supplemental
`feedback.mjs` probe and negative/restored control are separate from the frozen v1 rubric.
Final deterministic controls were rerun against the shipped tools.

Codex marketplace discovery, actual installation of the then-separate `ranui` agent plugin
1.2.0 (since merged into `plugins/ran`; not the npm package), cached/source skill byte equality,
and a new read-only `$ranui` session were exercised. It routed the copy/snapshot rule and stale
screenshots to their canonical owners. Temporary plugin/marketplace entries were removed and
the user's marketplace inventory returned unchanged. Both Claude manifests validated; no Claude
model evaluation, npm publication or merge is claimed.

Limits: one session per task/condition plus two follow-ups is not a statistical reliability or
cross-model comparison. The native harness does not expose a concrete model identifier.
Chromium, light host theme and emulated touch do not establish other engines, native zoom,
assistive technology or physical-device behavior. The fixtures import real ranui source but do
not establish acceptance of Document product pages. Exact prompts, reports, source outputs and
observations are retained locally; full native tool transcripts remain in the chat and are not
claimed as an exported artifact. Automated results, independent agent review and human decisions
remain separate. Human acceptance was not requested or inferred.
