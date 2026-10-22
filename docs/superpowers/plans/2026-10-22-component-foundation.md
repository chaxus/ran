# Component foundation implementation plan

Use subagent-driven-development for independent component owners, followed by independent
review. Root owns integration, generated references, conversation following, Markdown styles,
actual media review and PR delivery. Do not build shared outputs concurrently.

- [x] Reproduce actual primitive, portal/disclosure and rendered-content failures before editing.
- [x] Submit the separately verified select exit/reopen correction to the existing ran PR.
- [x] Independently review the paired foundation spec and resolve concrete scope/ownership gaps.
- [x] Input owner: failing tests, disabled pointer guard, retained icon/label semantics, pending
      speech cancellation/state, focused browser proof and mirrored documentation.
- [x] Interaction owner: failing tests, portaled/nested Escape, disclosure focus restoration,
      stale entrance-frame rejection, focused browser proof and mirrored documentation.
- [x] Content owner: failing tests, per-source clipboard lifetime and failure feedback, stable
      streamed code/table viewports and selection-aware highlighting, focused browser proof and docs.
- [x] Root: gate automatic conversation following, refine token-based table/code defaults and
      align code header/text. Preserve explicit navigation and safe rendering.
- [x] Integrate owners; regenerate API/token references if public contracts changed. Run types,
      relevant unit/integration/SSR/browser, design, docs, links and formatting checks.
- [x] Inspect source-bound before/after screenshots and continuous normal/reduced-motion flows
      at applicable widths/themes, then independent code and visual review. Correct findings.
- [x] Update ran PR with actual outcomes and limits. Only then resume Document integration;
      its draft PR remains a reviewable snapshot, without final product acceptance claims.
