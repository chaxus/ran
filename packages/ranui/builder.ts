export { isSSR } from './utils/builder/env';
export { EventManager } from './utils/builder/events';
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
} from './utils/builder/signal';
export type { Getter, Setter, SignalOptions, Owner } from './utils/builder/signal';
export { escapeHtml, escapeHtmlAttribute } from './utils/builder/escape';
export { matchSelector, collectMatches } from './utils/builder/selectors';
export type { MockNode } from './utils/builder/selectors';
export { DocumentFragmentMock, HTMLElementMock, ShadowRootMock } from './utils/builder/mocks';
export { createRef, For, Index, Show, Switch, Match, ElementBuilder, ShadowBuilder } from './utils/builder/core';
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
} from './utils/builder/core';
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
} from './utils/builder/factory';
