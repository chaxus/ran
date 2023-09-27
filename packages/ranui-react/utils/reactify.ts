import type {
  AriaAttributes,
  ForwardRefExoticComponent,
  HTMLAttributes,
} from 'react';
import { createElement, forwardRef } from 'react';

const reactifyWebComponent = <T = AriaAttributes>(
  wc: string,
): ForwardRefExoticComponent<HTMLAttributes<T>> =>
  forwardRef((props, ref) => {
    const { className, ...rest } = props;
    return createElement(wc, { class: className, ...rest, ref });
  });

export default reactifyWebComponent;
