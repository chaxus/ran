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
import { Div, EventManager, Slot, View } from '@/utils/builder';
import {
  ensureShadowElement,
  ensureShadowRoot,
  getStringAttribute,
  setStringAttribute,
  syncSheetAttribute,
} from '@/utils/component';
import popoverCss from './index.less?inline';
import { defineSSR } from '@/utils/ssr-registry';
import { computePlacement, type Placement } from '@/utils/placement';
import { isActivationKey } from '@/utils/a11y';

// index.ts:29 Uncaught DOMException: Failed to construct 'CustomElement': The result must not have children
// index.ts:31 Uncaught DOMException: Failed to construct 'CustomElement': The result must not have attributes
const arrowHeight = 8;

const animationTime = 300;

const HOVER_TIME = 16;

export type PlacementDirection = Record<string, Record<string, string>>;

const placementDirection: PlacementDirection = {
  bottom: {
    add: 'ran-dropdown-down-in',
    remove: 'ran-dropdown-down-out',
  },
  top: {
    add: 'ran-dropdown-up-in',
    remove: 'ran-dropdown-up-out',
  },
  left: {
    add: 'ran-dropdown-left-in',
    remove: 'ran-dropdown-left-out',
  },
  right: {
    add: 'ran-dropdown-right-in',
    remove: 'ran-dropdown-right-out',
  },
};

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

export class Popover extends RanElement {
  _events = new EventManager();
  _slot: HTMLSlotElement;
  popoverBlock: HTMLDivElement;
  popoverContent?: HTMLElement;
  popoverInner?: HTMLDivElement;
  popoverInnerBlock?: HTMLDivElement;
  _shadowDom: ShadowRoot;
  dropDownInTimeId?: NodeJS.Timeout;
  dropDownOutTimeId?: NodeJS.Timeout;
  removeTimeId?: NodeJS.Timeout;
  static get observedAttributes(): string[] {
    return ['placement', 'trigger', 'sheet'];
  }
  public readonly closePopover = (): void => {
    this.setDropdownDisplayNone();
  };
  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this, popoverCss);
    const block = ensureShadowElement(
      this._shadowDom,
      '.ran-popover-block',
      () => Div().class('ran-popover-block').role('tooltip').children(Slot().class('slot')).build() as HTMLDivElement,
    );

    this.popoverBlock = block;
    this._slot = block.querySelector('.slot') as HTMLSlotElement;
  }
  get placement(): string {
    return getStringAttribute(this, 'placement', 'top');
  }
  set placement(value: string) {
    setStringAttribute(this, 'placement', value);
  }
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
      this.popoverContent = View('r-dropdown')
        .class('ran-popover-dropdown')
        .style('display', 'none')
        .style('position', 'absolute')
        // r-dropdown is a zero-padding primitive (select's item list wants
        // edge-to-edge rows); a popover's arbitrary content needs breathing
        // room, or it renders flush against the rounded panel edges.
        .cssVar('ran-dropdown-padding', 'var(--ran-popover-content-padding, 12px)')
        .build() as HTMLElement;
      this.popoverContent?.addEventListener('click', this.stopPropagation);

      const div = Div().children(this.popoverContent).build() as HTMLDivElement;

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
    }, animationTime);
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
    if (this.dropDownInTimeId) return;
    clearTimeout(this.dropDownInTimeId);
    this.dropDownInTimeId = undefined;
    clearTimeout(this.dropDownOutTimeId);
    this.dropDownOutTimeId = undefined;
    if (this.popoverContent && this.popoverContent.style.display !== 'block') {
      this.updateAriaExpanded(true);
      this.popoverContent.setAttribute('transit', placementDirection[this.placement].add);
      this.popoverContent?.style.setProperty('display', 'block');
      this.placementPosition();
      this.dropDownInTimeId = setTimeout(() => {
        if (this.popoverContent) {
          this.popoverContent.removeAttribute('transit');
        }
        clearTimeout(this.dropDownInTimeId);
        this.dropDownInTimeId = undefined;
      }, animationTime);
    }
  }, HOVER_TIME);
  /**
   * @description: 移除 select dropdown
   * @return {*}
   */
  setDropdownDisplayNone = debounce((): void => {
    if (this.dropDownOutTimeId) return;
    clearTimeout(this.dropDownInTimeId);
    this.dropDownInTimeId = undefined;
    clearTimeout(this.dropDownOutTimeId);
    this.dropDownOutTimeId = undefined;
    if (this.popoverContent && this.popoverContent.style.display !== 'none') {
      this.updateAriaExpanded(false);
      this.popoverContent.setAttribute('transit', placementDirection[this.placement].remove);
      this.dropDownOutTimeId = setTimeout(() => {
        this.popoverContent?.style.setProperty('display', 'none');
        if (this.popoverContent) {
          this.popoverContent.removeAttribute('transit');
        }
        clearTimeout(this.dropDownOutTimeId);
        this.dropDownOutTimeId = undefined;
      }, animationTime);
    }
  }, HOVER_TIME);
  /**
   * @description: 设置 popover 位置
   * @param {*} void
   * @return {*}
   */
  placementPosition = (): void => {
    if (!this.popoverContent) return;
    const rect = this.getBoundingClientRect();
    const { top, left, bottom, width, height } = rect;
    const root = document.getElementById(this.getPopupContainerId);
    const popoverContentRect = this.popoverContent.getBoundingClientRect();
    let popoverTop: number;
    let popoverLeft: number;

    if (this.getPopupContainerId && root) {
      // Coordinates are relative to the custom container, not the viewport —
      // boundary-aware flip (which assumes viewport coordinates) doesn't
      // apply here, so fall back to the simple placement.
      const rootRect = root.getBoundingClientRect();
      popoverTop = bottom - rootRect.top + arrowHeight;
      popoverLeft = left - rootRect.left;
      if (this.placement === PLACEMENT_TYPE.TOP) {
        popoverTop = top - rootRect.top - this.popoverContent.clientHeight - arrowHeight;
      }
      if (this.placement === PLACEMENT_TYPE.LEFT) {
        popoverLeft = left - rootRect.left - Math.max(popoverContentRect.width, width) - arrowHeight;
        popoverTop = top - rootRect.top;
      }
      if (this.placement === PLACEMENT_TYPE.RIGHT) {
        popoverLeft = left - rootRect.left + width + arrowHeight;
        popoverTop = top - rootRect.top;
      }
    } else {
      // Portaled to <body>: viewport-relative, so flip to the opposite side
      // when the preferred side lacks room and shift along the cross axis to
      // stay on-screen — the same flip/shift middleware pattern Floating
      // UI/Radix use.
      const computed = computePlacement({
        anchor: { top, left, width, height },
        floating: { width: popoverContentRect.width, height: popoverContentRect.height },
        placement: this.placement as Placement,
        offset: arrowHeight,
      });
      popoverTop = computed.top + window.scrollY;
      popoverLeft = computed.left + window.scrollX;
      // A flip changes which side the panel actually renders on — repoint the
      // arrow so it still points back at the trigger instead of the nominal side.
      const side = oppositeSide[computed.placement as PLACEMENT_TYPE];
      if (side) this.popoverContent.setAttribute('arrow', side);
    }

    this.popoverContent.style.setProperty('inset', `${popoverTop}px auto auto ${popoverLeft}px`);
    this.popoverContent.style.setProperty('--ran-x', `${popoverLeft}px`);
    this.popoverContent.style.setProperty('--ran-y', `${popoverTop}px`);
    this.popoverContent.style.setProperty('--ran-dropdown-arrow-anchor-width', `${width}px`);
    this.popoverContent.style.setProperty('--ran-dropdown-arrow-anchor-height', `${height}px`);
    this.popoverContent.style.setProperty('--ran-dropdown-min-width', `${popoverContentRect.width}px`);
    this.popoverContent.style.setProperty('--ran-dropdown-min-height', `${popoverContentRect.height}px`);
  };
  /**
   * @description: 鼠标移入
   * @param {Event} e
   * @return {*}
   */
  hoverPopover = (e: Event): void => {
    this.clickPopover(e);
  };

  clickContent = (e: Event): void => {
    e.stopPropagation();
  };
  clickPopover = (e: Event): void => {
    e.stopPropagation();
    e.preventDefault();
    this.setDropdownDisplayBlock();
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
    if (!this.getPopupContainerId && this.popoverContent?.style.display === 'block') return;
    const side = oppositeSide[this.placement as PLACEMENT_TYPE];
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
  }
  attributeChangedCallback(n: string, o: string, v: string): void {
    if (o === v) return;
    if (n === 'trigger') this.popoverTrigger();
    if (n === 'placement') this.changePlacement();
    if (n === 'sheet') this.handlerExternalCss();
  }
}

defineSSR('r-popover', Popover as unknown as new () => HTMLElement);
export default Popover;
