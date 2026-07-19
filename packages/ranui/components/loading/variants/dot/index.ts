import css from './index.less?inline';
import { Div } from '@/utils/builder';
import type { LoadingVariant } from '../../types';

const render = (): HTMLElement => {
  const loading = Div()
    .class('dot')
    .part('dot')
    .children(
      ...Array(2)
        .fill(1)
        .map((_, i) => Div().class(`dot${i + 1}`)),
    )
    .build();
  return loading;
};

export default { css, render } satisfies LoadingVariant;
