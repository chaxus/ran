# Complete component review implementation plan

> For agentic workers: use subagent-driven-development for bounded owners and independent
> spec/code/visual review. Root owns integration, shared utilities, generated references,
> build outputs, evidence and commits. Never run competing builds or mutate the Git index
> from several workers. The user already authorized this direction and one PR/many commits.

**Goal:** Review every public ranui component and improve concrete visual/interaction defects
under the current design system before publishing0.5.1 or integrating Document.

**Architecture:** Preserve existing component owners and the canonical standards. Review shared
roles first, then families; fix shared causes once. Real browser/evidence and published package
contracts remain separate from source/static coverage.

**Stack:** Existing TypeScript Web Components, LESS/tokens, Vitest, Playwright and release tools.

## Chunk1: Complete inventory and trustworthy baseline

- [x] Enumerate40 public registrations across37 owners, including child elements and nonvisual routes.
- [x] Record user scope, approved reference direction, family ownership and publication pause in the paired spec.
- [x] Reconcile API/export/demo/unit/SSR/browser coverage with the independent inventory.
- [x] Independently review spec/plan and record missing ownership or acceptance requirements.
      All40 tags are accounted for; attached variant/adapter/Glass paths and four existing
      SSR exclusions now have explicit scope in the spec. Reviewed runtime evidence and
      remaining platform limits are recorded in the paired spec.
- [x] Finish the current mobile popup capture correction before accepting new visual results.
      Preserve failed CI and local iterations; correct viewport coordinates and settled positioning;
      retain full target content and zero capture-induced resize checks. Do not loosen baselines.
- [ ] Capture and inspect family baselines using realistic states/compositions; mark missing states.
- [x] Commit inventory/scope and accepted capture correction as separately reviewable changes.

## Chunk2: Foundation and actions

Owners: `components/{button,link,icon,image,card,section,glass}/` and relevant theme/base defaults.

- [ ] Review real default/state compositions and narrow/light/dark behavior for every owner.
- [ ] Reproduce findings before edits; cover optical icon/text balance, heading/extra content,
      interactive vs inert surfaces, image loading/failure and visible keyboard/touch targets.
- [ ] Fix smallest common causes; preserve actual events, links and safe text/content.
- [ ] Run relevant browser/unit/SSR/type/design checks; inspect before/after and changed motion.
- [ ] Update exact APIs/docs if changed; independent review, then one coherent family commit.

## Chunk3: Forms and composition

Owners: `components/{input,checkbox,select,colorpicker,theme-switch,voice-button,attachments}/`,
including Select's option/dropdown-item children.

- [ ] Review labels/help/errors, values/forms, selected/checked/disabled/busy states and control proportions.
- [ ] Exercise native typing/IME, keyboard selection/clear, cancellation, permission/retry and removal focus.
- [ ] Inspect large labels, wrapping, narrow/coarse and both themes; truthful pending feedback.
- [ ] Fix reproduced defects; preserve drafts, values and pending request ownership.
- [ ] Verify APIs/docs and meaningful browser checks; inspect recordings; independent review and commit.

## Chunk4: Navigation and layers

Owners: `components/{tab,tabpane,router,route,popover,dropdown,modal}/`, including Popover's content.

- [ ] Inspect navigation emphasis, active vs focus, nested layers, placement, scrolling and command hierarchy.
- [ ] Test full open/close/reverse/reopen, nested Escape, outside input, focus return, resize and reconnect.
- [x] Review nonvisual router/route navigation and SSR contracts without decorative changes.
- [ ] Fix observed causes and verify every affected consumer; preserve reachability and authored children.
- [ ] Inspect normal/reduced transitions, narrow translations and both themes; review and commit.

## Chunk5: Reading and AI content

Owners: `components/{markdown,math,mermaid,conversation,disclosure-row,reasoning,tool-card,token-meter,state-dot}/`.

- [ ] Inspect realistic prose, tables, code, math/diagrams and agent status groups at reading widths.
- [ ] Exercise exact copy/failure/retry, native selection, long overflow, streaming, lazy highlighting and follow intent.
- [ ] Review disclosure density, progress truthfulness, state/color semantics, empty/error/interruption and keyboard focus.
- [ ] Preserve safe/raw data and renderer limits; do not fabricate reasoning/provider/media capability.
- [ ] Verify and inspect source-bound media; independent review and family commit.

## Chunk6: Feedback and interactive visuals/media

Owners: `components/{loading,skeleton,message,progress,radar,scratch,player}/`, including variants/adapters.

- [ ] Review default/loading/empty/error/disabled/completion, typography and visual hierarchy.
- [ ] Exercise determinate vs indeterminate feedback, announcements, dismissal, pointer/touch/keyboard and interruption.
- [ ] Inspect media controls and real available playback paths; distinguish simulated events from actual codec/network proof.
- [ ] Verify reduced motion preserves information, no gratuitous loops, and teardown releases observers/frames/resources.
- [ ] Fix reproduced issues; inspect actual states/continuous transitions; independent review and coherent commits.

## Chunk7: Whole-system review and delivery

- [x] Reconcile all40 rows with actual reviewed outcomes, evidence and honest limits; no implied full pass from unit coverage.
- [ ] Inspect sibling components together for type, spacing, shape, icon weight and control/state consistency.
- [x] Regenerate API/token/changelog references and mirrored docs; keep agent routing thin and canonical.
- [ ] Run applicable full unit/SSR/type/design/docs/links/format/package-consumer gates and3-engine CI.
- [x] Review intentional screenshot changes individually, retain unrelated reviewed images and unchanged tolerances,
      then run two fresh strict canonical comparisons. Demonstrate capture/acceptance guards reject real defects.
- [ ] Update existing draft PR437 with grouped commits, final evidence and unresolved conditions.
- [ ] After this phase passes, rebuild/verify the clean0.5.1 release set, follow the existing trusted release workflow,
      verify registry artifacts, then resume Document using published dependencies and its separate UI acceptance.

## Follow-up work requested during implementation

The user requested these after the current component pass; they do not replace incomplete
runtime fixes or permit treating bug-free controls as a finished visual direction.

- [ ] Compare excellent current product component libraries with the supplied references,
      using their official live examples. Assess proportions, density, control sizing,
      typography, optical balance, hierarchy and interaction choreography in realistic
      compositions. Document concrete adoption decisions and prototype before/after options;
      do not collect another undifferentiated link list or claim a copied brand is a design system.
- [ ] Migrate repository-owned tracked `.mjs` tooling to typed `.ts` source, as explicitly
      requested by the user during implementation. Preserve ESM and native Node24+ execution;
      use erasable types, explicit local extensions and a separate strict no-emit tooling gate.
      Update all package/CI/plugin/test/documentation invocations and measured harness inputs.
      Do not rename third-party/generated JavaScript or rewrite historical evidence as fresh.
      Published runtime artifacts remain JavaScript. Keep this migration in its own commit;
      verify equivalent script behavior, Node24/26 execution, types and package boundaries.
- [ ] Reconcile these follow-ups with the final release scope before publication; no version
      is published merely because the earlier package candidates were prepared.

## Integration checkpoint — 2026-10-24

The paired spec's forty-owner table is the current evidence index. Family evidence includes
composed controls, route/history behavior, reading/AI rendering, all29 Loading variants,
Glass lifecycle and actual decoding on six Player adapters. Remaining unchecked family
items denote broader acceptance scope, not an absence of the bounded reviews linked there.
Optional illustration art direction and hardware/provider limits remain explicit.

Production fixes and source-bound recordings are committed separately. Two strict canonical
comparisons passed148/148 each. The expanded full browser run passed1032/1035; correcting
the final Select fixture's Tab order retained its expectations and the complete layer suite
passed30/30 across all three engines. CI is still separate from these local results.
Repository lint/type/build, generated docs, SSR and packed consumer checks passed. npm12's
package-keyed pack output required a typed parser repair; nine regressions pass on Node24/26.

Keep delivery/CI and release status separate. Do not convert this review into a claim of
hardware coverage, universal illustration uniformity or Document acceptance.
