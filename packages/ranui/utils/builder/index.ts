/**
 * The builder now lives in its own package, `ranview`.
 *
 * This file stays as a re-export so nothing in ranui had to change: 84 modules import
 * `@/utils/builder`, and `ranui/builder` is a published entry point that consumers use.
 * Both keep resolving here, and here forwards.
 *
 * It moved because it had grown into a general-purpose library wearing a component
 * library's clothes — 1,831 lines, its own 434-line manual, its own test suite, and
 * exactly one external import. Anyone wanting framework-free reactive DOM had to install
 * ranui, and with it a video player, a diagram renderer and a maths typesetter: 242 MB of
 * transitive dependencies for a file that depends on one function.
 */
// Named, not `export *`: the build turns a star re-export of an external package into a
// namespace object copied at runtime, which no consumer's bundler can tree-shake, so every
// component carried all of ranview. test/unit/utils.builder-exports.test.ts holds the list
// equal to ranview's.
export {
  isSSR,
  EventManager,
  signal,
  createEffect,
  computed,
  batch,
  untrack,
  createRoot,
  onCleanup,
  getOwner,
  runWithOwner,
  escapeHtml,
  escapeHtmlAttribute,
  matchSelector,
  collectMatches,
  DocumentFragmentMock,
  HTMLElementMock,
  ShadowRootMock,
  createRef,
  For,
  Index,
  Show,
  Switch,
  Match,
  ElementBuilder,
  ShadowBuilder,
  View,
  Div,
  Svg,
  Span,
  Slot,
  ButtonBuilder,
  InputBuilder,
  Style,
  Label,
  Ul,
  Li,
  Section,
  Article,
  Nav,
  Header,
  Footer,
  Main,
  DeclarativeShadow,
} from '@alixex/ranview';
export type {
  Getter,
  Setter,
  SignalOptions,
  Owner,
  MockNode,
  Ref,
  Child,
  ForOptions,
  ForHandle,
  IndexOptions,
  IndexHandle,
  ShowOptions,
  SwitchOptions,
  MatchClause,
} from '@alixex/ranview';
