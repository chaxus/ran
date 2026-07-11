import { beforeEach, describe, expect, it } from 'vitest';
import type { ThemeSwitch } from '@/components/theme-switch';
import '@/components/theme-switch';

const create = (): ThemeSwitch => {
  const el = document.createElement('r-theme-switch') as ThemeSwitch;
  document.body.appendChild(el);
  return el;
};

const buttons = (el: ThemeSwitch): HTMLButtonElement[] => {
  const shadow = (el as any)._shadowDom as ShadowRoot;
  return [...shadow.querySelectorAll<HTMLButtonElement>('button')];
};

describe('r-theme-switch contract', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
    document.documentElement.removeAttribute('data-ran-theme');
    document.documentElement.removeAttribute('theme');
  });

  it('does not throw on createElement', () => {
    expect(() => document.createElement('r-theme-switch')).not.toThrow();
  });

  it('renders three choices (system / light / dark) with aria-pressed state', () => {
    const el = create();
    const choices = buttons(el).map((b) => b.dataset.choice);
    expect(choices).toEqual(['system', 'light', 'dark']);
    // nothing forced → system is pressed
    expect(buttons(el).map((b) => b.getAttribute('aria-pressed'))).toEqual(['true', 'false', 'false']);
  });

  it('clicking dark forces the theme, persists, and reflects state', () => {
    const el = create();
    const dark = buttons(el).find((b) => b.dataset.choice === 'dark')!;
    dark.click();
    expect(document.documentElement.getAttribute('data-ran-theme')).toBe('dark');
    expect(document.documentElement.getAttribute('theme')).toBe('dark');
    expect(localStorage.getItem('ran-theme')).toBe('dark');
    expect(dark.getAttribute('aria-pressed')).toBe('true');
    expect(el.value).toBe('dark');
  });

  it('emits a composed change event with the chosen theme', () => {
    const el = create();
    const events: CustomEvent[] = [];
    el.addEventListener('change', (e) => events.push(e as CustomEvent));
    buttons(el)
      .find((b) => b.dataset.choice === 'light')!
      .click();
    expect(events.length).toBe(1);
    expect(events[0].detail).toEqual({ theme: 'light' });
  });

  it('keeps multiple instances on the page in sync', () => {
    const first = create();
    const second = create();
    buttons(first)
      .find((b) => b.dataset.choice === 'dark')!
      .click();
    const pressed = buttons(second).find((b) => b.getAttribute('aria-pressed') === 'true');
    expect(pressed?.dataset.choice).toBe('dark');
  });

  it('label-* attributes localize the aria-labels', () => {
    const el = document.createElement('r-theme-switch') as ThemeSwitch;
    el.setAttribute('label', '主题');
    el.setAttribute('label-system', '跟随系统');
    el.setAttribute('label-light', '浅色');
    el.setAttribute('label-dark', '深色');
    document.body.appendChild(el);
    const labels = buttons(el).map((b) => b.getAttribute('aria-label'));
    expect(labels).toEqual(['跟随系统', '浅色', '深色']);
    const group = ((el as any)._shadowDom as ShadowRoot).querySelector('.ran-theme-switch');
    expect(group?.getAttribute('aria-label')).toBe('主题');
  });

  it('value setter drives the selection programmatically', () => {
    const el = create();
    el.value = 'light';
    expect(document.documentElement.getAttribute('data-ran-theme')).toBe('light');
    expect(localStorage.getItem('ran-theme')).toBe('light');
  });
});
