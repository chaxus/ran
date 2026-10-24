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

A bounded-evidence link means the named behavior and states were reviewed, not that every
state/capability passed. The per-row links describe measured scope; release-wide gates and concrete remaining findings are recorded below.
Existing focused proof is a useful baseline, not an automatic full-row pass. Record findings, actual environments/media, fixes and uncovered conditions per family.
Router/Route are nonvisual infrastructure: inspect navigation/ownership/SSR contracts rather
than inventing decorative screenshots for them.

### Foundation and actions

| Public element | Source owner                                 | Full review status                                                                                                   |
| -------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `r-button`     | `packages/ranui/components/button/index.ts`  | [Bounded state review](../../../packages/ranui/test/evidence/2026-10-24-composed-controls/README.md)                 |
| `r-link`       | `packages/ranui/components/link/index.ts`    | [Bounded state review](../../../packages/ranui/test/evidence/2026-10-24-navigation/README.md)                        |
| `r-icon`       | `packages/ranui/components/icon/index.ts`    | Size/color/spin screenshots reviewed; full browser gate tracked below                                                |
| `r-img`        | `packages/ranui/components/image/index.ts`   | [Bounded state review](../../../packages/ranui/test/evidence/2026-10-23-foundations/README.md)                       |
| `r-card`       | `packages/ranui/components/card/index.ts`    | [Bounded state review](../../../packages/ranui/test/evidence/2026-10-23-foundations/README.md)                       |
| `r-section`    | `packages/ranui/components/section/index.ts` | [Bounded state review](../../../packages/ranui/test/evidence/2026-10-23-checkbox/README.md)                          |
| `r-glass`      | `packages/ranui/components/glass/index.ts`   | [Bounded state review](../../../packages/ranui/test/evidence/2026-10-23-glass/README.md); WebGPU adapter unavailable |

### Forms and composition

| Public element    | Source owner                                              | Full review status                                                                                                                                                     |
| ----------------- | --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `r-input`         | `packages/ranui/components/input/index.ts`                | [Bounded state review](../../../packages/ranui/test/evidence/2026-10-24-composed-controls/README.md)                                                                   |
| `r-checkbox`      | `packages/ranui/components/checkbox/index.ts`             | [Bounded state review](../../../packages/ranui/test/evidence/2026-10-23-checkbox/README.md)                                                                            |
| `r-select`        | `packages/ranui/components/select/index.ts`               | [Bounded state review](../../../packages/ranui/test/evidence/2026-10-24-overlay-composition/README.md); clear/hint and page-scroll regressions exercised separately    |
| `r-option`        | `packages/ranui/components/select/option/index.ts`        | [Bounded state review](../../../packages/ranui/test/evidence/2026-10-23-controls/README.md)                                                                            |
| `r-dropdown-item` | `packages/ranui/components/select/dropdown-item/index.ts` | [Bounded state review](../../../packages/ranui/test/evidence/2026-10-23-controls/README.md)                                                                            |
| `r-colorpicker`   | `packages/ranui/components/colorpicker/index.ts`          | [Bounded state review](../../../packages/ranui/test/evidence/2026-10-23-controls/README.md)                                                                            |
| `r-theme-switch`  | `packages/ranui/components/theme-switch/index.ts`         | [Bounded state review](../../../packages/ranui/test/evidence/2026-10-23-navigation/README.md)                                                                          |
| `r-voice-button`  | `packages/ranui/components/voice-button/index.ts`         | [Bounded state review](../../../packages/ranui/test/evidence/2026-10-23-reading-current/README.md); provider mocked, Firefox pending-state failure under investigation |
| `r-attachments`   | `packages/ranui/components/attachments/index.ts`          | [Bounded state review](../../../packages/ranui/test/evidence/2026-10-23-reading-current/README.md)                                                                     |

### Navigation and layers

| Public element | Source owner                                         | Full review status                                                                                                                                                    |
| -------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `r-tabs`       | `packages/ranui/components/tab/index.ts`             | [Bounded state review](../../../packages/ranui/test/evidence/2026-10-23-navigation/README.md)                                                                         |
| `r-tab`        | `packages/ranui/components/tabpane/index.ts`         | [Bounded state review](../../../packages/ranui/test/evidence/2026-10-23-navigation/README.md)                                                                         |
| `r-router`     | `packages/ranui/components/router/index.ts`          | [Bounded state review](../../../packages/ranui/test/evidence/2026-10-24-navigation/README.md)                                                                         |
| `r-route`      | `packages/ranui/components/route/index.ts`           | [Bounded state review](../../../packages/ranui/test/evidence/2026-10-24-navigation/README.md)                                                                         |
| `r-popover`    | `packages/ranui/components/popover/index.ts`         | [Bounded state review](../../../packages/ranui/test/evidence/2026-10-24-overlay-composition/README.md)                                                                |
| `r-content`    | `packages/ranui/components/popover/content/index.ts` | [Bounded state review](../../../packages/ranui/test/evidence/2026-10-24-overlay-composition/README.md)                                                                |
| `r-dropdown`   | `packages/ranui/components/dropdown/index.ts`        | [Bounded state review](../../../packages/ranui/test/evidence/2026-10-24-overlay-composition/README.md)                                                                |
| `r-modal`      | `packages/ranui/components/modal/index.ts`           | [Bounded state review](../../../packages/ranui/test/evidence/2026-10-24-overlay-composition/README.md); editor Escape follow-up under final cross-engine verification |

### Reading and AI content

| Public element     | Source owner                                        | Full review status                                                                                 |
| ------------------ | --------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `r-markdown`       | `packages/ranui/components/markdown/index.ts`       | [Bounded state review](../../../packages/ranui/test/evidence/2026-10-23-reading-current/README.md) |
| `r-math`           | `packages/ranui/components/math/index.ts`           | [Bounded state review](../../../packages/ranui/test/evidence/2026-10-23-renderers/README.md)       |
| `r-mermaid`        | `packages/ranui/components/mermaid/index.ts`        | [Bounded state review](../../../packages/ranui/test/evidence/2026-10-23-renderers/README.md)       |
| `r-conversation`   | `packages/ranui/components/conversation/index.ts`   | [Bounded state review](../../../packages/ranui/test/evidence/2026-10-23-reading-current/README.md) |
| `r-disclosure-row` | `packages/ranui/components/disclosure-row/index.ts` | [Bounded state review](../../../packages/ranui/test/evidence/2026-10-23-reading/README.md)         |
| `r-reasoning`      | `packages/ranui/components/reasoning/index.ts`      | [Bounded state review](../../../packages/ranui/test/evidence/2026-10-23-reading/README.md)         |
| `r-tool-card`      | `packages/ranui/components/tool-card/index.ts`      | [Bounded state review](../../../packages/ranui/test/evidence/2026-10-23-reading/README.md)         |
| `r-token-meter`    | `packages/ranui/components/token-meter/index.ts`    | [Bounded state review](../../../packages/ranui/test/evidence/2026-10-23-reading/README.md)         |
| `r-state-dot`      | `packages/ranui/components/state-dot/index.ts`      | [Bounded state review](../../../packages/ranui/test/evidence/2026-10-23-reading/README.md)         |

### Feedback

| Public element | Source owner                                  | Full review status                                                                                                                                       |
| -------------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `r-loading`    | `packages/ranui/components/loading/index.ts`  | [Bounded state review](../../../packages/ranui/test/evidence/2026-10-24-loading-variants/README.md); illustrative variants retain separate art direction |
| `r-skeleton`   | `packages/ranui/components/skeleton/index.ts` | [Bounded state review](../../../packages/ranui/test/evidence/2026-10-24-composed-controls/README.md)                                                     |
| `r-message`    | `packages/ranui/components/message/index.ts`  | [Bounded state review](../../../packages/ranui/test/evidence/2026-10-23-feedback/README.md)                                                              |
| `r-progress`   | `packages/ranui/components/progress/index.ts` | [Bounded state review](../../../packages/ranui/test/evidence/2026-10-23-feedback/README.md)                                                              |

### Interactive visuals and media

| Public element | Source owner                                 | Full review status                                                                                                                                            |
| -------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `r-radar`      | `packages/ranui/components/radar/index.ts`   | [Bounded state review](../../../packages/ranui/test/evidence/2026-10-23-feedback/README.md)                                                                   |
| `r-scratch`    | `packages/ranui/components/scratch/index.ts` | [Bounded state review](../../../packages/ranui/test/evidence/2026-10-23-loading-scratch/README.md)                                                            |
| `r-player`     | `packages/ranui/components/player/index.ts`  | [Bounded state review](../../../packages/ranui/test/evidence/2026-10-24-player-adapters/README.md); six real local decoding paths; external TURN/DRM excluded |

## Acceptance and simplest workable approach

### Attached implementation coverage

The40 element rows do not certify their attached implementations. Record these separately:

- Loading variants: `arc`, `circle`, `circle-fold`, `circle-line`, `circle-rotate`,
  `circle-spin`, `circle-turn`, `cube`, `cube-dim`, `cube-fold`, `cube-grid`, `dot`,
  `dot-bar`, `dot-circle`, `dot-line`, `dot-pulse`, `double-bounce`, `drop`, `line`,
  `line-scale`, `pacman`, `pulse`, `rotate`, `scale-out`, `solar`, `square`, `stretch`,
  `text`, `triple-bounce`. Reduced-motion visibility and narrow geometry were reviewed for the changed circle,
  circle-fold, cube-dim, cube-fold, dot-bar, dot-line, text and triple-bounce variants.
  The original recordings show the gallery, but that does not establish all29 as a refined,
  coherent product palette; the other variants retain their pending design outcome.
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

## Checkpoint after specification-first review — 2026-10-23

The canonical style brief now precedes implementation and is reused by acceptance and the agent
plugin. It settles task/hierarchy, proportions, surfaces, combined states, purposeful motion,
reference decisions where applicable and observable proof. ranui's default visual direction
belongs to its adapter; the portable design skill still respects each host's language.

Evidence-backed fixes in this batch are committed separately. 1691 unit and 76 SSR tests passed;
168 related three-engine functional cases passed before the final menu correction, followed by
54 final renderer cases in an isolated run. A preceding 53/54 renderer run failed on a transient
success icon in WebKit; its cause is not proven and remains recorded with the renderer evidence.
The website passed154 unit and63 three-engine browser cases. These counts establish their tests,
not complete visual acceptance of all40 public elements. Publication and Document integration
remain gated on resolving the open rows and capability limits above.

## Follow-up from actual gallery review — 2026-10-24

The normal and reduced-motion gallery exposes low-contrast fluorescent status marks on white.
Keep variant geometry and public overrides, but use existing text semantic colors for circle-line,
pulse, dot-bar and dot-line; remove the broad neon glow from dot-line. The circle core follows
the current surface. Move drop's small status label below its animated cyan illustration so its
text remains readable throughout the wave, in both themes. Arc and dot-pulse also need their
already reproduced reduced-motion visibility fixes. Inspect all29 variants after these changes;
these corrections do not certify every illustrative variant as a single unified product palette.

The real gallery must not initiate external media before user intent. An explicit localized load
action initializes its sample Player; existing playback error/retry handling remains available
after that request. Verify browsing and theme changes while the external stream is unavailable.

## Current integration checkpoint — 2026-10-24

All forty registered elements now have a bounded evidence entry above; this does not
certify arbitrary compositions, every optional illustration's art direction or hardware.

- The final source passed two strict pinned Linux arm64 visual runs:148/148 and148/148,
  with updates/retries disabled. All142 reviewed PNG hashes match their manifest.
- The expanded1035-case three-engine run passed1032 cases. Its three failures were the
  same newly added Select sibling-field fixture assuming the wrong native Tab order.
  Placing the field immediately after Select preserves the real Tab/Escape assertions;
  the complete final layer suite then passed30/30 across Chromium, Firefox and WebKit.
  This is full-suite coverage plus a focused repair verification, not one uninterrupted
  green1035-case run. CI remains a separate delivery gate.
- 1705 ranui unit cases passed; after the final nested-layer change,101 affected unit
  cases and76 SSR cases passed. Repository lint/type/build, tooling types, eight-language
  API/token/docs synchronization, link checks and packed consumer checks passed.
- Six agent regressions and36 script checks passed earlier in this review; nine new
  npm-pack parser regressions pass on Node24 and26. Real npm12 tarballs pass strict
  NodeNext/Bundler/browser types, ESM imports, component identity and SSR round trips.
- Independent native-key review reproduced and rechecked editor Escape priority,
  sibling focus, automatic-focus preservation and nested Popover dismissal. Refreshed
  [final ownership media](../../../packages/ranui/test/evidence/2026-10-24-overlay-composition/final-ownership/README.md)
  binds five source files,18 screenshots and two recordings to the final implementation.

The fixture repair uses zero transition duration instead of creating microtransitions
on static layout, colors and layers. Normal-motion interruption cases create their browser
context with that preference; this does not certify dynamic OS preference changes in WebKit.
Failed logs and the old-helper red regression are retained; no behavior expectation,
comparison tolerance or retry budget was relaxed.

Loading has all29 gallery/normal/reduced evidence and targeted readability repairs, not
one newly unified illustration palette. Glass WebGPU pixels remain unverified because
requestAdapter returned null. Real microphone/provider, physical assistive technology,
external WHEP/TURN, DRM and cast hardware are not claimed. See per-family limitations.

Ranui/ranuts0.5.1 and ranview0.2.1 release metadata validates. No npm publication, merge
or Document integration is performed as part of this review delivery.
