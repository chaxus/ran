import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ColorPicker } from '@/components/colorpicker';
import '@/components/colorpicker';

function mount() {
  const picker = document.createElement('r-colorpicker') as ColorPicker;
  picker.value = '#ff0000';
  document.body.append(picker);
  picker.openColorPicker();
  for (const node of [picker.colorPickerPalette!, picker.colorPickerHueSlider!, picker.colorPickerAlphaSlider!]) {
    vi.spyOn(node, 'getBoundingClientRect').mockReturnValue({ left: 0, top: 0, width: 100, height: 100 } as DOMRect);
  }
  return picker;
}

function state(picker: ColorPicker) {
  return {
    value: picker.value,
    hue: picker.context.hue.getter(),
    saturation: picker.context.saturation.getter(),
    lightness: picker.context.lightness.getter(),
    alpha: picker.context.transparency.getter(),
    format: picker._format,
  };
}

describe('r-colorpicker disabled portal ownership', () => {
  beforeEach(() => document.body.replaceChildren());
  afterEach(() => vi.restoreAllMocks());

  it('closes both owners, cancels drag state and disables the exiting panel', () => {
    const picker = mount();
    picker.popoverBlock.setAttribute('open', '');
    picker.colorPickerFormatSelect!.setAttribute('open', '');
    picker.colorPickerPaletteSelect = true;
    picker._activeSlider = 'hue';
    picker.disabled = true;
    expect(picker.popoverBlock.hasAttribute('open')).toBe(false);
    expect(picker.colorPickerFormatSelect!.hasAttribute('open')).toBe(false);
    expect(picker.colorPickerPaletteSelect).toBe(false);
    expect(picker._activeSlider).toBeNull();
    expect(picker.colorPickerInner!.inert).toBe(true);
    expect(picker.colorPickerFormatSelect!.hasAttribute('disabled')).toBe(true);
    expect(picker.colorPickerValueInput!.hasAttribute('disabled')).toBe(true);
    picker.disabled = false;
    expect(picker.colorPickerInner!.inert).toBe(false);
    expect(picker.colorPickerFormatSelect!.hasAttribute('disabled')).toBe(false);
    expect(picker.colorPickerValueInput!.hasAttribute('disabled')).toBe(false);
  });

  const pendingInput: Record<string, (picker: ColorPicker) => void> = {
    paletteDown: (picker) => picker.palettePointerDown(new PointerEvent('pointerdown', { clientX: 20, clientY: 30 })),
    paletteMove: (picker) =>
      picker.updatePaletteFromEvent(new PointerEvent('pointermove', { clientX: 20, clientY: 30 })),
    hueDown: (picker) => picker.sliderPointerDown('hue')(new PointerEvent('pointerdown', { clientX: 60 })),
    alphaDown: (picker) => picker.sliderPointerDown('alpha')(new PointerEvent('pointerdown', { clientX: 60 })),
    hueMove: (picker) => picker.updateSliderFromEvent('hue', new PointerEvent('pointermove', { clientX: 60 })),
    alphaMove: (picker) => picker.updateSliderFromEvent('alpha', new PointerEvent('pointermove', { clientX: 60 })),
    hueKey: (picker) =>
      picker.colorPickerHueSlider!.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })),
    alphaKey: (picker) =>
      picker.colorPickerAlphaSlider!.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true })),
    valueInput: (picker) =>
      picker.colorPickerValueInput!.dispatchEvent(new CustomEvent('change', { detail: { value: '#0000ff' } })),
    formatInput: (picker) =>
      picker.colorPickerFormatSelect!.dispatchEvent(new CustomEvent('change', { detail: { value: 'RGB' } })),
    emit: (picker) => picker.emitChange(),
  };

  it.each(Object.keys(pendingInput))(
    'ignores a pending %s input after disabling without mutating color or emitting',
    (input) => {
      const picker = mount();
      const change = vi.fn();
      picker.addEventListener('change', change);
      picker.disabled = true;
      const before = state(picker);
      pendingInput[input](picker);
      expect(state(picker)).toEqual(before);
      expect(change).not.toHaveBeenCalled();
      expect(picker.colorPickerPaletteSelect).toBe(false);
      expect(picker._activeSlider).toBeNull();
    },
  );

  it('keeps controlled value updates and subsequent enabled editing available', () => {
    const picker = mount();
    const change = vi.fn();
    picker.addEventListener('change', change);
    picker.disabled = true;
    picker.value = '#00ff00';
    expect(picker.value).toBe('#00ff00');
    expect(picker.context.hue.getter()).toBe(120);
    expect(change).not.toHaveBeenCalled();
    picker.disabled = false;
    picker.colorPickerHueSlider!.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(picker.context.hue.getter()).toBe(121);
    expect(change).toHaveBeenCalledOnce();
  });
});
