import css from './index.less?inline';
import { Div } from '@/utils/builder';
import type { LoadingVariant } from '../../types';

const render = (): HTMLElement => {
    const loading = Div()
      .class('cube-grid')
      .part('cube-grid')
      .children(
        ...Array(9)
          .fill(1)
          .map((_, index) => Div().class(`cube-grid-item cube-grid-item-${index + 1}`)),
      )
      .build();
    return loading;
};

export default { css, render } satisfies LoadingVariant;
