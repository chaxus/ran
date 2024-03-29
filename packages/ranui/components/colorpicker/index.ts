import { range } from 'ranuts/utils';
import { HTMLElementSSR, createCustomError, createSignal } from '@/utils/index';
import { HEX_COLOR_REGEX, RGBA_REGEX, RGB_REGEX, hex2hsv, hsv2rgb, rgb2hsv } from '@/utils/color';
import '@/components/popover';
import '@/components/content';
import '@/shadowless/input';
import '@/shadowless/select';
import '@/components/option';
import '@/components/progress';
import './index.less';

// RGBA：red、green、blue, 透明度
// HSL：色相、饱和度、亮度，透明度
// HSB：色相、饱和度、明度，透明度
// HSV：色相、饱和度、明度，透明度

const BOT_WIDTH = 8;

const HUE = 360;

interface Context {
  disabled: Signal<boolean>;
  value: Signal<string>;
  hue: Signal<number>; // 0 - 360 色相 hue
  saturation: Signal<number>; // 0 - 100 饱和度 x
  lightness: Signal<number>; // 0 - 100 亮度 y
  transparency: Signal<number>; // 0 - 100 透明度
}

interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

interface Signal<T> {
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
  popoverBlock: HTMLElement;
  popoverContent: HTMLElement;
  colorPickerInner?: HTMLDivElement;
  colorPickerInnerContent?: HTMLDivElement;
  colorPickerPanel?: HTMLDivElement;
  colorPickerInputContainer?: HTMLDivElement;
  colorPickerPanelDot?: HTMLDivElement;
  colorPickerPanelSliderContainer?: HTMLDivElement;
  colorPickerPanelSliderGroup?: HTMLDivElement;
  colorPickerPanelSliderHue?: HTMLElement;
  colorPickerPanelSliderAlpha?: HTMLElement;
  colorPickerColorBlockInner?: HTMLDivElement;
  colorPickerColorBlock?: HTMLDivElement;
  colorPickerInnerContentSelect?: HTMLDivElement;
  colorPickerPanelPalette?: HTMLDivElement;
  colorPickerPanelSaturation?: HTMLDivElement;
  colorPickerInputContainerSelect?: HTMLElement;
  colorPickerInputContainerInputColor?: HTMLElement;
  colorPickerInputContainerInputNumber?: HTMLElement;
  colorPickerInputContainerSelectItem?: HTMLElement;
  colorPickerPaletteSelect: boolean;
  colorPickerPanelDotInner?: HTMLDivElement;
  static get observedAttributes(): string[] {
    return ['disabled', 'value'];
  }
  constructor() {
    super();
    this.setAttribute('class', 'ran-colorpicker');
    this.popoverBlock = document.createElement('r-popover');
    this.popoverBlock.setAttribute('class', 'ran-popover');
    this.popoverContent = document.createElement('r-content');
    this.popoverContent.setAttribute('class', 'ran-content');
    this.colorpicker = document.createElement('div');
    this.colorpicker.setAttribute('class', 'ran-colorpicker-block');
    this.colorpickerInner = document.createElement('div');
    this.colorpickerInner.setAttribute('class', 'ran-colorpicker-inner');
    this.popoverBlock.appendChild(this.colorpicker);
    this.popoverBlock.appendChild(this.popoverContent);
    this.colorpicker.appendChild(this.colorpickerInner);
    this.appendChild(this.popoverBlock);
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
    this.colorPickerPanelSliderAlpha?.style.setProperty('--ran-progress-wrap', this.generateColorPickerProgress());
  };
  updateColorPickerPanelSliderAlphaProgressDot = (): void => {
    this.colorPickerPanelSliderAlpha?.style.setProperty('--ran-progress-dot', this.generateHsv2RgbaValue());
  };
  updateColorPickerPanelSliderHueProgressDot = (): void => {
    this.colorPickerPanelSliderHue?.style.setProperty('--ran-progress-dot', this.generateHue2rgb());
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
    this.colorPickerPanelSliderContainer = document.createElement('div');
    this.colorPickerPanelSliderContainer.setAttribute('class', 'ran-color-picker-slider-container');
    this.colorPickerPanelSliderGroup = document.createElement('div');
    this.colorPickerPanelSliderGroup.setAttribute('class', 'ran-color-picker-slider-container-group');
    this.colorPickerPanelSliderHue = document.createElement('r-progress');
    this.updateColorPickerPanelSliderHueProgressDot();
    this.colorPickerPanelSliderHue.style.setProperty(
      '--ran-progress-wrap',
      'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
    );
    this.colorPickerPanelSliderHue.setAttribute('percent', `${this.context.hue.getter() / 360}`);
    this.colorPickerPanelSliderHue.addEventListener('change', this.changeColorPickerHue);
    this.colorPickerPanelSliderHue.setAttribute('type', 'drag');
    this.colorPickerPanelSliderHue.setAttribute('class', 'ran-color-picker-slider-container-group-hue');
    this.colorPickerPanelSliderAlpha = document.createElement('r-progress');
    this.updateColorPickerPanelSliderAlphaProgressDot();
    this.colorPickerPanelSliderAlpha.setAttribute('percent', `${this.context.transparency.getter() / 100}`);
    this.updateColorPickerPanelSliderAlphaProgressWrap();
    this.colorPickerPanelSliderAlpha.addEventListener('change', this.changeColorPickerAlpha);
    this.colorPickerPanelSliderAlpha.setAttribute('type', 'drag');
    this.colorPickerPanelSliderAlpha.setAttribute('class', 'ran-color-picker-slider-container-group-alpha');
    this.colorPickerPanelSliderGroup.appendChild(this.colorPickerPanelSliderHue);
    this.colorPickerPanelSliderGroup.appendChild(this.colorPickerPanelSliderAlpha);
    this.colorPickerPanelSliderContainer.appendChild(this.colorPickerPanelSliderGroup);
    this.colorPickerColorBlock = document.createElement('div');
    this.colorPickerColorBlock.setAttribute('class', 'ran-color-picker-slider-container-color-block');
    this.colorPickerColorBlockInner = document.createElement('div');
    this.colorPickerColorBlockInner.setAttribute('class', 'ran-color-picker-slider-container-color-block-inner');
    this.updateColorPickerColorBlockInnerBackground();
    this.colorPickerColorBlock.appendChild(this.colorPickerColorBlockInner);
    this.colorPickerPanelSliderContainer.appendChild(this.colorPickerColorBlock);
  };
  changeColorPickerHue = (e: Event): void => {
    this.context.hue.setter((<CustomEvent>e).detail.value * HUE);
  };
  changeColorPickerAlpha = (e: Event): void => {
    this.context.transparency.setter((<CustomEvent>e).detail.value * 100);
  };
  createColorPickerSelect = (): void => {
    this.colorPickerPanel = document.createElement('div');
    this.colorPickerPanel.setAttribute('class', 'ran-color-picker-panel');
    this.colorPickerInnerContentSelect = document.createElement('div');
    this.colorPickerInnerContentSelect.setAttribute('class', 'ran-color-picker-select');
    this.colorPickerPanel.appendChild(this.colorPickerInnerContentSelect);
    this.colorPickerPanelPalette = document.createElement('div');
    this.colorPickerPanelPalette.setAttribute('class', 'ran-color-picker-palette');
    this.colorPickerInnerContentSelect.appendChild(this.colorPickerPanelPalette);
    this.colorPickerPanelSaturation = document.createElement('div');
    this.colorPickerPanelSaturation.setAttribute('class', 'ran-color-picker-saturation');
    this.updateColorPickerPanelSaturationBackground();
    this.colorPickerPanelDot = document.createElement('div');
    this.colorPickerPanelDotInner = document.createElement('div');
    this.colorPickerPanelDotInner.setAttribute('class', 'ran-color-picker-palette-dot-inner');
    this.colorPickerPanelDot.setAttribute('class', 'ran-color-picker-palette-dot');
    this.colorPickerPanelDot.addEventListener('mousedown', this.mouseDownColorPickerPalette);
    document.body.addEventListener('mousemove', this.mouseMoveColorPickerPalette);
    this.colorPickerPanelDot.addEventListener('mouseup', this.mouseUpColorPickerPalette);
    this.colorPickerPanelDot.appendChild(this.colorPickerPanelDotInner);
    this.colorPickerPanelPalette.appendChild(this.colorPickerPanelDot);
    this.colorPickerPanelPalette.appendChild(this.colorPickerPanelSaturation);
    this.colorPickerPanelPalette.addEventListener('mousedown', this.clickColorPalette);
  };
  createColorPickerInput = (): void => {
    this.colorPickerInputContainer = document.createElement('div');
    this.colorPickerInputContainer.setAttribute('class', 'ran-color-picker-input-container');
    const colorPickerInputContainerId = `${performance.now()}`.replace('.', '');
    // select
    this.colorPickerInputContainerSelect = document.createElement('div');
    this.colorPickerInputContainerSelect.setAttribute('class', 'ran-color-picker-input-container-select');
    this.colorPickerInputContainerSelect.setAttribute('id', colorPickerInputContainerId);
    this.colorPickerInputContainerSelectItem = document.createElement('ra-select');
    this.colorPickerInputContainerSelectItem.setAttribute('value', 'HEX');
    this.colorPickerInputContainerSelectItem.setAttribute('class', 'ran-color-picker-input-container-select-item');
    this.colorPickerInputContainerSelectItem.setAttribute('type', 'text');
    this.colorPickerInputContainerSelectItem.setAttribute('getPopupContainerId', colorPickerInputContainerId);
    const colorSelectOption = ['HEX', 'HSB', 'RGB'];
    const Fragment = document.createDocumentFragment();
    colorSelectOption.forEach((item) => {
      const Option = document.createElement('r-option');
      Option.setAttribute('value', item);
      Option.innerText = item;
      Fragment.appendChild(Option);
    });
    this.colorPickerInputContainerSelectItem.appendChild(Fragment);
    this.colorPickerInputContainerSelect.appendChild(this.colorPickerInputContainerSelectItem);
    this.colorPickerInputContainer.appendChild(this.colorPickerInputContainerSelect);
    this.colorPickerInputContainerInputColor = document.createElement('ra-input');
    this.colorPickerInputContainerInputColor.setAttribute('class', 'ran-color-picker-input-container-input-color');
    this.colorPickerInputContainerInputNumber = document.createElement('ra-input');
    this.colorPickerInputContainerInputNumber.setAttribute('class', 'ran-color-picker-input-container-input-number');
    this.colorPickerInputContainer.appendChild(this.colorPickerInputContainerInputColor);
    this.colorPickerInputContainer.appendChild(this.colorPickerInputContainerInputNumber);
  };
  openColorPicker = (): void => {
    if (this.colorPickerInner) return;
    this.colorPickerInner = document.createElement('div');
    this.colorPickerInner.setAttribute('class', 'ran-color-picker-inner');
    this.colorPickerInnerContent = document.createElement('div');
    this.colorPickerInnerContent.setAttribute('class', 'ran-color-picker-inner-content');
    this.createColorPickerProgress();
    this.createColorPickerSelect();
    this.createColorPickerInput();
    this.colorPickerPanel && this.colorPickerInnerContent.appendChild(this.colorPickerPanel);
    this.colorPickerPanelSliderContainer &&
      this.colorPickerInnerContent.appendChild(this.colorPickerPanelSliderContainer);
    this.colorPickerInputContainer && this.colorPickerInnerContent.appendChild(this.colorPickerInputContainer);
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
  mouseUpColorPickerPalette = (e: MouseEvent): void => {
    this.colorPickerPaletteSelect = false;
  };
  connectedCallback(): void {
    this.popoverBlock.addEventListener('click', this.openColorPicker);
  }
  disconnectCallback(): void {
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
