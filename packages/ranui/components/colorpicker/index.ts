import { range } from 'ranuts/utils';
import { signal, createEffect, RanElement } from '@/utils/index';
import { HEX_COLOR_REGEX, RGBA_REGEX, RGB_REGEX, hex2hsv, hsv2rgb, rgb2hex, rgb2hsv } from '@/utils/color';
import { Div, View, EventManager, Style } from '@/utils/builder';
import '@/components/popover';
import '@/components/input';
import '@/components/select';
import { defineSSR } from '@/utils/ssr-registry';
import {
  ensureShadowElement,
  ensureShadowRoot,
  getStringAttribute,
  setStringAttribute,
  syncSheetAttribute,
} from '@/utils/component';
import colorPickerCss from './index.less?inline';
import panelCss from './panel.less?inline';

const HUE = 360;

export interface Context {
  disabled: Signal<boolean>;
  value: Signal<string>;
  hue: Signal<number>; // 0 - 360 色相 hue
  saturation: Signal<number>; // 0 - 100 饱和度 x
  lightness: Signal<number>; // 0 - 100 明度 y
  transparency: Signal<number>; // 0 - 100 透明度
}

export interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number; // 0 - 1
}

export interface Signal<T> {
  getter: () => T;
  setter: (newValue: T | ((prev: T) => T)) => void;
}

type ColorFormat = 'HEX' | 'RGB';

export class ColorPicker extends RanElement {
  colorpicker: HTMLDivElement;
  colorpickerInner: HTMLDivElement;
  context!: Context;
  _shadowDom: ShadowRoot;
  _events = new EventManager();
  _effectDisposers: Array<() => void> = [];
  popoverBlock: HTMLElement;
  popoverContent: HTMLElement;

  // Panel elements (built lazily on first open).
  colorPickerInner?: HTMLDivElement;
  colorPickerPalette?: HTMLElement;
  colorPickerSaturation?: HTMLElement;
  colorPickerPaletteDot?: HTMLElement;
  colorPickerHueSlider?: HTMLElement;
  colorPickerHueThumb?: HTMLElement;
  colorPickerAlphaSlider?: HTMLElement;
  colorPickerAlphaTrack?: HTMLElement;
  colorPickerAlphaThumb?: HTMLElement;
  colorPickerPreviewInner?: HTMLElement;
  colorPickerValueInput?: HTMLElement;
  colorPickerFormatSelect?: HTMLElement;

  colorPickerPaletteSelect: boolean;
  _activeSlider: 'hue' | 'alpha' | null = null;
  _format: ColorFormat = 'HEX';
  _editingInput = false;

  static get observedAttributes(): string[] {
    return ['disabled', 'value', 'sheet'];
  }

  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this, colorPickerCss);
    const popoverBlock = ensureShadowElement(this._shadowDom, 'r-popover', () => {
      const colorpickerInner = Div().class('ran-colorpicker-inner').build() as HTMLDivElement;
      const colorpicker = Div().class('ran-colorpicker-block').children(colorpickerInner).build() as HTMLDivElement;
      const popoverContent = View('r-content').class('ran-content').build() as HTMLElement;
      return View('r-popover')
        .class('ran-popover')
        .attr('trigger', 'click')
        .children(colorpicker, popoverContent)
        .build() as HTMLElement;
    });
    this.popoverBlock = popoverBlock;
    this.popoverContent = popoverBlock.querySelector('r-content') as HTMLElement;
    this.colorpicker = popoverBlock.querySelector('.ran-colorpicker-block') as HTMLDivElement;
    this.colorpickerInner = popoverBlock.querySelector('.ran-colorpicker-inner') as HTMLDivElement;

    this.colorPickerPaletteSelect = false;
    this.createContext();
  }

  // ── Accessors ───────────────────────────────────────────────────────────
  get value(): string {
    return this.context?.value.getter() || '';
  }

  set value(value: string) {
    this.setAttribute('value', value);
  }

  get sheet(): string {
    return getStringAttribute(this, 'sheet');
  }

  set sheet(value: string) {
    setStringAttribute(this, 'sheet', value);
  }

  handlerExternalCss = (): void => {
    syncSheetAttribute(this, this._shadowDom, 'sheet', null, this.sheet);
  };

  createContext = (): void => {
    const mk = <T>(initial: T): Signal<T> => {
      const [getter, setter] = signal<T>(initial);
      return { getter, setter };
    };
    this.context = {
      value: mk(''),
      disabled: mk(false),
      hue: mk(0),
      saturation: mk(0),
      lightness: mk(100),
      transparency: mk(100),
    };
  };

  // ── Color helpers ────────────────────────────────────────────────────────
  currentRgba = (): RGBA => {
    const { hue, saturation, lightness, transparency } = this.context;
    const { r, g, b } = hsv2rgb(hue.getter(), saturation.getter(), lightness.getter());
    return { r, g, b, a: transparency.getter() / 100 };
  };

  /** Canonical string used for the `value` attribute and `change` events. */
  currentValue = (): string => {
    const { r, g, b, a } = this.currentRgba();
    return a < 1 ? `rgba(${r}, ${g}, ${b}, ${Number(a.toFixed(2))})` : rgb2hex(r, g, b);
  };

  /** String shown in the value input, depending on the selected format. */
  currentDisplay = (): string => {
    const { r, g, b, a } = this.currentRgba();
    if (this._format === 'RGB') {
      return a < 1 ? `rgba(${r}, ${g}, ${b}, ${Number(a.toFixed(2))})` : `rgb(${r}, ${g}, ${b})`;
    }
    // HEX shows the 6-digit color; alpha is controlled by the alpha slider.
    return rgb2hex(r, g, b);
  };

  updateColorValue = (value: string): void => {
    if (value === this.context?.value.getter()) return;
    const compact = value.replace(/\s+/g, '');
    const hex = HEX_COLOR_REGEX.exec(value); // #1677FF #fff #FFF
    const rgba = RGBA_REGEX.exec(compact); // rgba(255, 255, 255, 0)
    const rgb = RGB_REGEX.exec(compact); // rgb(255, 255, 255)
    if (hex) {
      const { h, s, v } = hex2hsv(hex[0]);
      this.context.hue.setter(h);
      this.context.saturation.setter(s);
      this.context.lightness.setter(v);
      this.context.transparency.setter(100);
    } else if (rgba) {
      const { h, s, v } = rgb2hsv(Number(rgba[1]), Number(rgba[2]), Number(rgba[3]));
      this.context.hue.setter(h);
      this.context.saturation.setter(s);
      this.context.lightness.setter(v);
      this.context.transparency.setter(Number(rgba[4]) * 100);
    } else if (rgb) {
      const { h, s, v } = rgb2hsv(Number(rgb[1]), Number(rgb[2]), Number(rgb[3]));
      this.context.hue.setter(h);
      this.context.saturation.setter(s);
      this.context.lightness.setter(v);
      this.context.transparency.setter(100);
    } else {
      return;
    }
    this.setAttribute('value', value);
    this.context?.value.setter(value);
  };

  /** Sync the `value` attribute to the live color and emit a `change` event. */
  emitChange = (): void => {
    const value = this.currentValue();
    const { r, g, b, a } = this.currentRgba();
    this.context?.value.setter(value);
    this.setAttribute('value', value);
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: {
          value,
          hex: rgb2hex(r, g, b),
          rgb: `rgb(${r}, ${g}, ${b})`,
          rgba: `rgba(${r}, ${g}, ${b}, ${Number(a.toFixed(2))})`,
          alpha: Number(a.toFixed(2)),
        },
        bubbles: true,
        composed: true,
      }),
    );
  };

  // ── Pointer interaction ───────────────────────────────────────────────────
  palettePointerDown = (e: MouseEvent): void => {
    e.preventDefault();
    this.colorPickerPaletteSelect = true;
    this.updatePaletteFromEvent(e);
  };

  updatePaletteFromEvent = (e: MouseEvent): void => {
    if (!this.colorPickerPalette) return;
    const { left, top, width, height } = this.colorPickerPalette.getBoundingClientRect();
    if (!width || !height) return;
    const x = range(e.clientX - left, 0, width);
    const y = range(e.clientY - top, 0, height);
    this.context.saturation.setter((x / width) * 100);
    this.context.lightness.setter((1 - y / height) * 100);
    this.emitChange();
  };

  sliderPointerDown =
    (kind: 'hue' | 'alpha') =>
    (e: MouseEvent): void => {
      e.preventDefault();
      this._activeSlider = kind;
      this.updateSliderFromEvent(kind, e);
    };

  updateSliderFromEvent = (kind: 'hue' | 'alpha', e: MouseEvent): void => {
    const el = kind === 'hue' ? this.colorPickerHueSlider : this.colorPickerAlphaSlider;
    if (!el) return;
    const { left, width } = el.getBoundingClientRect();
    if (!width) return;
    const pct = range(e.clientX - left, 0, width) / width;
    if (kind === 'hue') this.context.hue.setter(pct * HUE);
    else this.context.transparency.setter(pct * 100);
    this.emitChange();
  };

  onPointerMove = (e: Event): void => {
    const me = e as MouseEvent;
    if (this.colorPickerPaletteSelect) this.updatePaletteFromEvent(me);
    else if (this._activeSlider) this.updateSliderFromEvent(this._activeSlider, me);
  };

  onPointerUp = (): void => {
    this.colorPickerPaletteSelect = false;
    this._activeSlider = null;
  };

  // ── Input row ─────────────────────────────────────────────────────────────
  onValueInput = (e: Event): void => {
    const target = e.target as HTMLElement & { value?: string };
    const next = (e as CustomEvent<{ value?: string }>).detail?.value ?? target?.value;
    if (typeof next !== 'string') return;
    this._editingInput = true;
    this.updateColorValue(next.trim());
    this._editingInput = false;
    this.emitChange();
  };

  onFormatChange = (e: Event): void => {
    const value = (e as CustomEvent<{ value?: string }>).detail?.value;
    this._format = value === 'RGB' ? 'RGB' : 'HEX';
    this.syncValueInput();
  };

  syncValueInput = (): void => {
    if (this._editingInput || !this.colorPickerValueInput) return;
    (this.colorPickerValueInput as HTMLElement & { value: string }).value = this.currentDisplay();
  };

  // ── Reactive panel updates ────────────────────────────────────────────────
  setupEffects = (): void => {
    this._effectDisposers.push(
      // Saturation panel background = the pure hue.
      createEffect(() => {
        const { r, g, b } = hsv2rgb(this.context.hue.getter(), 100, 100);
        this.colorPickerSaturation?.style.setProperty('background-color', `rgb(${r}, ${g}, ${b})`);
      }),
      // Palette dot position (percent-based, layout independent).
      createEffect(() => {
        const s = range(this.context.saturation.getter(), 0, 100);
        const l = range(this.context.lightness.getter(), 0, 100);
        this.colorPickerPaletteDot?.style.setProperty('left', `${s}%`);
        this.colorPickerPaletteDot?.style.setProperty('top', `${100 - l}%`);
      }),
      // Hue slider thumb position + color.
      createEffect(() => {
        const h = this.context.hue.getter();
        const { r, g, b } = hsv2rgb(h, 100, 100);
        this.colorPickerHueThumb?.style.setProperty('left', `${(h / HUE) * 100}%`);
        this.colorPickerHueThumb?.style.setProperty('background', `rgb(${r}, ${g}, ${b})`);
      }),
      // Alpha track gradient, alpha thumb, preview swatch, trigger swatch, input.
      createEffect(() => {
        const { r, g, b, a } = this.currentRgba();
        const solid = `rgb(${r}, ${g}, ${b})`;
        const current = `rgba(${r}, ${g}, ${b}, ${Number(a.toFixed(3))})`;
        this.colorPickerAlphaTrack?.style.setProperty(
          'background',
          `linear-gradient(to right, rgba(${r}, ${g}, ${b}, 0), ${solid})`,
        );
        this.colorPickerAlphaThumb?.style.setProperty('left', `${a * 100}%`);
        this.colorPickerAlphaThumb?.style.setProperty('background', current);
        this.colorPickerPreviewInner?.style.setProperty('background', current);
        this.colorpickerInner?.style.setProperty('background', current);
        this.syncValueInput();
      }),
    );
  };

  disposeEffects = (): void => {
    for (const dispose of this._effectDisposers) dispose();
    this._effectDisposers = [];
  };

  // ── Panel construction (once, on first open) ──────────────────────────────
  openColorPicker = (): void => {
    if (this.colorPickerInner) return;

    this.colorPickerSaturation = Div().class('ran-color-picker-saturation').build() as HTMLElement;
    this.colorPickerPaletteDot = Div().class('ran-color-picker-palette-dot').build() as HTMLElement;
    this.colorPickerPalette = Div()
      .class('ran-color-picker-palette')
      .on('mousedown', this.palettePointerDown)
      .children(this.colorPickerSaturation, this.colorPickerPaletteDot)
      .build() as HTMLElement;

    this.colorPickerPreviewInner = Div().class('ran-color-picker-preview-inner').build() as HTMLElement;
    const preview = Div().class('ran-color-picker-preview').children(this.colorPickerPreviewInner).build();

    this.colorPickerHueThumb = Div().class('ran-color-picker-slider-thumb').build() as HTMLElement;
    this.colorPickerHueSlider = Div()
      .class('ran-color-picker-slider ran-color-picker-slider-hue')
      .on('mousedown', this.sliderPointerDown('hue'))
      .children(this.colorPickerHueThumb)
      .build() as HTMLElement;

    this.colorPickerAlphaTrack = Div().class('ran-color-picker-slider-alpha-track').build() as HTMLElement;
    this.colorPickerAlphaThumb = Div().class('ran-color-picker-slider-thumb').build() as HTMLElement;
    this.colorPickerAlphaSlider = Div()
      .class('ran-color-picker-slider ran-color-picker-slider-alpha')
      .on('mousedown', this.sliderPointerDown('alpha'))
      .children(this.colorPickerAlphaTrack, this.colorPickerAlphaThumb)
      .build() as HTMLElement;

    const sliders = Div()
      .class('ran-color-picker-sliders')
      .children(this.colorPickerHueSlider, this.colorPickerAlphaSlider)
      .build();
    const controls = Div().class('ran-color-picker-controls').children(preview, sliders).build();

    this.colorPickerFormatSelect = View('r-select')
      .class('ran-color-picker-format')
      .attr('value', this._format)
      .attr('defaultValue', this._format)
      .attr('trigger', 'click')
      .children(...(['HEX', 'RGB'] as const).map((f) => View('r-option').attr('value', f).text(f).build()))
      .on('change', this.onFormatChange)
      .build() as HTMLElement;

    this.colorPickerValueInput = View('r-input')
      .class('ran-color-picker-value')
      .on('change', this.onValueInput)
      .build() as HTMLElement;

    const inputRow = Div()
      .class('ran-color-picker-input-container')
      .children(this.colorPickerFormatSelect, this.colorPickerValueInput)
      .build();

    const content = Div()
      .class('ran-color-picker-inner-content')
      .children(this.colorPickerPalette, controls, inputRow)
      .build();

    this.colorPickerInner = Div()
      .class('ran-color-picker-inner')
      .children(Style().text(panelCss).build(), content)
      .build() as HTMLDivElement;

    this.popoverContent.appendChild(this.colorPickerInner);
    this.setupEffects();
    this.syncValueInput();
  };

  // ── Lifecycle ──────────────────────────────────────────────────────────────
  connectedCallback(): void {
    this.handlerExternalCss();
    this.setAttribute('class', 'ran-colorpicker');
    this._events.on(this.popoverBlock, 'click', this.openColorPicker);
    this._events.on(document, 'mousemove', this.onPointerMove);
    this._events.on(document, 'mouseup', this.onPointerUp);
    if (this.value) this.updateColorValue(this.value);
  }

  disconnectedCallback(): void {
    this._events.abort();
    this.disposeEffects();
  }

  attributeChangedCallback(name: string, old: string, next: string): void {
    if (old === next) return;
    if (name === 'value') this.updateColorValue(next);
    if (name === 'sheet') this.handlerExternalCss();
  }
}

defineSSR('r-colorpicker', ColorPicker as unknown as new () => HTMLElement);
export default ColorPicker;
