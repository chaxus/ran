import { beforeEach, describe, expect, it } from 'vitest';
import type { SurfaceSwitch } from '@/components/surface-switch';
import '@/components/surface-switch';

const create = (): SurfaceSwitch => {
  const el = document.createElement('r-surface-switch') as SurfaceSwitch;
  document.body.appendChild(el);
  return el;
};

const selectEl = (el: SurfaceSwitch): HTMLElement & { value: string } => (el as any)._select;

const optionValues = (el: SurfaceSwitch): string[] =>
  [...((el as any)._shadowDom as ShadowRoot).querySelectorAll('r-option')].map(
    (opt) => (opt as HTMLElement).getAttribute('value') || '',
  );

describe('r-surface-switch contract', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
    document.documentElement.removeAttribute('data-ran-surface');
    document.documentElement.removeAttribute('data-ran-theme');
  });

  it('does not throw on createElement', () => {
    expect(() => document.createElement('r-surface-switch')).not.toThrow();
  });

  it('renders select options solid / glass with solid by default', () => {
    const el = create();
    expect(optionValues(el)).toEqual(['solid', 'glass']);
    expect(el.value).toBe('solid');
    expect(selectEl(el).value).toBe('solid');
  });

  it('picking glass applies, persists, and reflects', () => {
    const el = create();
    el.value = 'glass';
    expect(document.documentElement.getAttribute('data-ran-surface')).toBe('glass');
    expect(localStorage.getItem('ran-surface')).toBe('glass');
    expect(el.value).toBe('glass');
  });

  it('does not change the color theme', () => {
    const el = create();
    document.documentElement.setAttribute('data-ran-theme', 'dark');
    el.value = 'glass';
    expect(document.documentElement.getAttribute('data-ran-theme')).toBe('dark');
  });

  it('emits a composed change event with the chosen surface', () => {
    const el = create();
    const events: CustomEvent[] = [];
    el.addEventListener('change', (e) => events.push(e as CustomEvent));
    el.value = 'glass';
    expect(events).toHaveLength(1);
    expect(events[0]!.detail).toEqual({ surface: 'glass' });
  });

  it('keeps multiple instances in sync', () => {
    const first = create();
    const second = create();
    first.value = 'glass';
    expect(second.value).toBe('glass');
  });

  it('label-* attributes localize option text', () => {
    const el = document.createElement('r-surface-switch') as SurfaceSwitch;
    el.setAttribute('label', '风格');
    el.setAttribute('label-solid', '石墨');
    el.setAttribute('label-glass', '液态玻璃');
    document.body.appendChild(el);
    const labels = [...((el as any)._shadowDom as ShadowRoot).querySelectorAll('r-option')].map(
      (opt) => opt.textContent,
    );
    expect(labels).toEqual(['石墨', '液态玻璃']);
    expect(selectEl(el).getAttribute('aria-label')).toBe('风格');
  });
});
