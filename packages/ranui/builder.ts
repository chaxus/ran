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
export { isSSR } from 'ranview';
export { EventManager } from 'ranview';
export { signal, createEffect, computed, batch, untrack, createRoot, onCleanup, getOwner, runWithOwner } from 'ranview';
export type { Getter, Setter, SignalOptions, Owner } from 'ranview';
export { escapeHtml, escapeHtmlAttribute } from 'ranview';
export { matchSelector, collectMatches } from 'ranview';
export type { MockNode } from 'ranview';
export { DocumentFragmentMock, HTMLElementMock, ShadowRootMock } from 'ranview';
export { createRef, For, Index, Show, Switch, Match, ElementBuilder, ShadowBuilder } from 'ranview';
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
} from 'ranview';
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
} from 'ranview';
