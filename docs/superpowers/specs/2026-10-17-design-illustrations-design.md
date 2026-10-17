# Token-backed design illustrations

Extend the approved general guidance in #421 with three explanatory SVGs, rather than a new guideline category or animation framework. Learn the references' explanatory method, without copying their artwork or GPUI-specific geometry.

- Alignment: optional row content changes while the text spine and action column stay fixed.
- Radius: a necessary inset surface shares a corner center when outer radius minus inset equals inner radius. Use ranui's 16 / 12 radii and 4 spacing; preserve that geometry while revealing guides. This is a geometric example, not an instruction to add nested surfaces.
- Density: illustrate DESIGN's existing native-command composition, a 16px glyph inside a 32px native target, with separate sizing-role tokens. This is a documented host example, not a new library density, r-button capability or universal target size.

Build-time SVG rendering reads foundation token source; inline diagrams inherit the site's theme. Standalone exports embed only the required token declarations, with system dark and reduced-motion support. Schematics illustrate composition, not live component APIs. English/Chinese and the other existing locales receive localized explanations and playback labels.

The existing design-guide page embeds the diagrams. Static content remains meaningful without JavaScript. On-page motion is opt-in, finite, pausable and replayable through a native keyboard-accessible button. Teaching holds are distinct from production motion durations. Reduced motion disables playback. No new dependency, public component, navigation category or runtime service is introduced.

Verification: token/geometry and localized rendering tests, playback lifecycle/reduced-motion tests; existing docs/guidance suites, locale/type/link/design/generated-doc/format gates; production build and real browser inspection in light/dark/narrow modes, then CI on the pushed head.

Clarify DESIGN §11’s absolute nesting sentence to prohibit redundant containers/padding while allowing functionally necessary inset controls/surfaces with coherent geometry. Verify Persian/RTL labels and reduced-motion control state in the browser.

## Review refinement

The user requests a final review grounded in ran's own capabilities, without copying the reference. Keep the same three schematics and existing renderer/playback mechanism:

- Preserve correct radius geometry at every frame; reveal the concentric guides instead of temporarily drawing an incorrect inner radius under a statement that centers coincide.
- Replace the independently invented 32/48px example with DESIGN's existing native-command composition: a 16px glyph (`--ran-size-1`) inside a 32px native target (`--ran-size-7`). These are a documented host example, not a new default or r-button API. No send-button skin or added background is needed.
- Keep annotation geometry stable; reveal guides/content with opacity and the existing `--ran-motion-ease-standard`. Four-second educational playback remains distinct from production feedback timings. Use the owned SVG’s native animation completion signal instead of maintaining a second JavaScript clock.
- Reserve intrinsic width for localized normal playback labels so Pause/Resume/Replay never push the download link. Reduced-motion feedback is plain static text rather than a long disabled command. Preserve keyboard semantics and contextual descriptions.
- Let the 320-unit drawing scale into a 288px content area without a forced scrollbar. Add stable illustration anchors for direct reading; avoid new navigation categories, containers or token scales.

Verify actual 320px and desktop geometry, English/Chinese/Persian layouts, theme contrast, pause/resume/replay, native keyboard focus, reduced-motion changes and all 24 standalone XML exports. Existing tests and CI gates remain required.
