import { addClassToElement, removeClassToElement } from 'ranuts';
import { HTMLElementSSR, createCustomError } from '@/utils/index';
import './index.less'


interface Context {
    checked: boolean;
}

export class Checkbox extends (HTMLElementSSR()!) {
    checkInput: HTMLInputElement;
    checkInner: HTMLSpanElement;
    context: Context;
    static get observedAttributes(): string[] {
        return ['disabled', 'icon', 'effect', 'iconSize', 'sheet'];
    }
    constructor() {
        super();
        this.setAttribute('class', 'ran-checkbox')
        this.checkInput = document.createElement('input')
        this.checkInput.setAttribute('class', 'ran-checkbox-input')
        this.checkInput.setAttribute('type', 'checkbox')
        this.checkInner = document.createElement('span')
        this.checkInner.setAttribute('class', 'ran-checkbox-inner')
        this.appendChild(this.checkInput)
        this.appendChild(this.checkInner)
        this.context = {
            checked: false
        }
    }
    get checked(): boolean {
        return this.context.checked
    }
    set checked(value: string) {
        this.setAttribute('checked', value);
        this.context.checked = !!value
        this.updateChecked()
    }
    updateChecked = (): void => {
        const { checked } = this.context
        if (checked) {
            addClassToElement(this, 'ran-checkbox-checked')
        } else {
            removeClassToElement(this, 'ran-checkbox-checked')
        }
    }
    update = (): void => {
        this.updateChecked()
    }
    onChange = (): void => {
        const { checked } = this.context
        this.context.checked = !checked
        this.dispatchEvent(
            new CustomEvent('change', {
                detail: {
                    checked: this.context.checked
                },
            }),
        );
        this.update()
    }
    connectedCallback(): void {
        this.addEventListener('click', this.onChange)
    }
    disconnectCallback(): void {
        this.removeEventListener('click', this.onChange)
    }
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void {

    }
}

function Custom() {
    if (typeof document !== 'undefined' && !customElements.get('r-checkbox')) {
        customElements.define('r-checkbox', Checkbox);
        return Checkbox;
    } else {
        return createCustomError('document is undefined or r-checkbox is exist');
    }
}

export default Custom();