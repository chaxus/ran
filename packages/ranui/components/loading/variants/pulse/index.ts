import css from './index.less?inline';
import { Div } from '@/utils/builder';
import type { LoadingVariant } from '../../types';

const render = (): HTMLElement => {
  const pulse = Div()
    .class('pulse')
    .part('pulse')
    .children(
      ...Array(3)
        .fill(1)
        .map((_, index) => Div().class(`pulse-bubble pulse-bubble-${index + 1}`)),
    )
    .build();
  return pulse;
};

export default { css, render } satisfies LoadingVariant;
