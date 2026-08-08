import { EventManager, Slot } from '@/utils/builder';
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
  _shadowDom: ShadowRoot;
  _events = new EventManager();

  static get observedAttributes(): string[] {
    return ['sheet'];
  }

  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this, formCss);

    // Deliberately no <form> element here. A <form> owner is resolved by
    // walking the real (light) DOM ancestor chain, which never crosses into
    // a shadow root — a <form> hidden inside shadow DOM can never become the
    // form owner of light-DOM children, even ones rendered through a <slot>
    // (verified empirically: a plain slotted <input>'s `.form` is null).
    // So the real <form> must be authored by the consumer, as an ordinary
    // light-DOM child — this is just a passthrough slot plus a default
    // layout for it (see index.less, `::slotted(form)`).
    ensureShadowElement(this._shadowDom, 'slot', () => Slot().build());
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

  private _handleSubmit = (event: Event): void => {
    // A real <form> submits by navigating the page by default — this is a JS
    // form wrapper, so stop that and serialize instead.
    event.preventDefault();
    // `submit`/`reset` bubble from the consumer's light-DOM <form> up through
    // this host; `event.target` is always that <form> (the event's own
    // target, per spec) — recomputed fresh on every submit, so `value`
    // always reflects what was actually submitted, not whatever the fields
    // held when the form first connected.
    const formData = new FormData(event.target as HTMLFormElement);
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
    this._events.on(this, 'submit', this._handleSubmit).on(this, 'reset', this._handleReset);
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
