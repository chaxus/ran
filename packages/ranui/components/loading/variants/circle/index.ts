import css from './index.less?inline';
import { Div } from '@/utils/builder';
import type { LoadingVariant } from '../../types';

const render = (): HTMLElement => {
    const loading = Div().class('circle').part('circle').build();
    Array(3)
      .fill(1)
      .map(() => Array(4).fill(1))
      .forEach((i, index) => {
        const container = Div()
          .class(`circle-container container${index + 1}`)
          .children(...i.map((_, j) => Div().class(`circle${j + 1}`)))
          .build();
        loading.appendChild(container);
      });
    return loading;
};

export default { css, render } satisfies LoadingVariant;
