import { addClassToElement, removeClassToElement } from 'ranuts/utils';
import { RanElement, falseList } from '@/utils/index';
import { Div, EventManager, InputBuilder, Slot, Span } from '@/utils/builder';
import {
  ensureShadowElement,
  ensureShadowRoot,
  getStringAttribute,
  setStringAttribute,
  syncSheetAttribute,
} from '@/utils/component';
import checkboxCss from './index.less?inline';
import { defineSSR } from '@/utils/ssr-registry';

export interface Context {
  checked: boolean;
}

export class Checkbox extends RanElement {
  _events = new EventManager();
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
    this._shadowDom = ensureShadowRoot(this, checkboxCss);
    const wrapper = ensureShadowElement(this._shadowDom, '.ran-checkbox-wrapper', () =>
      Div()
        .class('ran-checkbox-wrapper')
        .part('wrapper')
        .children(
          Div()
            .class('ran-checkbox')
            .part('checkbox')
            .children(
              InputBuilder().class('ran-checkbox-input').part('input').attr('type', 'checkbox'),
              Span().class('ran-checkbox-inner').part('inner'),
            ),
          Span().class('ran-checkbox-label').part('label').children(Slot()),
        )
        .build(),
    );

    this.container = wrapper.querySelector('.ran-checkbox') as HTMLElement;
    this.checkInput = wrapper.querySelector('.ran-checkbox-input') as HTMLInputElement;
    this.checkInner = wrapper.querySelector('.ran-checkbox-inner') as HTMLSpanElement;

    this.context = {
      checked: false,
    };
  }
  get disabled(): string {
    return getStringAttribute(this, 'disabled');
  }
  set disabled(value: string) {
    setStringAttribute(this, 'disabled', value);
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
  get checked(): boolean {
    const checked = this.getAttribute('checked');
    if (falseList.includes(checked)) {
      this.context.checked = false;
    }
    return this.context.checked;
  }
  set checked(value: boolean | string) {
    if (falseList.includes(value as boolean | string | null | undefined)) {
      this.setAttribute('checked', 'false');
      this.context.checked = false;
    } else {
      this.setAttribute('checked', 'true');
      this.context.checked = true;
    }
    this.updateChecked();
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
    this._events.on(this, 'click', this.onChange);
  }
  disconnectedCallback(): void {
    this._events.abort();
  }
  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;
    if (name === 'checked') {
      this.checked = newValue;
      this.value = newValue;
    }
    if (name === 'value') {
      this.checked = newValue;
      this.value = newValue;
    }
    if (name === 'sheet') this.handlerExternalCss();
  }
}

defineSSR('r-checkbox', Checkbox as unknown as new () => HTMLElement);
export default Checkbox;
