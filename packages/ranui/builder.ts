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
export { isSSR } from '@alixex/ranview';
export { EventManager } from '@alixex/ranview';
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
} from '@alixex/ranview';
export type { Getter, Setter, SignalOptions, Owner } from '@alixex/ranview';
export { escapeHtml, escapeHtmlAttribute } from '@alixex/ranview';
export { matchSelector, collectMatches } from '@alixex/ranview';
export type { MockNode } from '@alixex/ranview';
export { DocumentFragmentMock, HTMLElementMock, ShadowRootMock } from '@alixex/ranview';
export { createRef, For, Index, Show, Switch, Match, ElementBuilder, ShadowBuilder } from '@alixex/ranview';
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
} from '@alixex/ranview';
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
} from '@alixex/ranview';
