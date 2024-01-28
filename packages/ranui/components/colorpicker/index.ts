import { addClassToElement, removeClassToElement } from 'ranuts';
import { HTMLElementSSR, createCustomError } from '@/utils/index';
import '@/components/popover'
import '@/components/content'
import './index.less'

// RGBA： red、green、blue, 透明度 
// HSL： 色相、饱和度、亮度，透明度
// HSB： 色相、饱和度、明度，透明度
// HSV： 色相、饱和度、明度，透明度

interface Context {
    disabled: boolean;
    value: string
}

export class ColorPicker extends (HTMLElementSSR()!) {
    colorpicker: HTMLDivElement;
    colorpickerInner: HTMLDivElement;
    context: Context;
    popoverBlock: HTMLElement;
    popoverContent: HTMLElement;
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
        this.context = {
            value: '',
            disabled: false
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
    openColorPicker = (): void => {
        this.popoverContent.innerHTML = '1111'
    }
    connectedCallback(): void {
        this.addEventListener('click', this.openColorPicker)
    }
    disconnectCallback(): void {
        this.removeEventListener('click', this.openColorPicker)
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