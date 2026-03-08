import { beforeEach, describe, expect, it } from 'vitest';
import { Dropdown } from '@/components/dropdown/index';
import '@/components/dropdown/index';

describe('r-dropdown contract', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('creates, updates and removes arrow element from arrow attribute', () => {
    const dropdown = document.createElement('r-dropdown') as Dropdown;
    document.body.appendChild(dropdown);

    // @ts-ignore
    const shadow = dropdown._shadowDom as ShadowRoot;

    dropdown.arrow = 'top';
    let arrow = shadow.querySelector('.ranui-dropdown-arrow') as HTMLElement;
    expect(arrow).toBeTruthy();
    expect(arrow.classList.contains('top')).toBe(true);

    dropdown.arrow = 'left';
    arrow = shadow.querySelector('.ranui-dropdown-arrow') as HTMLElement;
    expect(arrow.classList.contains('left')).toBe(true);

    dropdown.arrow = '';
    arrow = shadow.querySelector('.ranui-dropdown-arrow') as HTMLElement;
    expect(arrow).toBeFalsy();
  });
});
