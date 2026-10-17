# Agent AI design guidance

## Goal and scope

The user requests that the design lessons from the Document AI workspace be integrated into ran's existing design system, usable by agents, delivered as one PR with multiple commits allowed. Preserve library APIs and defaults. This is documentation and documentation validation, not a new AI application or token scale.

## Evidence and ownership

- `packages/ranui/docs/DESIGN.md` is the authoritative visual standard; sections 11–12 already govern flat composition and information architecture.
- `packages/ranui/docs/CODING.md` owns implementation/state architecture; `COMPONENTS.md` and `style-tokens-public.md` own generated API references.
- `theme/tokens.less` declares spacing steps 1/2/3/4/6/8/10/16/24. DESIGN's relationship table incorrectly names step 5 and maps major boundaries to 6 instead of 8.
- `plugins/ranui/skills/ranui/SKILL.md` is an installed-consumer entry point. Package `files` determines which agent references survive npm publication.
- The Document review demonstrated excessive nested surfaces, oversized command buttons, stale or failed request confusion, provider-irrelevant settings, and keyboard/focus defects missed by static token checks. Product-specific dimensions are evidence about that product, not universal library defaults.

## Chosen structure

1. Keep DESIGN authoritative; correct its spacing table and add concise links to a focused `docs/AI_INTERFACES.md` application guide.
2. Add a short root `AGENTS.md` routing agents to the relevant owners and verification commands. Root DESIGN describes the demo and must not become a second library-wide standard.
3. Ship AI_INTERFACES with npm, link it from the plugin, CLAUDE reference and README. Add English and Chinese public design-guideline links to the canonical guide instead of copying its full text into multiple owners.
4. The guide contains decisions, state/action tables, a small real-token density example, implementation boundaries, a cross-surface regression matrix and a copyable task/review brief. Describe host-owned connectors/artifacts rather than claiming ranui implements OAuth, storage or application review policies.
5. Validate all token names in the new guide's CSS examples and the authoritative spacing relationship table against real declarations, plus package inclusion. Prefer existing link and generated-doc checks for routing instead of redundant keyword assertions.

## Guidance to preserve

- Content leads; whitespace and alignment before containers; one input boundary, flat queue summary, quiet object-local actions, one primary action per task region.
- Keep visual size separate from pointer target and focus geometry; use product semantic density tokens where repetition warrants them, derived from real foundation tokens. No global 42/32/44 requirement copied from Document.
- Queueing, stopping, retrying and restoring drafts must have explicit semantics; IME Enter never submits. Preserve reading position and composition while streaming or switching context.
- Errors explain what failed, whether anything changed and a useful recovery; do not hide an actionable failure in a disclosure. Local/cloud settings and offline availability follow actual capability and data destination.
- Connection configuration, authorization, verification and network reachability are distinct states. Artifact review is separate from document mutation, with revision/stale-context handling and undo where supported.
- Prefer public attributes/events/parts; verify real keyboard integration across shadow boundaries and focus restoration.
- Tests and screenshots must cover actual geometry, theme, longest translation, coarse input, keyboard, reduced motion, offline and failure/stale responses. A successful static audit is only one layer of evidence.

## Alternatives

- Append everything to DESIGN: rejected because it is already a large standard and AI application recipes need a focused lookup.
- Add a new independent skill or token set: rejected because it duplicates existing owners.
- One canonical application guide with thin entry links: adopted; documentation checks protect executable examples and publication.

## Acceptance

- Every new token reference resolves; corrected spacing means 24px sections and 32px major boundaries using real steps, with no invented step 5.
- A consuming agent can find this guide from repo, installed package and plugin paths, without loading the entire repository.
- Fresh docs links, formatting, generated docs, design checks and focused unit tests pass. Existing CI remains enabled and is inspected on the PR.
- Independent spec and quality reviews approve; report exact checks and any external CI limitation honestly.
