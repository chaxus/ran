import css from './index.less?inline';
import { Div } from '@/utils/builder';
import type { LoadingVariant } from '../../types';

const render = (): HTMLElement => {
    const loading = Div()
      .class('cube-dim')
      .part('cube-dim')
      .children(
        ...Array(9)
          .fill(1)
          .map(() => Div().class('cube-dim-item')),
      )
      .build();
    return loading;
};

export default { css, render } satisfies LoadingVariant;
