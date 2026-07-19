import css from './index.less?inline';
import { Div } from '@/utils/builder';
import type { LoadingVariant } from '../../types';

const render = (): HTMLElement => {
    const loading = Div()
      .class('circle-fold')
      .part('circle-fold')
      .children(
        ...Array(12)
          .fill(1)
          .map((_, index) => Div().class(`circle-fold-item circle-fold-item-${index + 1}`)),
      )
      .build();
    return loading;
};

export default { css, render } satisfies LoadingVariant;
