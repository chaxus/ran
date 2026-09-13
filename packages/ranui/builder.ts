/**
 * The `ranui/builder` entry point.
 *
 * The implementation moved to its own package, `ranview`; this file keeps the same export
 * list so the public surface of `ranui/builder` is unchanged down to the name. Every
 * name is written out rather than forwarded wholesale: a star re-export would also carry
 * whatever ranview adds next, quietly widening ranui's public API. `package-exports.source`
 * enforces that, by looking for the star token in this file's text — which is why this
 * sentence does not spell it.
 */
export { isSSR } from '@chaxus/ranview';
export { EventManager } from '@chaxus/ranview';
export {
  signal,
  createEffect,
  computed,
  batch,
  untrack,
  createRoot,
  onCleanup,
  getOwner,
  runWithOwner,
} from '@chaxus/ranview';
export type { Getter, Setter, SignalOptions, Owner } from '@chaxus/ranview';
export { escapeHtml, escapeHtmlAttribute } from '@chaxus/ranview';
export { matchSelector, collectMatches } from '@chaxus/ranview';
export type { MockNode } from '@chaxus/ranview';
export { DocumentFragmentMock, HTMLElementMock, ShadowRootMock } from '@chaxus/ranview';
export { createRef, For, Index, Show, Switch, Match, ElementBuilder, ShadowBuilder } from '@chaxus/ranview';
export type {
  Ref,
  Child,
  ForOptions,
  ForHandle,
  IndexOptions,
  IndexHandle,
  ShowOptions,
  SwitchOptions,
  MatchClause,
} from '@chaxus/ranview';
export {
  View,
  Div,
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
} from '@chaxus/ranview';
