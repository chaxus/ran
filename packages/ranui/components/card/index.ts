import cardCss from './index.less?inline';
import { createRef, Div, Slot } from '@/utils/builder';
import { RanElement } from '@/utils/index';
import {
  mountShadowTree,
  ensureShadowRoot,
  getStringAttribute,
  setStringAttribute,
  shadowPart,
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
    return ['heading', 'description', 'sheet', 'hoverable'];
  }

  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this, cardCss);
    const headerElRef = createRef<HTMLDivElement>();
    const titleElRef = createRef<HTMLDivElement>();
    const descriptionElRef = createRef<HTMLDivElement>();
    const footerElRef = createRef<HTMLDivElement>();
    const footerSlotRef = createRef<HTMLSlotElement>();

    const card = mountShadowTree(this._shadowDom, () =>
      Div()
        .class('ran-card')
        .attr('part', 'card')
        .children(
          Div()
            .class('ran-card-header')
            .ref(headerElRef)
            .attr('part', 'header')
            .children(
              Div()
                .class('ran-card-title-area')
                .children(
                  Div().class('ran-card-title').ref(titleElRef).attr('part', 'title'),
                  Div().class('ran-card-description').ref(descriptionElRef).attr('part', 'description'),
                ),
              Slot().attr('name', 'extra').attr('part', 'extra'),
            ),
          Div().class('ran-card-body').attr('part', 'body').children(Slot()),
          Div()
            .class('ran-card-footer')
            .ref(footerElRef)
            .attr('part', 'footer')
            .children(Slot().attr('name', 'footer').ref(footerSlotRef)),
        )
        .build(),
    );

    this._headerEl = shadowPart(headerElRef, 'header');
    this._titleEl = shadowPart(titleElRef, 'title');
    this._descriptionEl = shadowPart(descriptionElRef, 'description');
    this._footerEl = shadowPart(footerElRef, 'footer');

    // Hide footer until content is slotted
    this._footerEl.style.display = 'none';
    const footerSlot = shadowPart(footerSlotRef, 'slot[name="footer"]');
    footerSlot.addEventListener('slotchange', () => {
      this._footerEl.style.display = footerSlot.assignedElements().length > 0 ? '' : 'none';
    });
  }

  // ── Accessors ──────────────────────────────────────────────────────────────

  /**
   * Heading text.
   *
   * Not `title`: that is a native `HTMLElement` attribute, and the browser renders it as a
   * tooltip. A component using it for a heading makes every instance sprout a tooltip
   * repeating the text already on screen, and there is no way to switch that off once the
   * attribute is set.
   */
  get heading(): string {
    return getStringAttribute(this, 'heading');
  }
  set heading(value: string) {
    setStringAttribute(this, 'heading', value);
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

  /** Interactive card (Geist): hover darkens the border and lifts to the elevated shadow tier. Purely presentational — gate it to cards that are actually clickable. */
  get hoverable(): boolean {
    return this.hasAttribute('hoverable');
  }
  set hoverable(value: boolean) {
    if (value) {
      this.setAttribute('hoverable', '');
    } else {
      this.removeAttribute('hoverable');
    }
  }

  // ── Internal sync ──────────────────────────────────────────────────────────

  private _syncTitle(): void {
    this._titleEl.textContent = this.getAttribute('heading') ?? '';
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
    if (name === 'heading') this._syncTitle();
    if (name === 'description') this._syncDescription();
    if (name === 'sheet') syncSheetAttribute(this, this._shadowDom, name, oldValue, newValue);
  }
}

defineSSR('r-card', Card as unknown as new () => HTMLElement);
export default Card;
