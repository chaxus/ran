import css from './index.less?inline';
import { Div } from '@/utils/builder';
import type { LoadingVariant } from '../../types';

const render = (): HTMLElement => {
  const loading = Div()
    .class('cube-fold')
    .part('cube-fold')
    .children(
      ...Array(4)
        .fill(1)
        .map((_, index) => Div().class(`cube-fold-item cube-fold-item-${index + 1}`)),
    )
    .build();
  return loading;
};

export default { css, render } satisfies LoadingVariant;
