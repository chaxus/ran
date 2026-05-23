import { describe, expect, it, beforeEach } from 'vitest';
import type { ColorPicker } from '@/components/colorpicker/index';
// Ensure custom elements are defined
import '@/components/colorpicker/index';

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

  it('sheet property reflects to attribute', () => {
    const cp = document.createElement('r-colorpicker') as unknown as ColorPicker;
    document.body.appendChild(cp);

    cp.sheet = '.ran-colorpicker-block { border: 2px solid blue; }';
    expect(cp.getAttribute('sheet')).toBe('.ran-colorpicker-block { border: 2px solid blue; }');
  });

  it('context is initialized with all signals after construction', () => {
    const cp = document.createElement('r-colorpicker') as any;
    document.body.appendChild(cp);

    expect(cp.context).toBeDefined();
    expect(typeof cp.context.hue.getter).toBe('function');
    expect(typeof cp.context.saturation.getter).toBe('function');
    expect(typeof cp.context.lightness.getter).toBe('function');
    expect(typeof cp.context.transparency.getter).toBe('function');
    expect(typeof cp.context.value.getter).toBe('function');
    expect(typeof cp.context.disabled.getter).toBe('function');
  });

  it('colorPickerPaletteSelect initializes to false', () => {
    const cp = document.createElement('r-colorpicker') as any;
    document.body.appendChild(cp);
    expect(cp.colorPickerPaletteSelect).toBe(false);
  });

  it('has r-content element inside shadow DOM', () => {
    const cp = document.createElement('r-colorpicker') as any;
    document.body.appendChild(cp);
    expect(cp._shadowDom.querySelector('r-content')).not.toBeNull();
  });

  it('updateColorValue accepts hex color string without throwing', () => {
    const cp = document.createElement('r-colorpicker') as any;
    document.body.appendChild(cp);
    expect(() => cp.updateColorValue('#aabbcc')).not.toThrow();
  });

  it('updateColorValue accepts rgb color string without throwing', () => {
    const cp = document.createElement('r-colorpicker') as any;
    document.body.appendChild(cp);
    expect(() => cp.updateColorValue('rgb(100, 200, 50)')).not.toThrow();
  });

  it('updateColorValue accepts rgba color string without throwing', () => {
    const cp = document.createElement('r-colorpicker') as any;
    document.body.appendChild(cp);
    expect(() => cp.updateColorValue('rgba(100, 200, 50, 0.5)')).not.toThrow();
  });
});
