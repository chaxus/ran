import { perToNum } from 'ranuts/utils';
import { Div, RanElement } from '@/utils/index';
import { adoptStyles } from '@/utils/style';
import progressCss from './index.less?inline';

const attributes: string[] = ['percent', 'type', 'total', 'dot'];

export class Progress extends RanElement {
  _progress!: HTMLDivElement;
  _progressWrap!: HTMLDivElement;
  _progressWrapValue!: HTMLDivElement;
  _progressDot!: HTMLDivElement;
  _shadowDom!: ShadowRoot;
  moveProgress: { mouseDown: boolean } = { mouseDown: false };

  static get observedAttributes(): string[] {
    return attributes;
  }

  constructor() {
    super();
    this._shadowDom = this.shadowRoot || this.attachShadow({ mode: 'closed' });
    adoptStyles(this._shadowDom, progressCss);

    // 🏗️ Surgical rehydration: check if content already exists to avoid nuking styles
    let container = this._shadowDom.querySelector('.ran-progress') as HTMLDivElement;
    if (!container) {
      const progressBuilder = Div()
        .class('ran-progress')
        .role('progressbar')
        .children(
          Div().class('ran-progress-wrap').children(Div().class('ran-progress-wrap-value')),
          Div().class('ran-progress-dot'),
        );
      container = progressBuilder.build();
      this._shadowDom.appendChild(container);
    }

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

  progressClick = (e: MouseEvent): void => {
    if (this.type !== 'drag') return;
    const rect = this._progress.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percentage = Math.min(1, Math.max(0, offsetX / this._progress.offsetWidth));
    const newVal = percentage * Number(this.total);
    this.percent = String(newVal);
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
    if (!this._progressWrapValue || !this._progressDot) return;
    this._progressWrapValue.style.setProperty('transform', `scaleX(${percentage})`);
    this._progressDot.style.setProperty('transform', `translateX(${percentage * this._progress.offsetWidth}px)`);
  };

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
    this._progress.addEventListener('click', this.progressClick);
    this._progressDot.addEventListener('mousedown', this.progressDotMouseDown);
    document.addEventListener('mousemove', this.progressDotMouseMove);
    document.addEventListener('mouseup', this.progressDotMouseUp);
  };

  private resize = (): void => {
    this.updateCurrentProgress();
  };

  connectedCallback(): void {
    if (!this.hasAttribute('type')) {
      this.setAttribute('type', 'primary');
    }
    this.dragEvent();
    this.updateCurrentProgress();
    this.appendProgressDot();
    window.addEventListener('resize', this.resize);
  }

  disconnectedCallback(): void {
    this._progress.removeEventListener('click', this.progressClick);
    this._progressDot.removeEventListener('mousedown', this.progressDotMouseDown);
    document.removeEventListener('mousemove', this.progressDotMouseMove);
    document.removeEventListener('mouseup', this.progressDotMouseUp);
    window.removeEventListener('resize', this.resize);
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;
    if (name === 'dot') this.appendProgressDot();
    if (name === 'percent' || name === 'total') this.updateCurrentProgress();
  }
}

function Custom() {
  if (typeof document !== 'undefined' && !customElements.get('r-progress')) {
    customElements.define('r-progress', Progress);
    return Progress;
  }
  return Progress;
}

export default Custom();
