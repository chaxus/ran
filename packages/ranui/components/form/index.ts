import { Slot, View } from '@/utils/builder';
import formCss from './index.less?inline';
import { RanElement } from '@/utils/index';
import { defineSSR } from '@/utils/ssr-registry';
import {
  ensureShadowElement,
  ensureShadowRoot,
  getStringAttribute,
  setStringAttribute,
  syncSheetAttribute,
} from '@/utils/component';

export class Form extends RanElement {
  _form: HTMLFormElement;
  _shadowDom: ShadowRoot;

  static get observedAttributes(): string[] {
    return ['sheet'];
  }

  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this, formCss);

    this._form = ensureShadowElement(
      this._shadowDom,
      '.r-form',
      () => View('form').class('r-form').children(Slot().attr('name', 'r-form_content')).build() as HTMLFormElement,
    );
  }

  get value(): string | null {
    return this.getAttribute('value');
  }
  set value(value: string | null) {
    if (value != null) this.setAttribute('value', value);
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

  connectedCallback(): void {
    this.handlerExternalCss();
    const jsonData: Record<string, unknown> = {};
    const formData = new FormData(this._form);
    formData.forEach((_, key) => {
      if (!jsonData[key]) {
        jsonData[key] = formData.getAll(key).length > 1 ? formData.getAll(key) : formData.get(key);
      }
    });
    this._form.addEventListener('submit', () => {
      this.value = JSON.stringify(jsonData);
    });
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;
    if (name === 'sheet') this.handlerExternalCss();
  }
}

defineSSR('r-form', Form as unknown as new () => HTMLElement);
export default Form;
