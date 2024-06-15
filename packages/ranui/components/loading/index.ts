import { HTMLElementSSR, createCustomError } from '@/utils/index';
import { create } from 'ranuts/utils';

enum NAME_AMP {
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
  CIRCLE_ROTATE = 'circle-rotate'
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
    const shadowRoot = this.attachShadow({ mode: 'closed' });
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
    this.contain.appendChild(loading);
  };
  stretchLoading = (): void => {
    const loading = document.createElement('div');
    loading.setAttribute('class', NAME_AMP.STRETCH);
    const arr = [1, 2, 3, 4, 5];
    arr.forEach((i) => {
      const rect = document.createElement('div');
      rect.setAttribute('class', `rect${i}`);
      loading.appendChild(rect);
    });
    this.contain.appendChild(loading);
  };
  doubleBounceLoading = (): void => {
    const loading = document.createElement('div');
    loading.setAttribute('class', NAME_AMP.DOUBLE_BOUNCE);
    const arr = [1, 2];
    arr.forEach((i) => {
      const rect = document.createElement('div');
      rect.setAttribute('class', `double-bounce${i}`);
      loading.appendChild(rect);
    });
    this.contain.appendChild(loading);
  };
  cubeLoading = (): void => {
    const loading = document.createElement('div');
    loading.setAttribute('class', NAME_AMP.CUBE);
    const arr = [1, 2];
    arr.forEach((i) => {
      const rect = document.createElement('div');
      rect.setAttribute('class', `cube${i}`);
      loading.appendChild(rect);
    });
    this.contain.appendChild(loading);
  };
  dotLoading = (): void => {
    const loading = document.createElement('div');
    loading.setAttribute('class', NAME_AMP.DOT);
    const arr = [1, 2];
    arr.forEach((i) => {
      const rect = document.createElement('div');
      rect.setAttribute('class', `dot${i}`);
      loading.appendChild(rect);
    });
    this.contain.appendChild(loading);
  };
  tripleBounceLoading = (): void => {
    const loading = document.createElement('div');
    loading.setAttribute('class', NAME_AMP.TRIPLE_BOUNCE);
    const arr = [1, 2, 3];
    arr.forEach((i) => {
      const rect = document.createElement('div');
      rect.setAttribute('class', `triple-bounce${i}`);
      loading.appendChild(rect);
    });
    this.contain.appendChild(loading);
  };
  scaleOutLoading = (): void => {
    const loading = document.createElement('div');
    loading.setAttribute('class', 'scale-out');
    this.contain.appendChild(loading);
  };
  circleLoading = (): void => {
    const loading = document.createElement('div');
    loading.setAttribute('class', 'circle');
    [
      [1, 2, 3, 4],
      [1, 2, 3, 4],
      [1, 2, 3, 4],
    ].forEach((i, index) => {
      const container = document.createElement('div');
      container.setAttribute('class', `circle-container container${index + 1}`);
      i.forEach((j) => {
        const rect = document.createElement('div');
        rect.setAttribute('class', `circle${j}`);
        container.appendChild(rect);
      });
      loading.appendChild(container);
    });
    this.contain.appendChild(loading);
  };
  circleLineLoading = (): void => {
    const { element: core } = create('div').setAttribute('class', 'circle-line-core')
    const { element: border } = create('div').setAttribute('class', 'circle-line-border').append(core)
    const { element: loading } = create('div').setAttribute('class', 'circle-line').append(border)
    this.contain.appendChild(loading);
  };
  squareLoading = (): void => {
    const { element: core } = create('div').setAttribute('class', 'square-core')
    const { element: box1 } = create('div').setAttribute('class', 'square-box1').append(core)
    const { element: box2 } = create('div').setAttribute('class', 'square-box2').append(core)
    const { element: square } = create('div').setAttribute('class', 'square').append(box1).append(box2)
    this.contain.appendChild(square);
  }
  pulseLoading = (): void => {
    const pulse = create('div').setAttribute('class', 'pulse')
    const arr = [1, 2, 3];
    arr.forEach((_, index) => {
      const { element: bubble } = create('div').setAttribute('class', `pulse-bubble pulse-bubble-${index + 1}`)
      pulse.append(bubble)
    })
    this.contain.appendChild(pulse.element)
  }
  solarLoading = (): void => {
    const { element: sun } = create('div').setAttribute('class', 'sun')
    const { element: mercury } = create('div').setAttribute('class', 'planet mercury')
    const { element: mercuryOrbit } = create('div').setAttribute('class', 'mercury-orbit orbit').append(mercury).append(sun)
    const { element: venus } = create('div').setAttribute('class', 'planet venus')
    const { element: venusOrbit } = create('div').setAttribute('class', 'venus-orbit orbit').append(venus).append(mercuryOrbit)
    const { element: earth } = create('div').setAttribute('class', 'planet earth')
    const { element: earthOrbit } = create('div').setAttribute('class', 'earth-orbit orbit').append(earth).append(venusOrbit)
    const { element: solar } = create('div').setAttribute('class', 'solar').append(earthOrbit)
    this.contain.appendChild(solar)
  }
  cubeFoldLoading = (): void => {
    const { element: cubeFold } = create('div').setAttribute('class', 'cube-fold')
    const arr = [1, 2, 3, 4]
    arr.forEach((_, index) => {
      const { element: cube } = create('div').setAttribute('class', `cube-fold-item cube-fold-item-${index + 1}`)
      cubeFold.appendChild(cube)
    })
    this.contain.appendChild(cubeFold)
  }
  circleFoldLoading = (): void => {
    const circleFold = create('div').setAttribute('class', 'circle-fold')
    Array(12).fill(1).forEach((_, index) => {
      const { element } = create('div').setAttribute('class', `circle-fold-item circle-fold-item-${index + 1}`)
      circleFold.append(element)
    })
    this.contain.appendChild(circleFold.element)
  }
  cubeGridLoading = (): void => {
    const cubeGrid = create('div').setAttribute('class', 'cube-grid')
    Array(9).fill(1).forEach((_, index) => {
      const { element } = create('div').setAttribute('class', `cube-grid-item cube-grid-item-${index + 1}`)
      cubeGrid.append(element)
    })
    this.contain.appendChild(cubeGrid.element)
  }
  circleTurnLoading = (): void => {
    const { element: circleTurn } = create('div').setAttribute('class', 'circle-turn')
    this.contain.appendChild(circleTurn)
  }
  circleRotateLoading = ():void => {
    const { element: circleRotate } = create('div').setAttribute('class', 'circle-rotate')
    const { element: circleInner } = create('div').setAttribute('class','circle-rotate-inner')
    const { element: circleOuter } = create('div').setAttribute('class','circle-rotate-outer')
    circleRotate.appendChild(circleOuter)
    circleRotate.appendChild(circleInner)
    this.contain.appendChild(circleRotate)
  }
  
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
      [NAME_AMP.CIRCLE_ROTATE]: this.circleRotateLoading
    };
    const handler = NAME_MAP[this.name];
    handler && handler();
  };
  connectedCallback(): void {
    this.createLoading();
  }
  disconnectCallback(): void { }
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
