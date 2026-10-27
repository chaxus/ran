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
  private _stage: HTMLElement;
  private _open = false;
  private _hovered: Element | null = null;
  private _focused: Element | null = null;
  private _stopEntry: (() => void) | null = null;
  private _sizes: ResizeObserver | null = null;

  static get observedAttributes(): string[] {
    return ['spread', 'sheet'];
  }

  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this, componentCss);
    this._slot = Slot().build() as HTMLSlotElement;
    this._stage = Div().class('ran-fan-gallery').attr('part', 'stage').children(this._slot).build();
    this._shadowDom.appendChild(this._stage);
    this._slot.addEventListener('slotchange', () => {
      this._observeSizes();
      this._layout(false);
    });
    // Pointer and focus are tracked apart, so the mouse leaving never drops a focused child.
    this.addEventListener('pointerover', (event) => this._track('_hovered', this._itemOf(event)));
    this.addEventListener('pointerleave', () => this._track('_hovered', null));
    this.addEventListener('focusin', (event) => this._track('_focused', this._itemOf(event)));
    this.addEventListener('focusout', (event) => {
      if (!this.contains(event.relatedTarget as Node | null)) this._track('_focused', null);
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
    this._observeSizes();
    this.style.setProperty('--fan-duration', `${OPEN.duration}s`);
    this.style.setProperty('--fan-easing', OPEN.easing);
    if (this._open || prefersReducedMotion()) {
      this._open = true;
      this._layout(false);
      return;
    }
    this._layout(false);
    // A line at the very bottom: a short gallery at the end of a page may never reach a higher one.
    this._stopEntry = observeEntry(this, {
      line: 1,
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
    this._sizes?.disconnect();
    this._sizes = null;
  }

  attributeChangedCallback(name: string, old: string | null, next: string | null): void {
    if (old === next) return;
    if (name === 'sheet') this.handlerExternalCss();
    if (name === 'spread') {
      this._reserve();
      this._layout(false);
    }
  }

  handlerExternalCss = (): void => {
    syncSheetAttribute(this, this._shadowDom, 'sheet', null, this.sheet);
  };

  /** The direct child an event came from, if any. */
  private _itemOf(event: Event): Element | null {
    const items = this._slot.assignedElements();
    return (event.composedPath().find((node) => items.includes(node as Element)) as Element | undefined) ?? null;
  }

  private _track(source: '_hovered' | '_focused', item: Element | null): void {
    if (this[source] === item) return;
    this[source] = item;
    this._layout(false);
  }

  /** Re-measures when a child's size changes; observing fires once, which takes the first measurement. */
  private _observeSizes(): void {
    if (typeof ResizeObserver === 'undefined') return;
    this._sizes ??= new ResizeObserver(() => this._reserve());
    this._sizes.disconnect();
    // The host too: a narrower container scales the fan down (see `_reserve`).
    this._sizes.observe(this);
    for (const item of this._slot.assignedElements()) this._sizes.observe(item);
  }

  /**
   * Room for the open fan, beside the children. Each child turns about a pivot below it, so
   * at its widest angle (half the spread, plus the part for a lifted neighbour) its outer top
   * corner swings `w/2·cos a + r·sin a` from the centre, where `r` is the distance from its top
   * edge to the pivot. Reserved before opening too, so opening moves nothing around it.
   */
  private _reserve(): void {
    const items = this._slot.assignedElements() as HTMLElement[];
    const spread = Number.parseFloat(this.spread);
    const angle =
      (((Number.isFinite(spread) ? Math.abs(spread) / 2 : 0) + (items.length > 1 ? PART_DEG : 0)) * Math.PI) / 180;
    let reach = 0;
    let widest = 0;
    for (const item of items) {
      const width = item.offsetWidth;
      const pivot = Number.parseFloat(getComputedStyle(item).transformOrigin.split(' ')[1] ?? '') || item.offsetHeight;
      reach = Math.max(reach, (width / 2) * Math.cos(angle) + pivot * Math.sin(angle) - width / 2);
      widest = Math.max(widest, width);
    }
    this.style.setProperty('--fan-reach', `${Math.ceil(reach)}px`);
    // Where the container is narrower than the open fan (a phone), the whole stage shrinks to
    // fit rather than spilling past the page. `zoom` scales layout too, so the height follows.
    const room =
      widest + 2 * Math.max(Math.ceil(reach), Number.parseFloat(getComputedStyle(this._stage).paddingTop) || 0);
    const available = this.clientWidth;
    const zoom = room > 0 && available > 0 ? Math.min(1, available / room) : 1;
    this._stage.style.setProperty('zoom', zoom < 1 ? String(Math.floor(zoom * 1000) / 1000) : '');
  }

  /** Writes each child's angle; `staggered` delays them in order, for the opening only. */
  private _layout(staggered: boolean): void {
    const items = this._slot.assignedElements() as HTMLElement[];
    const count = items.length;
    const spread = Number.parseFloat(this.spread);
    const step = count > 1 && Number.isFinite(spread) ? spread / (count - 1) : 0;
    const lifted = this._hovered ?? this._focused;
    const active = this._open && lifted ? items.indexOf(lifted as HTMLElement) : -1;
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
