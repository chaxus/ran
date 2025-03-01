import { perToNum } from 'ranuts/utils';
import { HTMLElementSSR, createCustomError } from '@/utils/index';

const attributes: string[] = ['percent', 'type', 'total', 'dot'];

class Progress extends (HTMLElementSSR()!) {
  _progress: HTMLDivElement;
  _progressWrap: HTMLDivElement;
  _progressWrapValue: HTMLDivElement;
  _progressDot: HTMLDivElement;
  moveProgress: { mouseDown: boolean };
  _shadowDom: ShadowRoot;
  constructor() {
    super();
    this._progress = document.createElement('div');
    this._progress.setAttribute('class', 'ran-progress');
    this._progress.setAttribute('role', 'progressbar');
    this._progressWrap = document.createElement('div');
    this._progressWrap.setAttribute('class', 'ran-progress-wrap');
    this._progress.appendChild(this._progressWrap);
    this._progressWrapValue = document.createElement('div');
    this._progressWrapValue.setAttribute('class', 'ran-progress-wrap-value');
    this._progressWrap.appendChild(this._progressWrapValue);
    this._progressDot = document.createElement('div');
    this._progressDot.setAttribute('class', 'ran-progress-dot');
    this.moveProgress = {
      mouseDown: false,
    };
    this._progress.appendChild(this._progressDot);
    const shadowRoot = this.attachShadow({ mode: 'closed' });
    this._shadowDom = shadowRoot;
    shadowRoot.appendChild(this._progress);
  }
  static get observedAttributes(): string[] {
    return attributes;
  }
  get percent(): string {
    const percent = this.getAttribute('percent') || '';
    const num = perToNum(percent);
    if (Number(num) > Number(this.total)) {
      console.error('percent must be < total');
      return this.total;
    }
    return `${perToNum(percent)}`;
  }
  set percent(value: string) {
    this.setAttribute('percent', `${value || 0}`);
    this.setAttribute('aria-valuenow', `${value || 0}`);
  }
  get total(): string {
    const total = this.getAttribute('total');
    if (!total) return '1';
    return `${perToNum(total)}`;
  }
  set total(value: string) {
    this.setAttribute('total', value || '');
  }
  get type(): string {
    const result = ['primary', 'drag'];
    const type = this.getAttribute('type') || '';
    if (result.includes(type)) {
      return type;
    } else {
      return 'primary';
    }
  }
  set type(value: string) {
    this.setAttribute('type', value || 'primary');
  }
  get animation(): string {
    const result = ['play', 'pause'];
    const animation = this.getAttribute('animation') || '';
    if (result.includes(animation)) {
      return animation;
    } else {
      return 'pause';
    }
  }
  set animation(value: string) {
    this.setAttribute('animation', value || 'pause');
  }
  get dot(): string {
    const result = ['true', 'false'];
    const dot = this.getAttribute('dot') || '';
    if (result.includes(dot)) {
      return dot;
    } else {
      return 'true';
    }
  }
  set dot(value: string) {
    this.setAttribute('dot', value || 'true');
  }
  progressClick = (e: MouseEvent): void => {
    const rect = this._progress.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percentage = Math.min(1, Math.max(0, offsetX / this._progress.offsetWidth));
    this.percent = `${percentage * Number(this.total)}`;
    this._progressWrapValue.style.setProperty('transform', `scaleX(${percentage})`);
    this._progressDot.style.setProperty('transform', `translateX(${percentage * this._progress.offsetWidth}px)`);
    this.change();
  };
  progressDotMouseDown = (): void => {
    this.moveProgress.mouseDown = true;
  };
  progressDotMouseMove = (e: MouseEvent): void => {
    if (!this.moveProgress.mouseDown) return;
    const rect = this._progress.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percentage = Math.min(1, Math.max(0, offsetX / this._progress.offsetWidth));
    this.percent = `${percentage * Number(this.total)}`;
    this._progressWrapValue.style.setProperty('transform', `scaleX(${percentage})`);
    this._progressDot.style.setProperty('transform', `translateX(${percentage * this._progress.offsetWidth}px)`);
    this.change();
  };
  progressDotMouseUp = (): void => {
    if (!this.moveProgress.mouseDown) return;
    this.moveProgress.mouseDown = false;
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
    if (this.dot === 'true' && !this._progress.contains(this._progressDot)) {
      this._progress.appendChild(this._progressDot);
    }
    if (this.dot === 'false' && this._progress.contains(this._progressDot)) {
      this._progress.removeChild(this._progressDot);
    }
  };
  updateCurrentProgress = (): void => {
    const percent = Number(this.percent) / Number(this.total);
    this._progressWrapValue.style.setProperty('transform', `scaleX(${percent})`);
    this._progressDot.style.setProperty('transform', `translateX(${percent * this._progress.offsetWidth}px)`);
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
    const type = this.getAttribute('type');
    if (!type) {
      this.setAttribute('type', 'primary');
    }
    this.dragEvent();
    this.updateCurrentProgress();
    window.addEventListener('resize', this.resize);
  }
  disconnectCallback(): void {
    this._progress.removeEventListener('click', this.progressClick);
    this._progressDot.removeEventListener('mousedown', this.progressDotMouseDown);
    document.removeEventListener('mousemove', this.progressDotMouseMove);
    document.removeEventListener('mouseup', this.progressDotMouseUp);
    window.removeEventListener('resize', this.resize);
  }
  attributeChangedCallback(k: string, o: string, n: string): void {
    if (o !== n) {
      if (k === 'dot') {
        this.appendProgressDot();
      }
      if (k === 'percent') {
        this.updateCurrentProgress();
      }
    }
  }
}

function Custom() {
  if (typeof document !== 'undefined' && !customElements.get('r-progress')) {
    Progress && customElements.define('r-progress', Progress);
    return Progress;
  } else {
    return createCustomError('document is undefined or r-progress is exist');
  }
}

export default Custom();
export { Progress };
