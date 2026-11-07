import { beforeEach, describe, expect, it } from 'vitest';
import type { ThemeSwitch } from '@/components/theme-switch';
import '@/components/theme-switch';

const create = (): ThemeSwitch => {
  const el = document.createElement('r-theme-switch') as ThemeSwitch;
  document.body.appendChild(el);
  return el;
};

const selectEl = (el: ThemeSwitch): HTMLElement & { value: string } => (el as any)._select;

const optionValues = (el: ThemeSwitch): string[] =>
  [...((el as any)._shadowDom as ShadowRoot).querySelectorAll('r-option')].map(
    (opt) => (opt as HTMLElement).getAttribute('value') || '',
  );

describe('r-theme-switch contract', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
    document.documentElement.removeAttribute('data-ran-theme');
    document.documentElement.removeAttribute('theme');
    document.documentElement.removeAttribute('data-ran-surface');
  });

  it('does not throw on createElement', () => {
    expect(() => document.createElement('r-theme-switch')).not.toThrow();
  });

  it('renders select options system / light / dark only', () => {
    const el = create();
    expect(optionValues(el)).toEqual(['system', 'light', 'dark']);
    expect(el.value).toBe('system');
    expect(selectEl(el).value).toBe('system');
  });

  it('picking dark forces the theme and persists', () => {
    const el = create();
    el.value = 'dark';
    expect(document.documentElement.getAttribute('data-ran-theme')).toBe('dark');
    expect(document.documentElement.getAttribute('theme')).toBe('dark');
    expect(localStorage.getItem('ran-theme')).toBe('dark');
    expect(el.value).toBe('dark');
  });

  it('does not change the surface axis', () => {
    const el = create();
    document.documentElement.setAttribute('data-ran-surface', 'glass');
    el.value = 'light';
    expect(document.documentElement.getAttribute('data-ran-surface')).toBe('glass');
    expect(el.value).toBe('light');
  });

  it('emits a composed change event with the chosen theme', () => {
    const el = create();
    const events: CustomEvent[] = [];
    el.addEventListener('change', (e) => events.push(e as CustomEvent));
    el.value = 'light';
    expect(events.length).toBe(1);
    expect(events[0].detail).toEqual({ theme: 'light' });
  });

  it('keeps multiple instances on the page in sync', () => {
    const first = create();
    const second = create();
    first.value = 'dark';
    expect(second.value).toBe('dark');
  });

  it('label-* attributes localize option text', () => {
    const el = document.createElement('r-theme-switch') as ThemeSwitch;
    el.setAttribute('label', '主题');
    el.setAttribute('label-system', '跟随系统');
    el.setAttribute('label-light', '浅色');
    el.setAttribute('label-dark', '深色');
    document.body.appendChild(el);
    const labels = [...((el as any)._shadowDom as ShadowRoot).querySelectorAll('r-option')].map(
      (opt) => opt.textContent,
    );
    expect(labels).toEqual(['跟随系统', '浅色', '深色']);
    expect(selectEl(el).getAttribute('aria-label')).toBe('主题');
  });

  it('value setter drives the selection programmatically', () => {
    const el = create();
    el.value = 'light';
    expect(document.documentElement.getAttribute('data-ran-theme')).toBe('light');
    expect(localStorage.getItem('ran-theme')).toBe('light');
  });
});
