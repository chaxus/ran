import css from './index.less?inline';
import { Div } from '@/utils/builder';
import type { LoadingVariant } from '../../types';

const render = (): HTMLElement => {
  const loading = Div()
    .class('line')
    .part('line')
    .children(
      ...Array(3)
        .fill(1)
        .map(() => Div().class('line-item')),
    )
    .build();
  return loading;
};

export default { css, render } satisfies LoadingVariant;
