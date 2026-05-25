# ranui Home Polish and Component Docs Entry Design

## Goal

Polish the existing ranui demo homepage into a stronger public-facing website while turning the component gallery into a lightweight documentation entry point. The page should keep yesterday's product-site direction, retain real ranui component demos, and add same-page component anchors/details without introducing a full multi-page docs system.

## Context

The current homepage in `packages/ranui/demo/index.html` already has a strong baseline:

- Sticky navigation with theme mode and theme-pack controls.
- Product hero with real ranui preview components.
- Theme Lab showcasing the available theme packs.
- Grouped component gallery.
- Code path and Style API sections.

The next step is not a redesign from scratch. The work should preserve the current visual direction and improve hierarchy, navigation, and documentation affordance.

The current worktree also contains ongoing theme-pack/component-token changes. This spec is scoped to the homepage and component docs entry experience; it should integrate with those changes without broadening into a separate theme-pack refactor.

## Selected Approach

Use a single-page documentation-entry model.

The homepage remains one page, but `#components` becomes a more useful bridge between marketing and documentation:

- A compact component index grouped by use case.
- Stable same-page anchors for each represented component.
- Cards that act as both showcase demos and entry points.
- A lightweight detail section below the gallery with import paths, basic examples, and key styling/usage notes.

This gives the site a real docs-entry surface without adding routing, generated docs, or a full API reference system.

## Homepage Polish

The polish work should refine the existing page rather than change its identity:

- Keep the current product-site structure: nav, hero, Theme Lab, components, code paths, style API.
- Tighten spacing and section rhythm so the page reads as a coherent website rather than stacked demo fixtures.
- Make the hero preview feel like a deliberate live product surface, with cleaner labels and less visual clutter.
- Keep primary CTAs focused on the next developer actions: browse components, inspect theme packs, and view code/import paths.
- Preserve the current theme-aware page palette and ensure the theme packs continue to visibly affect the page.
- Avoid decorative-only assets, oversized marketing sections, or new one-off illustration systems.

## Component Gallery

The `#components` section should become a component directory with real examples:

- Keep the existing grouping:
  - Actions and inputs.
  - Feedback.
  - Navigation and overlays.
  - Media and advanced.
- Give each component a stable anchor such as `#component-button`, `#component-input`, and `#component-modal`.
- Each card should include:
  - Component name.
  - One concise usage sentence.
  - Small type/status metadata such as `form`, `feedback`, `overlay`, `advanced`, or `theme-aware`.
  - A live mini demo using the real component where practical.
  - A same-page link or button to the component's detail block.
- Keep cards compact and scannable. They should feel like docs entry cards, not full API tables.

## Component Details

Add a lightweight same-page details area after the gallery.

Each detail block should include:

- Component title and short purpose.
- Import path, using the current package export style such as `ranui/button`.
- Minimal HTML usage example.
- One to three key notes, chosen from attributes, slots, events, CSS variables, or `::part()` usage.
- A link back to the component index.

Initial coverage should focus on components already shown in the homepage gallery. The detail content should be useful but intentionally incomplete; it is a docs preview, not the final API reference.

## Navigation and Hash Behavior

Navigation should support repeated use:

- Existing nav links must keep working.
- The `Components` nav item should land at the component index.
- Component detail links should update the URL hash and scroll to the matching detail block.
- Detail blocks should have enough `scroll-margin-top` to avoid being hidden under the sticky nav.
- Mobile navigation and horizontal controls must not overlap or force unreadable text.

## Content Model

Keep content inline in `packages/ranui/demo/index.html` for this pass. Do not add a content pipeline, Markdown parser, docs generator, or routing layer.

Use small repeated HTML patterns so a future docs extraction is straightforward:

- Component id.
- Category.
- One-line description.
- Demo surface.
- Import example.
- Usage example.
- Notes list.

If the implementation starts duplicating too much markup, add small local structural conventions in the HTML/CSS, but do not introduce a framework or build-time data system.

## Implementation Scope

Primary target:

- `packages/ranui/demo/index.html`

Allowed supporting changes:

- `packages/ranui/demo/index.ts` only if a small behavior hook is needed for anchors or demo interactions.
- Existing unit/browser tests for homepage contracts.

Out of scope:

- Multi-page docs routing.
- Full generated component API reference.
- New runtime dependencies.
- Broad component implementation refactors.
- Replacing yesterday's homepage design direction.

## Testing and Verification

Verification should cover both structure and visual behavior:

- Type check ranui with `pnpm -F ranui tsc`.
- Run focused tests for demo/homepage contracts if present, or add a focused contract test for required anchors and component detail blocks.
- Run the demo locally with Vite and inspect:
  - Desktop homepage.
  - Mobile-width homepage.
  - `#components` anchor.
  - A representative component detail anchor.
  - Theme mode and theme-pack switching.
  - Message, modal, scratch, and other existing interactive examples that already have triggers.

The implementation should not be considered complete if the page only looks correct at one viewport width or if component detail links land underneath the sticky nav.
