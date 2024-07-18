import { create } from 'ranuts/utils';
import { HTMLElementSSR, createCustomError } from '@/utils/index';

export enum NAME_AMP {
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
  static get observedAttributes(): string[] {
    return ['name'];
  }
  constructor() {
    super();
    this.contain = document.createElement('div');
    this.contain.setAttribute('class', 'ran-loading');
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(this.contain);
  }
  get name(): NAME_AMP {
    const name = this.getAttribute('name') || '';
    if (!name) return NAME_AMP.CIRCLE;
    return name as NAME_AMP;
  }
  set name(value: string) {
    this.setAttribute('name', value || '');
  }
  rotateLoading = (): void => {
    const loading = document.createElement('div');
    loading.setAttribute('class', NAME_AMP.ROTATE);
    loading.setAttribute('part', NAME_AMP.ROTATE);
    this.contain.appendChild(loading);
  };
  stretchLoading = (): void => {
    const loading = document.createElement('div');
    loading.setAttribute('class', NAME_AMP.STRETCH);
    loading.setAttribute('part', NAME_AMP.STRETCH);
    Array(5)
      .fill(1)
      .forEach((_, i) => {
        const rect = document.createElement('div');
        rect.setAttribute('class', `rect${i + 1}`);
        loading.appendChild(rect);
      });
    this.contain.appendChild(loading);
  };
  doubleBounceLoading = (): void => {
    const loading = document.createElement('div');
    loading.setAttribute('class', NAME_AMP.DOUBLE_BOUNCE);
    loading.setAttribute('part', NAME_AMP.DOUBLE_BOUNCE);
    Array(2)
      .fill(1)
      .forEach((_, i) => {
        const rect = document.createElement('div');
        rect.setAttribute('class', `double-bounce${i + 1}`);
        loading.appendChild(rect);
      });
    this.contain.appendChild(loading);
  };
  cubeLoading = (): void => {
    const loading = document.createElement('div');
    loading.setAttribute('class', NAME_AMP.CUBE);
    loading.setAttribute('part', NAME_AMP.CUBE);
    Array(2)
      .fill(1)
      .forEach((_, i) => {
        const rect = document.createElement('div');
        rect.setAttribute('class', `cube${i + 1}`);
        loading.appendChild(rect);
      });
    this.contain.appendChild(loading);
  };
  dotLoading = (): void => {
    const loading = document.createElement('div');
    loading.setAttribute('class', NAME_AMP.DOT);
    loading.setAttribute('part', NAME_AMP.DOT);
    Array(2)
      .fill(1)
      .forEach((_, i) => {
        const rect = document.createElement('div');
        rect.setAttribute('class', `dot${i + 1}`);
        loading.appendChild(rect);
      });
    this.contain.appendChild(loading);
  };
  tripleBounceLoading = (): void => {
    const loading = document.createElement('div');
    loading.setAttribute('class', NAME_AMP.TRIPLE_BOUNCE);
    loading.setAttribute('part', NAME_AMP.TRIPLE_BOUNCE);
    Array(3)
      .fill(1)
      .forEach((_, i) => {
        const rect = document.createElement('div');
        rect.setAttribute('class', `triple-bounce${i + 1}`);
        loading.appendChild(rect);
      });
    this.contain.appendChild(loading);
  };
  scaleOutLoading = (): void => {
    const loading = document.createElement('div');
    loading.setAttribute('class', NAME_AMP.SCALE_OUT);
    loading.setAttribute('part', NAME_AMP.SCALE_OUT);
    this.contain.appendChild(loading);
  };
  circleLoading = (): void => {
    const loading = document.createElement('div');
    loading.setAttribute('class', NAME_AMP.CIRCLE);
    loading.setAttribute('part', NAME_AMP.CIRCLE);
    Array(3)
      .fill(1)
      .map(() => new Array(4).fill(1))
      .forEach((i, index) => {
        const container = document.createElement('div');
        container.setAttribute('class', `circle-container container${index + 1}`);
        i.forEach((_, j) => {
          const rect = document.createElement('div');
          rect.setAttribute('class', `circle${j + 1}`);
          container.appendChild(rect);
        });
        loading.appendChild(container);
      });
    this.contain.appendChild(loading);
  };
  circleLineLoading = (): void => {
    const { element: core } = create('div').setAttribute('class', 'circle-line-core');
    const { element: border } = create('div').setAttribute('class', 'circle-line-border').append(core);
    const { element: loading } = create('div')
      .setAttribute('class', NAME_AMP.CIRCLE_LINE)
      .setAttribute('part', NAME_AMP.CIRCLE_LINE)
      .append(border);
    this.contain.appendChild(loading);
  };
  squareLoading = (): void => {
    const { element: core } = create('div').setAttribute('class', 'square-core');
    const { element: box1 } = create('div').setAttribute('class', 'square-box1').append(core);
    const { element: box2 } = create('div').setAttribute('class', 'square-box2').append(core);
    const { element: square } = create('div')
      .setAttribute('class', NAME_AMP.SQUARE)
      .setAttribute('part', NAME_AMP.SQUARE)
      .append(box1)
      .append(box2);
    this.contain.appendChild(square);
  };
  pulseLoading = (): void => {
    const pulse = create('div').setAttribute('class', NAME_AMP.PULSE).setAttribute('part', NAME_AMP.PULSE);
    Array(3)
      .fill(1)
      .forEach((_, index) => {
        const { element: bubble } = create('div').setAttribute('class', `pulse-bubble pulse-bubble-${index + 1}`);
        pulse.append(bubble);
      });
    this.contain.appendChild(pulse.element);
  };
  solarLoading = (): void => {
    const { element: sun } = create('div').setAttribute('class', 'sun').setAttribute('part', 'sun');
    const { element: mercury } = create('div').setAttribute('class', 'planet mercury');
    const { element: mercuryOrbit } = create('div')
      .setAttribute('class', 'mercury-orbit orbit')
      .append(mercury)
      .append(sun);
    const { element: venus } = create('div').setAttribute('class', 'planet venus');
    const { element: venusOrbit } = create('div')
      .setAttribute('class', 'venus-orbit orbit')
      .append(venus)
      .append(mercuryOrbit);
    const { element: earth } = create('div').setAttribute('class', 'planet earth');
    const { element: earthOrbit } = create('div')
      .setAttribute('class', 'earth-orbit orbit')
      .append(earth)
      .append(venusOrbit);
    const { element: solar } = create('div')
      .setAttribute('class', NAME_AMP.SOLAR)
      .setAttribute('part', NAME_AMP.SOLAR)
      .append(earthOrbit);
    this.contain.appendChild(solar);
  };
  cubeFoldLoading = (): void => {
    const { element: cubeFold } = create('div')
      .setAttribute('class', NAME_AMP.CUBE_FOLD)
      .setAttribute('part', NAME_AMP.CUBE_FOLD);
    Array(4)
      .fill(1)
      .forEach((_, index) => {
        const { element: cube } = create('div').setAttribute('class', `cube-fold-item cube-fold-item-${index + 1}`);
        cubeFold.appendChild(cube);
      });
    this.contain.appendChild(cubeFold);
  };
  circleFoldLoading = (): void => {
    const circleFold = create('div')
      .setAttribute('class', NAME_AMP.CIRCLE_FOLD)
      .setAttribute('part', NAME_AMP.CIRCLE_FOLD);
    Array(12)
      .fill(1)
      .forEach((_, index) => {
        const { element } = create('div').setAttribute('class', `circle-fold-item circle-fold-item-${index + 1}`);
        circleFold.append(element);
      });
    this.contain.appendChild(circleFold.element);
  };
  cubeGridLoading = (): void => {
    const cubeGrid = create('div').setAttribute('class', NAME_AMP.CUBE_GRID).setAttribute('part', NAME_AMP.CUBE_GRID);
    Array(9)
      .fill(1)
      .forEach((_, index) => {
        const { element } = create('div').setAttribute('class', `cube-grid-item cube-grid-item-${index + 1}`);
        cubeGrid.append(element);
      });
    this.contain.appendChild(cubeGrid.element);
  };
  circleTurnLoading = (): void => {
    const { element: circleTurn } = create('div')
      .setAttribute('class', NAME_AMP.CIRCLE_TURN)
      .setAttribute('part', NAME_AMP.CIRCLE_TURN);
    this.contain.appendChild(circleTurn);
  };
  circleRotateLoading = (): void => {
    const { element: circleRotate } = create('div')
      .setAttribute('class', NAME_AMP.CIRCLE_ROTATE)
      .setAttribute('part', NAME_AMP.CIRCLE_ROTATE);
    const { element: circleInner } = create('div').setAttribute('class', 'circle-rotate-inner');
    const { element: circleOuter } = create('div').setAttribute('class', 'circle-rotate-outer');
    circleRotate.appendChild(circleOuter);
    circleRotate.appendChild(circleInner);
    this.contain.appendChild(circleRotate);
  };
  circleSpinLoading = (): void => {
    const { element: circleSpin } = create('div')
      .setAttribute('class', NAME_AMP.CIRCLE_SPIN)
      .setAttribute('part', NAME_AMP.CIRCLE_SPIN);
    const { element: circleInner } = create('div').setAttribute('class', 'circle-spin-inner');
    const { element: circleOuter } = create('div').setAttribute('class', 'circle-spin-outer');
    circleSpin.appendChild(circleOuter);
    circleSpin.appendChild(circleInner);
    this.contain.appendChild(circleSpin);
  };
  dotBarLoading = (): void => {
    const { element: dotBar } = create('div')
      .setAttribute('class', NAME_AMP.DOT_BAR)
      .setAttribute('part', NAME_AMP.DOT_BAR);
    Array(5)
      .fill(1)
      .forEach((_, index) => {
        const { element } = create('div').setAttribute('class', `dot-bar-item dot-bar-item-${index + 1}`);
        dotBar.appendChild(element);
      });
    this.contain.appendChild(dotBar);
  };
  dotCircleLoading = (): void => {
    const { element: dotCircle } = create('div')
      .setAttribute('class', NAME_AMP.DOT_CIRCLE)
      .setAttribute('part', NAME_AMP.DOT_CIRCLE);
    Array(5)
      .fill(1)
      .forEach((_, index) => {
        const { element } = create('div').setAttribute('class', `dot-circle-item dot-circle-item-${index + 1}`);
        dotCircle.appendChild(element);
      });
    this.contain.appendChild(dotCircle);
  };
  lineLoading = (): void => {
    const { element: line } = create('div').setAttribute('class', NAME_AMP.LINE).setAttribute('part', NAME_AMP.LINE);
    Array(3)
      .fill(1)
      .forEach(() => {
        const { element } = create('div').setAttribute('class', `line-item`);
        line.appendChild(element);
      });
    this.contain.appendChild(line);
  };
  dotPulseLoading = (): void => {
    const { element: dotPulse } = create('div')
      .setAttribute('class', NAME_AMP.DOT_PULSE)
      .setAttribute('class', NAME_AMP.DOT_PULSE);
    Array(5)
      .fill(1)
      .forEach((_, index) => {
        const { element: pulse } = create('div').setAttribute('class', `dot-pulse-item`);
        const { element: dot } = create('div').setAttribute(
          'class',
          `dot-pulse-item-dot dot-pulse-item-dot-${index + 1}`,
        );
        const { element: ball } = create('div').setAttribute(
          'class',
          `dot-pulse-item-ball dot-pulse-item-ball-${index + 1}`,
        );
        pulse.appendChild(dot);
        pulse.appendChild(ball);
        dotPulse.appendChild(pulse);
      });
    this.contain.appendChild(dotPulse);
  };
  lineScaleLoading = (): void => {
    const { element: lineScale } = create('div')
      .setAttribute('class', NAME_AMP.LINE_SCALE)
      .setAttribute('part', NAME_AMP.LINE_SCALE);
    Array(5)
      .fill(1)
      .forEach((_, index) => {
        const { element } = create('div').setAttribute('class', `line-scale-item`);
        lineScale.appendChild(element);
      });
    this.contain.appendChild(lineScale);
  };
  textLoading = (): void => {
    const { element: text } = create('div').setAttribute('class', NAME_AMP.TEXT).setAttribute('part', NAME_AMP.TEXT);
    const arr = ['L', 'o', 'a', 'd', 'i', 'n', 'g'];
    arr.forEach((i) => {
      const { element } = create('span').setAttribute('class', `text-item`).setTextContent(i);
      text.appendChild(element);
    });
    this.contain.appendChild(text);
  };
  cubeDimLoading = (): void => {
    const { element: cubeDim } = create('div')
      .setAttribute('class', NAME_AMP.CUBE_DIM)
      .setAttribute('part', NAME_AMP.CUBE_DIM);
    Array(9)
      .fill(1)
      .forEach((_, index) => {
        const { element } = create('div').setAttribute('class', `cube-dim-item`);
        cubeDim.appendChild(element);
      });
    this.contain.appendChild(cubeDim);
  };
  dotLineLoading = (): void => {
    const { element: dotLine } = create('div')
      .setAttribute('class', NAME_AMP.DOT_LINE)
      .setAttribute('part', NAME_AMP.DOT_LINE);
    Array(2)
      .fill(1)
      .forEach((_, index) => {
        const { element: line } = create('div').setAttribute('class', `dot-line-item`);
        const { element } = create('div').setAttribute('class', `dot-line-item-circle`);
        line.appendChild(element);
        dotLine.appendChild(line);
      });
    this.contain.appendChild(dotLine);
  };
  arcLoading = (): void => {
    const { element: arcItem } = create('div').setAttribute('class', 'arc-item');
    const { element: arc } = create('div')
      .setAttribute('class', NAME_AMP.ARC)
      .setAttribute('part', NAME_AMP.ARC)
      .append(arcItem);
    const { element: span } = create('span').setTextContent('LOADING');
    const { element: h1 } = create('h1').append(span);
    arc.appendChild(h1);
    this.contain.appendChild(arc);
  };
  dropLoading = (): void => {
    const { element: span } = create('span').setTextContent('LOADING');
    const { element: dropItemBg } = create('div').setAttribute('class', 'drop-item-bg').append(span);
    const { element: dropDot1 } = create('div').setAttribute('class', 'drop-dot-1');
    const { element: dropDot2 } = create('div').setAttribute('class', 'drop-dot-2');
    const { element: dropDot } = create('div').setAttribute('class', 'drop-dot').append(dropDot1).append(dropDot2);
    const { element: dropItem } = create('div').setAttribute('class', 'drop-item').append(dropItemBg).append(dropDot);
    const { element: drop } = create('div')
      .setAttribute('class', NAME_AMP.DROP)
      .setAttribute('part', NAME_AMP.DROP)
      .append(dropItem)
      .append(dropDot);
    this.contain.appendChild(drop);
  };
  pacmanLoading = (): void => {
    const { element: pacman } = create('div')
      .setAttribute('class', NAME_AMP.PACMAN)
      .setAttribute('part', NAME_AMP.PACMAN);
    Array(5)
      .fill(1)
      .forEach(() => {
        const { element: dot } = create('div');
        pacman.append(dot);
      });
    this.contain.appendChild(pacman);
  };
  createLoading = (): void => {
    this.contain.innerHTML = '';
    const NAME_MAP: Record<NAME_AMP, () => void> = {
      [NAME_AMP.STRETCH]: this.stretchLoading,
      [NAME_AMP.ROTATE]: this.rotateLoading,
      [NAME_AMP.DOUBLE_BOUNCE]: this.doubleBounceLoading,
      [NAME_AMP.CUBE]: this.cubeLoading,
      [NAME_AMP.DOT]: this.dotLoading,
      [NAME_AMP.TRIPLE_BOUNCE]: this.tripleBounceLoading,
      [NAME_AMP.SCALE_OUT]: this.scaleOutLoading,
      [NAME_AMP.CIRCLE]: this.circleLoading,
      [NAME_AMP.CIRCLE_LINE]: this.circleLineLoading,
      [NAME_AMP.SQUARE]: this.squareLoading,
      [NAME_AMP.PULSE]: this.pulseLoading,
      [NAME_AMP.SOLAR]: this.solarLoading,
      [NAME_AMP.CUBE_FOLD]: this.cubeFoldLoading,
      [NAME_AMP.CIRCLE_FOLD]: this.circleFoldLoading,
      [NAME_AMP.CUBE_GRID]: this.cubeGridLoading,
      [NAME_AMP.CIRCLE_TURN]: this.circleTurnLoading,
      [NAME_AMP.CIRCLE_ROTATE]: this.circleRotateLoading,
      [NAME_AMP.CIRCLE_SPIN]: this.circleSpinLoading,
      [NAME_AMP.DOT_BAR]: this.dotBarLoading,
      [NAME_AMP.DOT_CIRCLE]: this.dotCircleLoading,
      [NAME_AMP.LINE]: this.lineLoading,
      [NAME_AMP.DOT_PULSE]: this.dotPulseLoading,
      [NAME_AMP.LINE_SCALE]: this.lineScaleLoading,
      [NAME_AMP.TEXT]: this.textLoading,
      [NAME_AMP.CUBE_DIM]: this.cubeDimLoading,
      [NAME_AMP.DOT_LINE]: this.dotLineLoading,
      [NAME_AMP.ARC]: this.arcLoading,
      [NAME_AMP.DROP]: this.dropLoading,
      [NAME_AMP.PACMAN]: this.pacmanLoading,
    };
    const handler = NAME_MAP[this.name];
    handler && handler();
  };
  connectedCallback(): void {
    this.createLoading();
  }
  disconnectCallback(): void {}
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
