import { describe, expect, it, beforeEach } from 'vitest';
import '@/components/input';

describe('r-input contract', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders input wrapper and inner input correctly via ElementBuilder', () => {
    const input = document.createElement('r-input');
    document.body.appendChild(input);

    const shadow = (input as any)._shadowDom as ShadowRoot;
    expect(shadow).toBeTruthy();

    const wrapper = shadow.querySelector('.ran-input') as HTMLElement;
    expect(wrapper).toBeTruthy();
    expect(wrapper.getAttribute('part')).toBe('ran-input');

    const innerInput = shadow.querySelector('.ran-input-content') as HTMLInputElement;
    expect(innerInput).toBeTruthy();
    expect(innerInput.getAttribute('part')).toBe('ran-input-content');
  });

  it('reflects value property to inner input', () => {
    const input = document.createElement('r-input');
    document.body.appendChild(input);

    const innerInput = (input as any)._shadowDom.querySelector('.ran-input-content') as HTMLInputElement;
    input.setAttribute('value', 'hello world');

    expect((input as any).value).toBe('hello world');
    expect(innerInput.value).toBe('hello world');
  });

  it('generates label dynamically when label attribute is set', () => {
    const input = document.createElement('r-input');
    document.body.appendChild(input);

    input.setAttribute('label', 'Username');

    const wrapper = (input as any)._shadowDom.querySelector('.ran-input') as HTMLElement;
    const labelEl = wrapper.querySelector('.ran-input-label') as HTMLLabelElement;

    expect(labelEl).toBeTruthy();
    expect(labelEl.innerHTML).toBe('Username');
    expect(labelEl.getAttribute('part')).toBe('ran-input-label');
  });
});
