import css from './index.less?inline';
import { Div } from '@/utils/builder';
import type { LoadingVariant } from '../../types';

const render = (): HTMLElement => {
  const loading = Div()
    .class('dot-line')
    .part('dot-line')
    .children(
      ...Array(2)
        .fill(1)
        .map(() => Div().class('dot-line-item').children(Div().class('dot-line-item-circle'))),
    )
    .build();
  return loading;
};

export default { css, render } satisfies LoadingVariant;
