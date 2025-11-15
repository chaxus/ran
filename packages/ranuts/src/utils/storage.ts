import { isClient } from '@/utils/device';

export const localStorageSetItem = (name: string, value: string): void => {
  if (!isClient) return;
  // eslint-disable-next-line n/no-unsupported-features/node-builtins
  localStorage.setItem(name, value);
};

export const localStorageGetItem = (name: string): string => {
  if (!isClient) return '';
  // eslint-disable-next-line n/no-unsupported-features/node-builtins
  return localStorage.getItem(name) || '';
};
