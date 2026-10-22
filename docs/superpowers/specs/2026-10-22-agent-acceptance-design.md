# Agent guidance and acceptance design

Approved direction: simplify ranui's canonical guidance, make evidence and decision authority explicit, and validate six real agent regression tasks before creating a follow-up to merged PR #436.

## Scope lock

- Observed: DESIGN has 1,049 lines; the skill is already a small router. Existing API, token, package and browser geometry checks are valuable and remain intact.
- Inferred risk: repeated prose and engineering recipes obscure visual decisions; agent review can be confused with human acceptance, and captures can outlive the runtime they show.
- Owners: DESIGN owns visual composition; INTERACTION owns observable behavior; new ACCEPTANCE (included in the npm files allowlist) owns evidence freshness and decision reporting; the skill/index only route.
- Remove duplicated engineering recipes from DESIGN in favor of existing CODING/theme owners. Preserve normative geometry, spacing, accessibility, hierarchy and motion contracts and existing anchors used by consumers.
- No component redesign, application change, package release, mandatory human approval gate, compatibility layer, general agent platform or external service.

## Acceptance

Six isolated tasks: visible text drift with aligned frames; duplicate Back levels; narrow translated labels; premium effects overload; stale captures after shared styles change; code copy/selection/scroll preservation.

Pin baseline 7544bce before editing guidance. Each task uses a fresh agent session with the same model/settings, defective fixture, task prompt and tools for baseline/candidate, with only guidance changed. Freeze prompt/fixture/rubric/tool manifests before runs and hash each guidance snapshot. For freshness, capture first, then stage a shared-style change; the affected review must become stale. Agents act on real files, render the fixture and retain evidence. The assessor checks observable behavior and artifacts independently, not exact wording or implementation. Honest baseline passes remain controls. A single sample demonstrates these tasks, not model-wide reliability.

Acceptance evidence identifies runtime inputs/build, state/environment, media hashes and review scope. Automated results, agent visual review and human decision are separate. Changed relevant runtime/media invalidates affected reviews. Docs-only changes need no unrelated recapture. User authorization controls PR updates; absent human acceptance is reported truthfully without blocking authorized work.

## Smallest alternative

Only adding stronger prose is smaller but provides no evidence that agents follow it. A full approval/artboard platform is unnecessary. Use shipped Markdown contracts plus source-only fixtures and a repeatable browser assessor; live agent runs are opt-in, deterministic negative controls run locally/CI.
