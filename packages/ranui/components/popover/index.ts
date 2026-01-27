import type { PopoverPlacement, PopoverTrigger, PopoverVisibilityEventDetail, PopoverContentChangeEventDetail } from './types';
import { HTMLElementSSR, createCustomError } from '@/utils/index';
import '@/components/popover/content';
import '@/components/dropdown';

const ARROW_HEIGHT = 8;
const ANIMATION_TIME = 300;
const HOVER_DELAY = 16;

/**
 * Modern Popover Component
 *
 * @element r-popover
 *
 * @fires popover-show - Fired when popover becomes visible
 * @fires popover-hide - Fired when popover becomes hidden
 *
 * @csspart trigger - The trigger element
 * @csspart popover - The popover dropdown
 *
 * @cssprop --popover-bg - Popover background color
 * @cssprop --popover-border-radius - Popover border radius
 * @cssprop --popover-box-shadow - Popover box shadow
 * @cssprop --popover-max-width - Popover maximum width
 */
export class Popover extends (HTMLElementSSR()!) {
  private _slot!: HTMLSlotElement;
  private _triggerBlock!: HTMLDivElement;
  private _popoverContent?: HTMLElement;
  private _shadowRoot!: ShadowRoot;
  private _showTimer?: NodeJS.Timeout;
  private _hideTimer?: NodeJS.Timeout;

  static get observedAttributes(): string[] {
    return ['placement', 'trigger', 'visible'];
  }

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this.render();
  }

  // ========== Properties ==========

  get placement(): PopoverPlacement {
    return (this.getAttribute('placement') as PopoverPlacement) || 'top';
  }
  set placement(value: PopoverPlacement) {
    this.setAttribute('placement', value);
  }

  get trigger(): PopoverTrigger {
    return (this.getAttribute('trigger') as PopoverTrigger) || 'hover';
  }
  set trigger(value: PopoverTrigger) {
    this.setAttribute('trigger', value);
  }

  get visible(): boolean {
    return this.hasAttribute('visible');
  }
  set visible(value: boolean) {
    if (value) {
      this.setAttribute('visible', '');
    } else {
      this.removeAttribute('visible');
    }
  }

  get popupContainerId(): string {
    return this.getAttribute('popup-container-id') || '';
  }
  set popupContainerId(value: string) {
    if (value) {
      this.setAttribute('popup-container-id', value);
    } else {
      this.removeAttribute('popup-container-id');
    }
  }

  // ========== Render ==========

  private render(): void {
    const style = document.createElement('style');
    style.textContent = `@import url("${new URL('./index.css', import.meta.url).href}");`;

    this._slot = document.createElement('slot');
    this._slot.setAttribute('class', 'slot');

    this._triggerBlock = document.createElement('div');
    this._triggerBlock.setAttribute('part', 'trigger');
    this._triggerBlock.setAttribute('class', 'popover-trigger');
    this._triggerBlock.setAttribute('role', 'button');
    this._triggerBlock.setAttribute('tabindex', '0');
    this._triggerBlock.appendChild(this._slot);

    this._shadowRoot.appendChild(style);
    this._shadowRoot.appendChild(this._triggerBlock);
  }

  // ========== Lifecycle ==========

  connectedCallback(): void {
    this.setupEventListeners();
    this.setupContentObserver();
    this.updateArrowPlacement();
  }

  disconnectedCallback(): void {
    this.removeEventListeners();
    this.cleanupTimers();
    if (this._popoverContent) {
      this._popoverContent.remove();
      this._popoverContent = undefined;
    }
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;

    switch (name) {
      case 'placement':
        this.updateArrowPlacement();
        if (this.visible) {
          this.updatePosition();
        }
        break;

      case 'trigger':
        this.removeEventListeners();
        this.setupEventListeners();
        break;

      case 'visible':
        if (this.visible) {
          this.showPopover();
        } else {
          this.hidePopover();
        }
        break;
    }
  }

  // ========== Event Listeners ==========

  private setupEventListeners(): void {
    const triggers = this.trigger.split(' ') as PopoverTrigger[];

    if (triggers.includes('hover')) {
      this._triggerBlock.addEventListener('mouseenter', this.handleMouseEnter);
      this._triggerBlock.addEventListener('mouseleave', this.handleMouseLeave);
    }

    if (triggers.includes('click')) {
      this._triggerBlock.addEventListener('click', this.handleClick);
    }

    if (triggers.includes('focus')) {
      this._triggerBlock.addEventListener('focus', this.handleFocus);
      this._triggerBlock.addEventListener('blur', this.handleBlur);
    }

    // Keyboard support
    this._triggerBlock.addEventListener('keydown', this.handleKeyDown);

    // Close on outside click
    document.addEventListener('click', this.handleOutsideClick);
  }

  private removeEventListeners(): void {
    this._triggerBlock.removeEventListener('mouseenter', this.handleMouseEnter);
    this._triggerBlock.removeEventListener('mouseleave', this.handleMouseLeave);
    this._triggerBlock.removeEventListener('click', this.handleClick);
    this._triggerBlock.removeEventListener('focus', this.handleFocus);
    this._triggerBlock.removeEventListener('blur', this.handleBlur);
    this._triggerBlock.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('click', this.handleOutsideClick);

    if (this._popoverContent) {
      this._popoverContent.removeEventListener('mouseenter', this.handlePopoverMouseEnter);
      this._popoverContent.removeEventListener('mouseleave', this.handlePopoverMouseLeave);
    }
  }

  private handleMouseEnter = (): void => {
    this.clearHideTimer();
    this.scheduleShow();
  };

  private handleMouseLeave = (): void => {
    this.clearShowTimer();
    this.scheduleHide();
  };

  private handlePopoverMouseEnter = (): void => {
    this.clearHideTimer();
  };

  private handlePopoverMouseLeave = (): void => {
    this.scheduleHide();
  };

  private handleClick = (event: Event): void => {
    event.stopPropagation();
    this.toggle();
  };

  private handleFocus = (): void => {
    this.show();
  };

  private handleBlur = (): void => {
    this.hide();
  };

  private handleKeyDown = (event: Event): void => {
    const keyboardEvent = event as KeyboardEvent;

    if (keyboardEvent.key === 'Enter' || keyboardEvent.key === ' ') {
      keyboardEvent.preventDefault();
      this.toggle();
    } else if (keyboardEvent.key === 'Escape' && this.visible) {
      keyboardEvent.preventDefault();
      this.hide();
    }
  };

  private handleOutsideClick = (event: Event): void => {
    if (!this.visible) return;

    const target = event.target as Node;
    if (!this.contains(target) && !this._popoverContent?.contains(target)) {
      this.hide();
    }
  };

  // ========== Content Management ==========

  private setupContentObserver(): void {
    // Listen for content changes from r-content children
    for (const element of this.children) {
      if (element.tagName === 'R-CONTENT') {
        element.addEventListener('change', this.handleContentChange);
        // Initialize with current content
        this.createPopoverContent(element.children);
      }
    }
  }

  private handleContentChange = (event: Event): void => {
    const customEvent = event as CustomEvent;
    const { content } = customEvent.detail.value;
    this.createPopoverContent(content);
  };

  private createPopoverContent(content: HTMLCollection): void {
    if (!this._popoverContent) {
      this._popoverContent = document.createElement('r-dropdown');
      this._popoverContent.setAttribute('class', 'popover-dropdown');
      this._popoverContent.setAttribute('part', 'popover');
      this._popoverContent.style.display = 'none';
      this._popoverContent.style.position = 'absolute';

      // Add hover listeners for popover content
      if (this.trigger.includes('hover')) {
        this._popoverContent.addEventListener('mouseenter', this.handlePopoverMouseEnter);
        this._popoverContent.addEventListener('mouseleave', this.handlePopoverMouseLeave);
      }

      document.body.appendChild(this._popoverContent);
    }

    // Update content
    if (this._popoverContent && content.length > 0) {
      this._popoverContent.innerHTML = '';
      const fragment = document.createDocumentFragment();
      for (const child of content) {
        fragment.appendChild(child.cloneNode(true));
      }
      this._popoverContent.appendChild(fragment);
    }

    this.dispatchEvent(
      new CustomEvent<PopoverContentChangeEventDetail>('popover-content-change', {
        detail: { content },
        bubbles: true,
        composed: true,
      })
    );
  }

  // ========== Position Management ==========

  private updatePosition(): void {
    if (!this._popoverContent) return;

    const triggerRect = this.getBoundingClientRect();
    const { top, left, bottom, width, height } = triggerRect;

    let popoverTop = bottom + window.scrollY + ARROW_HEIGHT;
    let popoverLeft = left + window.scrollX;

    const container = this.popupContainerId ? document.getElementById(this.popupContainerId) : null;
    const popoverRect = this._popoverContent.getBoundingClientRect();

    switch (this.placement) {
      case 'top':
        popoverTop = top + window.scrollY - Math.max(popoverRect.height, height) - ARROW_HEIGHT;
        if (container) {
          const containerRect = container.getBoundingClientRect();
          popoverTop = top - containerRect.top - popoverRect.height - ARROW_HEIGHT;
          popoverLeft = left - containerRect.left;
        }
        break;

      case 'left':
        popoverLeft = left - Math.max(popoverRect.width, width) - ARROW_HEIGHT;
        popoverTop = top + window.scrollY;
        break;

      case 'right':
        popoverLeft = left + width + ARROW_HEIGHT;
        popoverTop = top + window.scrollY;
        break;

      case 'bottom':
      default:
        // Already calculated above
        break;
    }

    this._popoverContent.style.setProperty('inset', `${popoverTop}px auto auto ${popoverLeft}px`);
    this._popoverContent.style.setProperty('--ran-x', `${popoverLeft}px`);
    this._popoverContent.style.setProperty('--ran-y', `${popoverTop}px`);
    this._popoverContent.style.setProperty('--ran-popover-width', `${width}px`);
    this._popoverContent.style.setProperty('--ran-popover-height', `${height}px`);
    this._popoverContent.style.setProperty('--ran-popover-content-width', `${popoverRect.width}px`);
    this._popoverContent.style.setProperty('--ran-popover-content-height', `${popoverRect.height}px`);
  }

  private updateArrowPlacement(): void {
    if (!this._popoverContent) return;

    const arrowPlacement: Record<PopoverPlacement, PopoverPlacement> = {
      top: 'bottom',
      bottom: 'top',
      left: 'right',
      right: 'left',
    };

    this._popoverContent.setAttribute('arrow', arrowPlacement[this.placement]);
  }

  // ========== Visibility Management ==========

  private scheduleShow(): void {
    this.clearShowTimer();
    this._showTimer = setTimeout(() => {
      this.show();
    }, HOVER_DELAY);
  }

  private scheduleHide(): void {
    this.clearHideTimer();
    this._hideTimer = setTimeout(() => {
      this.hide();
    }, ANIMATION_TIME);
  }

  private clearShowTimer(): void {
    if (this._showTimer) {
      clearTimeout(this._showTimer);
      this._showTimer = undefined;
    }
  }

  private clearHideTimer(): void {
    if (this._hideTimer) {
      clearTimeout(this._hideTimer);
      this._hideTimer = undefined;
    }
  }

  private cleanupTimers(): void {
    this.clearShowTimer();
    this.clearHideTimer();
  }

  private showPopover(): void {
    if (!this._popoverContent) return;

    const transitionClass = `ran-dropdown-${this.placement}-in`;
    this._popoverContent.setAttribute('transit', transitionClass);
    this._popoverContent.style.display = 'block';
    this.updatePosition();

    this.dispatchEvent(
      new CustomEvent<PopoverVisibilityEventDetail>('popover-show', {
        detail: { visible: true, placement: this.placement },
        bubbles: true,
        composed: true,
      })
    );
  }

  private hidePopover(): void {
    if (!this._popoverContent) return;

    const transitionClass = `ran-dropdown-${this.placement}-out`;
    this._popoverContent.setAttribute('transit', transitionClass);

    setTimeout(() => {
      if (this._popoverContent) {
        this._popoverContent.style.display = 'none';
        this._popoverContent.removeAttribute('transit');
      }
    }, ANIMATION_TIME);

    this.dispatchEvent(
      new CustomEvent<PopoverVisibilityEventDetail>('popover-hide', {
        detail: { visible: false, placement: this.placement },
        bubbles: true,
        composed: true,
      })
    );
  }

  // ========== Public Methods ==========

  /**
   * Shows the popover
   */
  public show(): void {
    this.visible = true;
  }

  /**
   * Hides the popover
   */
  public hide(): void {
    this.visible = false;
  }

  /**
   * Toggles the popover visibility
   */
  public toggle(): void {
    this.visible = !this.visible;
  }

  /**
   * Closes the popover (alias for hide)
   */
  public readonly close = (): void => {
    this.hide();
  };
}

function Custom() {
  if (typeof document !== 'undefined' && !customElements.get('r-popover')) {
    customElements.define('r-popover', Popover);
    return Popover;
  } else {
    return createCustomError('document is undefined or r-popover already exists');
  }
}

export default Custom();
