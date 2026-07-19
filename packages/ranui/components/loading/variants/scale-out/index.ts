import css from './index.less?inline';
import { Div } from '@/utils/builder';
import type { LoadingVariant } from '../../types';

const render = (): HTMLElement => {
  const loading = Div().class('scale-out').part('scale-out').build();
  return loading;
};

export default { css, render } satisfies LoadingVariant;
