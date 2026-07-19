import css from './index.less?inline';
import { Div } from '@/utils/builder';
import type { LoadingVariant } from '../../types';

const render = (): HTMLElement => {
  const solar = Div()
    .class('solar')
    .part('solar')
    .children(
      Div()
        .class('earth-orbit orbit')
        .children(
          Div().class('planet earth'),
          Div()
            .class('venus-orbit orbit')
            .children(
              Div().class('planet venus'),
              Div()
                .class('mercury-orbit orbit')
                .children(Div().class('planet mercury'), Div().class('sun').part('sun')),
            ),
        ),
    )
    .build();
  return solar;
};

export default { css, render } satisfies LoadingVariant;
