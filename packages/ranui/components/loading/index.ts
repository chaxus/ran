import loadingCss from './index.less?inline';
import { HTMLElementSSR, createCustomError } from '@/utils/index';
import { Div, Span, View } from '@/utils/builder';
import { adoptSheetText, adoptStyles } from '@/utils/style';

export enum ICON_NAME_AMP {
  DOUBLE_BOUNCE = 'double-bounce',
  ROTATE = 'rotate',
  STRETCH = 'stretch',
  CUBE = 'cube',
  DOT = 'dot',
  TRIPLE_BOUNCE = 'triple-bounce',
  SCALE_OUT = 'scale-out',
  CIRCLE = 'circle',
  CIRCLE_LINE = 'circle-line',
  SQUARE = 'square',
  PULSE = 'pulse',
  SOLAR = 'solar',
  CUBE_FOLD = 'cube-fold',
  CIRCLE_FOLD = 'circle-fold',
  CUBE_GRID = 'cube-grid',
  CIRCLE_TURN = 'circle-turn',
  CIRCLE_ROTATE = 'circle-rotate',
  CIRCLE_SPIN = 'circle-spin',
  DOT_BAR = 'dot-bar',
  DOT_CIRCLE = 'dot-circle',
  LINE = 'line',
  DOT_PULSE = 'dot-pulse',
  LINE_SCALE = 'line-scale',
  TEXT = 'text',
  CUBE_DIM = 'cube-dim',
  DOT_LINE = 'dot-line',
  ARC = 'arc',
  DROP = 'drop',
  PACMAN = 'pacman',
}

export class Loading extends (HTMLElementSSR()!) {
  contain: HTMLDivElement;
  _shadowDom: ShadowRoot;
  static get observedAttributes(): string[] {
    return ['name', 'sheet'];
  }
  constructor() {
    super();
    this._shadowDom = this.shadowRoot || this.attachShadow({ mode: 'open' });
    adoptStyles(this._shadowDom, loadingCss);

    let contain = this._shadowDom.querySelector('.ran-loading') as HTMLDivElement | null;
    if (!contain) {
      contain = Div().class('ran-loading').build() as HTMLDivElement;
      this._shadowDom.appendChild(contain);
    }
    this.contain = contain;
  }
  get name(): ICON_NAME_AMP {
    const name = this.getAttribute('name') || '';
    if (!name) return ICON_NAME_AMP.CIRCLE;
    return name as ICON_NAME_AMP;
  }
  set name(value: string) {
    this.setAttribute('name', value || '');
  }
  get sheet(): string {
    return this.getAttribute('sheet') || '';
  }
  set sheet(value: string) {
    this.setAttribute('sheet', value || '');
  }
  handlerExternalCss = (): void => {
    if (!this.sheet) return;
    adoptSheetText(this._shadowDom, this.sheet);
  };
  rotateLoading = (): void => {
    const loading = Div().class(ICON_NAME_AMP.ROTATE).part(ICON_NAME_AMP.ROTATE).build();
    this.contain.appendChild(loading);
  };
  stretchLoading = (): void => {
    const loading = Div()
      .class(ICON_NAME_AMP.STRETCH)
      .part(ICON_NAME_AMP.STRETCH)
      .children(
        ...Array(5)
          .fill(1)
          .map((_, i) => Div().class(`rect${i + 1}`)),
      )
      .build();
    this.contain.appendChild(loading);
  };
  doubleBounceLoading = (): void => {
    const loading = Div()
      .class(ICON_NAME_AMP.DOUBLE_BOUNCE)
      .part(ICON_NAME_AMP.DOUBLE_BOUNCE)
      .children(
        ...Array(2)
          .fill(1)
          .map((_, i) => Div().class(`double-bounce${i + 1}`)),
      )
      .build();
    this.contain.appendChild(loading);
  };
  cubeLoading = (): void => {
    const loading = Div()
      .class(ICON_NAME_AMP.CUBE)
      .part(ICON_NAME_AMP.CUBE)
      .children(
        ...Array(2)
          .fill(1)
          .map((_, i) => Div().class(`cube${i + 1}`)),
      )
      .build();
    this.contain.appendChild(loading);
  };
  dotLoading = (): void => {
    const loading = Div()
      .class(ICON_NAME_AMP.DOT)
      .part(ICON_NAME_AMP.DOT)
      .children(
        ...Array(2)
          .fill(1)
          .map((_, i) => Div().class(`dot${i + 1}`)),
      )
      .build();
    this.contain.appendChild(loading);
  };
  tripleBounceLoading = (): void => {
    const loading = Div()
      .class(ICON_NAME_AMP.TRIPLE_BOUNCE)
      .part(ICON_NAME_AMP.TRIPLE_BOUNCE)
      .children(
        ...Array(3)
          .fill(1)
          .map((_, i) => Div().class(`triple-bounce${i + 1}`)),
      )
      .build();
    this.contain.appendChild(loading);
  };
  scaleOutLoading = (): void => {
    const loading = Div().class(ICON_NAME_AMP.SCALE_OUT).part(ICON_NAME_AMP.SCALE_OUT).build();
    this.contain.appendChild(loading);
  };
  circleLoading = (): void => {
    const loading = Div().class(ICON_NAME_AMP.CIRCLE).part(ICON_NAME_AMP.CIRCLE).build();
    Array(3)
      .fill(1)
      .map(() => new Array(4).fill(1))
      .forEach((i, index) => {
        const container = Div()
          .class(`circle-container container${index + 1}`)
          .children(...i.map((_, j) => Div().class(`circle${j + 1}`)))
          .build();
        loading.appendChild(container);
      });
    this.contain.appendChild(loading);
  };
  circleLineLoading = (): void => {
    const loading = Div()
      .class(ICON_NAME_AMP.CIRCLE_LINE)
      .part(ICON_NAME_AMP.CIRCLE_LINE)
      .children(Div().class('circle-line-border').children(Div().class('circle-line-core')))
      .build();
    this.contain.appendChild(loading);
  };
  squareLoading = (): void => {
    const loading = Div()
      .class(ICON_NAME_AMP.SQUARE)
      .part(ICON_NAME_AMP.SQUARE)
      .children(
        Div().class('square-box1').children(Div().class('square-core')),
        Div().class('square-box2').children(Div().class('square-core')),
      )
      .build();
    this.contain.appendChild(loading);
  };
  pulseLoading = (): void => {
    const pulse = Div()
      .class(ICON_NAME_AMP.PULSE)
      .part(ICON_NAME_AMP.PULSE)
      .children(
        ...Array(3)
          .fill(1)
          .map((_, index) => Div().class(`pulse-bubble pulse-bubble-${index + 1}`)),
      )
      .build();
    this.contain.appendChild(pulse);
  };
  solarLoading = (): void => {
    const solar = Div()
      .class(ICON_NAME_AMP.SOLAR)
      .part(ICON_NAME_AMP.SOLAR)
      .children(
        Div()
          .class('earth-orbit orbit')
          .children(
            Div().class('planet earth'),
            Div()
              .class('venus-orbit orbit')
              .children(
                Div().class('planet venus'),
                Div()
                  .class('mercury-orbit orbit')
                  .children(Div().class('planet mercury'), Div().class('sun').part('sun')),
              ),
          ),
      )
      .build();
    this.contain.appendChild(solar);
  };
  cubeFoldLoading = (): void => {
    const loading = Div()
      .class(ICON_NAME_AMP.CUBE_FOLD)
      .part(ICON_NAME_AMP.CUBE_FOLD)
      .children(
        ...Array(4)
          .fill(1)
          .map((_, index) => Div().class(`cube-fold-item cube-fold-item-${index + 1}`)),
      )
      .build();
    this.contain.appendChild(loading);
  };
  circleFoldLoading = (): void => {
    const loading = Div()
      .class(ICON_NAME_AMP.CIRCLE_FOLD)
      .part(ICON_NAME_AMP.CIRCLE_FOLD)
      .children(
        ...Array(12)
          .fill(1)
          .map((_, index) => Div().class(`circle-fold-item circle-fold-item-${index + 1}`)),
      )
      .build();
    this.contain.appendChild(loading);
  };
  cubeGridLoading = (): void => {
    const loading = Div()
      .class(ICON_NAME_AMP.CUBE_GRID)
      .part(ICON_NAME_AMP.CUBE_GRID)
      .children(
        ...Array(9)
          .fill(1)
          .map((_, index) => Div().class(`cube-grid-item cube-grid-item-${index + 1}`)),
      )
      .build();
    this.contain.appendChild(loading);
  };
  circleTurnLoading = (): void => {
    const loading = Div().class(ICON_NAME_AMP.CIRCLE_TURN).part(ICON_NAME_AMP.CIRCLE_TURN).build();
    this.contain.appendChild(loading);
  };
  circleRotateLoading = (): void => {
    const loading = Div()
      .class(ICON_NAME_AMP.CIRCLE_ROTATE)
      .part(ICON_NAME_AMP.CIRCLE_ROTATE)
      .children(Div().class('circle-rotate-outer'), Div().class('circle-rotate-inner'))
      .build();
    this.contain.appendChild(loading);
  };
  circleSpinLoading = (): void => {
    const loading = Div()
      .class(ICON_NAME_AMP.CIRCLE_SPIN)
      .part(ICON_NAME_AMP.CIRCLE_SPIN)
      .children(Div().class('circle-spin-outer'), Div().class('circle-spin-inner'))
      .build();
    this.contain.appendChild(loading);
  };
  dotBarLoading = (): void => {
    const loading = Div()
      .class(ICON_NAME_AMP.DOT_BAR)
      .part(ICON_NAME_AMP.DOT_BAR)
      .children(
        ...Array(5)
          .fill(1)
          .map((_, index) => Div().class(`dot-bar-item dot-bar-item-${index + 1}`)),
      )
      .build();
    this.contain.appendChild(loading);
  };
  dotCircleLoading = (): void => {
    const loading = Div()
      .class(ICON_NAME_AMP.DOT_CIRCLE)
      .part(ICON_NAME_AMP.DOT_CIRCLE)
      .children(
        ...Array(5)
          .fill(1)
          .map((_, index) => Div().class(`dot-circle-item dot-circle-item-${index + 1}`)),
      )
      .build();
    this.contain.appendChild(loading);
  };
  lineLoading = (): void => {
    const loading = Div()
      .class(ICON_NAME_AMP.LINE)
      .part(ICON_NAME_AMP.LINE)
      .children(
        ...Array(3)
          .fill(1)
          .map(() => Div().class('line-item')),
      )
      .build();
    this.contain.appendChild(loading);
  };
  dotPulseLoading = (): void => {
    const loading = Div()
      .class(ICON_NAME_AMP.DOT_PULSE)
      .class(ICON_NAME_AMP.DOT_PULSE)
      .children(
        ...Array(5)
          .fill(1)
          .map((_, index) =>
            Div()
              .class('dot-pulse-item')
              .children(
                Div().class(`dot-pulse-item-dot dot-pulse-item-dot-${index + 1}`),
                Div().class(`dot-pulse-item-ball dot-pulse-item-ball-${index + 1}`),
              ),
          ),
      )
      .build();
    this.contain.appendChild(loading);
  };
  lineScaleLoading = (): void => {
    const loading = Div()
      .class(ICON_NAME_AMP.LINE_SCALE)
      .part(ICON_NAME_AMP.LINE_SCALE)
      .children(
        ...Array(5)
          .fill(1)
          .map(() => Div().class('line-scale-item')),
      )
      .build();
    this.contain.appendChild(loading);
  };
  textLoading = (): void => {
    const loading = Div()
      .class(ICON_NAME_AMP.TEXT)
      .part(ICON_NAME_AMP.TEXT)
      .children(...['L', 'o', 'a', 'd', 'i', 'n', 'g'].map((i) => Span().class('text-item').text(i)))
      .build();
    this.contain.appendChild(loading);
  };
  cubeDimLoading = (): void => {
    const loading = Div()
      .class(ICON_NAME_AMP.CUBE_DIM)
      .part(ICON_NAME_AMP.CUBE_DIM)
      .children(
        ...Array(9)
          .fill(1)
          .map(() => Div().class('cube-dim-item')),
      )
      .build();
    this.contain.appendChild(loading);
  };
  dotLineLoading = (): void => {
    const loading = Div()
      .class(ICON_NAME_AMP.DOT_LINE)
      .part(ICON_NAME_AMP.DOT_LINE)
      .children(
        ...Array(2)
          .fill(1)
          .map(() => Div().class('dot-line-item').children(Div().class('dot-line-item-circle'))),
      )
      .build();
    this.contain.appendChild(loading);
  };
  arcLoading = (): void => {
    const loading = Div()
      .class(ICON_NAME_AMP.ARC)
      .part(ICON_NAME_AMP.ARC)
      .children(Div().class('arc-item'), View('h1').children(Span().text('LOADING')))
      .build();
    this.contain.appendChild(loading);
  };
  dropLoading = (): void => {
    const loading = Div()
      .class(ICON_NAME_AMP.DROP)
      .part(ICON_NAME_AMP.DROP)
      .children(
        Div()
          .class('drop-item')
          .children(
            Div().class('drop-item-bg').children(Span().text('LOADING')),
            Div().class('drop-dot').children(Div().class('drop-dot-1'), Div().class('drop-dot-2')),
          ),
        Div().class('drop-dot').children(Div().class('drop-dot-1'), Div().class('drop-dot-2')),
      )
      .build();
    this.contain.appendChild(loading);
  };
  pacmanLoading = (): void => {
    const loading = Div()
      .class(ICON_NAME_AMP.PACMAN)
      .part(ICON_NAME_AMP.PACMAN)
      .children(
        ...Array(5)
          .fill(1)
          .map(() => Div()),
      )
      .build();
    this.contain.appendChild(loading);
  };
  createLoading = (): void => {
    this.contain.innerHTML = '';
    const NAME_MAP: Record<ICON_NAME_AMP, () => void> = {
      [ICON_NAME_AMP.STRETCH]: this.stretchLoading,
      [ICON_NAME_AMP.ROTATE]: this.rotateLoading,
      [ICON_NAME_AMP.DOUBLE_BOUNCE]: this.doubleBounceLoading,
      [ICON_NAME_AMP.CUBE]: this.cubeLoading,
      [ICON_NAME_AMP.DOT]: this.dotLoading,
      [ICON_NAME_AMP.TRIPLE_BOUNCE]: this.tripleBounceLoading,
      [ICON_NAME_AMP.SCALE_OUT]: this.scaleOutLoading,
      [ICON_NAME_AMP.CIRCLE]: this.circleLoading,
      [ICON_NAME_AMP.CIRCLE_LINE]: this.circleLineLoading,
      [ICON_NAME_AMP.SQUARE]: this.squareLoading,
      [ICON_NAME_AMP.PULSE]: this.pulseLoading,
      [ICON_NAME_AMP.SOLAR]: this.solarLoading,
      [ICON_NAME_AMP.CUBE_FOLD]: this.cubeFoldLoading,
      [ICON_NAME_AMP.CIRCLE_FOLD]: this.circleFoldLoading,
      [ICON_NAME_AMP.CUBE_GRID]: this.cubeGridLoading,
      [ICON_NAME_AMP.CIRCLE_TURN]: this.circleTurnLoading,
      [ICON_NAME_AMP.CIRCLE_ROTATE]: this.circleRotateLoading,
      [ICON_NAME_AMP.CIRCLE_SPIN]: this.circleSpinLoading,
      [ICON_NAME_AMP.DOT_BAR]: this.dotBarLoading,
      [ICON_NAME_AMP.DOT_CIRCLE]: this.dotCircleLoading,
      [ICON_NAME_AMP.LINE]: this.lineLoading,
      [ICON_NAME_AMP.DOT_PULSE]: this.dotPulseLoading,
      [ICON_NAME_AMP.LINE_SCALE]: this.lineScaleLoading,
      [ICON_NAME_AMP.TEXT]: this.textLoading,
      [ICON_NAME_AMP.CUBE_DIM]: this.cubeDimLoading,
      [ICON_NAME_AMP.DOT_LINE]: this.dotLineLoading,
      [ICON_NAME_AMP.ARC]: this.arcLoading,
      [ICON_NAME_AMP.DROP]: this.dropLoading,
      [ICON_NAME_AMP.PACMAN]: this.pacmanLoading,
    };
    const handler = NAME_MAP[this.name];
    handler && handler();
  };
  connectedCallback(): void {
    this.handlerExternalCss();
    this.createLoading();
  }
  attributeChangedCallback(k: string, o: string, n: string): void {
    if (o !== n) {
      if (k === 'name') {
        this.createLoading();
      }
      if (k === 'sheet') {
        this.handlerExternalCss();
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
