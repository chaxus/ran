import { Slot, View } from '@/utils/builder';
import formCss from './index.less?inline';
import { RanElement } from '@/utils/index';
import { defineSSR } from '@/utils/ssr-registry';
import { ensureShadowElement, ensureShadowRoot } from '@/utils/component';

class CustomElement extends RanElement {
  // Changed to extend RanElement
  _form: HTMLFormElement;
  _shadowDom: ShadowRoot; // Added _shadowDom property

  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this, formCss);

    const form = ensureShadowElement(
      this._shadowDom,
      '.r-form',
      () => View('form').class('r-form').children(Slot().attr('name', 'r-form_content')).build() as HTMLFormElement,
    );
    this._form = form;

    // The following logic for jsonData and event listener should be moved to connectedCallback or a method
    // as it relies on the form being in the DOM and potentially having content.
    // For now, keeping it in constructor as per original, but it's not ideal for SSR hydration.
    const jsonData: Record<string, any> = {};
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
  get value() {
    return this.getAttribute('value');
  }
  set value(value) {
    if (value != null) this.setAttribute('value', value);
  }
}

function Component() {
  defineSSR('r-form', CustomElement as unknown as new () => HTMLElement);
  return CustomElement;
}
export default Component();
