import { create, isMobile } from 'ranuts/utils';
import { HTMLElementSSR, createCustomError } from '@/utils/index';
import '@/components/popover/content';
import '@/components/dropdown';

// index.ts:29 Uncaught DOMException: Failed to construct 'CustomElement': The result must not have children
// index.ts:31 Uncaught DOMException: Failed to construct 'CustomElement': The result must not have attributes
const arrowHeight = 4;

const animationTime = 300;

interface PlacementDirection {
  [x: string]: Record<string, string>;
}

const placementDirection: PlacementDirection = {
  bottom: {
    add: 'ran-dropdown-down-in',
    remove: 'ran-dropdown-down-out',
  },
  top: {
    add: 'ran-dropdown-up-in',
    remove: 'ran-dropdown-up-out',
  },
};

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
  watchContent = (e: Event): void => {
    const { value } = (e as CustomEvent).detail;
    this.createContent(value.content);
  };
  /**
   * @description: 焦点移除的情况，需要移除下拉框
   * @return {*}
   */
  blur = (): void => {
    if (this.removeTimeId) {
      this.removeDropDownTimeId();
    }
    this.removeTimeId = setTimeout(() => {
      this.removeDropDownTimeId();
      this.setDropdownDisplayNone();
    }, 300);
  };
  removeDropDownTimeId = (): void => {
    if (this.trigger.includes('hover') && !isMobile()) {
      clearTimeout(this.removeTimeId);
      this.removeTimeId = undefined;
    }
  };
  /**
   * @description: 添加 dropdown
   * @return {*}
   */
  setDropdownDisplayBlock = (): void => {
    if (this.dropDownInTimeId) return;
    if (this.popoverContent && this.popoverContent.style.display !== 'block') {
      this.popoverContent.setAttribute('transit', placementDirection[this.placement].add);
      this.popoverContent?.style.setProperty('display', 'block');
      this.dropDownInTimeId = setTimeout(() => {
        this.popoverContent && this.popoverContent.removeAttribute('transit');
        clearTimeout(this.dropDownInTimeId);
        this.dropDownInTimeId = undefined;
      }, animationTime);
    }
  };
  /**
   * @description: 移除 select dropdown
   * @return {*}
   */
  setDropdownDisplayNone = (): void => {
    if (this.dropDownOutTimeId) return;
    if (this.popoverContent && this.popoverContent.style.display !== 'none') {
      this.popoverContent.setAttribute('transit', placementDirection[this.placement].remove);
      this.dropDownOutTimeId = setTimeout(() => {
        this.popoverContent?.style.setProperty('display', 'none');
        this.popoverContent && this.popoverContent.removeAttribute('transit');
        clearTimeout(this.dropDownOutTimeId);
        this.dropDownOutTimeId = undefined;
      }, animationTime);
    }
  };
  placementPosition = (): void => {
    if (!this.popoverContent) return;
    const rect = this.getBoundingClientRect();
    const { top, left, bottom, width, height } = rect;
    let popoverTop = bottom + window.scrollY + arrowHeight;
    let popoverLeft = left + window.scrollX;
    const root = document.getElementById(this.getPopupContainerId);
    const popoverContentRect = this.popoverContent.getBoundingClientRect();
    if (this.placement === 'top') {
      popoverTop = top + window.scrollY - popoverContentRect.height - arrowHeight;
      if (this.getPopupContainerId && root) {
        const rootRect = root.getBoundingClientRect();
        popoverLeft = left - rootRect.left;
        popoverTop = top - root.getBoundingClientRect().top - this.popoverContent.clientHeight - arrowHeight;
        popoverLeft = left - root.getBoundingClientRect().left;
      }
    }
    this.popoverContent.style.setProperty('inset', `${popoverTop}px auto auto ${popoverLeft}px`);
    this.popoverContent.style.setProperty('--ran-x', `${popoverLeft}px`);
    this.popoverContent.style.setProperty('--ran-y', `${popoverTop}px`);
    this.popoverContent.style.setProperty('--ran-popover-width', `${width}px`);
    this.popoverContent.style.setProperty('--ran-popover-height', `${popoverContentRect.height}px`);
  };
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
    this.placementPosition();
  };
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
  };
  hoverRemovePopover = (e: Event): void => {
    e.stopPropagation();
    this.setDropdownDisplayNone();
  };
  changePlacement = (): void => {
    if (this.placement) {
      const arrow = this.placement === 'bottom' ? 'top' : 'bottom';
      this.popoverContent?.setAttribute('arrow', arrow);
    }
  };
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
