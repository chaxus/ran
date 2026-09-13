/**
 * The `ranui/builder` entry point.
 *
 * The implementation moved to its own package, `ranvi`; this file keeps the same export
 * list so the public surface of `ranui/builder` is unchanged down to the name. Every
 * name is written out rather than forwarded wholesale: a star re-export would also carry
 * whatever ranvi adds next, quietly widening ranui's public API. `package-exports.source`
 * enforces that, by looking for the star token in this file's text — which is why this
 * sentence does not spell it.
 */
export { isSSR } from 'ranvi';
export { EventManager } from 'ranvi';
export { signal, createEffect, computed, batch, untrack, createRoot, onCleanup, getOwner, runWithOwner } from 'ranvi';
export type { Getter, Setter, SignalOptions, Owner } from 'ranvi';
export { escapeHtml, escapeHtmlAttribute } from 'ranvi';
export { matchSelector, collectMatches } from 'ranvi';
export type { MockNode } from 'ranvi';
export { DocumentFragmentMock, HTMLElementMock, ShadowRootMock } from 'ranvi';
export { createRef, For, Index, Show, Switch, Match, ElementBuilder, ShadowBuilder } from 'ranvi';
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
} from 'ranvi';
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
} from 'ranvi';
