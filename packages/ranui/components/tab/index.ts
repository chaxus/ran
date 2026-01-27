import type { TabAlign, TabChangeEventDetail, TabType } from './types';
import { HTMLElementSSR, createCustomError } from '@/utils/index';

/**
 * Modern Tab Component
 *
 * @element r-tabs
 *
 * @fires change - Fired when the active tab changes
 *
 * @slot - Tab panels (r-tab elements)
 *
 * @csspart header - The tab header container
 * @csspart nav - The navigation container
 * @csspart line - The active indicator line
 * @csspart content - The content container
 *
 * @cssprop --tab-active-color - Active tab color
 * @cssprop --tab-line-color - Indicator line color
 * @cssprop --tab-border-color - Border color for line type
 * @cssprop --tab-border-radius - Border radius
 * @cssprop --tab-transition-duration - Transition duration
 * @cssprop --tab-header-padding - Header padding
 * @cssprop --tab-content-padding - Content padding
 */
export class Tabs extends (HTMLElementSSR()!) {
  private _container!: HTMLDivElement;
  private _header!: HTMLDivElement;
  private _nav!: HTMLDivElement;
  private _line!: HTMLDivElement;
  private _content!: HTMLDivElement;
  private _wrap!: HTMLDivElement;
  private _slot!: HTMLSlotElement;
  private _shadowRoot!: ShadowRoot;
  private _tabHeaderKeyMapIndex: Record<string, number> = {};
  private _previousActive?: string;

  static get observedAttributes(): string[] {
    return ['active', 'type', 'align', 'effect'];
  }

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this.render();
  }

  // ========== Properties ==========

  get align(): TabAlign {
    return (this.getAttribute('align') as TabAlign) || 'start';
  }
  set align(value: TabAlign) {
    this.setAttribute('align', value);
  }

  get type(): TabType {
    return (this.getAttribute('type') as TabType) || 'flat';
  }
  set type(value: TabType) {
    this.setAttribute('type', value);
  }

  get active(): string | null {
    return this.getAttribute('active');
  }
  set active(value: string | null) {
    if (value) {
      this.setAttribute('active', value);
    } else {
      this.removeAttribute('active');
    }
  }

  get effect(): string | null {
    return this.getAttribute('effect');
  }
  set effect(value: string | null) {
    if (value && value !== 'false') {
      this.setAttribute('effect', value);
    } else {
      this.removeAttribute('effect');
    }
  }

  // ========== Render ==========

  private render(): void {
    const style = document.createElement('style');
    style.textContent = `@import url("${new URL('./index.css', import.meta.url).href}");`;

    // Create container structure
    this._container = document.createElement('div');
    this._container.className = 'ran-tab';

    // Header with nav and line
    this._header = document.createElement('div');
    this._header.className = 'ran-tab-header';
    this._header.setAttribute('part', 'header');
    this._header.setAttribute('role', 'tablist');

    this._nav = document.createElement('div');
    this._nav.className = 'ran-tab-header-nav';
    this._nav.setAttribute('part', 'nav');

    this._line = document.createElement('div');
    this._line.className = 'ran-tab-header-line';
    this._line.setAttribute('part', 'line');
    this._line.setAttribute('aria-hidden', 'true');

    this._header.appendChild(this._nav);
    this._header.appendChild(this._line);

    // Content area
    this._content = document.createElement('div');
    this._content.className = 'ran-tab-content';
    this._content.setAttribute('part', 'content');

    this._wrap = document.createElement('div');
    this._wrap.className = 'ran-tab-content-wrap';

    this._slot = document.createElement('slot');

    this._wrap.appendChild(this._slot);
    this._content.appendChild(this._wrap);

    this._container.appendChild(this._header);
    this._container.appendChild(this._content);

    this._shadowRoot.appendChild(style);
    this._shadowRoot.appendChild(this._container);
  }

  // ========== Lifecycle ==========

  connectedCallback(): void {
    this.setupEventListeners();
  }

  disconnectedCallback(): void {
    this.removeEventListeners();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;

    switch (name) {
      case 'align':
        this.updateLineAlignment();
        break;

      case 'effect':
        this.updateEffectOnTabs(newValue);
        break;

      case 'active':
        if (newValue) {
          this.activateTab(newValue);
        }
        break;

      case 'type':
        // Type change handled by CSS
        break;
    }
  }

  // ========== Event Listeners ==========

  private setupEventListeners(): void {
    this._slot.addEventListener('slotchange', this.handleSlotChange);
  }

  private removeEventListeners(): void {
    this._slot.removeEventListener('slotchange', this.handleSlotChange);

    // Remove all tab header click listeners
    const headers = Array.from(this._nav.children);
    headers.forEach((header) => {
      header.removeEventListener('click', this.handleTabClick);
      header.removeEventListener('keydown', this.handleTabKeyDown);
    });
  }

  private handleSlotChange = (): void => {
    this.initializeTabs();
  };

  private handleTabClick = (event: Event): void => {
    const tabHeader = event.currentTarget as HTMLElement;
    const key = tabHeader.getAttribute('r-key');
    const disabled = tabHeader.hasAttribute('disabled');

    if (!disabled && key) {
      this.selectTab(key);
    }
  };

  private handleTabKeyDown = (event: Event): void => {
    const keyboardEvent = event as KeyboardEvent;
    const key = keyboardEvent.key;

    switch (key) {
      case 'ArrowLeft':
        keyboardEvent.preventDefault();
        this.focusPreviousTab();
        break;

      case 'ArrowRight':
        keyboardEvent.preventDefault();
        this.focusNextTab();
        break;

      case 'Home':
        keyboardEvent.preventDefault();
        this.focusFirstTab();
        break;

      case 'End':
        keyboardEvent.preventDefault();
        this.focusLastTab();
        break;

      case 'Enter':
      case ' ':
        { keyboardEvent.preventDefault();
        const tabHeader = event.currentTarget as HTMLElement;
        const tabKey = tabHeader.getAttribute('r-key');
        if (tabKey) {
          this.selectTab(tabKey);
        }
        break; }
    }
  };

  // ========== Tab Management ==========

  private initializeTabs(): void {
    // Clear existing tabs
    this._nav.innerHTML = '';
    this._tabHeaderKeyMapIndex = {};

    // Get all tab panes
    const tabPanes = this._slot.assignedElements();

    tabPanes.forEach((tabPane, index) => {
      const key = tabPane.getAttribute('r-key') || `${index}`;

      // Check for duplicate keys
      if (this._tabHeaderKeyMapIndex[key] !== undefined) {
        throw new Error(`Duplicate tab key: ${key}. Each tab must have a unique r-key attribute.`);
      }

      this._tabHeaderKeyMapIndex[key] = index;

      // Create tab header
      const tabHeader = this.createTabHeader(tabPane, key);
      this._nav.appendChild(tabHeader);

      // Set effect if present
      if (this.effect) {
        tabPane.setAttribute('effect', this.effect);
        this._line.style.display = 'none';
      }

      // Ensure tab pane has the key
      tabPane.setAttribute('r-key', key);
    });

    // Initialize active tab
    this.initializeActiveTab();

    // Update line alignment
    this.updateLineAlignment();
  }

  private createTabHeader(tabPane: Element, key: string): HTMLElement {
    const label = tabPane.getAttribute('label') || '';
    const icon = tabPane.getAttribute('icon');
    const iconSize = tabPane.getAttribute('iconSize');
    const disabled = tabPane.hasAttribute('disabled');
    const type = tabPane.getAttribute('type') || 'text';

    const tabHeader = document.createElement('r-button');
    tabHeader.className = 'tab-header-nav-item';
    tabHeader.setAttribute('type', type);
    tabHeader.setAttribute('role', 'tab');
    tabHeader.setAttribute('r-key', key);
    tabHeader.setAttribute('tabindex', '-1');
    tabHeader.setAttribute('aria-selected', 'false');

    if (icon) tabHeader.setAttribute('icon', icon);
    if (iconSize) tabHeader.setAttribute('iconSize', iconSize);
    if (disabled) {
      tabHeader.setAttribute('disabled', '');
      tabHeader.setAttribute('aria-disabled', 'true');
    }

    tabHeader.innerHTML = label;

    // Add event listeners
    tabHeader.addEventListener('click', this.handleTabClick);
    tabHeader.addEventListener('keydown', this.handleTabKeyDown);

    return tabHeader;
  }

  private initializeActiveTab(): void {
    const headers = Array.from(this._nav.children) as HTMLElement[];
    const enabledHeaders = headers.filter((h) => !h.hasAttribute('disabled'));

    let activeHeader: HTMLElement | undefined;

    // If active attribute is set, find that tab
    if (this.active) {
      activeHeader = enabledHeaders.find((h) => h.getAttribute('r-key') === this.active);
    }

    // Otherwise use first enabled tab
    if (!activeHeader) {
      activeHeader = enabledHeaders[0];
    }

    if (activeHeader) {
      const key = activeHeader.getAttribute('r-key');
      if (key) {
        this.selectTab(key, false);
      }
    }
  }

  private selectTab(key: string, dispatchEvent = true): void {
    const index = this._tabHeaderKeyMapIndex[key];
    if (index === undefined) return;

    // Update active attribute
    this._previousActive = this.active || undefined;
    this.active = key;

    // Update tab headers
    const headers = Array.from(this._nav.children) as HTMLElement[];
    headers.forEach((header) => {
      const headerKey = header.getAttribute('r-key');
      const isActive = headerKey === key;

      if (isActive) {
        header.classList.add('active');
        header.setAttribute('aria-selected', 'true');
        header.setAttribute('tabindex', '0');
      } else {
        header.classList.remove('active');
        header.setAttribute('aria-selected', 'false');
        header.setAttribute('tabindex', '-1');
      }
    });

    // Update line position
    this.updateLinePosition(key);

    // Update content position
    this.updateContentPosition(key);

    // Dispatch change event
    if (dispatchEvent) {
      this.dispatchEvent(
        new CustomEvent<TabChangeEventDetail>('change', {
          detail: {
            active: key,
            previousActive: this._previousActive,
          },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  private activateTab(key: string): void {
    this.selectTab(key, false);
  }

  private updateLinePosition(key: string): void {
    const index = this._tabHeaderKeyMapIndex[key];
    if (index === undefined) return;

    const headers = Array.from(this._nav.children) as HTMLElement[];
    const activeHeader = headers[index];

    if (!activeHeader) return;

    // Calculate width
    const { width } = activeHeader.getBoundingClientRect();
    this._line.style.width = `${width}px`;

    // Calculate distance
    let distance = 0;
    for (let i = 0; i < index; i++) {
      const header = headers[i];
      const { width: headerWidth } = header.getBoundingClientRect();
      distance += headerWidth;
    }

    this._line.style.transform = `translateX(${distance}px)`;
  }

  private updateContentPosition(key: string): void {
    const index = this._tabHeaderKeyMapIndex[key];
    if (index === undefined) return;

    this._wrap.style.transform = `translateX(${index * -100}%)`;

    // Update ARIA for tab panels
    const panels = this._slot.assignedElements();
    panels.forEach((panel, i) => {
      if (i === index) {
        panel.setAttribute('aria-hidden', 'false');
      } else {
        panel.setAttribute('aria-hidden', 'true');
      }
    });
  }

  private updateLineAlignment(): void {
    if (this.align === 'center') {
      this.initTabLineAlignCenter();
    } else if (this.align === 'end') {
      this.initTabLineAlignEnd();
    } else {
      this._line.style.left = '';
    }
  }

  private initTabLineAlignCenter(): void {
    const headers = Array.from(this._nav.children) as HTMLElement[];
    let totalWidth = 0;

    headers.forEach((header) => {
      const { width } = header.getBoundingClientRect();
      totalWidth += width;
    });

    this._line.style.left = `calc(50% - ${totalWidth / 2}px)`;
  }

  private initTabLineAlignEnd(): void {
    const headers = Array.from(this._nav.children) as HTMLElement[];
    let totalWidth = 0;

    headers.forEach((header) => {
      const { width } = header.getBoundingClientRect();
      totalWidth += width;
    });

    this._line.style.left = `calc(100% - ${totalWidth}px)`;
  }

  private updateEffectOnTabs(effect: string): void {
    const headers = Array.from(this._nav.children) as HTMLElement[];
    const panels = this._slot.assignedElements();

    headers.forEach((header) => {
      if (!effect || effect === 'false') {
        header.removeAttribute('effect');
      } else {
        header.setAttribute('effect', effect);
      }
    });

    panels.forEach((panel) => {
      if (!effect || effect === 'false') {
        panel.removeAttribute('effect');
      } else {
        panel.setAttribute('effect', effect);
      }
    });

    // Hide line if effect is set
    if (effect && effect !== 'false') {
      this._line.style.display = 'none';
    } else {
      this._line.style.display = '';
    }
  }

  // ========== Keyboard Navigation ==========

  private focusPreviousTab(): void {
    const headers = Array.from(this._nav.children) as HTMLElement[];
    const currentIndex = headers.findIndex((h) => h.getAttribute('tabindex') === '0');

    if (currentIndex <= 0) return;

    let newIndex = currentIndex - 1;
    while (newIndex >= 0 && headers[newIndex].hasAttribute('disabled')) {
      newIndex--;
    }

    if (newIndex >= 0) {
      headers[newIndex].focus();
    }
  }

  private focusNextTab(): void {
    const headers = Array.from(this._nav.children) as HTMLElement[];
    const currentIndex = headers.findIndex((h) => h.getAttribute('tabindex') === '0');

    if (currentIndex >= headers.length - 1) return;

    let newIndex = currentIndex + 1;
    while (newIndex < headers.length && headers[newIndex].hasAttribute('disabled')) {
      newIndex++;
    }

    if (newIndex < headers.length) {
      headers[newIndex].focus();
    }
  }

  private focusFirstTab(): void {
    const headers = Array.from(this._nav.children) as HTMLElement[];
    const firstEnabled = headers.find((h) => !h.hasAttribute('disabled'));

    if (firstEnabled) {
      firstEnabled.focus();
    }
  }

  private focusLastTab(): void {
    const headers = Array.from(this._nav.children) as HTMLElement[];
    const lastEnabled = headers.reverse().find((h) => !h.hasAttribute('disabled'));

    if (lastEnabled) {
      lastEnabled.focus();
    }
  }

  // ========== Public Methods ==========

  /**
   * Updates an attribute on a specific tab header
   */
  public updateAttribute(key: string, attribute: string, value: string | null = ''): void {
    const index = this._tabHeaderKeyMapIndex[key];
    if (index === undefined) return;

    const headers = Array.from(this._nav.children) as HTMLElement[];
    const header = headers[index];

    if (!header) return;

    if (value) {
      header.setAttribute(attribute, value);
    } else {
      header.removeAttribute(attribute);
    }
  }
}

function Custom() {
  if (typeof document !== 'undefined' && !customElements.get('r-tabs')) {
    customElements.define('r-tabs', Tabs);
    return Tabs;
  } else {
    return createCustomError('document is undefined or r-tabs already exists');
  }
}

export default Custom();
