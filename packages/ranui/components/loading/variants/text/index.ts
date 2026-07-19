import css from './index.less?inline';
import { Div, Span } from '@/utils/builder';
import type { LoadingVariant } from '../../types';

const render = (): HTMLElement => {
  const loading = Div()
    .class('text')
    .part('text')
    .children(...['L', 'o', 'a', 'd', 'i', 'n', 'g'].map((i) => Span().class('text-item').text(i)))
    .build();
  return loading;
};

export default { css, render } satisfies LoadingVariant;
