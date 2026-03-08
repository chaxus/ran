import { ElementBuilder } from './core';

export const View = <T extends HTMLElement = HTMLElement>(tag: string): ElementBuilder<T> => new ElementBuilder<T>(tag);
export const Div = (): ElementBuilder<HTMLDivElement> => View<HTMLDivElement>('div');
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
