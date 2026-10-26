import componentCss from './index.less?inline';
import { observeEntry, prefersReducedMotion, spring, stagger } from 'ranuts/utils';
import { Div, Slot } from '@/utils/builder';
import { RanElement } from '@/utils/index';
import { ensureShadowRoot, getStringAttribute, setStringAttribute, syncSheetAttribute } from '@/utils/component';
import { defineSSR } from '@/utils/ssr-registry';

/** The opening spring: settles in about half a second with a slight overshoot. */
const OPEN = spring({ stiffness: 200, damping: 20 });
/** Neighbours turn this much further away from the item under the pointer or focus. */
const PART_DEG = 4;

/**
 * `<r-fan-gallery>` — fans its children out like a hand of cards.
 *
 * Each child turns about a point below the row, so the group reads as one object. The fan
 * opens with a spring, one child after another, the first time it scrolls into view; until
 * then the children lie stacked, so the front one is always readable. Hovering or focusing a
 * child lifts it and turns its neighbours aside. With reduced motion the fan is open from
 * the start and nothing moves.
 *
 * The children are the consumer's own elements — links, buttons or images keep their roles
 * and their place in the tab order.
 *
 * ```html
 * <r-fan-gallery spread="30">
 *   <img src="a.jpg" alt="Harbour at dawn" />
 *   <img src="b.jpg" alt="Market street" />
 *   <img src="c.jpg" alt="Ferry wake" />
 * </r-fan-gallery>
 * ```
 *
 * Attributes: `spread`, `sheet`.
 */
export class FanGallery extends RanElement {
  _shadowDom!: ShadowRoot;
  private _slot: HTMLSlotElement;
  private _open = false;
  private _active: Element | null = null;
  private _stopEntry: (() => void) | null = null;

  static get observedAttributes(): string[] {
    return ['spread', 'sheet'];
  }

  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this, componentCss);
    this._slot = Slot().build() as HTMLSlotElement;
    this._shadowDom.appendChild(Div().class('ran-fan-gallery').attr('part', 'stage').children(this._slot).build());
    this._slot.addEventListener('slotchange', () => this._layout(false));
    this.addEventListener('pointerover', (event) => this._setActive(this._itemOf(event)));
    this.addEventListener('pointerleave', () => this._setActive(null));
    this.addEventListener('focusin', (event) => this._setActive(this._itemOf(event)));
    this.addEventListener('focusout', (event) => {
      if (!this.contains(event.relatedTarget as Node | null)) this._setActive(null);
    });
  }

  /** Angle in degrees between the first and last child once open. Defaults to `24`; `0` lines them up. */
  get spread(): string {
    return getStringAttribute(this, 'spread', '24');
  }
  set spread(value: string) {
    setStringAttribute(this, 'spread', value);
  }

  get sheet(): string {
    return getStringAttribute(this, 'sheet');
  }
  set sheet(value: string) {
    setStringAttribute(this, 'sheet', value);
  }

  connectedCallback(): void {
    this.handlerExternalCss();
    this.style.setProperty('--fan-duration', `${OPEN.duration}s`);
    this.style.setProperty('--fan-easing', OPEN.easing);
    if (this._open || prefersReducedMotion()) {
      this._open = true;
      this._layout(false);
      return;
    }
    this._layout(false);
    this._stopEntry = observeEntry(this, {
      onEnter: ({ reduced }) => {
        this._stopEntry = null;
        this._open = true;
        this._layout(!reduced);
      },
    });
  }

  disconnectedCallback(): void {
    this._stopEntry?.();
    this._stopEntry = null;
  }

  attributeChangedCallback(name: string, old: string | null, next: string | null): void {
    if (old === next) return;
    if (name === 'sheet') this.handlerExternalCss();
    if (name === 'spread') this._layout(false);
  }

  handlerExternalCss = (): void => {
    syncSheetAttribute(this, this._shadowDom, 'sheet', null, this.sheet);
  };

  /** The direct child an event came from, if any. */
  private _itemOf(event: Event): Element | null {
    const items = this._slot.assignedElements();
    return (event.composedPath().find((node) => items.includes(node as Element)) as Element | undefined) ?? null;
  }

  private _setActive(item: Element | null): void {
    if (item === this._active) return;
    this._active = item;
    this._layout(false);
  }

  /** Writes each child's angle; `staggered` delays them in order, for the opening only. */
  private _layout(staggered: boolean): void {
    const items = this._slot.assignedElements() as HTMLElement[];
    const count = items.length;
    const spread = Number.parseFloat(this.spread);
    const step = count > 1 && Number.isFinite(spread) ? spread / (count - 1) : 0;
    const active = this._open && this._active ? items.indexOf(this._active as HTMLElement) : -1;
    items.forEach((item, index) => {
      const base = this._open ? (index - (count - 1) / 2) * step : 0;
      const part = active < 0 || index === active ? 0 : index < active ? -PART_DEG : PART_DEG;
      item.style.setProperty('--fan-angle', `${base + part}deg`);
      item.style.setProperty('--fan-lifted', index === active ? '1' : '0');
      item.style.setProperty('--fan-delay', staggered ? `${stagger(index, count, { each: 0.06 })}s` : '0s');
    });
  }
}

defineSSR('r-fan-gallery', FanGallery as unknown as new () => HTMLElement);
export default FanGallery;
