import { addClassToElement, removeClassToElement } from 'ranuts/utils';
import { HTMLElementSSR, createCustomError, falseList } from '@/utils/index';
import { Div, InputBuilder, Span } from '@/utils/builder';
import { adoptSheetText, adoptStyles } from '@/utils/style';
import checkboxCss from './index.less?inline';

export interface Context {
  checked: boolean;
}

export class Checkbox extends (HTMLElementSSR()!) {
  checkInput: HTMLInputElement;
  checkInner: HTMLSpanElement;
  context: Context;
  container: HTMLElement;
  _shadowDom: ShadowRoot;
  static get observedAttributes(): string[] {
    return ['disabled', 'checked', 'value', 'sheet'];
  }
  constructor() {
    super();
    this._shadowDom = this.shadowRoot || this.attachShadow({ mode: 'closed' });
    adoptStyles(this._shadowDom, checkboxCss);

    let wrap = this._shadowDom.querySelector('.ran-checkbox') as HTMLElement;
    if (!wrap) {
      wrap = Div()
        .class('ran-checkbox')
        .part('checkbox')
        .children(
          InputBuilder().class('ran-checkbox-input').part('input').attr('type', 'checkbox'),
          Span().class('ran-checkbox-inner').part('inner'),
        )
        .build();
      this._shadowDom.appendChild(wrap);
    }

    this.container = wrap;
    this.checkInput = wrap.querySelector('.ran-checkbox-input') as HTMLInputElement;
    this.checkInner = wrap.querySelector('.ran-checkbox-inner') as HTMLSpanElement;

    this.context = {
      checked: false,
    };
  }
  get disabled(): string {
    return this.getAttribute('disabled') || '';
  }
  set disabled(value: string) {
    this.setAttribute('disabled', value);
  }
  get value(): string {
    const checked = this.getAttribute('value');
    if (falseList.includes(checked)) {
      this.context.checked = false;
    }
    return `${this.context.checked}`;
  }
  set value(value: string) {
    if (falseList.includes(value)) {
      this.setAttribute('value', 'false');
      this.context.checked = false;
    } else {
      this.setAttribute('value', 'true');
      this.context.checked = true;
    }
    this.updateChecked();
  }
  get checked(): string {
    const checked = this.getAttribute('checked');
    if (falseList.includes(checked)) {
      this.context.checked = false;
    }
    return `${this.context.checked}`;
  }
  set checked(value: string) {
    if (falseList.includes(value)) {
      this.setAttribute('checked', 'false');
      this.context.checked = false;
    } else {
      this.setAttribute('checked', 'true');
      this.context.checked = true;
    }
    this.updateChecked();
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
  updateChecked = (): void => {
    const { checked } = this.context;
    if (checked) {
      this.setAttribute('checked', 'true');
      this.setAttribute('value', 'true');
      addClassToElement(this.container, 'ran-checkbox-checked');
    } else {
      this.setAttribute('checked', 'false');
      this.setAttribute('value', 'false');
      removeClassToElement(this.container, 'ran-checkbox-checked');
    }
  };
  update = (): void => {
    this.updateChecked();
  };
  onChange = (): void => {
    if (falseList.includes(this.disabled)) return;
    if (this.hasAttribute('disabled')) return;
    const { checked } = this.context;
    this.context.checked = !checked;
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: {
          checked: this.context.checked,
        },
      }),
    );
    this.update();
  };
  connectedCallback(): void {
    this.handlerExternalCss();
    this.addEventListener('click', this.onChange);
  }
  disconnectedCallback(): void {
    this.removeEventListener('click', this.onChange);
  }
  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue !== newValue) {
      if (name === 'checked') {
        this.checked = newValue;
        this.value = newValue;
      }
      if (name === 'value') {
        this.checked = newValue;
        this.value = newValue;
      }
      if (name === 'sheet') {
        this.handlerExternalCss();
      }
    }
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
