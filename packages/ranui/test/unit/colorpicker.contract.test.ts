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

  it('parses rgba alpha into the transparency signal (0-100)', () => {
    const cp = document.createElement('r-colorpicker') as any;
    document.body.appendChild(cp);

    cp.updateColorValue('rgba(255, 0, 0, 0.5)');
    expect(cp.context.transparency.getter()).toBe(50);

    cp.updateColorValue('#00ff00');
    expect(cp.context.transparency.getter()).toBe(100);
  });

  it('currentValue emits hex when opaque and rgba when translucent', () => {
    const cp = document.createElement('r-colorpicker') as any;
    document.body.appendChild(cp);

    cp.updateColorValue('#ff0000');
    expect(cp.currentValue()).toBe('#ff0000');

    cp.updateColorValue('rgba(255, 0, 0, 0.5)');
    expect(cp.currentValue()).toBe('rgba(255, 0, 0, 0.5)');
  });

  it('emitChange dispatches a change event with hex/rgb/rgba detail', () => {
    const cp = document.createElement('r-colorpicker') as any;
    document.body.appendChild(cp);

    cp.updateColorValue('#ff0000');
    let detail: any;
    cp.addEventListener('change', (e: Event) => {
      detail = (e as CustomEvent).detail;
    });
    cp.emitChange();

    expect(detail).toBeDefined();
    expect(detail.hex).toBe('#ff0000');
    expect(detail.rgb).toBe('rgb(255, 0, 0)');
    expect(detail.alpha).toBe(1);
  });

  it('a11y: the swatch is a focusable button that opens the picker via keyboard', () => {
    const cp = document.createElement('r-colorpicker') as any;
    document.body.appendChild(cp);

    expect(cp.colorpicker.getAttribute('role')).toBe('button');
    expect(cp.colorpicker.getAttribute('tabindex')).toBe('0');
    expect(cp.colorpicker.getAttribute('aria-haspopup')).toBe('dialog');
    expect(cp.colorpicker.getAttribute('aria-label')).toBeTruthy();

    // Enter opens the panel (builds it lazily).
    cp.onSwatchKeydown({ key: 'Enter', preventDefault() {} });
    expect(cp.colorPickerInner).toBeTruthy();
  });

  it('a11y: hue/alpha are role=slider with bounds and are keyboard-adjustable', () => {
    const cp = document.createElement('r-colorpicker') as any;
    document.body.appendChild(cp);
    cp.openColorPicker();

    const hue = cp.colorPickerHueSlider as HTMLElement;
    const alpha = cp.colorPickerAlphaSlider as HTMLElement;
    expect(hue.getAttribute('role')).toBe('slider');
    expect(hue.getAttribute('tabindex')).toBe('0');
    expect(hue.getAttribute('aria-valuemin')).toBe('0');
    expect(hue.getAttribute('aria-valuemax')).toBe('360');
    expect(alpha.getAttribute('aria-valuemax')).toBe('100');

    // Arrow keys adjust the underlying value.
    cp.context.hue.setter(10);
    cp.sliderKeydown('hue')({ key: 'ArrowRight', shiftKey: false, preventDefault() {} });
    expect(cp.context.hue.getter()).toBe(11);
    cp.sliderKeydown('hue')({ key: 'Home', preventDefault() {} });
    expect(cp.context.hue.getter()).toBe(0);
    cp.sliderKeydown('hue')({ key: 'End', preventDefault() {} });
    expect(cp.context.hue.getter()).toBe(360);

    cp.context.transparency.setter(50);
    cp.sliderKeydown('alpha')({ key: 'ArrowLeft', shiftKey: false, preventDefault() {} });
    expect(cp.context.transparency.getter()).toBe(49);
  });
});
