# Ranui complete component design and interaction review

## Authorized direction and evidence

The user requested reviewing and improving **all ran components** using the latest ran standards
and their supplied design references, keeping one existing PR with several coherent commits.
This expands the earlier focused component foundation work. Publication and Document integration
are paused until this phase is complete. The prepared0.5.1 patch remains unpublished.

| Assumption                                                              | Evidence                                                                                    | Status                                       |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------- |
| The scope is all public components, not only chat-related elements      | User instructions,2026-10-23                                                                | Authorized                                   |
| One existing PR, multiple commits                                       | User instructions,2026-10-23; PR437                                                         | Authorized                                   |
| There are40 registered elements across37 top-level owners               | `defineSSR` declarations under `packages/ranui/components/`; generated `docs/COMPONENTS.md` | Source fact                                  |
| Prior input/portal/reading fixes have bounded real component evidence   | `packages/ranui/test/evidence/2026-10-22-components/` and `2026-10-23-focus-return/`        | Does not certify the whole library           |
| 83bd9bf passed5CI jobs and all3 functional browser jobs                 | GitHub CI39888266924 and E2E39888266941                                                     | Measured; its mobile popup screenshot failed |
| Fixed-environment local passes alone do not establish capture stability | Later CI failure, preserved image and geometry probes; `test/visual/baseline-review.md`     | Capture correction still in progress         |

## Visual direction

Use the existing ran token system and canonical DESIGN, INTERACTION and ACCEPTANCE owners.
The intended result is deliberate, calm product UI with clear hierarchy, consistent optical
weight, readable content and precise feedback. Work with real content and composed groups,
not isolated attractive controls alone. A component that already serves its role well can
remain unchanged after review; all components must have an explicit reviewed outcome.

Adapt reference relationships, not brand pixels: Claude/ChatGPT inform reading, composition,
progress and result workflows; Don't Make Me Think informs recognition and recovery; taste-skill
and ryugi inform restraint, coherent composition and evidence; the supplied galleries inform
appropriate type, proportions and visual character;60fps and Motionin inform triggers,
interruption and reverse paths. `REFERENCE_RESEARCH.md` owns source scope/certainty. Marketing
backdrops and promotional motion need their own product-context justification.

Every family is inspected for typography, icon/content balance, shape, spacing, borders and
surface hierarchy; default/hover/pressed/focus/selected/disabled/busy/empty/error states;
light/dark, narrow/wide and applicable coarse input; lifecycle and draft/reading preservation;
interruptible transitions and reduced motion. Preserve useful labels, errors and consequences.

## Scope lock

- May change: affected files under `packages/ranui/components/`, shared theme/base/floating/
  accessibility utilities when a reproduced common defect requires it, actual component demos,
  meaningful tests, generated API/token references and mirrored public docs. Exact families
  and owners are enumerated below. Variant and media-adapter files belong to their parent.
- May change ranuts only for a reproduced shared utility defect; enumerate its consumers and
  verify them. Root owns changes spanning families and generated/build outputs.
- Keep Document unchanged. Keep release publication/merge disabled during this review.
  Do not add a new design system, renderer, backend, application workflow or motion dependency.
- Earlier user authorization permits incompatible presentation choices; still preserve raw
  data, explicit intent, native accessibility, supported events, safe rendering, cancellation,
  form values and lifecycle/SSR contracts. A required contract change must be made explicit.
- Do not force decorative edits on working controls, hide difficult states, change assertions
  merely to pass, enlarge comparison tolerances or raise design/size debt budgets.

## Exhaustive review ledger

Status starts pending. Existing focused proof is a useful baseline, not an automatic full-row
pass. Record findings, actual environments/media, fixes and uncovered conditions per family.
Router/Route are nonvisual infrastructure: inspect navigation/ownership/SSR contracts rather
than inventing decorative screenshots for them.

### Foundation and actions

| Public element | Source owner                                 | Full review status |
| -------------- | -------------------------------------------- | ------------------ |
| `r-button`     | `packages/ranui/components/button/index.ts`  | Pending            |
| `r-link`       | `packages/ranui/components/link/index.ts`    | Pending            |
| `r-icon`       | `packages/ranui/components/icon/index.ts`    | Pending            |
| `r-img`        | `packages/ranui/components/image/index.ts`   | Pending            |
| `r-card`       | `packages/ranui/components/card/index.ts`    | Pending            |
| `r-section`    | `packages/ranui/components/section/index.ts` | Pending            |
| `r-glass`      | `packages/ranui/components/glass/index.ts`   | Pending            |

### Forms and composition

| Public element    | Source owner                                              | Full review status |
| ----------------- | --------------------------------------------------------- | ------------------ |
| `r-input`         | `packages/ranui/components/input/index.ts`                | Pending            |
| `r-checkbox`      | `packages/ranui/components/checkbox/index.ts`             | Pending            |
| `r-select`        | `packages/ranui/components/select/index.ts`               | Pending            |
| `r-option`        | `packages/ranui/components/select/option/index.ts`        | Pending            |
| `r-dropdown-item` | `packages/ranui/components/select/dropdown-item/index.ts` | Pending            |
| `r-colorpicker`   | `packages/ranui/components/colorpicker/index.ts`          | Pending            |
| `r-theme-switch`  | `packages/ranui/components/theme-switch/index.ts`         | Pending            |
| `r-voice-button`  | `packages/ranui/components/voice-button/index.ts`         | Pending            |
| `r-attachments`   | `packages/ranui/components/attachments/index.ts`          | Pending            |

### Navigation and layers

| Public element | Source owner                                         | Full review status |
| -------------- | ---------------------------------------------------- | ------------------ |
| `r-tabs`       | `packages/ranui/components/tab/index.ts`             | Pending            |
| `r-tab`        | `packages/ranui/components/tabpane/index.ts`         | Pending            |
| `r-router`     | `packages/ranui/components/router/index.ts`          | Pending            |
| `r-route`      | `packages/ranui/components/route/index.ts`           | Pending            |
| `r-popover`    | `packages/ranui/components/popover/index.ts`         | Pending            |
| `r-content`    | `packages/ranui/components/popover/content/index.ts` | Pending            |
| `r-dropdown`   | `packages/ranui/components/dropdown/index.ts`        | Pending            |
| `r-modal`      | `packages/ranui/components/modal/index.ts`           | Pending            |

### Reading and AI content

| Public element     | Source owner                                        | Full review status |
| ------------------ | --------------------------------------------------- | ------------------ |
| `r-markdown`       | `packages/ranui/components/markdown/index.ts`       | Pending            |
| `r-math`           | `packages/ranui/components/math/index.ts`           | Pending            |
| `r-mermaid`        | `packages/ranui/components/mermaid/index.ts`        | Pending            |
| `r-conversation`   | `packages/ranui/components/conversation/index.ts`   | Pending            |
| `r-disclosure-row` | `packages/ranui/components/disclosure-row/index.ts` | Pending            |
| `r-reasoning`      | `packages/ranui/components/reasoning/index.ts`      | Pending            |
| `r-tool-card`      | `packages/ranui/components/tool-card/index.ts`      | Pending            |
| `r-token-meter`    | `packages/ranui/components/token-meter/index.ts`    | Pending            |
| `r-state-dot`      | `packages/ranui/components/state-dot/index.ts`      | Pending            |

### Feedback

| Public element | Source owner                                  | Full review status |
| -------------- | --------------------------------------------- | ------------------ |
| `r-loading`    | `packages/ranui/components/loading/index.ts`  | Pending            |
| `r-skeleton`   | `packages/ranui/components/skeleton/index.ts` | Pending            |
| `r-message`    | `packages/ranui/components/message/index.ts`  | Pending            |
| `r-progress`   | `packages/ranui/components/progress/index.ts` | Pending            |

### Interactive visuals and media

| Public element | Source owner                                 | Full review status |
| -------------- | -------------------------------------------- | ------------------ |
| `r-radar`      | `packages/ranui/components/radar/index.ts`   | Pending            |
| `r-scratch`    | `packages/ranui/components/scratch/index.ts` | Pending            |
| `r-player`     | `packages/ranui/components/player/index.ts`  | Pending            |

## Acceptance and simplest workable approach

### Attached implementation coverage

The40 element rows do not certify their attached implementations. Record these separately:

- Loading variants: `arc`, `circle`, `circle-fold`, `circle-line`, `circle-rotate`,
  `circle-spin`, `circle-turn`, `cube`, `cube-dim`, `cube-fold`, `cube-grid`, `dot`,
  `dot-bar`, `dot-circle`, `dot-line`, `dot-pulse`, `double-bounce`, `drop`, `line`,
  `line-scale`, `pacman`, `pulse`, `rotate`, `scale-out`, `solar`, `square`, `stretch`,
  `text`, `triple-bounce`. All29 remain pending; the existing four-variant row is not exhaustive.
- Player paths: native, HLS, DASH, FLV (including TS), WebRTC. Each needs an explicit outcome
  and available runtime/codec/network limits; simulated events are not playback proof.
- Glass paths: CSS, WebGL and WebGPU, including unsupported/failure fallback. State actual
  environment capability instead of claiming unsupported accelerated paths passed.
- Existing SSR exclusions: `r-content` (MutationObserver), `r-link` (document), `r-modal`
  (mock assignedNodes), `r-radar` (ResizeObserver). Resolve or retain each explicitly;
  the currently green suite does not establish SSR for these four elements.

The independent source inventory and plan review found all40 tags accounted for. Existing
owner unit tests and docs routes establish discoverability, not state completeness. Inspect
source when the generated API is incomplete (currently image, option, tab and progress).
Dedicated browser coverage is missing or incidental for glass, scratch, theme switch,
token meter and routing/link flows. Correct stale demo/card/icon guidance at its owner.

### Review and delivery

Use the existing demo/docs surfaces and real registered components, with small bounded
fixtures only where a state is absent. Clearly label those as component proof. Compare realistic
compositions at1280px and360px, plus declared stress cases such as long translations, large
content or320px when relevant. Inspect current screenshots and continuous recordings for
stateful flows. Do not claim physical devices, real media/provider access or human acceptance
from automation. Capture must preserve its own viewport and contain the full target.

Each family gets a self-contained commit after its relevant checks and image/interaction review.
Fix a shared cause once and recheck every affected family. Regenerate public references from
source; keep multilingual structure in sync. Functional defects require meaningful failing
behavior before repair. Visual-only changes need actual browser review, not mirrored CSS tests.

The simplest approach is to review existing defaults and repair observed defects family by
family. Adopt that. A blanket reskin would erase working distinctions and expand verification
without demonstrated benefit. Documentation-only changes would leave runtime defects intact.

Before release: reconcile all40 ledger rows, resolve material findings, review affected complete
compositions, run appropriate unit/SSR/type/design/docs/package checks and full3-engine CI,
then complete the pinned visual gate without weakened assertions. Only then prepare/publish
0.5.1 through the existing release workflow and resume Document's separate product acceptance.
