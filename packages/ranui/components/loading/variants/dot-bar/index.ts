import css from './index.less?inline';
import { Div } from '@/utils/builder';
import type { LoadingVariant } from '../../types';

const render = (): HTMLElement => {
  const loading = Div()
    .class('dot-bar')
    .part('dot-bar')
    .children(
      ...Array(5)
        .fill(1)
        .map((_, index) => Div().class(`dot-bar-item dot-bar-item-${index + 1}`)),
    )
    .build();
  return loading;
};

export default { css, render } satisfies LoadingVariant;
