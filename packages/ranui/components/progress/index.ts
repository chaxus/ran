import type {
  ProgressChangeEventDetail,
  ProgressSize,
  ProgressStatus,
  ProgressType,
} from './types';
import { HTMLElementSSR, createCustomError } from '@/utils/index';

/**
 * Modern Progress Component
 *
 * @element r-progress
 *
 * @fires progress-change - Fired when progress value changes
 *
 * @csspart container - The progress container
 * @csspart track - The progress track (background)
 * @csspart bar - The progress bar (fill)
 * @csspart text - The progress text
 * @csspart handle - The drag handle (for draggable progress)
 */
export class Progress extends (HTMLElementSSR()!) {
  private _container!: HTMLDivElement;
  private _track!: HTMLDivElement;
  private _bar!: HTMLDivElement;
  private _text?: HTMLSpanElement;
  private _handle?: HTMLDivElement;
  private _shadowRoot!: ShadowRoot;
  private _isDragging = false;

  static get observedAttributes(): string[] {
    return [
      'percent',
      'type',
      'size',
      'status',
      'show-text',
      'draggable',
      'indeterminate',
      'stroke-width',
      'width',
    ];
  }

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this.render();
  }

  // ========== Properties ==========

  get percent(): number {
    const value = parseFloat(this.getAttribute('percent') || '0');
    return Math.min(100, Math.max(0, value));
  }
  set percent(value: number) {
    const clamped = Math.min(100, Math.max(0, value));
    this.setAttribute('percent', String(clamped));
  }

  get type(): ProgressType {
    return (this.getAttribute('type') as ProgressType) || 'line';
  }
  set type(value: ProgressType) {
    this.setAttribute('type', value);
  }

  get size(): ProgressSize {
    return (this.getAttribute('size') as ProgressSize) || 'md';
  }
  set size(value: ProgressSize) {
    this.setAttribute('size', value);
  }

  get status(): ProgressStatus {
    return (this.getAttribute('status') as ProgressStatus) || 'normal';
  }
  set status(value: ProgressStatus) {
    this.setAttribute('status', value);
  }

  get draggable(): boolean {
    return this.hasAttribute('draggable');
  }
  set draggable(value: boolean) {
    if (value) {
      this.setAttribute('draggable', '');
    } else {
      this.removeAttribute('draggable');
    }
  }

  get indeterminate(): boolean {
    return this.hasAttribute('indeterminate');
  }
  set indeterminate(value: boolean) {
    if (value) {
      this.setAttribute('indeterminate', '');
    } else {
      this.removeAttribute('indeterminate');
    }
  }

  // ========== Render ==========

  private render(): void {
    const style = document.createElement('style');
    style.textContent = `@import url("${new URL('./index.css', import.meta.url).href}");`;

    this._shadowRoot.innerHTML = `
      <div part="container" class="progress-container" role="progressbar" aria-valuemin="0" aria-valuemax="100">
        <div part="track" class="progress-track">
          <div part="bar" class="progress-bar"></div>
        </div>
      </div>
    `;

    this._shadowRoot.prepend(style);
    this._container = this._shadowRoot.querySelector('.progress-container')!;
    this._track = this._shadowRoot.querySelector('.progress-track')!;
    this._bar = this._shadowRoot.querySelector('.progress-bar')!;
  }

  // ========== Lifecycle ==========

  connectedCallback(): void {
    this.setupProgress();
    this.updateProgress();
    this.updateClasses();
    this.updateAriaAttributes();

    if (this.draggable) {
      this.setupDraggable();
    }

    window.addEventListener('resize', this.handleResize);
  }

  disconnectedCallback(): void {
    this.removeDraggable();
    window.removeEventListener('resize', this.handleResize);
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;

    switch (name) {
      case 'percent':
        this.updateProgress();
        this.updateAriaAttributes();
        break;

      case 'type':
      case 'size':
      case 'status':
      case 'indeterminate':
        this.updateClasses();
        break;

      case 'show-text':
        this.updateText();
        break;

      case 'draggable':
        if (this.draggable) {
          this.setupDraggable();
        } else {
          this.removeDraggable();
        }
        this.updateClasses();
        break;

      case 'stroke-width':
      case 'width':
        this.updateProgress();
        break;
    }
  }

  // ========== Methods ==========

  private setupProgress(): void {
    this.updateText();
    this.updateProgress();
  }

  private updateProgress(): void {
    if (!this._bar) return;

    const percent = this.percent / 100;
    this._bar.style.transform = `scaleX(${percent})`;

    // Update handle position if draggable
    if (this._handle) {
      const trackWidth = this._track.offsetWidth;
      this._handle.style.transform = `translateX(${percent * trackWidth}px)`;
    }
  }

  private updateText(): void {
    const showText = this.hasAttribute('show-text');

    if (showText) {
      if (!this._text) {
        this._text = document.createElement('span');
        this._text.setAttribute('part', 'text');
        this._text.className = 'progress-text';
        this._container.appendChild(this._text);
      }
      this._text.textContent = `${Math.round(this.percent)}%`;
    } else if (this._text) {
      this._container.removeChild(this._text);
      this._text = undefined;
    }
  }

  private updateClasses(): void {
    if (!this._container) return;

    const classes = [
      'progress-container',
      `progress-${this.type}`,
      `progress-${this.size}`,
      `progress-${this.status}`,
      this.draggable && 'progress-draggable',
      this.indeterminate && 'progress-indeterminate',
    ].filter(Boolean);

    this._container.className = classes.join(' ');
  }

  private updateAriaAttributes(): void {
    if (!this._container) return;

    this._container.setAttribute('aria-valuenow', String(this.percent));

    if (this.indeterminate) {
      this._container.removeAttribute('aria-valuenow');
    }
  }

  private setupDraggable(): void {
    if (this._handle) return;

    // Create handle
    this._handle = document.createElement('div');
    this._handle.setAttribute('part', 'handle');
    this._handle.className = 'progress-handle';
    this._track.appendChild(this._handle);

    // Add event listeners
    this._track.addEventListener('click', this.handleTrackClick);
    this._handle.addEventListener('mousedown', this.handleMouseDown);
  }

  private removeDraggable(): void {
    if (!this._handle) return;

    this._track.removeEventListener('click', this.handleTrackClick);
    this._handle.removeEventListener('mousedown', this.handleMouseDown);

    this._track.removeChild(this._handle);
    this._handle = undefined;
  }

  // ========== Event Handlers ==========

  private handleTrackClick = (event: MouseEvent): void => {
    if (this._isDragging) return;

    const rect = this._track.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const percent = Math.min(100, Math.max(0, (offsetX / rect.width) * 100));

    this.percent = percent;
    this.updateProgress();
    this.updateText();

    this.dispatchEvent(
      new CustomEvent<ProgressChangeEventDetail>('progress-change', {
        detail: { percent: this.percent },
        bubbles: true,
        composed: true,
      })
    );
  };

  private handleMouseDown = (event: MouseEvent): void => {
    event.preventDefault();
    event.stopPropagation();

    this._isDragging = true;

    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  };

  private handleMouseMove = (event: MouseEvent): void => {
    if (!this._isDragging) return;

    const rect = this._track.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const percent = Math.min(100, Math.max(0, (offsetX / rect.width) * 100));

    this.percent = percent;
    this.updateProgress();
    this.updateText();

    this.dispatchEvent(
      new CustomEvent<ProgressChangeEventDetail>('progress-change', {
        detail: { percent: this.percent },
        bubbles: true,
        composed: true,
      })
    );
  };

  private handleMouseUp = (): void => {
    this._isDragging = false;

    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
  };

  private handleResize = (): void => {
    this.updateProgress();
  };
}

function Custom() {
  if (typeof document !== 'undefined' && !customElements.get('r-progress')) {
    customElements.define('r-progress', Progress);
    return Progress;
  } else {
    return createCustomError('document is undefined or r-progress already exists');
  }
}

export default Custom();
