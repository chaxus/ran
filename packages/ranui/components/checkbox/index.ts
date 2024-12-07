import { addClassToElement, create, removeClassToElement } from 'ranuts/utils';
import type { Chain } from 'ranuts/utils';
import { HTMLElementSSR, createCustomError, falseList } from '@/utils/index';

interface Context {
  checked: boolean;
}

export class Checkbox extends (HTMLElementSSR()!) {
  checkInput: HTMLInputElement;
  checkInner: HTMLSpanElement;
  context: Context;
  container: Chain;
  _shadowDom: ShadowRoot;
  static get observedAttributes(): string[] {
    return ['disabled', 'checked', 'value'];
  }
  constructor() {
    super();
    this.checkInput = document.createElement('input');
    this.checkInput.setAttribute('class', 'ran-checkbox-input');
    this.checkInput.setAttribute('type', 'checkbox');
    this.checkInner = document.createElement('span');
    this.checkInner.setAttribute('class', 'ran-checkbox-inner');
    this.container = create('div')
      .setAttribute('class', 'ran-checkbox')
      .addChild([this.checkInput, this.checkInner]).element;
    const shadowRoot = this.attachShadow({ mode: 'closed' });
    this._shadowDom = shadowRoot;
    shadowRoot.appendChild(this.container);
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
      // eslint-disable-next-line n/no-unsupported-features/node-builtins
      new CustomEvent('change', {
        detail: {
          checked: this.context.checked,
        },
      }),
    );
    this.update();
  };
  connectedCallback(): void {
    this.addEventListener('click', this.onChange);
  }
  disconnectCallback(): void {
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
