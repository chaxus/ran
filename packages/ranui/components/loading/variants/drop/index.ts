import css from './index.less?inline';
import { Div } from '@/utils/builder';
import type { LoadingVariant } from '../../types';

const render = (): HTMLElement =>
  Div()
    .class('drop')
    .part('drop')
    .children(
      Div()
        .class('drop-visual')
        .children(
          Div()
            .class('drop-item')
            .children(Div().class('drop-dot').children(Div().class('drop-dot-1'), Div().class('drop-dot-2'))),
          Div().class('drop-dot').children(Div().class('drop-dot-1'), Div().class('drop-dot-2')),
        ),
    )
    .build();

export default { css, render } satisfies LoadingVariant;
