import type { DocumentFragmentMock, HTMLElementMock } from './mocks';

export type MockNode = HTMLElementMock | DocumentFragmentMock | string;

export const matchSelector = (node: HTMLElementMock, selector: string): boolean => {
  const trimmed = selector.trim();
  if (!trimmed) return false;

  if (trimmed.startsWith('.')) {
    return node.classList.contains(trimmed.slice(1));
  }
  if (trimmed.startsWith('#')) {
    return node.getAttribute('id') === trimmed.slice(1);
  }
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    const content = trimmed.slice(1, -1).trim();
    const [rawKey, rawValue] = content.split('=');
    const key = (rawKey || '').trim();
    if (!key) return false;
    if (rawValue == null) return node.hasAttribute(key);
    const value = rawValue.trim().replace(/^['\"]|['\"]$/g, '');
    return node.getAttribute(key) === value;
  }
  return node.tagName === trimmed.toLowerCase();
};

export const collectMatches = (nodes: MockNode[], selector: string, result: HTMLElementMock[]): void => {
  for (const child of nodes) {
    if (!(child instanceof HTMLElementMock)) continue;
    if (matchSelector(child, selector)) {
      result.push(child);
    }
    collectMatches(child.childrenList as MockNode[], selector, result);
  }
};
