import css from './index.less?inline';
import { Div } from '@/utils/builder';
import type { LoadingVariant } from '../../types';

const render = (): HTMLElement => {
    const loading = Div().class('circle-turn').part('circle-turn').build();
    return loading;
};

export default { css, render } satisfies LoadingVariant;
