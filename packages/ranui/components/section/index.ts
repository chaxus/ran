import sectionCss from './index.less?inline';
import { Div, EventManager, Slot } from '@/utils/builder';
import { RanElement } from '@/utils/index';
import {
  ensureShadowElement,
  ensureShadowRoot,
  getStringAttribute,
  setStringAttribute,
  syncSheetAttribute,
} from '@/utils/component';
import { defineSSR } from '@/utils/ssr-registry';

export class Section extends RanElement {
  _shadowDom!: ShadowRoot;
  _headerEl!: HTMLDivElement;
  _headingEl!: HTMLDivElement;
  _subtitleEl!: HTMLDivElement;
  _events = new EventManager();

  static get observedAttributes(): string[] {
    return ['heading', 'subtitle', 'sheet'];
  }

  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this, sectionCss);

    const container = ensureShadowElement(this._shadowDom, '.ran-section-header', () => {
      const header = Div()
        .class('ran-section-header')
        .attr('part', 'header')
        .children(
          Div().class('ran-section-heading').attr('part', 'heading').attr('role', 'heading').attr('aria-level', '2'),
          Div().class('ran-section-subtitle').attr('part', 'subtitle'),
        )
        .build();

      const body = Div().class('ran-section-body').attr('part', 'body').children(Slot()).build();

      this._shadowDom.appendChild(header);
      this._shadowDom.appendChild(body);
      return header;
    });

    this._headerEl = container;
    this._headingEl = container.querySelector<HTMLDivElement>('.ran-section-heading')!;
    this._subtitleEl = container.querySelector<HTMLDivElement>('.ran-section-subtitle')!;
  }

  get heading(): string {
    return getStringAttribute(this, 'heading');
  }
  set heading(value: string) {
    setStringAttribute(this, 'heading', value);
  }

  get subtitle(): string {
    return getStringAttribute(this, 'subtitle');
  }
  set subtitle(value: string) {
    setStringAttribute(this, 'subtitle', value);
  }

  get sheet(): string {
    return getStringAttribute(this, 'sheet');
  }
  set sheet(value: string) {
    setStringAttribute(this, 'sheet', value);
  }

  private _syncHeading(): void {
    this._headingEl.textContent = this.getAttribute('heading') ?? '';
    this._headerEl.style.display = this._headingEl.textContent || this._subtitleEl.textContent ? '' : 'none';
  }

  private _syncSubtitle(): void {
    this._subtitleEl.textContent = this.getAttribute('subtitle') ?? '';
    this._headerEl.style.display = this._headingEl.textContent || this._subtitleEl.textContent ? '' : 'none';
  }

  connectedCallback(): void {
    this._syncHeading();
    this._syncSubtitle();
    syncSheetAttribute(this, this._shadowDom, 'sheet', null, this.sheet);
  }

  disconnectedCallback(): void {
    this._events.abort();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;
    if (name === 'heading') this._syncHeading();
    if (name === 'subtitle') this._syncSubtitle();
    if (name === 'sheet') syncSheetAttribute(this, this._shadowDom, name, oldValue, newValue);
  }
}

defineSSR('r-section', Section as unknown as new () => HTMLElement);
export default Section;
