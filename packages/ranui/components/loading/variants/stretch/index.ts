import css from './index.less?inline';
import { Div } from '@/utils/builder';
import type { LoadingVariant } from '../../types';

const render = (): HTMLElement => {
    const loading = Div()
      .class('stretch')
      .part('stretch')
      .children(
        ...Array(5)
          .fill(1)
          .map((_, i) => Div().class(`rect${i + 1}`)),
      )
      .build();
    return loading;
};

export default { css, render } satisfies LoadingVariant;
