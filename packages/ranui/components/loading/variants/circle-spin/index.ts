import css from './index.less?inline';
import { Div } from '@/utils/builder';
import type { LoadingVariant } from '../../types';

const render = (): HTMLElement => {
  const loading = Div()
    .class('circle-spin')
    .part('circle-spin')
    .children(Div().class('circle-spin-outer'), Div().class('circle-spin-inner'))
    .build();
  return loading;
};

export default { css, render } satisfies LoadingVariant;
