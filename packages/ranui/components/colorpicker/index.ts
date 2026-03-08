import { range } from 'ranuts/utils';
import { HTMLElementSSR, createCustomError, createSignal } from '@/utils/index';
import { HEX_COLOR_REGEX, RGBA_REGEX, RGB_REGEX, hex2hsv, hsv2rgb, rgb2hsv } from '@/utils/color';
import { Div, View } from '@/utils/builder';
import '@/components/popover';
import '@/components/input';
import '@/components/select';
import '@/components/progress';
import { adoptSheetText, adoptStyles } from '@/utils/style';
import colorPickerCss from './index.less?inline';

// RGBA：red、green、blue, 透明度
// HSL：色相、饱和度、亮度，透明度
// HSB：色相、饱和度、明度，透明度
// HSV：色相、饱和度、明度，透明度

const BOT_WIDTH = 8;

const HUE = 360;

export interface Context {
  disabled: Signal<boolean>;
  value: Signal<string>;
  hue: Signal<number>; // 0 - 360 色相 hue
  saturation: Signal<number>; // 0 - 100 饱和度 x
  lightness: Signal<number>; // 0 - 100 亮度 y
  transparency: Signal<number>; // 0 - 100 透明度
}

export interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface Signal<T> {
  getter: () => T;
  setter: (newValue: T) => void;
}
/**
 * @description: 数据驱动视图，改变数据，即改变视图
 * @return {*}
 */
export class ColorPicker extends (HTMLElementSSR()!) {
  colorpicker: HTMLDivElement;
  colorpickerInner: HTMLDivElement;
  context!: Context;
  _shadowDom: ShadowRoot;
  popoverBlock: HTMLElement;
  popoverContent: HTMLElement;
  colorPickerInner?: HTMLDivElement;
  colorPickerInnerContent?: HTMLElement;
  colorPickerPanel?: HTMLElement;
  colorPickerInputContainer?: HTMLElement;
  colorPickerPanelDot?: HTMLDivElement;
  colorPickerPanelSliderContainer?: HTMLDivElement;
  colorPickerPanelSliderGroup?: HTMLDivElement;
  colorPickerPanelSliderHue?: HTMLElement;
  colorPickerPanelSliderAlpha?: HTMLElement;
  colorPickerColorBlockInner?: HTMLElement;
  colorPickerColorBlock?: HTMLElement;
  colorPickerInnerContentSelect?: HTMLElement;
  colorPickerPanelPalette?: HTMLElement;
  colorPickerPanelSaturation?: HTMLElement;
  colorPickerInputContainerSelect?: HTMLElement;
  colorPickerInputContainerInputColor?: HTMLElement;
  colorPickerInputContainerInputNumber?: HTMLElement;
  colorPickerInputContainerSelectItem?: HTMLElement;
  colorPickerPaletteSelect: boolean;
  colorPickerPanelDotInner?: HTMLElement;
  static get observedAttributes(): string[] {
    return ['disabled', 'value', 'sheet'];
  }
  constructor() {
    super();
    this._shadowDom = this.shadowRoot || this.attachShadow({ mode: 'closed' });
    adoptStyles(this._shadowDom, colorPickerCss);

    let popoverBlock = this._shadowDom.querySelector('r-popover') as HTMLElement | null;
    let popoverContent = this._shadowDom.querySelector('r-content') as HTMLElement | null;
    let colorpicker = this._shadowDom.querySelector('.ran-colorpicker-block') as HTMLDivElement | null;
    let colorpickerInner = this._shadowDom.querySelector('.ran-colorpicker-inner') as HTMLDivElement | null;

    if (!popoverBlock || !popoverContent || !colorpicker || !colorpickerInner) {
      colorpickerInner = Div().class('ran-colorpicker-inner').build() as HTMLDivElement;
      colorpicker = Div().class('ran-colorpicker-block').children(colorpickerInner).build() as HTMLDivElement;
      popoverContent = View('r-content').class('ran-content').build() as HTMLElement;
      popoverBlock = View('r-popover')
        .class('ran-popover')
        .children(colorpicker, popoverContent)
        .build() as HTMLElement;
      this._shadowDom.appendChild(popoverBlock);
    }

    this.popoverBlock = popoverBlock;
    this.popoverContent = popoverContent;
    this.colorpicker = colorpicker;
    this.colorpickerInner = colorpickerInner;

    this.colorPickerPaletteSelect = false;
    this.createContext();
  }
  get value(): string {
    return this.context?.value.getter() || '';
  }
  set value(value: string) {
    this.setAttribute('value', value);
    this.updateColorValue(value);
  }
  get sheet(): string {
    return this.getAttribute('sheet') || '';
  }
  set sheet(value: string) {
    this.setAttribute('sheet', value || '');
  }
  handlerExternalCss = (): void => {
    if (!this.sheet) return;
    adoptSheetText(this._shadowDom, this.sheet);
  };
  createContext = (): void => {
    this.context = {
      value: this.createColorValueSignal(),
      disabled: this.createColorDisabled(),
      hue: this.createColorHue(),
      saturation: this.createColorSaturation(),
      lightness: this.createColorLightness(),
      transparency: this.createColorTransparency(),
    };
  };
  /**
   * @description:  0 - 360 色相 hue
   * @param {*} Signal
   * @return {*}
   */
  createColorHue = (): Signal<number> => {
    const [getter, setter] = createSignal<number>(0, {
      subscriber: [
        this.updateColorPickerPanelSaturationBackground,
        this.updateColorPickerPanelSliderHueProgressPercent,
        this.updateColorPickerPanelSliderAlphaProgressWrap,
        this.updateColorPickerPanelSliderAlphaProgressDot,
        this.updateColorPickerColorBlockInnerBackground,
        this.updateColorPickerPanelSliderHueProgressDot,
      ],
    });
    return { getter, setter };
  };
  /**
   * @description: 0 - 100 饱和度 x
   * @param {*} Signal
   * @return {*}
   */
  createColorSaturation = (): Signal<number> => {
    const [getter, setter] = createSignal(100, {
      subscriber: [
        this.updateColorPickerPanelSliderAlphaProgressWrap,
        this.updateColorPickerPanelSliderAlphaProgressDot,
        this.updateColorPickerColorBlockInnerBackground,
      ],
    });
    return { getter, setter };
  };
  /**
   * @description: 0 - 100 亮度 y
   * @param {*} Signal
   * @return {*}
   */
  createColorLightness = (): Signal<number> => {
    const [getter, setter] = createSignal(100, {
      subscriber: [
        this.updateColorPickerPanelSliderAlphaProgressWrap,
        this.updateColorPickerPanelSliderAlphaProgressDot,
        this.updateColorPickerColorBlockInnerBackground,
      ],
    });
    return { getter, setter };
  };
  /**
   * @description:  0 - 100 透明度
   * @param {*} Signal
   * @return {*}
   */
  createColorTransparency = (): Signal<number> => {
    const [getter, setter] = createSignal(80, {
      subscriber: [
        this.updateColorPickerPanelSliderAlphaProgressPercent,
        this.updateColorPickerColorBlockInnerBackground,
        this.updateColorPickerPanelSliderAlphaProgressDot,
      ],
    });
    return { getter, setter };
  };
  createColorDisabled = (): Signal<boolean> => {
    const [getter, setter] = createSignal(true, { subscriber: [] });
    return { getter, setter };
  };
  createColorValueSignal = (): Signal<string> => {
    const [getter, setter] = createSignal('', {
      subscriber: [this.updateColorValue],
    });
    return { getter, setter };
  };
  generateHue2rgb = (): string => {
    const { hue } = this.context;
    const { r, g, b } = hsv2rgb(hue.getter(), 100, 100);
    return `rgb(${r}, ${g}, ${b})`;
  };
  generateHsv2Rgb = (): string => {
    const { r, g, b } = this.generateHsv2Rgba();
    return `rgb(${r}, ${g}, ${b})`;
  };
  generateHsv2Rgba = (): RGBA => {
    const { hue, saturation, lightness, transparency } = this.context;
    const { r, g, b } = hsv2rgb(hue.getter(), saturation.getter(), lightness.getter());
    return { r, g, b, a: transparency.getter() / 100 };
  };
  generateHsv2RgbaValue = (): string => {
    const { r, g, b, a } = this.generateHsv2Rgba();
    return `rgb(${r}, ${g}, ${b}, ${a})`;
  };
  generateColorPickerProgress = (): string => {
    const { r, g, b } = this.generateHsv2Rgba();
    return `linear-gradient(to right, rgba(255, 0, 4, 0), rgba(${r}, ${g}, ${b}, 1))`;
  };
  updateColorValue = (value: string): void => {
    if (value !== this.context?.value.getter()) {
      const hex = HEX_COLOR_REGEX.exec(value); // #1677FF #fff #FFF
      const rga = RGB_REGEX.exec(value.replace(/\s+/g, '')); // rgba(255, 255, 255, 0)
      const rgba = RGBA_REGEX.exec(value.replace(/\s+/g, '')); // rgb(255, 255, 255, 0)
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
        this.context.transparency.setter(Number(rgba[4]));
      } else if (rga) {
        const { h, s, v } = rgb2hsv(Number(rga[1]), Number(rga[2]), Number(rga[3]));
        this.context.hue.setter(h);
        this.context.saturation.setter(s);
        this.context.lightness.setter(v);
        this.context.transparency.setter(100);
      } else {
        return;
      }
      this.setAttribute('value', value);
      this.colorpickerInner.style.setProperty('background', value);
      this.context?.value.setter(value);
    }
  };
  updateColorPickerPanelSliderHueProgressPercent = (hue: number): void => {
    this.colorPickerPanelSliderHue?.setAttribute('percent', `${hue / 360}`);
  };
  updateColorPickerPanelSliderAlphaProgressPercent = (alpha: number): void => {
    this.colorPickerPanelSliderAlpha?.setAttribute('percent', `${alpha / 100}`);
  };
  updateColorPickerPanelSliderAlphaProgressWrap = (): void => {
    this.colorPickerPanelSliderAlpha?.style.setProperty(
      '--ran-progress-wrap-background',
      this.generateColorPickerProgress(),
    );
  };
  updateColorPickerPanelSliderAlphaProgressDot = (): void => {
    this.colorPickerPanelSliderAlpha?.style.setProperty('--ran-progress-dot-background', this.generateHsv2RgbaValue());
  };
  updateColorPickerPanelSliderHueProgressDot = (): void => {
    this.colorPickerPanelSliderHue?.style.setProperty('--ran-progress-dot-background', this.generateHue2rgb());
  };
  updateColorPickerColorBlockInnerBackground = (): void => {
    this.colorPickerColorBlockInner?.style.setProperty('background', this.generateHsv2RgbaValue());
  };
  updateColorPickerPanelSaturationBackground = (): void => {
    this.colorPickerPanelSaturation?.style.setProperty('background-color', this.generateHue2rgb());
  };
  clickStop = (e: MouseEvent): void => {
    e.stopPropagation();
    e.preventDefault();
  };
  changeColorPalettePositionByContext = (): void => {
    window.requestAnimationFrame(() => {
      this.updateColorValue(this.value);
      if (!this.colorPickerPanelPalette) return;
      if (!this.context?.lightness.getter || !this.context?.saturation.getter) return;
      const { width, height } = this.colorPickerPanelPalette?.getBoundingClientRect() || {};
      const limitY = height - (this.context.lightness.getter() / 100) * height;
      const limitX = (this.context.saturation.getter() / 100) * width;
      this.colorPickerPanelDot?.style.setProperty('top', `${limitY - BOT_WIDTH}px`);
      this.colorPickerPanelDot?.style.setProperty('left', `${limitX - BOT_WIDTH}px`);
    });
  };
  changeColorPalettePosition = (offsetX: number, offsetY: number): void => {
    if (!this.colorPickerPanelPalette) return;
    if (!this.context?.lightness.getter || !this.context?.saturation.getter) return;
    const { width, height } = this.colorPickerPanelPalette?.getBoundingClientRect() || {};
    const limitY = height - range(offsetY, 0, height);
    const limitX = range(offsetX, 0, width);
    this.context.saturation.setter((limitX / width) * 100); // 饱和度
    this.context.lightness.setter((limitY / height) * 100);
    window.requestAnimationFrame(() => {
      this.colorPickerPanelDot?.style.setProperty('top', `${offsetY - BOT_WIDTH}px`);
      this.colorPickerPanelDot?.style.setProperty('left', `${offsetX - BOT_WIDTH}px`);
    });
  };
  clickColorPalette = (e: MouseEvent): void => {
    const { offsetX, offsetY } = e;
    this.changeColorPalettePosition(offsetX, offsetY);
  };
  createColorPickerProgress = (): void => {
    // progress
    this.colorPickerPanelSliderHue = View('r-progress')
      .class('ran-color-picker-slider-container-group-hue')
      .attr('type', 'drag')
      .style(
        '--ran-progress-wrap-background',
        'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
      )
      .attr('percent', `${this.context.hue.getter() / 360}`)
      .build() as HTMLElement;

    this.colorPickerPanelSliderHue.addEventListener('change', this.changeColorPickerHue);
    this.updateColorPickerPanelSliderHueProgressDot();

    this.colorPickerPanelSliderAlpha = View('r-progress')
      .class('ran-color-picker-slider-container-group-alpha')
      .attr('type', 'drag')
      .attr('percent', `${this.context.transparency.getter() / 100}`)
      .build() as HTMLElement;

    this.colorPickerPanelSliderAlpha.addEventListener('change', this.changeColorPickerAlpha);
    this.updateColorPickerPanelSliderAlphaProgressWrap();
    this.updateColorPickerPanelSliderAlphaProgressDot();

    this.colorPickerPanelSliderGroup = Div()
      .class('ran-color-picker-slider-container-group')
      .children(this.colorPickerPanelSliderHue, this.colorPickerPanelSliderAlpha)
      .build() as HTMLDivElement;

    this.colorPickerColorBlockInner = Div()
      .class('ran-color-picker-slider-container-color-block-inner')
      .build() as HTMLElement;

    this.updateColorPickerColorBlockInnerBackground();

    this.colorPickerColorBlock = Div()
      .class('ran-color-picker-slider-container-color-block')
      .children(this.colorPickerColorBlockInner)
      .build() as HTMLElement;

    this.colorPickerPanelSliderContainer = Div()
      .class('ran-color-picker-slider-container')
      .children(this.colorPickerPanelSliderGroup, this.colorPickerColorBlock)
      .build() as HTMLDivElement;
  };
  changeColorPickerHue = (e: Event): void => {
    this.context.hue.setter((e as CustomEvent).detail.value * HUE);
  };
  changeColorPickerAlpha = (e: Event): void => {
    this.context.transparency.setter((e as CustomEvent).detail.value * 100);
  };
  createColorPickerSelect = (): void => {
    this.colorPickerPanelSaturation = Div().class('ran-color-picker-saturation').build() as HTMLElement;
    this.updateColorPickerPanelSaturationBackground();

    this.colorPickerPanelDotInner = Div().class('ran-color-picker-palette-dot-inner').build() as HTMLElement;

    this.colorPickerPanelDot = Div()
      .class('ran-color-picker-palette-dot')
      .children(this.colorPickerPanelDotInner)
      .build() as HTMLDivElement;

    this.colorPickerPanelDot.addEventListener('mousedown', this.mouseDownColorPickerPalette);
    document.body.addEventListener('mousemove', this.mouseMoveColorPickerPalette);
    this.colorPickerPanelDot.addEventListener('mouseup', this.mouseUpColorPickerPalette);

    this.colorPickerPanelPalette = Div()
      .class('ran-color-picker-palette')
      .children(this.colorPickerPanelDot, this.colorPickerPanelSaturation)
      .build() as HTMLElement;

    this.colorPickerPanelPalette.addEventListener('mousedown', this.clickColorPalette);

    this.colorPickerInnerContentSelect = Div()
      .class('ran-color-picker-select')
      .children(this.colorPickerPanelPalette)
      .build() as HTMLElement;

    this.colorPickerPanel = Div()
      .class('ran-color-picker-panel')
      .children(this.colorPickerInnerContentSelect)
      .build() as HTMLElement;
  };
  createColorPickerInput = (): void => {
    const colorPickerInputContainerId = `${performance.now()}`.replace('.', '');

    this.colorPickerInputContainerSelectItem = View('r-select')
      .attr('value', 'HEX')
      .class('ran-color-picker-input-container-select-item')
      .attr('type', 'text')
      .attr('getPopupContainerId', colorPickerInputContainerId)
      .children(...['HEX', 'HSB', 'RGB'].map((item) => View('r-option').attr('value', item).text(item).build()))
      .build() as HTMLElement;

    this.colorPickerInputContainerSelect = Div()
      .class('ran-color-picker-input-container-select')
      .id(colorPickerInputContainerId)
      .children(this.colorPickerInputContainerSelectItem)
      .build() as HTMLElement;

    this.colorPickerInputContainerInputColor = View('r-input')
      .class('ran-color-picker-input-container-input-color')
      .build() as HTMLElement;

    this.colorPickerInputContainerInputNumber = View('r-input')
      .class('ran-color-picker-input-container-input-number')
      .build() as HTMLElement;

    this.colorPickerInputContainer = Div()
      .class('ran-color-picker-input-container')
      .children(
        this.colorPickerInputContainerSelect,
        this.colorPickerInputContainerInputColor,
        this.colorPickerInputContainerInputNumber,
      )
      .build() as HTMLElement;
  };
  openColorPicker = (): void => {
    if (this.colorPickerInner) return;
    this.colorPickerInner = Div().class('ran-color-picker-inner').build() as HTMLDivElement;
    this.colorPickerInnerContent = Div().class('ran-color-picker-inner-content').build() as HTMLDivElement;
    this.createColorPickerProgress();
    this.createColorPickerSelect();
    this.createColorPickerInput();
    if (this.colorPickerPanel) {
      this.colorPickerInnerContent.appendChild(this.colorPickerPanel);
    }
    if (this.colorPickerPanelSliderContainer) {
      this.colorPickerInnerContent.appendChild(this.colorPickerPanelSliderContainer);
    }
    if (this.colorPickerInputContainer) {
      this.colorPickerInnerContent.appendChild(this.colorPickerInputContainer);
    }
    this.colorPickerInner.appendChild(this.colorPickerInnerContent);
    this.popoverContent.appendChild(this.colorPickerInner);
    this.changeColorPalettePositionByContext();
  };
  mouseMoveColorPickerPalette = (e: MouseEvent): void => {
    if (!this.colorPickerPanelPalette || !this.colorPickerPaletteSelect) return;
    const { pageX, pageY } = e;
    const { top = 0, left = 0, width, height } = this.colorPickerPanelPalette?.getBoundingClientRect() || {};
    const limitY = range(pageY - top - BOT_WIDTH, -BOT_WIDTH, height - BOT_WIDTH);
    const limitX = range(pageX - left - BOT_WIDTH, -BOT_WIDTH, width - BOT_WIDTH);
    this.context.saturation.setter((limitX / width) * 100); // 饱和度
    this.context.lightness.setter((limitY / height) * 100);
    window.requestAnimationFrame(() => {
      this.colorPickerPanelDot?.style.setProperty('top', `${limitY}px`);
      this.colorPickerPanelDot?.style.setProperty('left', `${limitX}px`);
    });
  };
  mouseDownColorPickerPalette = (e: MouseEvent): void => {
    e.stopPropagation();
    e.preventDefault();
    this.colorPickerPaletteSelect = true;
  };
  mouseUpColorPickerPalette = (): void => {
    this.colorPickerPaletteSelect = false;
  };
  connectedCallback(): void {
    this.handlerExternalCss();
    this.setAttribute('class', 'ran-colorpicker');
    this.popoverBlock.addEventListener('click', this.openColorPicker);
  }
  disconnectedCallback(): void {
    this.popoverBlock.removeEventListener('click', this.openColorPicker);
    this.colorPickerPanelDot?.removeEventListener('mousedown', this.mouseDownColorPickerPalette);
    document.body.removeEventListener('mousemove', this.mouseMoveColorPickerPalette);
    this.colorPickerPanelDot?.removeEventListener('mouseup', this.mouseUpColorPickerPalette);
    this.colorPickerPanelPalette?.removeEventListener('mousedown', this.clickColorPalette);
  }
  attributeChangedCallback(n: string, o: string, v: string): void {
    if (o !== v) {
      if (n === 'value') {
        this.updateColorValue(v);
      }
      if (n === 'sheet') {
        this.handlerExternalCss();
      }
    }
  }
}

function Custom() {
  if (typeof document !== 'undefined' && !customElements.get('r-colorpicker')) {
    customElements.define('r-colorpicker', ColorPicker);
    return ColorPicker;
  } else {
    return createCustomError('document is undefined or r-colorpicker is exist');
  }
}

export default Custom();
