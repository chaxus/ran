/**
 * Loading Component Configurations
 */

export interface LoadingElement {
  tag: string;
  class: string;
  children?: LoadingElement[];
  text?: string;
}

export interface LoadingConfig {
  type: string;
  part: string;
  class: string;
  elements: LoadingElement[];
}

export const LOADING_CONFIGS: Record<string, LoadingConfig> = {
  'rotate': {
    type: 'rotate',
    part: 'rotate',
    class: 'rotate',
    elements: [],
  },
  'stretch': {
    type: 'stretch',
    part: 'stretch',
    class: 'stretch',
    elements: Array(5).fill(null).map((_, i) => ({
      tag: 'div',
      class: `rect${i + 1}`,
    })),
  },
  'double-bounce': {
    type: 'double-bounce',
    part: 'double-bounce',
    class: 'double-bounce',
    elements: Array(2).fill(null).map((_, i) => ({
      tag: 'div',
      class: `double-bounce${i + 1}`,
    })),
  },
  'cube': {
    type: 'cube',
    part: 'cube',
    class: 'cube',
    elements: Array(2).fill(null).map((_, i) => ({
      tag: 'div',
      class: `cube${i + 1}`,
    })),
  },
  'dot': {
    type: 'dot',
    part: 'dot',
    class: 'dot',
    elements: Array(2).fill(null).map((_, i) => ({
      tag: 'div',
      class: `dot${i + 1}`,
    })),
  },
  'triple-bounce': {
    type: 'triple-bounce',
    part: 'triple-bounce',
    class: 'triple-bounce',
    elements: Array(3).fill(null).map((_, i) => ({
      tag: 'div',
      class: `triple-bounce${i + 1}`,
    })),
  },
  'scale-out': {
    type: 'scale-out',
    part: 'scale-out',
    class: 'scale-out',
    elements: [],
  },
  'circle': {
    type: 'circle',
    part: 'circle',
    class: 'circle',
    elements: Array(3).fill(null).map((_, containerIndex) => ({
      tag: 'div',
      class: `circle-container container${containerIndex + 1}`,
      children: Array(4).fill(null).map((_, i) => ({
        tag: 'div',
        class: `circle${i + 1}`,
      })),
    })),
  },
  'circle-line': {
    type: 'circle-line',
    part: 'circle-line',
    class: 'circle-line',
    elements: [
      {
        tag: 'div',
        class: 'circle-line-border',
        children: [
          {
            tag: 'div',
            class: 'circle-line-core',
          },
        ],
      },
    ],
  },
  'square': {
    type: 'square',
    part: 'square',
    class: 'square',
    elements: [
      {
        tag: 'div',
        class: 'square-box1',
        children: [
          {
            tag: 'div',
            class: 'square-core',
          },
        ],
      },
      {
        tag: 'div',
        class: 'square-box2',
        children: [
          {
            tag: 'div',
            class: 'square-core',
          },
        ],
      },
    ],
  },
  'pulse': {
    type: 'pulse',
    part: 'pulse',
    class: 'pulse',
    elements: Array(3).fill(null).map((_, i) => ({
      tag: 'div',
      class: `pulse-bubble pulse-bubble-${i + 1}`,
    })),
  },
  'solar': {
    type: 'solar',
    part: 'solar',
    class: 'solar',
    elements: [
      {
        tag: 'div',
        class: 'earth-orbit orbit',
        children: [
          {
            tag: 'div',
            class: 'planet earth',
          },
          {
            tag: 'div',
            class: 'venus-orbit orbit',
            children: [
              {
                tag: 'div',
                class: 'planet venus',
              },
              {
                tag: 'div',
                class: 'mercury-orbit orbit',
                children: [
                  {
                    tag: 'div',
                    class: 'planet mercury',
                  },
                  {
                    tag: 'div',
                    class: 'sun',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  'cube-fold': {
    type: 'cube-fold',
    part: 'cube-fold',
    class: 'cube-fold',
    elements: Array(4).fill(null).map((_, i) => ({
      tag: 'div',
      class: `cube-fold-item cube-fold-item-${i + 1}`,
    })),
  },
  'circle-fold': {
    type: 'circle-fold',
    part: 'circle-fold',
    class: 'circle-fold',
    elements: Array(12).fill(null).map((_, i) => ({
      tag: 'div',
      class: `circle-fold-item circle-fold-item-${i + 1}`,
    })),
  },
  'cube-grid': {
    type: 'cube-grid',
    part: 'cube-grid',
    class: 'cube-grid',
    elements: Array(9).fill(null).map((_, i) => ({
      tag: 'div',
      class: `cube-grid-item cube-grid-item-${i + 1}`,
    })),
  },
  'circle-turn': {
    type: 'circle-turn',
    part: 'circle-turn',
    class: 'circle-turn',
    elements: [],
  },
  'circle-rotate': {
    type: 'circle-rotate',
    part: 'circle-rotate',
    class: 'circle-rotate',
    elements: [
      {
        tag: 'div',
        class: 'circle-rotate-outer',
      },
      {
        tag: 'div',
        class: 'circle-rotate-inner',
      },
    ],
  },
  'circle-spin': {
    type: 'circle-spin',
    part: 'circle-spin',
    class: 'circle-spin',
    elements: [
      {
        tag: 'div',
        class: 'circle-spin-outer',
      },
      {
        tag: 'div',
        class: 'circle-spin-inner',
      },
    ],
  },
  'dot-bar': {
    type: 'dot-bar',
    part: 'dot-bar',
    class: 'dot-bar',
    elements: Array(5).fill(null).map((_, i) => ({
      tag: 'div',
      class: `dot-bar-item dot-bar-item-${i + 1}`,
    })),
  },
  'dot-circle': {
    type: 'dot-circle',
    part: 'dot-circle',
    class: 'dot-circle',
    elements: Array(5).fill(null).map((_, i) => ({
      tag: 'div',
      class: `dot-circle-item dot-circle-item-${i + 1}`,
    })),
  },
  'line': {
    type: 'line',
    part: 'line',
    class: 'line',
    elements: Array(3).fill(null).map(() => ({
      tag: 'div',
      class: 'line-item',
    })),
  },
  'dot-pulse': {
    type: 'dot-pulse',
    part: 'dot-pulse',
    class: 'dot-pulse',
    elements: Array(5).fill(null).map((_, i) => ({
      tag: 'div',
      class: 'dot-pulse-item',
      children: [
        {
          tag: 'div',
          class: `dot-pulse-item-dot dot-pulse-item-dot-${i + 1}`,
        },
        {
          tag: 'div',
          class: `dot-pulse-item-ball dot-pulse-item-ball-${i + 1}`,
        },
      ],
    })),
  },
  'line-scale': {
    type: 'line-scale',
    part: 'line-scale',
    class: 'line-scale',
    elements: Array(5).fill(null).map(() => ({
      tag: 'div',
      class: 'line-scale-item',
    })),
  },
  'text': {
    type: 'text',
    part: 'text',
    class: 'text',
    elements: ['L', 'o', 'a', 'd', 'i', 'n', 'g'].map((char) => ({
      tag: 'span',
      class: 'text-item',
      text: char,
    })),
  },
  'cube-dim': {
    type: 'cube-dim',
    part: 'cube-dim',
    class: 'cube-dim',
    elements: Array(9).fill(null).map(() => ({
      tag: 'div',
      class: 'cube-dim-item',
    })),
  },
  'dot-line': {
    type: 'dot-line',
    part: 'dot-line',
    class: 'dot-line',
    elements: Array(2).fill(null).map(() => ({
      tag: 'div',
      class: 'dot-line-item',
      children: [
        {
          tag: 'div',
          class: 'dot-line-item-circle',
        },
      ],
    })),
  },
  'arc': {
    type: 'arc',
    part: 'arc',
    class: 'arc',
    elements: [
      {
        tag: 'div',
        class: 'arc-item',
      },
      {
        tag: 'h1',
        class: '',
        children: [
          {
            tag: 'span',
            class: '',
            text: 'LOADING',
          },
        ],
      },
    ],
  },
  'drop': {
    type: 'drop',
    part: 'drop',
    class: 'drop',
    elements: [
      {
        tag: 'div',
        class: 'drop-item',
        children: [
          {
            tag: 'div',
            class: 'drop-item-bg',
            children: [
              {
                tag: 'span',
                class: '',
                text: 'LOADING',
              },
            ],
          },
          {
            tag: 'div',
            class: 'drop-dot',
            children: [
              {
                tag: 'div',
                class: 'drop-dot-1',
              },
              {
                tag: 'div',
                class: 'drop-dot-2',
              },
            ],
          },
        ],
      },
      {
        tag: 'div',
        class: 'drop-dot',
        children: [
          {
            tag: 'div',
            class: 'drop-dot-1',
          },
          {
            tag: 'div',
            class: 'drop-dot-2',
          },
        ],
      },
    ],
  },
  'pacman': {
    type: 'pacman',
    part: 'pacman',
    class: 'pacman',
    elements: Array(5).fill(null).map(() => ({
      tag: 'div',
      class: '',
    })),
  },
};
