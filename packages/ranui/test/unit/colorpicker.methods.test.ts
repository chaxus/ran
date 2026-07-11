import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { ColorPicker } from '@/components/colorpicker/index';
import '@/components/colorpicker/index';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function createCp(): ColorPicker & Record<string, any> {
  const cp = document.createElement('r-colorpicker') as any;
  document.body.appendChild(cp);
  return cp;
}

/** Create the picker and build its panel (panel elements exist only after open). */
function openPicker(): ColorPicker & Record<string, any> {
  const cp = createCp();
  cp.openColorPicker();
  return cp;
}

/** Mock getBoundingClientRect via direct assignment (works in jsdom). */
function mockBCR(
  el: HTMLElement,
  {
    top = 100,
    left = 50,
    width = 200,
    height = 160,
  }: { top?: number; left?: number; width?: number; height?: number } = {},
): void {
  (el as any).getBoundingClientRect = (): DOMRect =>
    ({
      top,
      left,
      width,
      height,
      right: left + width,
      bottom: top + height,
      x: left,
      y: top,
      toJSON: () => ({}),
    }) as DOMRect;
}

function mouse(type: string, clientX: number, clientY = 0): MouseEvent {
  return new MouseEvent(type, { clientX, clientY });
}

// ---------------------------------------------------------------------------
// Setup / teardown
// ---------------------------------------------------------------------------

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// Color helpers — currentRgba / currentValue / currentDisplay
// ---------------------------------------------------------------------------

describe('currentRgba', () => {
  it('returns white and full alpha for the default context (h0 s0 v100 t100)', () => {
    const cp = createCp();
    expect(cp.currentRgba()).toEqual({ r: 255, g: 255, b: 255, a: 1 });
  });

  it('reflects context changes', () => {
    const cp = createCp();
    cp.context.hue.setter(120);
    cp.context.saturation.setter(100);
    cp.context.lightness.setter(100);
    cp.context.transparency.setter(50);
    const { r, g, b, a } = cp.currentRgba();
    expect({ r, g, b }).toEqual({ r: 0, g: 255, b: 0 });
    expect(a).toBeCloseTo(0.5);
  });
});

describe('currentValue', () => {
  it('returns hex when fully opaque', () => {
    const cp = createCp();
    cp.context.hue.setter(0);
    cp.context.saturation.setter(100);
    cp.context.lightness.setter(100);
    expect(cp.currentValue()).toBe('#ff0000');
  });

  it('returns rgba() when alpha < 1', () => {
    const cp = createCp();
    cp.context.hue.setter(0);
    cp.context.saturation.setter(100);
    cp.context.lightness.setter(100);
    cp.context.transparency.setter(50);
    expect(cp.currentValue()).toBe('rgba(255, 0, 0, 0.5)');
  });
});

describe('currentDisplay', () => {
  it('HEX format shows the 6-digit color regardless of alpha', () => {
    const cp = createCp();
    cp.context.transparency.setter(40);
    expect(cp.currentDisplay()).toBe('#ffffff');
  });

  it('RGB format shows rgb() when opaque and rgba() when translucent', () => {
    const cp = createCp();
    cp._format = 'RGB';
    expect(cp.currentDisplay()).toBe('rgb(255, 255, 255)');
    cp.context.transparency.setter(40);
    expect(cp.currentDisplay()).toBe('rgba(255, 255, 255, 0.4)');
  });
});

// ---------------------------------------------------------------------------
// updateColorValue
// ---------------------------------------------------------------------------

describe('updateColorValue', () => {
  it('does nothing when value matches current context value', () => {
    const cp = createCp();
    cp.updateColorValue('#ff0000');
    const hue = cp.context.hue.getter();
    cp.updateColorValue('#ff0000');
    expect(cp.context.hue.getter()).toBe(hue);
  });

  it('ignores invalid / unrecognized color strings', () => {
    const cp = createCp();
    expect(() => cp.updateColorValue('not-a-color')).not.toThrow();
    expect(cp.getAttribute('value')).toBeNull();
  });

  it('hex updates hue/sat/lightness and fixes transparency to 100', () => {
    const cp = createCp();
    cp.updateColorValue('#ff0000');
    expect(cp.context.hue.getter()).toBe(0);
    expect(cp.context.saturation.getter()).toBe(100);
    expect(cp.context.lightness.getter()).toBe(100);
    expect(cp.context.transparency.getter()).toBe(100);
  });

  it('rgb(r,g,b) sets transparency to 100', () => {
    const cp = createCp();
    cp.updateColorValue('rgb(0,255,0)');
    expect(cp.context.hue.getter()).toBe(120);
    expect(cp.context.transparency.getter()).toBe(100);
  });

  it('rgba(r,g,b,a) sets transparency from the alpha channel (0–100 scale)', () => {
    const cp = createCp();
    cp.updateColorValue('rgba(0,0,255,0.5)');
    expect(cp.context.hue.getter()).toBe(240);
    expect(cp.context.transparency.getter()).toBe(50);
  });

  it('sets the value attribute on the element', () => {
    const cp = createCp();
    cp.updateColorValue('#aabbcc');
    expect(cp.getAttribute('value')).toBe('#aabbcc');
  });
});

// ---------------------------------------------------------------------------
// emitChange
// ---------------------------------------------------------------------------

describe('emitChange', () => {
  it('dispatches a composed, bubbling change event with the full detail shape', () => {
    const cp = createCp();
    cp.context.hue.setter(0);
    cp.context.saturation.setter(100);
    cp.context.lightness.setter(100);
    const seen: CustomEvent[] = [];
    cp.addEventListener('change', (e: Event) => seen.push(e as CustomEvent));
    cp.emitChange();
    expect(seen).toHaveLength(1);
    expect(seen[0].detail).toEqual({
      value: '#ff0000',
      hex: '#ff0000',
      rgb: 'rgb(255, 0, 0)',
      rgba: 'rgba(255, 0, 0, 1)',
      alpha: 1,
    });
    expect(seen[0].bubbles).toBe(true);
    expect(seen[0].composed).toBe(true);
  });

  it('uses rgba() as the value when translucent and syncs the value attribute', () => {
    const cp = createCp();
    cp.context.hue.setter(0);
    cp.context.saturation.setter(100);
    cp.context.lightness.setter(100);
    cp.context.transparency.setter(25);
    cp.emitChange();
    expect(cp.getAttribute('value')).toBe('rgba(255, 0, 0, 0.25)');
    expect(cp.context.value.getter()).toBe('rgba(255, 0, 0, 0.25)');
  });
});

// ---------------------------------------------------------------------------
// Palette pointer interaction
// ---------------------------------------------------------------------------

describe('palettePointerDown', () => {
  it('starts palette selection and applies the event position', () => {
    const cp = openPicker();
    mockBCR(cp.colorPickerPalette!);
    const e = mouse('mousedown', 150, 180); // center of 200×160 at (50,100)
    vi.spyOn(e, 'preventDefault');
    cp.palettePointerDown(e);
    expect(e.preventDefault).toHaveBeenCalled();
    expect(cp.colorPickerPaletteSelect).toBe(true);
    expect(cp.context.saturation.getter()).toBe(50);
    expect(cp.context.lightness.getter()).toBe(50);
  });
});

describe('updatePaletteFromEvent', () => {
  it('maps x → saturation and y → inverted lightness', () => {
    const cp = openPicker();
    mockBCR(cp.colorPickerPalette!);
    cp.updatePaletteFromEvent(mouse('mousemove', 50 + 200, 100)); // right edge, top
    expect(cp.context.saturation.getter()).toBe(100);
    expect(cp.context.lightness.getter()).toBe(100);
  });

  it('clamps positions outside the palette box', () => {
    const cp = openPicker();
    mockBCR(cp.colorPickerPalette!);
    cp.updatePaletteFromEvent(mouse('mousemove', 0, 10_000));
    expect(cp.context.saturation.getter()).toBe(0);
    expect(cp.context.lightness.getter()).toBe(0);
  });

  it('emits a change event for every update', () => {
    const cp = openPicker();
    mockBCR(cp.colorPickerPalette!);
    const onChange = vi.fn();
    cp.addEventListener('change', onChange);
    cp.updatePaletteFromEvent(mouse('mousemove', 150, 180));
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('does nothing when the palette has zero size (jsdom default)', () => {
    const cp = openPicker();
    const before = cp.context.saturation.getter();
    cp.updatePaletteFromEvent(mouse('mousemove', 150, 180));
    expect(cp.context.saturation.getter()).toBe(before);
  });
});

// ---------------------------------------------------------------------------
// Slider pointer interaction
// ---------------------------------------------------------------------------

describe('sliderPointerDown / updateSliderFromEvent', () => {
  it('hue: maps the x position to 0–360', () => {
    const cp = openPicker();
    mockBCR(cp.colorPickerHueSlider!, { left: 0, width: 200, top: 0, height: 12 });
    cp.sliderPointerDown('hue')(mouse('mousedown', 100));
    expect(cp._activeSlider).toBe('hue');
    expect(cp.context.hue.getter()).toBe(180);
  });

  it('alpha: maps the x position to 0–100 transparency', () => {
    const cp = openPicker();
    mockBCR(cp.colorPickerAlphaSlider!, { left: 0, width: 200, top: 0, height: 12 });
    cp.sliderPointerDown('alpha')(mouse('mousedown', 50));
    expect(cp._activeSlider).toBe('alpha');
    expect(cp.context.transparency.getter()).toBe(25);
  });

  it('clamps beyond both ends', () => {
    const cp = openPicker();
    mockBCR(cp.colorPickerHueSlider!, { left: 0, width: 200, top: 0, height: 12 });
    cp.updateSliderFromEvent('hue', mouse('mousemove', -50));
    expect(cp.context.hue.getter()).toBe(0);
    cp.updateSliderFromEvent('hue', mouse('mousemove', 999));
    expect(cp.context.hue.getter()).toBe(360);
  });
});

// ---------------------------------------------------------------------------
// Document-level pointer routing
// ---------------------------------------------------------------------------

describe('onPointerMove', () => {
  it('routes to the palette while palette selection is active', () => {
    const cp = openPicker();
    cp.colorPickerPaletteSelect = true;
    const spy = vi.spyOn(cp, 'updatePaletteFromEvent');
    cp.onPointerMove(mouse('mousemove', 10, 10));
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('routes to the active slider otherwise', () => {
    const cp = openPicker();
    cp._activeSlider = 'alpha';
    const spy = vi.spyOn(cp, 'updateSliderFromEvent');
    cp.onPointerMove(mouse('mousemove', 10, 10));
    expect(spy).toHaveBeenCalledWith('alpha', expect.any(MouseEvent));
  });

  it('does nothing when no interaction is active', () => {
    const cp = openPicker();
    const palette = vi.spyOn(cp, 'updatePaletteFromEvent');
    const slider = vi.spyOn(cp, 'updateSliderFromEvent');
    cp.onPointerMove(mouse('mousemove', 10, 10));
    expect(palette).not.toHaveBeenCalled();
    expect(slider).not.toHaveBeenCalled();
  });
});

describe('onPointerUp', () => {
  it('ends palette selection and slider drag', () => {
    const cp = openPicker();
    cp.colorPickerPaletteSelect = true;
    cp._activeSlider = 'hue';
    cp.onPointerUp();
    expect(cp.colorPickerPaletteSelect).toBe(false);
    expect(cp._activeSlider).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Keyboard interaction
// ---------------------------------------------------------------------------

describe('sliderKeydown', () => {
  const key = (k: string, shiftKey = false) => new KeyboardEvent('keydown', { key: k, shiftKey });

  it('arrow keys step hue by 1 (10 with Shift)', () => {
    const cp = createCp();
    const kd = cp.sliderKeydown('hue');
    kd(key('ArrowRight'));
    expect(cp.context.hue.getter()).toBe(1);
    kd(key('ArrowUp', true));
    expect(cp.context.hue.getter()).toBe(11);
    kd(key('ArrowLeft'));
    expect(cp.context.hue.getter()).toBe(10);
    kd(key('ArrowDown', true));
    expect(cp.context.hue.getter()).toBe(0);
  });

  it('Home/End jump to the ends and steps are clamped', () => {
    const cp = createCp();
    const kd = cp.sliderKeydown('hue');
    kd(key('End'));
    expect(cp.context.hue.getter()).toBe(360);
    kd(key('ArrowRight'));
    expect(cp.context.hue.getter()).toBe(360); // clamped at max
    kd(key('Home'));
    expect(cp.context.hue.getter()).toBe(0);
    kd(key('ArrowLeft'));
    expect(cp.context.hue.getter()).toBe(0); // clamped at min
  });

  it('alpha slider uses a 0–100 range', () => {
    const cp = createCp();
    cp.context.transparency.setter(0);
    const kd = cp.sliderKeydown('alpha');
    kd(key('End'));
    expect(cp.context.transparency.getter()).toBe(100);
  });

  it('prevents default on handled keys and ignores other keys', () => {
    const cp = createCp();
    const kd = cp.sliderKeydown('hue');
    const handled = key('ArrowRight');
    vi.spyOn(handled, 'preventDefault');
    kd(handled);
    expect(handled.preventDefault).toHaveBeenCalled();

    const ignored = key('a');
    vi.spyOn(ignored, 'preventDefault');
    const before = cp.context.hue.getter();
    kd(ignored);
    expect(ignored.preventDefault).not.toHaveBeenCalled();
    expect(cp.context.hue.getter()).toBe(before);
  });

  it('emits change for every keyboard adjustment', () => {
    const cp = createCp();
    const onChange = vi.fn();
    cp.addEventListener('change', onChange);
    cp.sliderKeydown('hue')(key('ArrowRight'));
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});

describe('onSwatchKeydown', () => {
  it('Enter and Space act like a click on the swatch', () => {
    const cp = createCp();
    const click = vi.spyOn(cp.colorpicker, 'click');
    cp.onSwatchKeydown(new KeyboardEvent('keydown', { key: 'Enter' }));
    cp.onSwatchKeydown(new KeyboardEvent('keydown', { key: ' ' }));
    expect(click).toHaveBeenCalledTimes(2);
  });

  it('other keys do not open', () => {
    const cp = createCp();
    const click = vi.spyOn(cp.colorpicker, 'click');
    cp.onSwatchKeydown(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(click).not.toHaveBeenCalled();
  });

  it('does nothing while disabled', () => {
    const cp = createCp();
    cp.setAttribute('disabled', '');
    const click = vi.spyOn(cp.colorpicker, 'click');
    cp.onSwatchKeydown(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(click).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Input row — value input + format select
// ---------------------------------------------------------------------------

describe('onValueInput', () => {
  it('applies a color from the event detail and emits change', () => {
    const cp = openPicker();
    const onChange = vi.fn();
    cp.addEventListener('change', onChange);
    cp.onValueInput(new CustomEvent('change', { detail: { value: '#ff0000' } }));
    expect(cp.context.hue.getter()).toBe(0);
    expect(cp.context.saturation.getter()).toBe(100);
    expect(onChange).toHaveBeenCalled();
  });

  it('trims surrounding whitespace', () => {
    const cp = openPicker();
    cp.onValueInput(new CustomEvent('change', { detail: { value: '  rgb(0,255,0)  ' } }));
    expect(cp.context.hue.getter()).toBe(120);
  });

  it('ignores events with no string value', () => {
    const cp = openPicker();
    const before = cp.context.hue.getter();
    expect(() => cp.onValueInput(new CustomEvent('change', { detail: {} }))).not.toThrow();
    expect(cp.context.hue.getter()).toBe(before);
  });

  it('resets the editing flag afterwards so the input keeps syncing', () => {
    const cp = openPicker();
    cp.onValueInput(new CustomEvent('change', { detail: { value: '#ff0000' } }));
    expect(cp._editingInput).toBe(false);
  });
});

describe('onFormatChange / syncValueInput', () => {
  it('switches the display format and re-syncs the input', () => {
    const cp = openPicker();
    cp.onFormatChange(new CustomEvent('change', { detail: { value: 'RGB' } }));
    expect(cp._format).toBe('RGB');
    expect((cp.colorPickerValueInput as any).value).toBe('rgb(255, 255, 255)');
    cp.onFormatChange(new CustomEvent('change', { detail: { value: 'HEX' } }));
    expect(cp._format).toBe('HEX');
    expect((cp.colorPickerValueInput as any).value).toBe('#ffffff');
  });

  it('unknown format values fall back to HEX', () => {
    const cp = openPicker();
    cp._format = 'RGB';
    cp.onFormatChange(new CustomEvent('change', { detail: { value: 'nope' } }));
    expect(cp._format).toBe('HEX');
  });

  it('syncValueInput skips while the user is editing', () => {
    const cp = openPicker();
    (cp.colorPickerValueInput as any).value = 'user-typing';
    cp._editingInput = true;
    cp.syncValueInput();
    expect((cp.colorPickerValueInput as any).value).toBe('user-typing');
  });
});

// ---------------------------------------------------------------------------
// openColorPicker — panel construction
// ---------------------------------------------------------------------------

describe('openColorPicker', () => {
  it('builds the panel into the popover content', () => {
    const cp = createCp();
    expect(cp.colorPickerInner).toBeUndefined();
    cp.openColorPicker();
    expect(cp.colorPickerInner).toBeDefined();
    expect(cp.popoverContent.contains(cp.colorPickerInner!)).toBe(true);
    expect(cp.colorPickerPalette).toBeDefined();
    expect(cp.colorPickerHueSlider).toBeDefined();
    expect(cp.colorPickerAlphaSlider).toBeDefined();
  });

  it('is idempotent — a second open does not rebuild the panel', () => {
    const cp = openPicker();
    const inner = cp.colorPickerInner;
    cp.openColorPicker();
    expect(cp.colorPickerInner).toBe(inner);
    expect(cp.popoverContent.querySelectorAll('.ran-color-picker-inner')).toHaveLength(1);
  });

  it('does nothing while disabled', () => {
    const cp = createCp();
    cp.setAttribute('disabled', '');
    cp.openColorPicker();
    expect(cp.colorPickerInner).toBeUndefined();
  });

  it('exposes accessible sliders (role, label, range)', () => {
    const cp = openPicker();
    expect(cp.colorPickerHueSlider!.getAttribute('role')).toBe('slider');
    expect(cp.colorPickerHueSlider!.getAttribute('aria-valuemax')).toBe('360');
    expect(cp.colorPickerAlphaSlider!.getAttribute('role')).toBe('slider');
    expect(cp.colorPickerAlphaSlider!.getAttribute('aria-valuemax')).toBe('100');
  });
});

// ---------------------------------------------------------------------------
// Reactive panel effects
// ---------------------------------------------------------------------------

describe('setupEffects (reactive panel updates)', () => {
  it('positions the palette dot from saturation/lightness (percent-based)', () => {
    const cp = openPicker();
    cp.context.saturation.setter(30);
    cp.context.lightness.setter(70);
    expect(cp.colorPickerPaletteDot!.style.left).toBe('30%');
    expect(cp.colorPickerPaletteDot!.style.top).toBe('30%');
  });

  it('moves the hue thumb and keeps aria-valuenow live', () => {
    const cp = openPicker();
    cp.context.hue.setter(180);
    expect(cp.colorPickerHueThumb!.style.left).toBe('50%');
    expect(cp.colorPickerHueSlider!.getAttribute('aria-valuenow')).toBe('180');
  });

  it('keeps the alpha slider position and aria state in sync', () => {
    const cp = openPicker();
    cp.context.transparency.setter(40);
    expect(cp.colorPickerAlphaThumb!.style.left).toBe('40%');
    expect(cp.colorPickerAlphaSlider!.getAttribute('aria-valuenow')).toBe('40');
    expect(cp.colorPickerAlphaSlider!.getAttribute('aria-valuetext')).toBe('40%');
  });

  it('paints the saturation panel with the pure hue', () => {
    const cp = openPicker();
    cp.context.hue.setter(120);
    expect(cp.colorPickerSaturation!.style.backgroundColor).toBe('rgb(0, 255, 0)');
  });

  it('updates the trigger swatch background with the current color', () => {
    const cp = openPicker();
    cp.context.hue.setter(0);
    cp.context.saturation.setter(100);
    cp.context.lightness.setter(100);
    // jsdom normalizes rgba(…, 1) to rgb(…)
    expect(cp.colorpickerInner.style.background).toBe('rgb(255, 0, 0)');
  });
});

// ---------------------------------------------------------------------------
// Disabled state
// ---------------------------------------------------------------------------

describe('disabled state', () => {
  it('reflects disabled into ARIA and removes the swatch from the tab order', () => {
    const cp = createCp();
    cp.setAttribute('disabled', '');
    expect(cp.getAttribute('aria-disabled')).toBe('true');
    expect(cp.colorpicker.getAttribute('tabindex')).toBe('-1');
    cp.removeAttribute('disabled');
    expect(cp.getAttribute('aria-disabled')).toBeNull();
    expect(cp.colorpicker.getAttribute('tabindex')).toBe('0');
  });
});

// ---------------------------------------------------------------------------
// Lifecycle
// ---------------------------------------------------------------------------

describe('lifecycle', () => {
  it('applies an initial value attribute to the context', () => {
    const cp = document.createElement('r-colorpicker') as any;
    cp.setAttribute('value', '#00ff00');
    document.body.appendChild(cp);
    expect(cp.context.hue.getter()).toBe(120);
    expect(cp.context.saturation.getter()).toBe(100);
  });

  it('value attribute changes flow into the context after connect', () => {
    const cp = createCp();
    cp.setAttribute('value', 'rgb(0,0,255)');
    expect(cp.context.hue.getter()).toBe(240);
  });

  it('disconnect disposes the panel effects', () => {
    const cp = openPicker();
    cp.remove();
    cp.context.saturation.setter(77);
    expect(cp.colorPickerPaletteDot!.style.left).not.toBe('77%');
    expect(cp._effectDisposers).toHaveLength(0);
  });
});
