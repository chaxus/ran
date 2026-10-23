# ranui live guidance evaluation

This source-only scaffold exercises six real host surfaces. It is not shipped in ranui's package. Each surface imports the actual ranui button source through Vite; public style and font imports also resolve to source. No paid model CLI, remote service, or model assertion is part of the assessor.

Prepare baseline and candidate in separate directories outside the repository:

```sh
node plugins/ranui/evals/prepare.ts --out /absolute/outside/repository --label baseline --guidance-ref 7544bce
node plugins/ranui/evals/prepare.ts --out /absolute/outside/repository --label candidate --guidance-ref working-tree
```

Each label contains immutable guidance files, a manifest, and six scenario directories. Each scenario has `TASK.md`, `run-tools.md`, `runtime.js`, and editable `surface/`. Only guidance varies between a pair. Retain the exact fixture/task/tool/rubric hashes and identical model/settings. Use a fresh agent session for each scenario and condition, without previous solution, assessor, or other run context. Retain agent transcripts separately; this runner does not claim to invoke a model.

For the freshness scenario, prepare renders and hashes the earlier screenshot and review **before** changing the shared stylesheet. Do not generate a pretend earlier capture after the change. Prepare refuses to overwrite runs. `prepare()` as a library only creates files; callers must also await `seedFreshness()` and call `finalizeManifest()` before scenario 05 starts. The final manifest binds the post-mutation host input and retains the initial surface and prior-evidence hashes separately.

The task asks for source work and evidence, without the oracle's threshold or a correction recipe. The common tool sheet offers a screenshot/metadata helper equally to both conditions; it does not prescribe review decision fields. The fixture and rubric must be frozen before the pair runs. If a startup tool bug is fixed, apply the identical fix to both conditions and record or repeat affected runs.

Start or assess one scenario:

```sh
node plugins/ranui/evals/serve.ts /absolute/run/baseline/01-text
node plugins/ranui/evals/assess.ts /absolute/run/baseline/01-text
node --test plugins/ranui/evals/prepare.test.ts plugins/ranui/evals/controls.test.ts
```

The assessor writes `assessment.json` and `evidence/assessor.png`. Its mechanical checks measure actual visible text `Range` positions, contextual return commands and real pointer/keyboard navigation, every translated glyph against viewport/ancestor clipping, computed decorative surfaces, current runtime/media binding, actual clipboard reads, native selection, horizontal scrolling, and streamed updates. The six negative controls run seeded defects then independent source/CSS repairs. Freshness also rechecks after a real additional runtime mutation and after media corruption.

Effects counts do not establish visual quality. An independent reviewer must inspect case 04's rendered screenshot and decide whether remaining grouping, hierarchy, contrast and effects have a purpose. Record that review separately from mechanical results. The harness always reports human decision as unobserved; an agent cannot infer human acceptance from passing checks.

Native Chromium `Selection.toString()` omits a terminal newline at a rendered code boundary. The code oracle requires the underlying `Range` text to preserve the complete payload, accepts that one browser normalization in native selection, and independently requires the clipboard to preserve tabs, blank lines and trailing newline exactly before and after streaming. It does not normalize the clipboard.

Freshness machine checks accept arbitrary evidence JSON filenames and verify current runtime/media/scope binding. They do not score report wording or infer human acceptance. An independent reviewer must inspect the report's actual automated/visual/human claims. Besides the supplied aggregate hash, per-file host hashes plus captured loaded-resource response hashes and nested screenshot metadata are supported. Host source and every actual stable loaded resource are independently checked. Vite's ephemeral development client is excluded from response comparison. Missing alternate dependency declarations require manual assessment (`mechanicalPass: null`, exit 2); mismatching declared current source/resource/media hashes fail. The supplied helper fingerprints host/incoming data, ranui button/utils/theme/style/fonts, ranuts and ranview build directories, and the lockfile. This is a small host, not a generic dependency graph system. Runtime/media changes invalidate affected evidence; unrelated guidance-only edits do not.

Both capture and assessment wait for fonts and two animation frames after network idle, and record observed route, viewport, document locale/theme, and browser engine version. The capture helper defaults to 320px for case 03. The alignment oracle uses a nonzero visible text Range and an independent main/row content origin; moving both sibling labels or hiding them fails. Case 03 checks horizontal and vertical clips and real pointer/keyboard round trips; changed destination wording requires separate semantic review. Case 06 additionally performs an actual mouse text selection and rejects selection-disabled ancestors.

A single paired sample is evidence about these tasks, not a statistical reliability estimate. Keep baseline passes as controls and report limitations, task clarifications and incomplete judgments honestly.

## Supplemental concurrency observation

`node plugins/ranui/evals/feedback.ts /absolute/run/candidate/06-code` delays a real clipboard write, updates the source, then resolves or rejects the older operation. It records the requested snapshot, current content identity, actual clipboard equality, visible status and captures. An independent reviewer decides whether feedback truthfully identifies its snapshot; no required prose is scored. `feedback.test.ts` proves this probe exposes both stale success and stale failure and distinguishes an independently guarded control. This additional interleaving does not rewrite the original frozen rubric or retrospectively turn an earlier run into a pass.

The [2026-10-22 live record](./results/2026-10-22/README.md) retains actual initial failures, scoped fresh refinements, unchanged screenshots, source patches and continuous recordings. It is evidence of these tasks, not a guarantee that a model will follow the guidance.
