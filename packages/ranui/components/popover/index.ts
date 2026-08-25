/*
 * @Author: chaxus nouo18@163.com
 * @Date: 2024-12-08 17:58:20
 * @LastEditors: chaxus nouo18@163.com
 * @LastEditTime: 2025-06-02 12:06:11
 * @FilePath: /ran/packages/ranui/components/popover/index.ts
 */
import { debounce, isMobile } from 'ranuts/utils';
import { RanElement } from '@/utils/index';
import '@/components/popover/content';
import '@/components/dropdown';
import { createRef, Div, EventManager, Slot, View } from '@/utils/builder';
import {
  ensureShadowRoot,
  getStringAttribute,
  setStringAttribute,
  shadowPart,
  syncSheetAttribute,
} from '@/utils/component';
import popoverCss from './index.less?inline';
import { defineSSR } from '@/utils/ssr-registry';
import { FloatingController } from '@/utils/floating';
import type { Placement, PlacementSide } from '@/utils/placement';
import { isActivationKey } from '@/utils/a11y';

// index.ts:29 Uncaught DOMException: Failed to construct 'CustomElement': The result must not have children
// index.ts:31 Uncaught DOMException: Failed to construct 'CustomElement': The result must not have attributes
const arrowHeight = 8;

/**
 * How long a hover-triggered panel stays up after the pointer leaves, so a
 * pointer crossing the gap between trigger and panel does not dismiss it. Not
 * an animation duration: the animation now ends when the stylesheet says it
 * does, which is what the shared controller waits for.
 */
const HOVER_CLOSE_DELAY = 300;

const HOVER_TIME = 16;

export enum PLACEMENT_TYPE {
  TOP = 'top',
  BOTTOM = 'bottom',
  LEFT = 'left',
  RIGHT = 'right',
}

// The arrow points back at the trigger, so it always renders on the side
// opposite to where the panel actually sits.
const oppositeSide: Record<PLACEMENT_TYPE, PLACEMENT_TYPE> = {
  [PLACEMENT_TYPE.TOP]: PLACEMENT_TYPE.BOTTOM,
  [PLACEMENT_TYPE.BOTTOM]: PLACEMENT_TYPE.TOP,
  [PLACEMENT_TYPE.LEFT]: PLACEMENT_TYPE.RIGHT,
  [PLACEMENT_TYPE.RIGHT]: PLACEMENT_TYPE.LEFT,
};

/**
 * @fires show - The panel is about to appear.
 * @fires after-show - The panel has appeared and any entrance animation has finished.
 * @fires hide - The panel is about to close.
 * @fires after-hide - The panel has closed and any exit animation has finished.
 */
export class Popover extends RanElement {
  _events = new EventManager();
  _slot: HTMLSlotElement;
  popoverBlock: HTMLDivElement;
  popoverContent?: HTMLElement;
  popoverInner?: HTMLDivElement;
  popoverInnerBlock?: HTMLDivElement;
  _shadowDom: ShadowRoot;
  removeTimeId?: NodeJS.Timeout;
  _repositionBound = false;
  /**
   * Positioning, portalling, scroll-following, the enter/exit animation and the
   * show/hide events are the shared controller's — r-select drives the same one.
   * What stays here is what only a popover knows: which child is the trigger,
   * and where its arrow has to point afterwards.
   */
  _floating = new FloatingController({
    host: this,
    panel: () => this.popoverContent,
    // The *trigger*, not the host. The host is `display: block` and stretches to
    // fill whatever block container it sits in (a demo card, a form row), so its
    // own rect is usually far wider and taller than anything visible. Feeding
    // that to the arrow-centring maths used to push the arrow clean off the
    // panel, and to the left/right placement maths used to offset the panel too.
    anchor: () => (Array.from(this.children).find((el) => el.tagName !== 'R-CONTENT') as HTMLElement) ?? this,
    placement: () => this.placement,
    offset: arrowHeight,
    containerId: () => this.getPopupContainerId,
    afterPosition: (position, panel) => {
      const { anchorRect, panelRect, side } = position;
      // A flip changes which side the panel actually renders on — repoint the
      // arrow so it still points back at the trigger, not at the nominal side.
      const opposite = oppositeSide[side as PLACEMENT_TYPE];
      if (opposite) panel.setAttribute('arrow', opposite);
      panel.style.setProperty('--ran-dropdown-arrow-anchor-width', `${anchorRect.width}px`);
      panel.style.setProperty('--ran-dropdown-arrow-anchor-height', `${anchorRect.height}px`);
      panel.style.setProperty('--ran-dropdown-min-width', `${panelRect.width}px`);
      panel.style.setProperty('--ran-dropdown-min-height', `${panelRect.height}px`);
      // `.top`/`.bottom` in dropdown/index.less self-centre the arrow on the
      // *panel* (`left: 50%`), which is right for a bare `<r-dropdown>` with no
      // trigger. A popover's panel is edge-aligned with its trigger, so the
      // panel's centre usually is not the trigger's. Re-measure now that `inset`
      // is applied and feed the panel-centre → trigger-centre delta back as a
      // nudge on top of that base.
      const finalPanelRect = panel.getBoundingClientRect();
      const triggerCentreX = anchorRect.left + anchorRect.width / 2;
      const panelCentreX = finalPanelRect.left + finalPanelRect.width / 2;
      panel.style.setProperty('--ran-dropdown-arrow-anchor-offset', `${triggerCentreX - panelCentreX}px`);
      // `.left`/`.right` measure the arrow from the *panel's top edge* rather
      // than from a self-centring base, so their formula only points at the
      // trigger while the panel's top edge is flush with the trigger's. The
      // boundary shift breaks that (a trigger near the viewport edge gets the
      // panel clamped vertically, and the arrow's formula has no idea), so the
      // correction here is an edge-to-edge delta, not centre-to-centre.
      panel.style.setProperty('--ran-dropdown-arrow-anchor-offset-y', `${anchorRect.top - finalPanelRect.top}px`);
    },
  });

  static get observedAttributes(): string[] {
    return ['open', 'placement', 'trigger', 'sheet'];
  }
  public readonly closePopover = (): void => {
    this.setDropdownDisplayNone();
  };
  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this, popoverCss);
    const slotRef = createRef<HTMLSlotElement>();
    const block = Div()
      .class('ran-popover-block')
      .role('tooltip')
      .children(Slot().class('slot').ref(slotRef))
      .build() as HTMLDivElement;
    this._shadowDom.appendChild(block);

    this.popoverBlock = block;
    this._slot = shadowPart(slotRef, 'slot');
  }
  /**
   * Which side of the trigger the panel sits on, with an optional alignment.
   *
   * `bottom`, `bottom-end`, `right-center`, … — the suffix lines the panel up
   * with the trigger's leading edge, centre or trailing edge along the cross
   * axis. A bare side means `-start`, which is how this attribute has always
   * behaved.
   */
  get placement(): Placement {
    return getStringAttribute(this, 'placement', 'top') as Placement;
  }
  set placement(value: Placement) {
    setStringAttribute(this, 'placement', value);
  }
  /**
   * The side alone. Everything that keys off a four-entry table -- the transit
   * animation, the arrow direction, the custom-container coordinate branch --
   * reads this rather than `placement`, which may carry an alignment suffix
   * those tables have no entry for.
   */
  private get placementSide(): PlacementSide {
    return this.placement.split('-')[0] as PlacementSide;
  }
  /**
   * Whether the panel is showing.
   *
   * The state itself, reflected the way `<details open>` and `<dialog open>` do
   * it — not inferred from the panel's `style.display`, which trails the state
   * by the length of the exit animation and answers about the frame rather than
   * the intent. Reflecting it also puts it where a consumer can reach it:
   * `:host([open])` in CSS, `popover.open = true` from script, an attribute to
   * assert in a test instead of a poll.
   */
  get open(): boolean {
    return this.hasAttribute('open');
  }
  set open(value: boolean) {
    if (value) {
      this.setAttribute('open', '');
    } else {
      this.removeAttribute('open');
    }
  }

  /** Drive the panel from `open`. Everything below it is the controller's. */
  _applyOpen = (): void => {
    this._floating.apply(this.open);
  };

  /** Show the panel. */
  show = (): void => {
    this.open = true;
  };

  /** Hide the panel. */
  hide = (): void => {
    this.open = false;
  };

  /** Flip the panel between shown and hidden. */
  toggle = (): void => {
    this.open = !this.open;
  };

  get trigger(): string {
    return getStringAttribute(this, 'trigger', 'hover');
  }
  set trigger(value: string) {
    setStringAttribute(this, 'trigger', value);
  }
  get getPopupContainerId(): string {
    return getStringAttribute(this, 'getPopupContainerId');
  }
  set getPopupContainerId(value: string) {
    setStringAttribute(this, 'getPopupContainerId', value);
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
  initAria = (): void => {
    if (!this.hasAttribute('tabindex')) {
      this.tabIndex = 0;
    }
    this.setAttribute('aria-haspopup', 'dialog');
    this.setAttribute('aria-expanded', 'false');
  };
  updateAriaExpanded = (isExpanded: boolean): void => {
    this.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
  };
  stopPropagation = (e: Event): void => {
    e.stopPropagation();
  };
  /**
   * @description: 创建下拉框
   * @param {HTMLCollection} content
   * @return {*}
   */
  createContent = (content: HTMLCollection): void => {
    if (!content) return;
    if (!this.popoverContent) {
      // r-dropdown is a zero-padding primitive (select's item list wants
      // edge-to-edge rows); a popover's arbitrary content needs breathing
      // room, or it renders flush against the rounded panel edges — hence
      // the 12px default below. A `var(--ran-popover-content-padding, 12px)`
      // *reference* doesn't work here: `this.popoverContent` (`<r-dropdown>`)
      // gets portaled to `document.body`/`getPopupContainerId` a few lines
      // down, so by paint time it's no longer a DOM descendant of `<r-popover>`
      // and can't inherit a custom property set on it (e.g. a consumer's
      // `.cssVar('ran-popover-content-padding', '0')`, as r-colorpicker does
      // to avoid double-padding its own already-padded panel — see
      // `components/colorpicker/index.ts`). Reading it via `getComputedStyle`
      // on `this` — still attached to its real place in the DOM at this point
      // — resolves the *value* once and bakes it onto the portaled node as a
      // literal, sidestepping the broken inheritance chain entirely.
      const contentPadding = getComputedStyle(this).getPropertyValue('--ran-popover-content-padding').trim() || '12px';
      this.popoverContent = View('r-dropdown')
        .class('ran-popover-dropdown')
        .style('display', 'none')
        .style('position', 'absolute')
        .cssVar('ran-dropdown-padding', contentPadding)
        .build() as HTMLElement;
      this.popoverContent?.addEventListener('click', this.stopPropagation);

      const div = Div().children(this.popoverContent).build() as HTMLDivElement;
      this.popoverInner = div;

      if (this.trigger.includes('hover') && !isMobile()) {
        this.popoverContent?.addEventListener('mouseleave', this.blur);
        this.popoverContent?.addEventListener('mouseenter', this.removeDropDownTimeId);
      }
      // Mount into the same container placementPosition() computes coordinates
      // against — the getPopupContainerId branch there measures relative to
      // `root`, not the viewport, so the panel must actually live inside it
      // (mirrors r-select's createOption, which resolves the same container).
      const rootNode = this.getRootNode() as ShadowRoot | Document;
      const container =
        (rootNode.getElementById ? rootNode.getElementById(this.getPopupContainerId) : null) ||
        document.getElementById(this.getPopupContainerId) ||
        document.body;
      container.appendChild(div);
    }
    if (this.popoverContent && content.length > 0) {
      this.popoverContent.innerHTML = '';
      const Fragment = document.createDocumentFragment();
      for (const child of content) {
        Fragment.appendChild(child);
      }
      this.popoverContent.appendChild(Fragment);
    }
  };
  /**
   * @description: 观察内容变化
   * @param {Event} e
   * @return {*}
   */
  watchContent = (e: Event): void => {
    const { value } = (e as CustomEvent).detail;
    this.createContent(value.content);
  };
  /**
   * @description: 焦点移除的情况，需要移除下拉框
   * @return {*}
   */
  blur = debounce((): void => {
    if (this.removeTimeId) {
      this.removeDropDownTimeId();
    }
    this.removeTimeId = setTimeout(() => {
      this.removeDropDownTimeId();
      this.setDropdownDisplayNone();
    }, HOVER_CLOSE_DELAY);
  }, HOVER_TIME);
  /**
   * @description: 移除下拉框
   * @return {*}
   */
  removeDropDownTimeId = debounce((): void => {
    if (this.trigger.includes('hover') && !isMobile()) {
      clearTimeout(this.removeTimeId);
      this.removeTimeId = undefined;
    }
  }, HOVER_TIME);
  /**
   * @description: 添加 dropdown
   * @return {*}
   */
  setDropdownDisplayBlock = debounce((): void => {
    this.open = true;
  }, HOVER_TIME);
  /**
   * @description: 移除 select dropdown
   * @return {*}
   */
  setDropdownDisplayNone = debounce((): void => {
    this.open = false;
  }, HOVER_TIME);
  /**
   * Position the panel against the trigger.
   *
   * Kept on the element because it is part of its surface, but the work — flip,
   * shift, alignment, the custom-container branch, and staying with the trigger
   * as the page scrolls — is the shared controller's.
   */
  placementPosition = (): void => {
    this._floating.position();
  };
  /**
   * @description: 鼠标移入
   * @param {Event} e
   * @return {*}
   */
  hoverPopover = (e: Event): void => {
    e.stopPropagation();
    e.preventDefault();
    this.setDropdownDisplayBlock();
  };

  clickContent = (e: Event): void => {
    e.stopPropagation();
  };
  // Toggle, not just open — a click trigger's document-level close listener
  // (see popoverTrigger) is blocked from ever firing on the trigger's own
  // click (this handler calls stopPropagation first), so re-clicking the
  // trigger was previously the one action that couldn't close it: it only
  // ever called setDropdownDisplayBlock, whose "already open" guard then
  // made the second click a no-op. Outside-click/Escape still worked, but a
  // click-triggered panel that its own trigger can't dismiss reads as stuck.
  clickPopover = (e: Event): void => {
    e.stopPropagation();
    e.preventDefault();
    this.toggle();
  };
  keydownPopover = (e: KeyboardEvent): void => {
    if (isActivationKey(e)) {
      e.preventDefault();
      this.setDropdownDisplayBlock();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      this.setDropdownDisplayNone();
    }
  };
  clickRemovePopover = (e: Event): void => {
    this.hoverRemovePopover(e);
  };
  popoverTrigger = (): void => {
    this._events.abort();
    for (const element of this.children) {
      if (element.tagName === 'R-CONTENT') {
        this._events.on(element, 'change', this.watchContent);
      }
    }
    if (this.trigger.includes('hover')) {
      this._events.on(this, 'mouseenter', this.hoverPopover);
      this._events.on(this, 'mouseleave', this.blur);
    }
    this._events
      .on(this, 'click', this.clickPopover)
      .on(this, 'keydown', this.keydownPopover)
      .on(document, 'click', this.clickRemovePopover);
  };
  hoverRemovePopover = (e: Event): void => {
    e.stopPropagation();
    this.setDropdownDisplayNone();
  };
  changePlacement = debounce((): void => {
    // While open in the body-portal (flip-capable) path, placementPosition()'s
    // resolved-side arrow is authoritative. Without this guard, a debounced
    // call queued (by a `placement` attribute write, or the initial connect)
    // just before the panel opens and flips can fire *after* the flip and
    // revert `arrow` to the nominal, unflipped side while the panel itself
    // stays flipped — pointing the arrow away from the trigger. The
    // getPopupContainerId branch has no flip concept, so it always applies.
    if (!this.getPopupContainerId && this.open) return;
    const side = oppositeSide[this.placementSide as PLACEMENT_TYPE];
    if (side) this.popoverContent?.setAttribute('arrow', side);
  }, HOVER_TIME);
  connectedCallback(): void {
    this.initAria();
    this.handlerExternalCss();
    for (const element of this.children) {
      if (element.tagName === 'R-CONTENT') {
        this.createContent(element.children);
      }
    }
    this.popoverTrigger();
    this.changePlacement();
  }
  disconnectedCallback(): void {
    this._events.abort();
    // popoverContent/popoverInner are portaled to document.body (or
    // getPopupContainerId) — outside this.subtree, so removing the host from
    // the DOM (an SPA route swap, a v-if/conditional unmount, …) never
    // removes them on its own. Left behind, an open panel stays visible
    // forever and — since every listener that could close it lived on
    // `_events` and was just aborted above — nothing can close it either.
    // Cancel in-flight open/close debounces first so a pending timeout can't
    // fire after teardown and resurrect the (about to be detached) panel.
    this.setDropdownDisplayBlock.cancel();
    this.setDropdownDisplayNone.cancel();
    this.blur.cancel();
    this.removeDropDownTimeId.cancel();
    this._floating.destroy();
    clearTimeout(this.removeTimeId);
    this.removeTimeId = undefined;
    this.popoverInner?.remove();
    this.popoverInner = undefined;
    this.popoverContent = undefined;
  }
  attributeChangedCallback(n: string, o: string, v: string): void {
    if (o === v) return;
    if (n === 'trigger') this.popoverTrigger();
    if (n === 'placement') this.changePlacement();
    if (n === 'sheet') this.handlerExternalCss();
    if (n === 'open') this._applyOpen();
  }
}

defineSSR('r-popover', Popover as unknown as new () => HTMLElement);
export default Popover;
