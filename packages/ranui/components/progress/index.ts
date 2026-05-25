import { perToNum } from 'ranuts/utils';
import progressCss from './index.less?inline';
import { Div, EventManager, RanElement } from '@/utils/index';
import {
  ensureShadowElement,
  ensureShadowRoot,
  getStringAttribute,
  setStringAttribute,
  syncSheetAttribute,
} from '@/utils/component';
import { defineSSR } from '@/utils/ssr-registry';

const attributes: string[] = ['percent', 'type', 'total', 'dot', 'sheet'];

export class Progress extends RanElement {
  _progress!: HTMLDivElement;
  _progressWrap!: HTMLDivElement;
  _progressWrapValue!: HTMLDivElement;
  _progressDot!: HTMLDivElement;
  _shadowDom!: ShadowRoot;
  _events = new EventManager();
  moveProgress: { mouseDown: boolean } = { mouseDown: false };

  static get observedAttributes(): string[] {
    return attributes;
  }

  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this, progressCss);

    const container = ensureShadowElement(this._shadowDom, '.ran-progress', () =>
      Div()
        .class('ran-progress')
        .role('progressbar')
        .children(
          Div().class('ran-progress-wrap').part('track').children(Div().class('ran-progress-wrap-value').part('fill')),
          Div().class('ran-progress-dot').part('dot'),
        )
        .build(),
    );

    this._progress = container;
    this._progressWrap = container.querySelector('.ran-progress-wrap')!;
    this._progressWrapValue = container.querySelector('.ran-progress-wrap-value')!;
    this._progressDot = container.querySelector('.ran-progress-dot')!;
  }

  get percent(): string {
    const percentAttr = this.getAttribute('percent') || '0';
    const num = perToNum(percentAttr);
    const totalNum = Number(this.total);
    if (num > totalNum) {
      // ⚠️ Keep it silent or cap it, console.error is too loud for dev
      return String(totalNum);
    }
    return String(num);
  }
  set percent(value: string) {
    this.setAttribute('percent', value || '0');
    this.setAttribute('aria-valuenow', value || '0');
  }

  get total(): string {
    const total = this.getAttribute('total');
    if (!total) return '100'; // 💡 Better default for "percent" context
    return `${perToNum(total)}`;
  }
  set total(value: string) {
    this.setAttribute('total', value || '100');
  }

  get type(): string {
    const type = this.getAttribute('type') || 'primary';
    return ['primary', 'drag'].includes(type) ? type : 'primary';
  }
  set type(value: string) {
    this.setAttribute('type', value || 'primary');
  }

  get dot(): string {
    const dot = this.getAttribute('dot') || 'true';
    return ['true', 'false'].includes(dot) ? dot : 'true';
  }
  set dot(value: string) {
    this.setAttribute('dot', value || 'true');
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

  progressClick = (e: MouseEvent): void => {
    if (this.type !== 'drag') return;
    const rect = this._progress.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percentage = Math.min(1, Math.max(0, offsetX / this._progress.offsetWidth));
    console.log(
      '[progressClick] e.clientX:',
      e.clientX,
      'rect.left:',
      rect.left,
      'offsetWidth:',
      this._progress.offsetWidth,
      'percentage:',
      percentage,
    );
    const newVal = percentage * Number(this.total);
    this.percent = String(newVal);
    console.log('[progressClick] newVal:', newVal, 'total:', this.total, 'this.percent:', this.percent);
    this.updateUI(percentage);
    this.change();
  };

  progressDotMouseDown = (e: MouseEvent): void => {
    this.moveProgress.mouseDown = true;
    e.stopPropagation();
  };

  progressDotMouseMove = (e: MouseEvent): void => {
    if (!this.moveProgress.mouseDown) return;
    const rect = this._progress.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percentage = Math.min(1, Math.max(0, offsetX / this._progress.offsetWidth));
    const newVal = percentage * Number(this.total);
    this.percent = String(newVal);
    this.updateUI(percentage);
    this.change();
  };

  progressDotMouseUp = (): void => {
    this.moveProgress.mouseDown = false;
  };

  updateUI = (percentage: number): void => {
    this.style.setProperty('--progress-percent', String(percentage));
  };

  _preSerialize(): void {
    const percent = Number(this.getAttribute('percent') || '0');
    const total = Number(this.getAttribute('total') || '100');
    const fraction = Math.min(1, Math.max(0, percent / total));
    this.style.setProperty('--progress-percent', String(fraction));
  }

  change = (): void => {
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: {
          value: this.percent,
          percent: this.percent,
          total: this.total,
        },
      }),
    );
  };

  appendProgressDot = (): void => {
    if (!this._progress || !this._progressDot) return;
    if (this.dot === 'true' && !this._progress.contains(this._progressDot)) {
      this._progress.appendChild(this._progressDot);
    }
    if (this.dot === 'false' && this._progress.contains(this._progressDot)) {
      this._progress.removeChild(this._progressDot);
    }
  };

  updateCurrentProgress = (): void => {
    if (!this._progress) return;
    const total = Number(this.total) || 100;
    const percent = Number(this.percent) / total;
    this.updateUI(percent);
  };

  dragEvent = (): void => {
    if (this.type !== 'drag') return;
    this._events
      .on(this._progress, 'click', this.progressClick)
      .on(this._progressDot, 'mousedown', this.progressDotMouseDown)
      .on(document, 'mousemove', this.progressDotMouseMove as EventListener)
      .on(document, 'mouseup', this.progressDotMouseUp as EventListener);
  };

  private resize = (): void => {
    this.updateCurrentProgress();
  };

  connectedCallback(): void {
    this.handlerExternalCss();
    if (!this.hasAttribute('type')) {
      this.setAttribute('type', 'primary');
    }
    this.dragEvent();
    this.updateCurrentProgress();
    this.appendProgressDot();
    this._events.on(window, 'resize', this.resize);
  }

  disconnectedCallback(): void {
    this._events.abort();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;
    if (name === 'dot') this.appendProgressDot();
    if (name === 'percent' || name === 'total') this.updateCurrentProgress();
    if (name === 'sheet') this.handlerExternalCss();
  }
}

defineSSR('r-progress', Progress as unknown as new () => HTMLElement);
export default Progress;
