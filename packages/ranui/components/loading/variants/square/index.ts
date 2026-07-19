import css from './index.less?inline';
import { Div } from '@/utils/builder';
import type { LoadingVariant } from '../../types';

const render = (): HTMLElement => {
  const loading = Div()
    .class('square')
    .part('square')
    .children(
      Div().class('square-box1').children(Div().class('square-core')),
      Div().class('square-box2').children(Div().class('square-core')),
    )
    .build();
  return loading;
};

export default { css, render } satisfies LoadingVariant;
