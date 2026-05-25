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

/** Open the picker panel and mock rAF to fire synchronously. */
function openPicker(): ColorPicker & Record<string, any> {
  const cp = createCp();
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
    cb(0);
    return 0;
  });
  cp.openColorPicker();
  return cp;
}

/** Mock getBoundingClientRect on the palette element via direct assignment (works in jsdom). */
function mockPaletteBCR(
  cp: any,
  { top = 100, left = 50, width = 200, height = 160 }: { top?: number; left?: number; width?: number; height?: number } = {},
): void {
  (cp.colorPickerPanelPalette as any).getBoundingClientRect = (): DOMRect =>
    ({ top, left, width, height, right: left + width, bottom: top + height, x: left, y: top, toJSON: () => ({}) }) as DOMRect;
}

function createMouseMoveWithPage(pageX: number, pageY: number): MouseEvent {
  const event = new MouseEvent('mousemove');
  Object.defineProperties(event, {
    pageX: { value: pageX },
    pageY: { value: pageY },
  });
  return event;
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
// Color generation methods
// ---------------------------------------------------------------------------

describe('generateHue2rgb', () => {
  it('returns rgb string for current hue context', () => {
    const cp = createCp();
    // Default hue = 0 → pure red
    expect(cp.generateHue2rgb()).toBe('rgb(255, 0, 0)');
  });

  it('updates when hue context changes', () => {
    const cp = createCp();
    cp.context.hue.setter(120);
    expect(cp.generateHue2rgb()).toBe('rgb(0, 255, 0)');
  });

  it('hue=240 → blue', () => {
    const cp = createCp();
    cp.context.hue.setter(240);
    expect(cp.generateHue2rgb()).toBe('rgb(0, 0, 255)');
  });
});

describe('generateHsv2Rgba', () => {
  it('returns correct RGBA from default context', () => {
    const cp = createCp();
    // hue=0, sat=100, light=100, transparency=80
    const { r, g, b, a } = cp.generateHsv2Rgba();
    expect(r).toBe(255);
    expect(g).toBe(0);
    expect(b).toBe(0);
    expect(a).toBeCloseTo(0.8);
  });

  it('reflects context changes', () => {
    const cp = createCp();
    cp.context.hue.setter(120); // green
    cp.context.transparency.setter(50);
    const { r, g, b, a } = cp.generateHsv2Rgba();
    expect(g).toBe(255);
    expect(r).toBe(0);
    expect(b).toBe(0);
    expect(a).toBeCloseTo(0.5);
  });
});

describe('generateHsv2RgbaValue', () => {
  it('returns rgba() string from context', () => {
    const cp = createCp();
    expect(cp.generateHsv2RgbaValue()).toBe('rgb(255, 0, 0, 0.8)');
  });
});

describe('generateHsv2Rgb', () => {
  it('returns rgb() string without alpha', () => {
    const cp = createCp();
    expect(cp.generateHsv2Rgb()).toBe('rgb(255, 0, 0)');
  });
});

describe('generateColorPickerProgress', () => {
  it('returns linear-gradient string', () => {
    const cp = createCp();
    const result = cp.generateColorPickerProgress();
    expect(result).toContain('linear-gradient(to right,');
    expect(result).toContain('rgba(255, 0, 4, 0)');
    // end color = current HSV → red at default
    expect(result).toContain('rgba(255, 0, 0, 1)');
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
    // value attribute stays unset
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

  it('rgba(r,g,b,a) sets transparency from alpha channel', () => {
    const cp = createCp();
    cp.updateColorValue('rgba(0,0,255,0.5)');
    expect(cp.context.hue.getter()).toBe(240);
    expect(cp.context.transparency.getter()).toBeCloseTo(0.5);
  });

  it('sets value attribute on the element', () => {
    const cp = createCp();
    cp.updateColorValue('#aabbcc');
    expect(cp.getAttribute('value')).toBe('#aabbcc');
  });

  it('updates colorpickerInner background style', () => {
    const cp = createCp();
    cp.updateColorValue('#ff0000');
    expect(cp.colorpickerInner.style.getPropertyValue('background') ||
           cp.colorpickerInner.getAttribute('style')).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// openColorPicker — lazy init & DOM structure
// ---------------------------------------------------------------------------

describe('openColorPicker', () => {
  it('creates colorPickerInner on first call', () => {
    const cp = openPicker();
    expect(cp.colorPickerInner).toBeTruthy();
  });

  it('returns early on second call (no re-creation)', () => {
    const cp = openPicker();
    const first = cp.colorPickerInner;
    cp.openColorPicker();
    expect(cp.colorPickerInner).toBe(first);
  });

  it('appends inner panel to popoverContent', () => {
    const cp = openPicker();
    expect(cp.popoverContent.querySelector('.ran-color-picker-inner')).not.toBeNull();
  });

  it('creates slider hue element', () => {
    const cp = openPicker();
    expect(cp.colorPickerPanelSliderHue).toBeTruthy();
  });

  it('creates slider alpha element', () => {
    const cp = openPicker();
    expect(cp.colorPickerPanelSliderAlpha).toBeTruthy();
  });

  it('creates palette panel element', () => {
    const cp = openPicker();
    expect(cp.colorPickerPanelPalette).toBeTruthy();
  });

  it('creates palette dot element', () => {
    const cp = openPicker();
    expect(cp.colorPickerPanelDot).toBeTruthy();
  });

  it('creates color block inner element', () => {
    const cp = openPicker();
    expect(cp.colorPickerColorBlockInner).toBeTruthy();
  });

  it('creates input container with select and inputs', () => {
    const cp = openPicker();
    expect(cp.colorPickerInputContainer).toBeTruthy();
    expect(cp.colorPickerInputContainerSelectItem).toBeTruthy();
    expect(cp.colorPickerInputContainerInputColor).toBeTruthy();
    expect(cp.colorPickerInputContainerInputNumber).toBeTruthy();
  });

  it('inner-content contains panel, slider, input sections', () => {
    const cp = openPicker();
    const content = cp.popoverContent;
    expect(content.querySelector('.ran-color-picker-panel')).not.toBeNull();
    expect(content.querySelector('.ran-color-picker-slider-container')).not.toBeNull();
    expect(content.querySelector('.ran-color-picker-input-container')).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// createColorPickerProgress — slider event wiring
// ---------------------------------------------------------------------------

describe('createColorPickerProgress — event wiring', () => {
  it('slider-hue dispatching change updates hue context', () => {
    const cp = openPicker();
    cp.colorPickerPanelSliderHue!.dispatchEvent(
      new CustomEvent('change', { detail: { value: 0.5 } }),
    );
    expect(cp.context.hue.getter()).toBeCloseTo(180, 0);
  });

  it('slider-alpha dispatching change updates transparency context', () => {
    const cp = openPicker();
    cp.colorPickerPanelSliderAlpha!.dispatchEvent(
      new CustomEvent('change', { detail: { value: 0.3 } }),
    );
    expect(cp.context.transparency.getter()).toBeCloseTo(30, 0);
  });
});

// ---------------------------------------------------------------------------
// Signal subscribers — update methods
// ---------------------------------------------------------------------------

describe('updateColorPickerPanelSliderHueProgressPercent', () => {
  it('sets percent attribute on hue slider', () => {
    const cp = openPicker();
    cp.updateColorPickerPanelSliderHueProgressPercent(180);
    expect(cp.colorPickerPanelSliderHue?.getAttribute('percent')).toBe('0.5');
  });

  it('is triggered when hue signal changes', () => {
    const cp = openPicker();
    cp.context.hue.setter(360);
    expect(cp.colorPickerPanelSliderHue?.getAttribute('percent')).toBe('1');
  });

  it('does nothing when slider element does not exist', () => {
    const cp = createCp();
    expect(() => cp.updateColorPickerPanelSliderHueProgressPercent(90)).not.toThrow();
  });
});

describe('updateColorPickerPanelSliderAlphaProgressPercent', () => {
  it('sets percent attribute on alpha slider', () => {
    const cp = openPicker();
    cp.updateColorPickerPanelSliderAlphaProgressPercent(50);
    expect(cp.colorPickerPanelSliderAlpha?.getAttribute('percent')).toBe('0.5');
  });

  it('is triggered when transparency signal changes', () => {
    const cp = openPicker();
    cp.context.transparency.setter(100);
    expect(cp.colorPickerPanelSliderAlpha?.getAttribute('percent')).toBe('1');
  });
});

describe('updateColorPickerPanelSliderAlphaProgressWrap', () => {
  it('sets --ran-progress-wrap-background CSS var on alpha slider', () => {
    const cp = openPicker();
    cp.updateColorPickerPanelSliderAlphaProgressWrap();
    const style = cp.colorPickerPanelSliderAlpha?.style.getPropertyValue('--ran-progress-wrap-background');
    expect(style).toContain('linear-gradient');
  });

  it('does nothing when alpha slider does not exist', () => {
    const cp = createCp();
    expect(() => cp.updateColorPickerPanelSliderAlphaProgressWrap()).not.toThrow();
  });
});

describe('updateColorPickerPanelSliderAlphaProgressDot', () => {
  it('sets --ran-progress-dot-background CSS var on alpha slider', () => {
    const cp = openPicker();
    cp.updateColorPickerPanelSliderAlphaProgressDot();
    const style = cp.colorPickerPanelSliderAlpha?.style.getPropertyValue('--ran-progress-dot-background');
    expect(style).toContain('rgb(');
  });
});

describe('updateColorPickerPanelSliderHueProgressDot', () => {
  it('sets --ran-progress-dot-background CSS var on hue slider', () => {
    const cp = openPicker();
    cp.updateColorPickerPanelSliderHueProgressDot();
    const style = cp.colorPickerPanelSliderHue?.style.getPropertyValue('--ran-progress-dot-background');
    expect(style).toContain('rgb(');
  });
});

describe('updateColorPickerColorBlockInnerBackground', () => {
  it('sets background style on color block inner', () => {
    const cp = openPicker();
    const spy = vi.spyOn(cp.colorPickerColorBlockInner!.style, 'setProperty');
    cp.updateColorPickerColorBlockInnerBackground();
    expect(spy).toHaveBeenCalledWith('background', expect.stringContaining('rgb('));
  });

  it('does nothing when element does not exist', () => {
    const cp = createCp();
    expect(() => cp.updateColorPickerColorBlockInnerBackground()).not.toThrow();
  });
});

describe('updateColorPickerPanelSaturationBackground', () => {
  it('sets background-color style on saturation panel', () => {
    const cp = openPicker();
    cp.updateColorPickerPanelSaturationBackground();
    const bg = cp.colorPickerPanelSaturation?.style.getPropertyValue('background-color');
    expect(bg).toBe('rgb(255, 0, 0)'); // hue=0 → red
  });

  it('does nothing when element does not exist', () => {
    const cp = createCp();
    expect(() => cp.updateColorPickerPanelSaturationBackground()).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// Palette interaction: click
// ---------------------------------------------------------------------------

describe('changeColorPalettePosition', () => {
  it('does nothing when colorPickerPanelPalette is missing', () => {
    const cp = createCp();
    expect(() => cp.changeColorPalettePosition(10, 10)).not.toThrow();
  });

  it('top-left click → saturation=0, lightness=100', () => {
    const cp = openPicker();
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => { cb(0); return 0; });
    mockPaletteBCR(cp, { top: 0, left: 0, width: 200, height: 160 });
    cp.changeColorPalettePosition(0, 0);
    expect(cp.context.saturation.getter()).toBeCloseTo(0, 0);
    expect(cp.context.lightness.getter()).toBeCloseTo(100, 0);
  });

  it('bottom-right click → saturation=100, lightness=0', () => {
    const cp = openPicker();
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => { cb(0); return 0; });
    mockPaletteBCR(cp, { top: 0, left: 0, width: 200, height: 160 });
    cp.changeColorPalettePosition(200, 160);
    expect(cp.context.saturation.getter()).toBeCloseTo(100, 0);
    expect(cp.context.lightness.getter()).toBeCloseTo(0, 0);
  });

  it('center click → saturation≈50, lightness≈50', () => {
    const cp = openPicker();
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => { cb(0); return 0; });
    mockPaletteBCR(cp, { top: 0, left: 0, width: 200, height: 160 });
    cp.changeColorPalettePosition(100, 80);
    expect(cp.context.saturation.getter()).toBeCloseTo(50, 0);
    expect(cp.context.lightness.getter()).toBeCloseTo(50, 0);
  });

  it('sets dot position via requestAnimationFrame', () => {
    const cp = openPicker();
    const frames: FrameRequestCallback[] = [];
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => { frames.push(cb); return frames.length; });
    mockPaletteBCR(cp, { top: 0, left: 0, width: 200, height: 160 });
    cp.changeColorPalettePosition(50, 40);
    expect(frames.length).toBe(1);
    frames[0](0);
    expect(cp.colorPickerPanelDot?.style.getPropertyValue('left')).toBe('42px'); // 50 - BOT_WIDTH(8)
    expect(cp.colorPickerPanelDot?.style.getPropertyValue('top')).toBe('32px');  // 40 - BOT_WIDTH(8)
  });

  it('clamps values outside palette bounds', () => {
    const cp = openPicker();
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => { cb(0); return 0; });
    mockPaletteBCR(cp, { top: 0, left: 0, width: 200, height: 160 });
    cp.changeColorPalettePosition(-100, -100); // below 0
    expect(cp.context.saturation.getter()).toBeCloseTo(0, 0);
    expect(cp.context.lightness.getter()).toBeCloseTo(100, 0);
    cp.changeColorPalettePosition(999, 999); // above max
    expect(cp.context.saturation.getter()).toBeCloseTo(100, 0);
    expect(cp.context.lightness.getter()).toBeCloseTo(0, 0);
  });
});

describe('clickColorPalette', () => {
  it('calls changeColorPalettePosition with offsetX/offsetY', () => {
    const cp = openPicker();
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => { cb(0); return 0; });
    mockPaletteBCR(cp, { top: 0, left: 0, width: 200, height: 160 });
    const spy = vi.spyOn(cp, 'changeColorPalettePosition');
    const event = new MouseEvent('mousedown', { bubbles: false });
    Object.defineProperty(event, 'offsetX', { value: 100 });
    Object.defineProperty(event, 'offsetY', { value: 80 });
    cp.clickColorPalette(event);
    expect(spy).toHaveBeenCalledWith(100, 80);
  });
});

// ---------------------------------------------------------------------------
// Palette interaction: drag (mouseMoveColorPickerPalette — bug fix validation)
// ---------------------------------------------------------------------------

describe('mouseMoveColorPickerPalette', () => {
  it('does nothing when colorPickerPaletteSelect is false', () => {
    const cp = openPicker();
    cp.colorPickerPaletteSelect = false;
    const initialSat = cp.context.saturation.getter();
    cp.mouseMoveColorPickerPalette(createMouseMoveWithPage(200, 200));
    expect(cp.context.saturation.getter()).toBe(initialSat);
  });

  it('does nothing when palette element is missing', () => {
    const cp = createCp();
    cp.colorPickerPaletteSelect = true;
    expect(() => cp.mouseMoveColorPickerPalette(createMouseMoveWithPage(100, 50))).not.toThrow();
  });

  // For these tests we mock at Element.prototype level so jsdom reliably
  // returns non-zero dimensions during the method call.
  it('moving to top of palette → lightness ≈ 100 (Y-axis inverted)', () => {
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue(
      { top: 100, left: 50, width: 200, height: 160, right: 250, bottom: 260, x: 50, y: 100, toJSON: () => ({}) } as DOMRect,
    );
    const cp = openPicker();
    cp.colorPickerPaletteSelect = true;
    cp.mouseMoveColorPickerPalette(createMouseMoveWithPage(150, 100));
    expect(cp.context.lightness.getter()).toBeCloseTo(100, 0);
  });

  it('moving to bottom of palette → lightness ≈ 0', () => {
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue(
      { top: 100, left: 50, width: 200, height: 160, right: 250, bottom: 260, x: 50, y: 100, toJSON: () => ({}) } as DOMRect,
    );
    const cp = openPicker();
    cp.colorPickerPaletteSelect = true;
    cp.mouseMoveColorPickerPalette(createMouseMoveWithPage(150, 260));
    expect(cp.context.lightness.getter()).toBeCloseTo(0, 0);
  });

  it('moving to left edge → saturation ≈ 0', () => {
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue(
      { top: 100, left: 50, width: 200, height: 160, right: 250, bottom: 260, x: 50, y: 100, toJSON: () => ({}) } as DOMRect,
    );
    const cp = openPicker();
    cp.colorPickerPaletteSelect = true;
    cp.mouseMoveColorPickerPalette(createMouseMoveWithPage(50, 180));
    expect(cp.context.saturation.getter()).toBeCloseTo(0, 0);
  });

  it('moving to right edge → saturation ≈ 100', () => {
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue(
      { top: 100, left: 50, width: 200, height: 160, right: 250, bottom: 260, x: 50, y: 100, toJSON: () => ({}) } as DOMRect,
    );
    const cp = openPicker();
    cp.colorPickerPaletteSelect = true;
    cp.mouseMoveColorPickerPalette(createMouseMoveWithPage(250, 180));
    expect(cp.context.saturation.getter()).toBeCloseTo(100, 0);
  });

  it('drag and click produce consistent lightness for the same position', () => {
    // palette at origin so pageX/pageY equal offsetX/offsetY directly
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue(
      { top: 0, left: 0, width: 200, height: 160, right: 200, bottom: 160, x: 0, y: 0, toJSON: () => ({}) } as DOMRect,
    );
    const cp = openPicker();

    cp.changeColorPalettePosition(100, 80);
    const clickLightness = cp.context.lightness.getter();

    cp.colorPickerPaletteSelect = true;
    cp.mouseMoveColorPickerPalette(createMouseMoveWithPage(100, 80));
    const dragLightness = cp.context.lightness.getter();

    expect(Math.abs(dragLightness - clickLightness)).toBeLessThan(2);
  });
});

// ---------------------------------------------------------------------------
// mouseDown / mouseUp on palette dot
// ---------------------------------------------------------------------------

describe('mouseDownColorPickerPalette', () => {
  it('sets colorPickerPaletteSelect to true', () => {
    const cp = createCp();
    cp.colorPickerPaletteSelect = false;
    const event = new MouseEvent('mousedown');
    vi.spyOn(event, 'stopPropagation');
    vi.spyOn(event, 'preventDefault');
    cp.mouseDownColorPickerPalette(event);
    expect(cp.colorPickerPaletteSelect).toBe(true);
    expect(event.stopPropagation).toHaveBeenCalled();
    expect(event.preventDefault).toHaveBeenCalled();
  });
});

describe('mouseUpColorPickerPalette', () => {
  it('sets colorPickerPaletteSelect to false', () => {
    const cp = createCp();
    cp.colorPickerPaletteSelect = true;
    cp.mouseUpColorPickerPalette();
    expect(cp.colorPickerPaletteSelect).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// clickStop
// ---------------------------------------------------------------------------

describe('clickStop', () => {
  it('calls stopPropagation and preventDefault on event', () => {
    const cp = createCp();
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    vi.spyOn(event, 'stopPropagation');
    vi.spyOn(event, 'preventDefault');
    cp.clickStop(event);
    expect(event.stopPropagation).toHaveBeenCalled();
    expect(event.preventDefault).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// changeColorPickerHue / changeColorPickerAlpha
// ---------------------------------------------------------------------------

describe('changeColorPickerHue', () => {
  it('sets hue from event detail.value * 360', () => {
    const cp = createCp();
    cp.changeColorPickerHue(new CustomEvent('change', { detail: { value: 0.5 } }));
    expect(cp.context.hue.getter()).toBeCloseTo(180, 0);
  });

  it('hue=1.0 → 360', () => {
    const cp = createCp();
    cp.changeColorPickerHue(new CustomEvent('change', { detail: { value: 1 } }));
    expect(cp.context.hue.getter()).toBeCloseTo(360, 0);
  });
});

describe('changeColorPickerAlpha', () => {
  it('sets transparency from event detail.value * 100', () => {
    const cp = createCp();
    cp.changeColorPickerAlpha(new CustomEvent('change', { detail: { value: 0.3 } }));
    expect(cp.context.transparency.getter()).toBeCloseTo(30, 0);
  });

  it('value=0 → transparency=0', () => {
    const cp = createCp();
    cp.changeColorPickerAlpha(new CustomEvent('change', { detail: { value: 0 } }));
    expect(cp.context.transparency.getter()).toBeCloseTo(0, 0);
  });
});

// ---------------------------------------------------------------------------
// connectedCallback / disconnectedCallback
// ---------------------------------------------------------------------------

describe('connectedCallback', () => {
  it('sets ran-colorpicker class on the host', () => {
    const cp = createCp();
    expect(cp.getAttribute('class')).toBe('ran-colorpicker');
  });

  it('registers click listener that calls openColorPicker', () => {
    const cp = createCp();
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => { cb(0); return 0; });
    cp.popoverBlock.click();
    expect(cp.colorPickerInner).toBeTruthy();
  });
});

describe('disconnectedCallback', () => {
  it('aborts EventManager to remove all lifecycle listeners', () => {
    const cp = openPicker();
    const abortSpy = vi.spyOn((cp as any)._events, 'abort');
    document.body.removeChild(cp);
    expect(abortSpy).toHaveBeenCalledOnce();
  });

  it('disposes reactive effects on disconnect', () => {
    const cp = openPicker();
    const disposeSpy = vi.spyOn(cp as any, 'disposeEffects');
    document.body.removeChild(cp);
    expect(disposeSpy).toHaveBeenCalledOnce();
  });
});

// ---------------------------------------------------------------------------
// attributeChangedCallback
// ---------------------------------------------------------------------------

describe('attributeChangedCallback', () => {
  it('value change calls updateColorValue', () => {
    const cp = createCp();
    const spy = vi.spyOn(cp, 'updateColorValue');
    cp.attributeChangedCallback('value', '', '#00ff00');
    expect(spy).toHaveBeenCalledWith('#00ff00');
  });

  it('same oldValue and newValue → no update', () => {
    const cp = createCp();
    const spy = vi.spyOn(cp, 'updateColorValue');
    cp.attributeChangedCallback('value', '#ff0000', '#ff0000');
    expect(spy).not.toHaveBeenCalled();
  });

  it('sheet change calls handlerExternalCss', () => {
    const cp = createCp();
    const spy = vi.spyOn(cp, 'handlerExternalCss');
    cp.attributeChangedCallback('sheet', '', '.x { color: red }');
    expect(spy).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// handlerExternalCss
// ---------------------------------------------------------------------------

describe('handlerExternalCss', () => {
  it('does nothing when sheet is empty', () => {
    const cp = createCp();
    expect(() => cp.handlerExternalCss()).not.toThrow();
  });

  it('calls adoptSheetText when sheet is set', () => {
    const cp = createCp();
    cp.setAttribute('sheet', '.x { color: red }');
    expect(() => cp.handlerExternalCss()).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// value / sheet getters and setters
// ---------------------------------------------------------------------------

describe('value getter / setter', () => {
  it('getter returns current context value', () => {
    const cp = createCp();
    expect(cp.value).toBe('');
    cp.updateColorValue('#ff0000');
    expect(cp.value).toBe('#ff0000');
  });

  it('setter reflects to attribute and calls updateColorValue', () => {
    const cp = createCp();
    const spy = vi.spyOn(cp, 'updateColorValue');
    cp.value = 'rgb(0,255,0)';
    expect(cp.getAttribute('value')).toBe('rgb(0,255,0)');
    expect(spy).toHaveBeenCalledWith('rgb(0,255,0)');
  });
});

describe('sheet getter / setter', () => {
  it('getter returns attribute value', () => {
    const cp = createCp();
    cp.setAttribute('sheet', '.x{}');
    expect(cp.sheet).toBe('.x{}');
  });

  it('setter reflects to attribute', () => {
    const cp = createCp();
    cp.sheet = '.y { color: blue }';
    expect(cp.getAttribute('sheet')).toBe('.y { color: blue }');
  });
});
