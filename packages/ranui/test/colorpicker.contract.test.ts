import { describe, expect, it, beforeEach } from 'vitest';
import type { ColorPicker } from '../components/colorpicker/index';
// Ensure custom elements are defined
import '../components/colorpicker/index';

describe('r-colorpicker contract', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('reflects value property to attributes', () => {
    const cp = document.createElement('r-colorpicker') as unknown as ColorPicker;
    document.body.appendChild(cp);

    cp.value = '#ff0000';
    expect(cp.getAttribute('value')).toBe('#ff0000');

    cp.value = 'rgb(0, 255, 0)';
    expect(cp.getAttribute('value')).toBe('rgb(0, 255, 0)');
  });

  it('renders internal color block', () => {
    const cp = document.createElement('r-colorpicker') as any;
    document.body.appendChild(cp);

    const shadow = cp._shadowDom as ShadowRoot;
    expect(shadow.querySelector('.ran-colorpicker-block')).not.toBeNull();
    expect(shadow.querySelector('r-popover')).not.toBeNull();
  });
});
