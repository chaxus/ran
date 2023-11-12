// percent 当前的值 支持百分数和数字
// total：进度条总值，默认 100 支持百分数和数字
// type ：primary，可拖拽 drag
// dot: true / false

// onchange(e) e.target e.total e.percent
import { perToNum } from 'ranuts';

const attributes: string[] = ['percent', 'type', 'total', 'dot'];

class Progress extends HTMLElement {
  _progress: HTMLDivElement;
  _progressWrap: HTMLDivElement;
  _progressWrapValue: HTMLDivElement;
  _progressDot: HTMLDivElement;
  moveProgress: { mouseDown: boolean };
  constructor() {
    super();
    this._progress = document.createElement('div');
    this._progress.setAttribute('class', 'ran-progress');
    this._progressWrap = document.createElement('div');
    this._progressWrap.setAttribute('class', 'ran-progress-wrap');
    this._progress.appendChild(this._progressWrap);
    this._progressWrapValue = document.createElement('div');
    this._progressWrapValue.setAttribute('class', 'ran-progress-wrap-value');
    this._progressWrap.appendChild(this._progressWrapValue);
    this._progressDot = document.createElement('div');
    this._progressDot.setAttribute('class', 'ran-progress-dot');
    const shadowRoot = this.attachShadow({ mode: 'closed' });
    shadowRoot.appendChild(this._progress);
    this.moveProgress = {
      mouseDown: false,
    };
  }
  static get observedAttributes(): string[] {
    return attributes;
  }
  get percent(): number {
    const percent = this.getAttribute('percent') || '';
    const num = perToNum(percent);
    if (num > this.total) {
      console.error('percent must be < total');
      return this.total;
    }
    return perToNum(percent);
  }
  set percent(value: number) {
    this.setAttribute('percent', `${value || 0}`);
    this.customChange();
  }
  get total(): number {
    const total = this.getAttribute('total');
    if (!total) return 1;
    return perToNum(total);
  }
  set total(value: string) {
    this.setAttribute('total', value || '');
    this.customChange();
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
    const rect = this._progressWrap.getBoundingClientRect();
    const offsetX = e.screenX - rect.left;
    const percentage = Math.min(
      1,
      Math.max(0, offsetX / this._progress.offsetWidth),
    );
    this.percent = percentage * this.total;
    this._progressWrapValue.style.setProperty(
      'transform',
      `scaleX(${percentage})`,
    );
    this._progressDot.style.setProperty(
      'transform',
      `translateX(${percentage * this._progress.offsetWidth}px)`,
    );
  };
  progressDotMouseDown = (e: MouseEvent): void => {
    this.moveProgress.mouseDown = true;
  };
  progressDotMouseMove = (e: MouseEvent): void => {
    if (!this.moveProgress.mouseDown) return;
    const rect = this._progressWrap.getBoundingClientRect();
    const offsetX = e.screenX - rect.left;
    const percentage = Math.min(
      1,
      Math.max(0, offsetX / this._progress.offsetWidth),
    );
    this.percent = percentage * this.total;
    this._progressWrapValue.style.setProperty(
      'transform',
      `scaleX(${percentage})`,
    );
    this._progressDot.style.setProperty(
      'transform',
      `translateX(${percentage * this._progress.offsetWidth}px)`,
    );
  };
  progressDotMouseUp = (e: MouseEvent): void => {
    if (!this.moveProgress.mouseDown) return;
    this.moveProgress.mouseDown = false;
  };
  customChange = (): void => {
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: {
          value: this.percent,
          percent: this.percent,
          total: this.total,
        },
      }),
    );
    this.dispatchEvent(
      new CustomEvent('Change', {
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
    this.appendProgressDot();
    const percent = this.percent / this.total;
    this._progressWrapValue.style.setProperty(
      'transform',
      `scaleX(${percent})`,
    );
    this._progressDot.style.setProperty(
      'transform',
      `translateX(${percent * this._progress.offsetWidth}px)`,
    );
  };
  private changeAttribute = (
    k: string,
    o: string,
    n: string,
    attribute: string,
    callback: Function,
  ) => {
    if (k === attribute && o !== n) callback();
  };
  dragEvent = (): void => {
    if (this.type !== 'drag') return;
    this._progress.addEventListener('click', this.progressClick);
    this._progressDot.addEventListener('mousedown', this.progressDotMouseDown);
    document.addEventListener('mousemove', this.progressDotMouseMove);
    document.addEventListener('mouseup', this.progressDotMouseUp);
  };
  connectedCallback(): void {
    this.dragEvent();
  }
  disconnectCallback(): void {
    this._progress.removeEventListener('click', this.progressClick);
    this._progressDot.removeEventListener(
      'mousedown',
      this.progressDotMouseDown,
    );
    document.removeEventListener('mousemove', this.progressDotMouseMove);
    document.removeEventListener('mouseup', this.progressDotMouseUp);
  }
  attributeChangedCallback(k: string, o: string, n: string): void {
    attributes.forEach((item) =>
      this.changeAttribute(k, o, n, item, this.updateCurrentProgress),
    );
  }
}

export default Progress;
