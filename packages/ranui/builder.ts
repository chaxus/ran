export { isSSR } from './utils/builder/env';
export { EventManager } from './utils/builder/events';
export { signal, createEffect, computed, batch } from './utils/builder/signal';
export type { Getter, Setter, SignalOptions } from './utils/builder/signal';
export { escapeHtml, escapeHtmlAttribute } from './utils/builder/escape';
export { matchSelector, collectMatches } from './utils/builder/selectors';
export type { MockNode } from './utils/builder/selectors';
export { DocumentFragmentMock, HTMLElementMock, ShadowRootMock } from './utils/builder/mocks';
export { createRef, ElementBuilder, ShadowBuilder } from './utils/builder/core';
export type { Ref } from './utils/builder/core';
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
