import { noop } from '@/utils/noop';

/**
 * @description: Listen for every click on the document, in the capture phase so a handler
 * calling `stopPropagation` cannot hide it.
 *
 * Returns an **unsubscribe function**; without one the listener outlives whatever installed it.
 *
 * @param {Function} hooks receives the click event
 * @return {Function} unsubscribe
 */
export const handleClick = (hooks: (event: MouseEvent) => void = noop): (() => void) => {
  if (typeof document === 'undefined') return noop;
  const onClick = (event: Event): void => hooks(event as MouseEvent);
  document.addEventListener('click', onClick, true);
  return () => document.removeEventListener('click', onClick, true);
};
