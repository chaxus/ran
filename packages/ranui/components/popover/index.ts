/*
 * @Author: chaxus nouo18@163.com
 * @Date: 2024-12-08 17:58:20
 * @LastEditors: chaxus nouo18@163.com
 * @LastEditTime: 2025-03-01 17:34:11
 * @FilePath: /ran/packages/ranui/components/popover/index.ts
 */
import { create, isMobile } from 'ranuts/utils';
import { debounce } from 'lodash-es';
import { HTMLElementSSR, createCustomError } from '@/utils/index';
import '@/components/popover/content';
import '@/components/dropdown';

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

export class Popover extends (HTMLElementSSR()!) {
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
    return ['placement', 'arrow', 'trigger'];
  }
  constructor() {
    super();
    this._slot = document.createElement('slot');
    this._slot.setAttribute('class', 'slot');
    this.popoverBlock = document.createElement('div');
    this.popoverBlock.setAttribute('class', 'ran-popover-block');
    this.popoverBlock.setAttribute('role', 'tooltip');
    this.popoverBlock.appendChild(this._slot);
    const shadowRoot = this.attachShadow({ mode: 'closed' });
    this._shadowDom = shadowRoot;
    shadowRoot.appendChild(this.popoverBlock);
  }
  get placement(): string {
    return this.getAttribute('placement') || 'top';
  }
  set placement(value: string) {
    this.setAttribute('placement', value);
  }
  get arrow(): string {
    return this.getAttribute('arrow') || '';
  }
  set arrow(value: string) {
    this.setAttribute('arrow', value);
  }
  get trigger(): string {
    return this.getAttribute('trigger') || 'hover';
  }
  set trigger(value: string) {
    this.setAttribute('trigger', value);
  }
  get getPopupContainerId(): string {
    return this.getAttribute('getPopupContainerId') || '';
  }
  set getPopupContainerId(value: string) {
    this.setAttribute('getPopupContainerId', value);
  }
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
      const div = document.createElement('div');
      this.popoverContent = create('r-dropdown')
        .setAttribute('class', 'ran-popover-dropdown')
        .setStyle('display', 'none')
        .setStyle('position', 'absolute').element;
      this.popoverContent?.addEventListener('click', this.stopPropagation);
      this.popoverContent && div.appendChild(this.popoverContent);
      if (this.trigger.includes('hover') && !isMobile()) {
        this.popoverContent?.addEventListener('mouseleave', this.blur);
        this.popoverContent?.addEventListener('mouseenter', this.removeDropDownTimeId);
      }
      document.body.appendChild(div);
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
      this.popoverContent.setAttribute('transit', placementDirection[this.placement].add);
      this.popoverContent?.style.setProperty('display', 'block');
      this.placementPosition();
      this.dropDownInTimeId = setTimeout(() => {
        this.popoverContent && this.popoverContent.removeAttribute('transit');
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
      this.popoverContent.setAttribute('transit', placementDirection[this.placement].remove);
      this.dropDownOutTimeId = setTimeout(() => {
        this.popoverContent?.style.setProperty('display', 'none');
        this.popoverContent && this.popoverContent.removeAttribute('transit');
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
    let popoverTop = bottom + window.scrollY + arrowHeight;
    let popoverLeft = left + window.scrollX;
    const root = document.getElementById(this.getPopupContainerId);
    const popoverContentRect = this.popoverContent.getBoundingClientRect();
    if (this.placement === PLACEMENT_TYPE.TOP) {
      popoverTop = top + window.scrollY - popoverContentRect.height - arrowHeight;
      if (this.getPopupContainerId && root) {
        const rootRect = root.getBoundingClientRect();
        popoverLeft = left - rootRect.left;
        popoverTop = top - root.getBoundingClientRect().top - this.popoverContent.clientHeight - arrowHeight;
        popoverLeft = left - root.getBoundingClientRect().left;
      }
    }
    if (this.placement === PLACEMENT_TYPE.LEFT) {
      popoverLeft = left - popoverContentRect.width - arrowHeight;
      popoverTop = top + window.scrollY;
    }
    if (this.placement === PLACEMENT_TYPE.RIGHT) {
      popoverLeft = left + width + arrowHeight;
      popoverTop = top + window.scrollY;
    }
    this.popoverContent.style.setProperty('inset', `${popoverTop}px auto auto ${popoverLeft}px`);
    this.popoverContent.style.setProperty('--ran-x', `${popoverLeft}px`);
    this.popoverContent.style.setProperty('--ran-y', `${popoverTop}px`);
    this.popoverContent.style.setProperty('--ran-popover-width', `${width}px`);
    this.popoverContent.style.setProperty('--ran-popover-height', `${height}px`);
    this.popoverContent.style.setProperty('--ran-popover-content-width', `${popoverContentRect.width}px`);
    this.popoverContent.style.setProperty('--ran-popover-content-height', `${popoverContentRect.height}px`);
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
  }
  clickRemovePopover = (e: Event): void => {
    this.hoverRemovePopover(e);
  };
  popoverTrigger = (): void => {
    this.removeEventListener('mouseenter', this.hoverPopover);
    this.removeEventListener('mouseleave', this.blur);
    this.removeEventListener('click', this.clickPopover);
    if (this.trigger.includes('hover')) {
      this.addEventListener('mouseenter', this.hoverPopover);
      this.addEventListener('mouseleave', this.blur);
    }
    this.addEventListener('click', this.clickPopover);
  }
  hoverRemovePopover = (e: Event): void => {
    e.stopPropagation();
    this.setDropdownDisplayNone();
  };
  changePlacement = debounce((): void => {
    if (this.placement === PLACEMENT_TYPE.TOP) {
      this.popoverContent?.setAttribute('arrow', PLACEMENT_TYPE.BOTTOM);
    }
    if (this.placement === PLACEMENT_TYPE.BOTTOM) {
      this.popoverContent?.setAttribute('arrow', PLACEMENT_TYPE.TOP);
    }
    if (this.placement === PLACEMENT_TYPE.LEFT) {
      this.popoverContent?.setAttribute('arrow', PLACEMENT_TYPE.RIGHT);
    }
    if (this.placement === PLACEMENT_TYPE.RIGHT) {
      this.popoverContent?.setAttribute('arrow', PLACEMENT_TYPE.LEFT);
    }
  }, HOVER_TIME);
  connectedCallback(): void {
    for (const element of this.children) {
      if (element.tagName === 'R-CONTENT') {
        element.addEventListener('change', this.watchContent);
        this.createContent(element.children);
      }
    }
    this.popoverTrigger();
    this.changePlacement();
    document.addEventListener('click', this.clickRemovePopover);
  }
  disconnectCallback(): void {
    this.removeEventListener('mouseenter', this.hoverPopover);
    this.removeEventListener('mouseleave', this.hoverRemovePopover);
    this.removeEventListener('click', this.hoverPopover);
    document.removeEventListener('click', this.clickRemovePopover);
  }
  attributeChangedCallback(n: string, o: string, v: string): void {
    if (o !== v) {
      if (n === 'trigger') {
        this.popoverTrigger();
      }
      if (n === 'placement') {
        this.changePlacement();
      }
    }
  }
}

function Custom() {
  if (typeof document !== 'undefined' && !customElements.get('r-popover')) {
    customElements.define('r-popover', Popover);
    return Popover;
  } else {
    return createCustomError('document is undefined or r-popover is exist');
  }
}

export default Custom();
