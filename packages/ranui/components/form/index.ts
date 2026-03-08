import { Div, Slot, View } from '@/utils/builder';
import { adoptStyles } from '@/utils/style';
import formCss from './index.less?inline';
import { RanElement, html } from '@/utils/index'; // Added RanElement and html

class CustomElement extends RanElement {
  // Changed to extend RanElement
  _form: HTMLFormElement;
  _shadowDom: ShadowRoot; // Added _shadowDom property

  constructor() {
    super();
    this._shadowDom = this.shadowRoot || this.attachShadow({ mode: 'closed' }); // Initialized _shadowDom
    adoptStyles(this._shadowDom, formCss); // Used _shadowDom

    let form = this._shadowDom.querySelector('.r-form') as HTMLFormElement | null; // Used _shadowDom
    if (!form) {
      form = View('form').class('r-form').children(Slot().attr('name', 'r-form_content')).build() as HTMLFormElement;
      this._shadowDom.appendChild(form); // Used _shadowDom
    }
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
  if (typeof window !== 'undefined' && !customElements.get('r-form')) {
    window.customElements.define('r-form', CustomElement);
    return CustomElement;
  }
}
export default Component();
