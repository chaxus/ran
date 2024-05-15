import { HTMLElementSSR, createCustomError } from '@/utils/index';
import './index.less'

enum NAME_AMP {
  DOUBLE_BOUNCE = 'double-bounce',
  ROTATE = 'rotate',
  STRETCH = 'stretch',
  CUBE = 'cube',
  DOT = 'dot',
  TRIPLE_BOUNCE = 'triple-bounce',
  SCALE_OUT = 'scale-out',
  CIRCLE = 'circle',
}

export class Loading extends (HTMLElementSSR()!) {
  contain: HTMLDivElement;
  static get observedAttributes(): string[] {
    return ['name'];
  }
  constructor() {
    super();
    this.contain = document.createElement('div');
    this.contain.setAttribute('class', 'ran-loading');
  }
  get name(): string {
    const name = this.getAttribute('name');
    if (!name) return '1';
    return name;
  }
  set name(value: string) {
    this.setAttribute('name', value || '');
  }
  rotateLoading = (): void => {
    const loading = document.createElement('div');
    loading.setAttribute('class', 'rotate');
    this.contain.appendChild(loading);
  }
  stretchLoading = (): void => {
    const loading = document.createElement('div');
    loading.setAttribute('class', 'stretch');
    const arr = [1, 2, 3, 4, 5];
    arr.forEach((i) => {
      const rect = document.createElement('div');
      rect.setAttribute('class', `rect${i}`);
      loading.appendChild(rect);
    });
    this.contain.appendChild(loading);
  }
  doubleBounceLoading = (): void => {
    const loading = document.createElement('div');
    loading.setAttribute('class', 'double-bounce');
    const arr = [1, 2];
    arr.forEach((i) => {
      const rect = document.createElement('div');
      rect.setAttribute('class', `double-bounce${i}`);
      loading.appendChild(rect);
    });
    this.contain.appendChild(loading);
  }
  cubeLoading = (): void => {
    const loading = document.createElement('div');
    loading.setAttribute('class', 'cube');
    const arr = [1, 2];
    arr.forEach((i) => {
      const rect = document.createElement('div');
      rect.setAttribute('class', `cube${i}`);
      loading.appendChild(rect);
    });
    this.contain.appendChild(loading);
  }
  dotLoading = (): void => {
    const loading = document.createElement('div');
    loading.setAttribute('class', 'dot');
    const arr = [1, 2];
    arr.forEach((i) => {
      const rect = document.createElement('div');
      rect.setAttribute('class', `dot${i}`);
      loading.appendChild(rect);
    });
    this.contain.appendChild(loading);
  }
  tripleBounceLoading = (): void => {
    const loading = document.createElement('div');
    loading.setAttribute('class', 'triple-bounce');
    const arr = [1, 2, 3];
    arr.forEach((i) => {
      const rect = document.createElement('div');
      rect.setAttribute('class', `triple-bounce${i}`);
      loading.appendChild(rect);
    });
    this.contain.appendChild(loading);
  }
  scaleOutLoading = (): void => {
    const loading = document.createElement('div');
    loading.setAttribute('class', 'scale-out');
    this.contain.appendChild(loading);
  }
  circleLoading = (): void => {
    const loading = document.createElement('div');
    loading.setAttribute('class', 'circle');
    [[1,2,3,4], [1,2,3,4], [1,2,3,4]].forEach((i,index) => {
      const container = document.createElement('div');
      container.setAttribute('class', `circle-container container${index+1}`);
      i.forEach((j) => {
        const rect = document.createElement('div');
        rect.setAttribute('class', `circle${j}`);
        container.appendChild(rect);
      });
      loading.appendChild(container);
    });
    this.contain.appendChild(loading);
  }
  createLoading = (): void => {
    this.contain.innerHTML = '';
    const NAME_MAP: Record<string, () => void> = {
      [NAME_AMP.STRETCH]: this.stretchLoading,
      [NAME_AMP.ROTATE]: this.rotateLoading,
      [NAME_AMP.DOUBLE_BOUNCE]: this.doubleBounceLoading,
      [NAME_AMP.CUBE]: this.cubeLoading,
      [NAME_AMP.DOT]: this.dotLoading,
      [NAME_AMP.TRIPLE_BOUNCE]: this.tripleBounceLoading,
      [NAME_AMP.SCALE_OUT]: this.scaleOutLoading,
      [NAME_AMP.CIRCLE]: this.circleLoading,
    }
    const handler = NAME_MAP[this.name];
    handler && handler()
    if (this.contains(this.contain)) return;
    this.appendChild(this.contain);
  }
  connectedCallback(): void {

  }
  disconnectCallback(): void {

  }
  attributeChangedCallback(k: string, o: string, n: string): void {
    if (o !== n) {
      if (k === 'name') {
        this.createLoading();
      }
    }
  }
}


function Custom() {
  if (typeof document !== 'undefined' && !customElements.get('r-loading')) {
    customElements.define('r-loading', Loading);
    return Loading;
  } else {
    return createCustomError('document is undefined or r-loading is exist');
  }
}

export default Custom();
