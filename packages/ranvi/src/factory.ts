import { ElementBuilder, SVG_NAMESPACE } from './core';

export const View = <T extends HTMLElement = HTMLElement>(tag: string): ElementBuilder<T> => new ElementBuilder<T>(tag);
export const Div = (): ElementBuilder<HTMLDivElement> => View<HTMLDivElement>('div');

/**
 * An element in the SVG namespace.
 *
 * `View()` already infers it for tags that only exist in SVG (`path`, `circle`,
 * `g`, …), so this is for the ones SVG shares with HTML -- `a`, `script`,
 * `style`, `title` -- where guessing would break the commoner HTML case.
 *
 * ```ts
 * View('svg').attrs({ viewBox: '0 0 16 16' }).children(
 *   Svg('a').attr('href', '#').children(View('path').attr('d', 'M1 1').build()).build(),
 * );
 * ```
 */
export const Svg = <T extends HTMLElement = HTMLElement>(tag: string): ElementBuilder<T> =>
  new ElementBuilder<T>(tag, SVG_NAMESPACE);
export const Span = (): ElementBuilder<HTMLSpanElement> => View<HTMLSpanElement>('span');
export const Slot = (): ElementBuilder<HTMLSlotElement> => View<HTMLSlotElement>('slot');
export const ButtonBuilder = (): ElementBuilder<HTMLButtonElement> => View<HTMLButtonElement>('button');
export const InputBuilder = (): ElementBuilder<HTMLInputElement> => View<HTMLInputElement>('input');
export const Style = (): ElementBuilder<HTMLStyleElement> => View<HTMLStyleElement>('style');
export const Label = (): ElementBuilder<HTMLLabelElement> => View<HTMLLabelElement>('label');
export const Ul = (): ElementBuilder<HTMLUListElement> => View<HTMLUListElement>('ul');
export const Li = (): ElementBuilder<HTMLLIElement> => View<HTMLLIElement>('li');
export const Section = (): ElementBuilder<HTMLElement> => View<HTMLElement>('section');
export const Article = (): ElementBuilder<HTMLElement> => View<HTMLElement>('article');
export const Nav = (): ElementBuilder<HTMLElement> => View<HTMLElement>('nav');
export const Header = (): ElementBuilder<HTMLElement> => View<HTMLElement>('header');
export const Footer = (): ElementBuilder<HTMLElement> => View<HTMLElement>('footer');
export const Main = (): ElementBuilder<HTMLElement> => View<HTMLElement>('main');

export const DeclarativeShadow = (
  mode: 'open' | 'closed' = 'open',
  delegatesFocus = false,
): ElementBuilder<HTMLTemplateElement> => {
  const tpl = View<HTMLTemplateElement>('template');
  tpl.attr('shadowrootmode', mode);
  if (delegatesFocus) tpl.attr('shadowrootdelegatesfocus', '');
  return tpl;
};
