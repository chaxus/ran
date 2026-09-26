/** Static DOM/mock construction. Getters render once; no signal runtime is imported. */
import { ElementBuilder } from './builder';
import { createFactories } from './factories';
import type { Child, ForOptions, IndexOptions, ShowOptions, SwitchOptions, MatchClause } from './core';
export { ElementBuilder, ShadowBuilder, SVG_NAMESPACE } from './builder';
export { isSSR } from './env';
export { EventManager } from './events';
export { DocumentFragmentMock, HTMLElementMock, ShadowRootMock } from './mocks';
export type { Child, Ref, ForOptions, IndexOptions, ShowOptions, SwitchOptions, MatchClause } from './core';
export const createRef = <T extends HTMLElement = HTMLElement>() => ({ current: null as T | null });
export function For<T>(options: ForOptions<T>): () => Child {
  return () => (options.each() ?? []).map((item, i) => options.render(item, () => i));
}
export function Index<T>(options: IndexOptions<T>): () => Child {
  return () => (options.each() ?? []).map((item, i) => options.render(() => item, i));
}
export function Show<T>(options: ShowOptions<T>): () => Child {
  return () =>
    options.when() ? options.children(() => options.when() as NonNullable<T>) : (options.fallback?.() ?? null);
}
export const Match = <T>(clause: MatchClause<T>): MatchClause<T> => clause;
export function Switch(options: SwitchOptions): () => Child {
  return () => {
    const clause = options.children.find((c) => Boolean(c.when()));
    return clause ? clause.children(() => clause.when() as NonNullable<unknown>) : (options.fallback?.() ?? null);
  };
}
export const {
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
} = createFactories(ElementBuilder);
