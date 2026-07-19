import css from './index.less?inline';
import { Div } from '@/utils/builder';
import type { LoadingVariant } from '../../types';

const render = (): HTMLElement => {
  const loading = Div()
    .class('pacman')
    .part('pacman')
    .children(
      ...Array(5)
        .fill(1)
        .map(() => Div()),
    )
    .build();
  return loading;
};

export default { css, render } satisfies LoadingVariant;
