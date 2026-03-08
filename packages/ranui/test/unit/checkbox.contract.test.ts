import { describe, expect, it, beforeEach } from 'vitest';
import '@/components/checkbox';

describe('r-checkbox contract', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders checkbox wrapper and inner input correctly via ElementBuilder', () => {
    const checkbox = document.createElement('r-checkbox');
    document.body.appendChild(checkbox);

    const shadow = (checkbox as any)._shadowDom as ShadowRoot;
    expect(shadow).toBeTruthy();

    const wrapper = shadow.querySelector('.ran-checkbox') as HTMLElement;
    expect(wrapper).toBeTruthy();
    expect(wrapper.getAttribute('part')).toBe('ran-checkbox');

    const innerInput = shadow.querySelector('.ran-checkbox-input') as HTMLInputElement;
    expect(innerInput).toBeTruthy();
    expect(innerInput.getAttribute('part')).toBe('ran-checkbox-input');
    expect(innerInput.getAttribute('type')).toBe('checkbox');

    const innerSpan = shadow.querySelector('.ran-checkbox-inner') as HTMLSpanElement;
    expect(innerSpan).toBeTruthy();
    expect(innerSpan.getAttribute('part')).toBe('ran-checkbox-inner');
  });

  it('reflects checked property properly', () => {
    const checkbox = document.createElement('r-checkbox');
    document.body.appendChild(checkbox);

    checkbox.setAttribute('checked', 'true');
    expect((checkbox as any).checked).toBe('true');
    expect((checkbox as any).value).toBe('true');

    const wrapper = (checkbox as any)._shadowDom.querySelector('.ran-checkbox') as HTMLElement;
    expect(wrapper.classList.contains('ran-checkbox-checked')).toBe(true);

    checkbox.setAttribute('checked', 'false');
    expect((checkbox as any).checked).toBe('false');
    expect((checkbox as any).value).toBe('false');
    expect(wrapper.classList.contains('ran-checkbox-checked')).toBe(false);
  });
});
