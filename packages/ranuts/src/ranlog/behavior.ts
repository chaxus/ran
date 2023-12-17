import { noop } from '@/utils';

export const handleClick = (hooks: (event: MouseEvent) => void = noop): void => {
  if (typeof document !== 'undefined') {
    document.addEventListener(
      'click',
      function (event) {
        hooks(event);
      },
      true,
    );
  }
};
