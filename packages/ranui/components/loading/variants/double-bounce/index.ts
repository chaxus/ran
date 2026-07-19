import css from './index.less?inline';
import { Div } from '@/utils/builder';
import type { LoadingVariant } from '../../types';

const render = (): HTMLElement => {
    const loading = Div()
      .class('double-bounce')
      .part('double-bounce')
      .children(
        ...Array(2)
          .fill(1)
          .map((_, i) => Div().class(`double-bounce${i + 1}`)),
      )
      .build();
    return loading;
};

export default { css, render } satisfies LoadingVariant;
