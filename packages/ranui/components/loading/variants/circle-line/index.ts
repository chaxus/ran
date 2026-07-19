import css from './index.less?inline';
import { Div } from '@/utils/builder';
import type { LoadingVariant } from '../../types';

const render = (): HTMLElement => {
    const loading = Div()
      .class('circle-line')
      .part('circle-line')
      .children(Div().class('circle-line-border').children(Div().class('circle-line-core')))
      .build();
    return loading;
};

export default { css, render } satisfies LoadingVariant;
