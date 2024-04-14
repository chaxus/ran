import { isClient } from '@/utils/device';

export const localStorageSetItem = (name: string, value: string): void => {
  if (!isClient) return;
  localStorage.setItem(name, value);
};

export const localStorageGetItem = (name: string): string => {
  if (!isClient) return '';
  return localStorage.getItem(name) || '';
};
