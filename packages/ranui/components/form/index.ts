import { EventManager, Slot, View } from '@/utils/builder';
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
  _events = new EventManager();

  static get observedAttributes(): string[] {
    return ['sheet'];
  }

  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this, formCss);

    // Default (unnamed) slot: any child placed directly inside <r-form> is
    // projected here — no slot="..." attribute needed, and no wrapper <div>
    // that would swallow every field into a single flex/grid item.
    this._form = ensureShadowElement(
      this._shadowDom,
      '.ran-form',
      () => View('form').class('ran-form').part('form').children(Slot()).build() as HTMLFormElement,
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

  private _handleSubmit = (): void => {
    // Recomputed fresh on every submit — must not be hoisted out of this
    // handler, or `value` would forever reflect whatever FormData looked
    // like at connect time instead of what the user actually submitted.
    const formData = new FormData(this._form);
    const jsonData: Record<string, unknown> = {};
    formData.forEach((_, key) => {
      if (!(key in jsonData)) {
        jsonData[key] = formData.getAll(key).length > 1 ? formData.getAll(key) : formData.get(key);
      }
    });
    this.value = JSON.stringify(jsonData);
  };

  private _handleReset = (): void => {
    // Bypass the public setter — it deliberately ignores null (see the
    // `value` setter contract above) — reset needs an actual clear.
    this.removeAttribute('value');
  };

  connectedCallback(): void {
    this.handlerExternalCss();
    this._events.on(this._form, 'submit', this._handleSubmit).on(this._form, 'reset', this._handleReset);
  }

  disconnectedCallback(): void {
    this._events.abort();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;
    if (name === 'sheet') this.handlerExternalCss();
  }
}

defineSSR('r-form', Form as unknown as new () => HTMLElement);
export default Form;
