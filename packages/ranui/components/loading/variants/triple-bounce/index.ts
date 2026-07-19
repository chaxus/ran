import css from './index.less?inline';
import { Div } from '@/utils/builder';
import type { LoadingVariant } from '../../types';

const render = (): HTMLElement => {
  const loading = Div()
    .class('triple-bounce')
    .part('triple-bounce')
    .children(
      ...Array(3)
        .fill(1)
        .map((_, i) => Div().class(`triple-bounce${i + 1}`)),
    )
    .build();
  return loading;
};

export default { css, render } satisfies LoadingVariant;
