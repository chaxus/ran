import { ElementBuilder, SVG_NAMESPACE } from './builder';
export function createFactories(Builder: typeof ElementBuilder) {
  const View = <T extends HTMLElement = HTMLElement>(tag: string): ElementBuilder<T> => new Builder<T>(tag);
  const Div = (): ElementBuilder<HTMLDivElement> => View<HTMLDivElement>('div');

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
  const Svg = <T extends HTMLElement = HTMLElement>(tag: string): ElementBuilder<T> =>
    new Builder<T>(tag, SVG_NAMESPACE);
  const Span = (): ElementBuilder<HTMLSpanElement> => View<HTMLSpanElement>('span');
  const Slot = (): ElementBuilder<HTMLSlotElement> => View<HTMLSlotElement>('slot');
  const ButtonBuilder = (): ElementBuilder<HTMLButtonElement> => View<HTMLButtonElement>('button');
  const InputBuilder = (): ElementBuilder<HTMLInputElement> => View<HTMLInputElement>('input');
  const Style = (): ElementBuilder<HTMLStyleElement> => View<HTMLStyleElement>('style');
  const Label = (): ElementBuilder<HTMLLabelElement> => View<HTMLLabelElement>('label');
  const Ul = (): ElementBuilder<HTMLUListElement> => View<HTMLUListElement>('ul');
  const Li = (): ElementBuilder<HTMLLIElement> => View<HTMLLIElement>('li');
  const Section = (): ElementBuilder<HTMLElement> => View<HTMLElement>('section');
  const Article = (): ElementBuilder<HTMLElement> => View<HTMLElement>('article');
  const Nav = (): ElementBuilder<HTMLElement> => View<HTMLElement>('nav');
  const Header = (): ElementBuilder<HTMLElement> => View<HTMLElement>('header');
  const Footer = (): ElementBuilder<HTMLElement> => View<HTMLElement>('footer');
  const Main = (): ElementBuilder<HTMLElement> => View<HTMLElement>('main');

  const DeclarativeShadow = (
    mode: 'open' | 'closed' = 'open',
    delegatesFocus = false,
  ): ElementBuilder<HTMLTemplateElement> => {
    const tpl = View<HTMLTemplateElement>('template');
    tpl.attr('shadowrootmode', mode);
    if (delegatesFocus) tpl.attr('shadowrootdelegatesfocus', '');
    return tpl;
  };

  return {
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
  };
}
