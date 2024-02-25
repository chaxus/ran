import { addClassToElement, range, removeClassToElement } from 'ranuts';
import { HTMLElementSSR, createCustomError } from '@/utils/index';
import { hsv2rgb } from '@/utils/color';
import '@/components/popover'
import '@/components/content'
import '@/components/input'
import '@/components/select'
import '@/components/option'
import '@/components/progress'
import './index.less'

// RGBA： red、green、blue, 透明度 
// HSL： 色相、饱和度、亮度，透明度
// HSB： 色相、饱和度、明度，透明度
// HSV： 色相、饱和度、明度，透明度

interface Context {
    disabled: boolean;
    value: string
    h: number,
    s: number,
    v: number,
    a: number
}

export class ColorPicker extends (HTMLElementSSR()!) {
    colorpicker: HTMLDivElement;
    colorpickerInner: HTMLDivElement;
    context: Context;
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
        this.setAttribute('class', 'ran-colorpicker')
        this.popoverBlock = document.createElement('r-popover')
        this.popoverBlock.setAttribute('class', 'ran-popover')
        this.popoverContent = document.createElement('r-content')
        this.popoverContent.setAttribute('class', 'ran-content')
        this.colorpicker = document.createElement('div')
        this.colorpicker.setAttribute('class', 'ran-colorpicker-block')
        this.colorpickerInner = document.createElement('div')
        this.colorpickerInner.setAttribute('class', 'ran-colorpicker-inner')
        this.popoverBlock.appendChild(this.colorpicker)
        this.popoverBlock.appendChild(this.popoverContent)
        this.colorpicker.appendChild(this.colorpickerInner)
        this.appendChild(this.popoverBlock)
        this.colorPickerPaletteSelect = false
        this.context = {
            value: '',
            disabled: false,
            h: 0,
            s: 0,
            v: 1,
            a: 0
        }
    }
    get value(): string {
        return this.context.value
    }
    set value(value: string) {
        this.setAttribute('value', value);
        this.updateColorValue(value)
    }
    updateColorValue = (value: string): void => {
        if (value !== this.context.value) {
            this.colorpickerInner.style.setProperty('background', value)
            this.context.value = value
        }
    }
    clickStop = (e: MouseEvent): void => {
        e.stopPropagation()
        e.preventDefault()
    }
    clickColorPalette = (e: MouseEvent): void => {
        if (!this.colorPickerPanelPalette) return
        const { offsetX, offsetY } = e
        const { width, height } = this.colorPickerPanelPalette?.getBoundingClientRect() || {}
        const limitY = range(offsetX - 8, -8, height - 8)
        const limitX = range(offsetX - 8, -8, width - 8)
        this.context.s = limitX / width // 饱和度
        this.context.v = limitY / height
        // this.colorPickerPanelSliderHue?.style.setProperty('--ran-progress-wrap', this.generateColorPickerProgress())
        this.colorPickerPanelSliderAlpha?.style.setProperty('--ran-progress-wrap', this.generateColorPickerProgress())
        this.colorPickerPanelSliderAlpha?.style.setProperty('--ran-progress-dot', this.generateColorPickerPanelSaturationRgba())
        this.colorPickerPanelSliderHue?.style.setProperty('--ran-progress-dot', this.generateColorPickerPanelSaturationRgba())
        this.colorPickerColorBlockInner?.style.setProperty('background', this.generateColorPickerColorBlockInner())
        this.colorPickerPanelSaturation?.style.setProperty('background-color', this.generateColorPickerPanelSaturationRgba())
        window.requestAnimationFrame(() => {
            this.colorPickerPanelDot?.style.setProperty('top', `${offsetY - 8}px`)
            this.colorPickerPanelDot?.style.setProperty('left', `${offsetX - 8}px`)
        })
    }
    createColorPickerProgress = (): void => {
        // progress
        this.colorPickerPanelSliderContainer = document.createElement('div')
        this.colorPickerPanelSliderContainer.setAttribute('class', 'ran-color-picker-slider-container')
        this.colorPickerPanelSliderGroup = document.createElement('div')
        this.colorPickerPanelSliderGroup.setAttribute('class', 'ran-color-picker-slider-container-group')
        this.colorPickerPanelSliderHue = document.createElement('r-progress')
        this.colorPickerPanelSliderHue.style.setProperty('--ran-progress-dot', this.generateColorPickerPanelSaturationRgba())
        this.colorPickerPanelSliderHue.style.setProperty('--ran-progress-wrap', 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)')
        this.colorPickerPanelSliderHue.addEventListener('change', this.changeColorPickerHue)
        this.colorPickerPanelSliderHue.setAttribute('type', 'drag')
        this.colorPickerPanelSliderHue.setAttribute('class', 'ran-color-picker-slider-container-group-hue')
        this.colorPickerPanelSliderAlpha = document.createElement('r-progress')
        this.colorPickerPanelSliderAlpha.style.setProperty('--ran-progress-dot', this.generateColorPickerPanelSaturationRgba())
        this.colorPickerPanelSliderAlpha.style.setProperty('--ran-progress-wrap', this.generateColorPickerProgress())
        this.colorPickerPanelSliderAlpha.addEventListener('change', this.changeColorPickerAlpha)
        this.colorPickerPanelSliderAlpha.setAttribute('type', 'drag')
        this.colorPickerPanelSliderAlpha.setAttribute('class', 'ran-color-picker-slider-container-group-alpha')
        this.colorPickerPanelSliderGroup.appendChild(this.colorPickerPanelSliderHue)
        this.colorPickerPanelSliderGroup.appendChild(this.colorPickerPanelSliderAlpha)
        this.colorPickerPanelSliderContainer.appendChild(this.colorPickerPanelSliderGroup)
        this.colorPickerColorBlock = document.createElement('div')
        this.colorPickerColorBlock.setAttribute('class', 'ran-color-picker-slider-container-color-block')
        this.colorPickerColorBlockInner = document.createElement('div')
        this.colorPickerColorBlockInner.setAttribute('class', 'ran-color-picker-slider-container-color-block-inner')
        this.colorPickerColorBlockInner.style.setProperty('background', this.generateColorPickerColorBlockInner())
        this.colorPickerColorBlock.appendChild(this.colorPickerColorBlockInner)
        this.colorPickerPanelSliderContainer.appendChild(this.colorPickerColorBlock)
    }
    changeColorPickerHue = (e: Event): void => {
        this.context.h = (<CustomEvent>e).detail.value * 360
        // this.colorPickerPanelSliderHue?.style.setProperty('--ran-progress-wrap', this.generateColorPickerProgress())
        this.colorPickerPanelSliderAlpha?.style.setProperty('--ran-progress-wrap', this.generateColorPickerProgress())
        this.colorPickerPanelSliderAlpha?.style.setProperty('--ran-progress-dot', this.generateColorPickerPanelSaturationRgba())
        this.colorPickerPanelSliderHue?.style.setProperty('--ran-progress-dot', this.generateColorPickerPanelSaturationRgba())
        this.colorPickerColorBlockInner?.style.setProperty('background', this.generateColorPickerColorBlockInner())
        this.colorPickerPanelSaturation?.style.setProperty('background-color', this.generateColorPickerPanelSaturationRgba())
    }
    changeColorPickerAlpha = (e: Event): void => {
        this.context.a = (<CustomEvent>e).detail.value
        // this.colorPickerPanelSliderHue?.style.setProperty('--ran-progress-wrap', this.generateColorPickerProgress())
        this.colorPickerPanelSliderAlpha?.style.setProperty('--ran-progress-wrap', this.generateColorPickerProgress())
        this.colorPickerPanelSliderAlpha?.style.setProperty('--ran-progress-dot', this.generateColorPickerPanelSaturationRgba())
        this.colorPickerPanelSliderHue?.style.setProperty('--ran-progress-dot', this.generateColorPickerPanelSaturationRgba())
        this.colorPickerColorBlockInner?.style.setProperty('background', this.generateColorPickerColorBlockInner())
        this.colorPickerPanelSaturation?.style.setProperty('background-color', this.generateColorPickerPanelSaturationRgba())
    }
    createColorPickerSelect = (): void => {
        this.colorPickerPanel = document.createElement('div')
        this.colorPickerPanel.setAttribute('class', 'ran-color-picker-panel')
        this.colorPickerInnerContentSelect = document.createElement('div')
        this.colorPickerInnerContentSelect.setAttribute('class', 'ran-color-picker-select')
        this.colorPickerPanel.appendChild(this.colorPickerInnerContentSelect)
        this.colorPickerPanelPalette = document.createElement('div')
        this.colorPickerPanelPalette.setAttribute('class', 'ran-color-picker-palette')
        this.colorPickerInnerContentSelect.appendChild(this.colorPickerPanelPalette)
        this.colorPickerPanelSaturation = document.createElement('div')
        this.colorPickerPanelSaturation.setAttribute('class', 'ran-color-picker-saturation')
        this.colorPickerPanelSaturation.style.setProperty('background-color', this.generateColorPickerPanelSaturationRgba())
        this.colorPickerPanelDot = document.createElement('div')
        this.colorPickerPanelDotInner = document.createElement('div')
        this.colorPickerPanelDotInner.setAttribute('class', 'ran-color-picker-palette-dot-inner')
        this.colorPickerPanelDot.setAttribute('class', 'ran-color-picker-palette-dot')
        this.colorPickerPanelDot.addEventListener('mousedown', this.mouseDownColorPickerPalette)
        document.body.addEventListener('mousemove', this.mouseMoveColorPickerPalette)
        this.colorPickerPanelDot.addEventListener('mouseup', this.mouseUpColorPickerPalette)
        this.colorPickerPanelDot.appendChild(this.colorPickerPanelDotInner)
        this.colorPickerPanelPalette.appendChild(this.colorPickerPanelDot)
        this.colorPickerPanelPalette.appendChild(this.colorPickerPanelSaturation)
        this.colorPickerPanelPalette.addEventListener('mousedown', this.clickColorPalette)
    }
    createColorPickerInput = (): void => {
        this.colorPickerInputContainer = document.createElement('div')
        this.colorPickerInputContainer.setAttribute('class', 'ran-color-picker-input-container')
        const colorPickerInputContainerId = `${performance.now()}`.replace('.', '')
        // select
        this.colorPickerInputContainerSelect = document.createElement('div')
        this.colorPickerInputContainerSelect.setAttribute('class', 'ran-color-picker-input-container-select')
        this.colorPickerInputContainerSelect.setAttribute('id', colorPickerInputContainerId)
        this.colorPickerInputContainerSelectItem = document.createElement('r-select')
        this.colorPickerInputContainerSelectItem.setAttribute('value', 'HEX')
        this.colorPickerInputContainerSelectItem.setAttribute('class', 'ran-color-picker-input-container-select-item')
        this.colorPickerInputContainerSelectItem.setAttribute('getPopupContainerId', colorPickerInputContainerId)
        const colorSelectOption = ['HEX', 'HSB', 'RGB']
        const Fragment = document.createDocumentFragment()
        colorSelectOption.forEach(item => {
            const Option = document.createElement('r-option')
            Option.setAttribute('value', item)
            Option.innerText = item
            Fragment.appendChild(Option)
        })
        this.colorPickerInputContainerSelectItem.appendChild(Fragment)
        this.colorPickerInputContainerSelect.appendChild(this.colorPickerInputContainerSelectItem)
        this.colorPickerInputContainer.appendChild(this.colorPickerInputContainerSelect)
        this.colorPickerInputContainerInputColor = document.createElement('r-input')
        this.colorPickerInputContainerInputColor.setAttribute('class', 'ran-color-picker-input-container-input-color')
        this.colorPickerInputContainerInputNumber = document.createElement('r-input')
        this.colorPickerInputContainerInputNumber.setAttribute('class', 'ran-color-picker-input-container-input-number')
        this.colorPickerInputContainer.appendChild(this.colorPickerInputContainerInputColor)
        this.colorPickerInputContainer.appendChild(this.colorPickerInputContainerInputNumber)
    }
    openColorPicker = (): void => {
        if (this.colorPickerInner) return
        this.colorPickerInner = document.createElement('div')
        this.colorPickerInner.setAttribute('class', 'ran-color-picker-inner')
        this.colorPickerInnerContent = document.createElement('div')
        this.colorPickerInnerContent.setAttribute('class', 'ran-color-picker-inner-content')
        this.createColorPickerProgress()
        this.createColorPickerSelect()
        this.createColorPickerInput()
        this.colorPickerPanel && this.colorPickerInnerContent.appendChild(this.colorPickerPanel)
        this.colorPickerPanelSliderContainer && this.colorPickerInnerContent.appendChild(this.colorPickerPanelSliderContainer)
        this.colorPickerInputContainer && this.colorPickerInnerContent.appendChild(this.colorPickerInputContainer)
        this.colorPickerInner.appendChild(this.colorPickerInnerContent)
        this.popoverContent.appendChild(this.colorPickerInner)
    }
    mouseMoveColorPickerPalette = (e: MouseEvent): void => {
        if (!this.colorPickerPanelPalette || !this.colorPickerPaletteSelect) return
        const { pageX, pageY } = e
        const { top = 0, left = 0, width, height } = this.colorPickerPanelPalette?.getBoundingClientRect() || {}
        const limitY = range(pageY - top - 8, -8, height - 8)
        const limitX = range(pageX - left - 8, -8, width - 8)
        this.context.s = limitX / width // 饱和度
        this.context.v = limitY / height
        // this.colorPickerPanelSliderHue?.style.setProperty('--ran-progress-wrap', this.generateColorPickerProgress())
        this.colorPickerPanelSliderAlpha?.style.setProperty('--ran-progress-wrap', this.generateColorPickerProgress())
        this.colorPickerPanelSliderAlpha?.style.setProperty('--ran-progress-dot', this.generateColorPickerPanelSaturationRgba())
        this.colorPickerPanelSliderHue?.style.setProperty('--ran-progress-dot', this.generateColorPickerPanelSaturationRgba())
        this.colorPickerColorBlockInner?.style.setProperty('background', this.generateColorPickerColorBlockInner())
        this.colorPickerPanelSaturation?.style.setProperty('background-color', this.generateColorPickerPanelSaturationRgba())
        window.requestAnimationFrame(() => {
            this.colorPickerPanelDot?.style.setProperty('top', `${limitY}px`)
            this.colorPickerPanelDot?.style.setProperty('left', `${limitX}px`)
        })
    }
    generateColorPickerPanelSaturationRgba = (): string => {
        const { h, s, v, a } = this.context
        const { r, g, b } = hsv2rgb(h, 100, 100)
        return `rgb(${r}, ${g}, ${b})`
    }
    generateColorPickerPanelDotInnerRgba = (): string => {
        const { h, s, v } = this.context
        const { r, g, b } = hsv2rgb(h, s * 100, v * 100)
        return `rgb(${r}, ${g}, ${b})`
    }
    generateColorPickerColorBlockInner = (): string => {
        const { h, s, v, a } = this.context
        const { r, g, b } = hsv2rgb(h, s * 100, v * 100)
        return `rgb(${r}, ${g}, ${b}, ${a})`
    }
    generateColorPickerProgress = (): string => {
        const { h, s, v} = this.context
        const { r, g, b } = hsv2rgb(h, s * 100, v * 100)
        return `linear-gradient(to right, rgba(255, 0, 4, 0), rgb(${r}, ${g}, ${b}))`
    }
    mouseDownColorPickerPalette = (e: MouseEvent): void => {
        e.stopPropagation()
        e.preventDefault()
        this.colorPickerPaletteSelect = true
    }
    mouseUpColorPickerPalette = (e: MouseEvent): void => {
        this.colorPickerPaletteSelect = false
    }
    connectedCallback(): void {
        this.popoverBlock.addEventListener('click', this.openColorPicker)
    }
    disconnectCallback(): void {
        this.popoverBlock.removeEventListener('click', this.openColorPicker)
        this.colorPickerPanelDot?.removeEventListener('mousedown', this.mouseDownColorPickerPalette)
        document.body.removeEventListener('mousemove', this.mouseMoveColorPickerPalette)
        this.colorPickerPanelDot?.removeEventListener('mouseup', this.mouseUpColorPickerPalette)
        this.colorPickerPanelPalette?.removeEventListener('mousedown', this.clickColorPalette)
    }
    attributeChangedCallback(n: string, o: string, v: string): void {
        if (o !== v) {
            if (n === 'value') {
                this.updateColorValue(v)
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