import css from './index.less?inline';
import { Div } from '@/utils/builder';
import type { LoadingVariant } from '../../types';

const render = (): HTMLElement => {
  const loading = Div()
    .class('dot-pulse')
    .part('dot-pulse')
    .children(
      ...Array(5)
        .fill(1)
        .map((_, index) =>
          Div()
            .class('dot-pulse-item')
            .children(
              Div().class(`dot-pulse-item-dot dot-pulse-item-dot-${index + 1}`),
              Div().class(`dot-pulse-item-ball dot-pulse-item-ball-${index + 1}`),
            ),
        ),
    )
    .build();
  return loading;
};

export default { css, render } satisfies LoadingVariant;
