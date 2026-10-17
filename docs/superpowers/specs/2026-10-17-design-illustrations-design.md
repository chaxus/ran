# Token-backed design illustrations

Extend the approved general guidance in #421 with three explanatory SVGs, rather than a new guideline category or animation framework. Learn the references' explanatory method, without copying their artwork or GPUI-specific geometry.

- Alignment: optional row content changes while the text spine and action column stay fixed.
- Radius: a necessary inset surface shares a corner center when outer radius minus inset equals inner radius. Use ranui's 16 / 12 radii and 4 spacing; this is a geometric example, not an instruction to add nested surfaces.
- Density: distinguish a 32px visible control from a 48px host-owned target, derived from existing size/spacing tokens. This example is not a new library density or universal target size.

Build-time SVG rendering reads foundation token source; inline diagrams inherit the site's theme. Standalone exports embed only the required token declarations, with system dark and reduced-motion support. Schematics illustrate composition, not live component APIs. English/Chinese and the other existing locales receive localized explanations and playback labels.

The existing design-guide page embeds the diagrams. Static content remains meaningful without JavaScript. On-page motion is opt-in, finite, pausable and replayable through a native keyboard-accessible button. Teaching holds are distinct from production motion durations. Reduced motion disables playback. No new dependency, public component, navigation category or runtime service is introduced.

Verification: token/geometry and localized rendering tests, playback lifecycle/reduced-motion tests; existing docs/guidance suites, locale/type/link/design/generated-doc/format gates; production build and real browser inspection in light/dark/narrow modes, then CI on the pushed head.

Clarify DESIGN §11’s absolute nesting sentence to prohibit redundant containers/padding while allowing functionally necessary inset controls/surfaces with coherent geometry. Verify Persian/RTL labels and reduced-motion control state in the browser.
