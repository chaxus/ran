import { addClassToElement, removeClassToElement } from 'ranuts/utils';
import { RanElement, falseList, isDisabled } from '@/utils/index';
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
  // Participate in native forms: the host relays its checked state via
  // ElementInternals.setFormValue, so `new FormData(form)` (which <r-form> uses)
  // collects it even though the visual <input> lives in shadow DOM.
  static formAssociated = true;
  _events = new EventManager();
  _internals?: ElementInternals;
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
    // attachInternals is allowed in the constructor; guard for SSR/old runtimes.
    try {
      this._internals = this.attachInternals();
    } catch {
      this._internals = undefined;
    }
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
    // The host is the accessible checkbox (see connectedCallback); the inner
    // <input> is a decorative visual/hit target, so keep it out of the a11y tree
    // and tab order to avoid a duplicate, always-unchecked checkbox node.
    this.checkInput.setAttribute('aria-hidden', 'true');
    this.checkInput.tabIndex = -1;

    this.context = {
      checked: false,
    };
  }
  get disabled(): boolean {
    return isDisabled(this);
  }
  set disabled(value: boolean | string) {
    if (falseList.includes(value as boolean | string | null | undefined)) {
      this.removeAttribute('disabled');
    } else {
      this.setAttribute('disabled', '');
    }
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
    this.syncA11yAndForm();
  };
  // Keep the host's exposed checkbox semantics and form value in step with the
  // internal checked/disabled state. The host (role=checkbox) is the single
  // accessible control; its name comes from the slotted label content.
  syncA11yAndForm = (): void => {
    const { checked } = this.context;
    this.setAttribute('role', 'checkbox');
    this.setAttribute('aria-checked', checked ? 'true' : 'false');
    if (this.disabled) {
      this.setAttribute('aria-disabled', 'true');
      this.tabIndex = -1;
    } else {
      this.removeAttribute('aria-disabled');
      if (this.tabIndex < 0 || !this.hasAttribute('tabindex')) this.tabIndex = 0;
    }
    // A checkbox contributes its value only when checked (matching native forms).
    // `setFormValue` is optional-chained: jsdom's ElementInternals stub omits it,
    // real browsers implement it.
    this._internals?.setFormValue?.(checked ? this.getAttribute('value') || 'true' : null);
  };
  update = (): void => {
    this.updateChecked();
  };
  onChange = (): void => {
    if (this.disabled) return;
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
  // A checkbox toggles on Space (and Enter, for convenience); without this the
  // host was clickable but not keyboard-operable.
  onKeydown = (event: KeyboardEvent): void => {
    if (event.key === ' ' || event.key === 'Spacebar' || event.key === 'Enter') {
      event.preventDefault();
      this.onChange();
    }
  };
  connectedCallback(): void {
    this.handlerExternalCss();
    this._events.on(this, 'click', this.onChange);
    this._events.on(this, 'keydown', this.onKeydown as EventListener);
    // Establish the host's checkbox semantics (role/tabindex/aria-checked) and
    // seed the form value from the current state.
    this.syncA11yAndForm();
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
