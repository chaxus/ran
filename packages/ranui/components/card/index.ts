import cardCss from './index.less?inline';
import { Div, Slot } from '@/utils/builder';
import { RanElement } from '@/utils/index';
import {
  ensureShadowElement,
  ensureShadowRoot,
  getStringAttribute,
  setStringAttribute,
  syncSheetAttribute,
} from '@/utils/component';
import { defineSSR } from '@/utils/ssr-registry';

export class Card extends RanElement {
  _shadowDom!: ShadowRoot;
  _titleEl!: HTMLElement;
  _descriptionEl!: HTMLElement;
  _headerEl!: HTMLElement;
  _footerEl!: HTMLElement;

  static get observedAttributes(): string[] {
    return ['title', 'description', 'sheet'];
  }

  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this, cardCss);

    const card = ensureShadowElement(this._shadowDom, '.ran-card', () =>
      Div()
        .class('ran-card')
        .attr('part', 'card')
        .children(
          Div()
            .class('ran-card-header')
            .attr('part', 'header')
            .children(
              Div()
                .class('ran-card-title-area')
                .children(
                  Div().class('ran-card-title').attr('part', 'title'),
                  Div().class('ran-card-description').attr('part', 'description'),
                ),
              Slot().attr('name', 'extra').attr('part', 'extra'),
            ),
          Div().class('ran-card-body').attr('part', 'body').children(Slot()),
          Div().class('ran-card-footer').attr('part', 'footer').children(Slot().attr('name', 'footer')),
        )
        .build(),
    );

    this._headerEl = card.querySelector<HTMLElement>('.ran-card-header')!;
    this._titleEl = card.querySelector<HTMLElement>('.ran-card-title')!;
    this._descriptionEl = card.querySelector<HTMLElement>('.ran-card-description')!;
    this._footerEl = card.querySelector<HTMLElement>('.ran-card-footer')!;

    // Hide footer until content is slotted
    this._footerEl.style.display = 'none';
    const footerSlot = this._footerEl.querySelector<HTMLSlotElement>('slot[name="footer"]')!;
    footerSlot.addEventListener('slotchange', () => {
      this._footerEl.style.display = footerSlot.assignedElements().length > 0 ? '' : 'none';
    });
  }

  // ── Accessors ──────────────────────────────────────────────────────────────

  get title(): string {
    return getStringAttribute(this, 'title');
  }
  set title(value: string) {
    setStringAttribute(this, 'title', value);
  }

  get description(): string {
    return getStringAttribute(this, 'description');
  }
  set description(value: string) {
    setStringAttribute(this, 'description', value);
  }

  get sheet(): string {
    return getStringAttribute(this, 'sheet');
  }
  set sheet(value: string) {
    setStringAttribute(this, 'sheet', value);
  }

  // ── Internal sync ──────────────────────────────────────────────────────────

  private _syncTitle(): void {
    this._titleEl.textContent = this.getAttribute('title') ?? '';
  }

  private _syncDescription(): void {
    this._descriptionEl.textContent = this.getAttribute('description') ?? '';
  }

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  connectedCallback(): void {
    this._syncTitle();
    this._syncDescription();
    syncSheetAttribute(this, this._shadowDom, 'sheet', null, this.sheet);
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    if (name === 'title') this._syncTitle();
    if (name === 'description') this._syncDescription();
    if (name === 'sheet') syncSheetAttribute(this, this._shadowDom, name, oldValue, newValue);
  }
}

defineSSR('r-card', Card as unknown as new () => HTMLElement);
export default Card;
