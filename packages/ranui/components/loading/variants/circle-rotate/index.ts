import css from './index.less?inline';
import { Div } from '@/utils/builder';
import type { LoadingVariant } from '../../types';

const render = (): HTMLElement => {
  const loading = Div()
    .class('circle-rotate')
    .part('circle-rotate')
    .children(Div().class('circle-rotate-outer'), Div().class('circle-rotate-inner'))
    .build();
  return loading;
};

export default { css, render } satisfies LoadingVariant;
