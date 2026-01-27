/**
 * Loading Component Configurations
 *
 * This file defines all loading animation structures using a simple DSL.
 *
 * ## Quick Reference - How to Add New Loading Types:
 *
 * ### Pattern 1: Empty (no children)
 * ```ts
 * 'my-loader': config('my-loader', []),
 * ```
 *
 * ### Pattern 2: Single Repeated Element
 * ```ts
 * 'my-loader': config('my-loader', repeat(3, i => el('div', `item-${i + 1}`))),
 * ```
 *
 * ### Pattern 3: Fixed Elements
 * ```ts
 * 'my-loader': config('my-loader', [
 *   el('div', 'outer'),
 *   el('div', 'inner'),
 * ]),
 * ```
 *
 * ### Pattern 4: Nested Structure
 * ```ts
 * 'my-loader': config('my-loader', [
 *   el('div', 'container', [
 *     el('div', 'child-1'),
 *     el('div', 'child-2'),
 *   ]),
 * ]),
 * ```
 *
 * ### Pattern 5: With Text
 * ```ts
 * 'my-loader': config('my-loader', [
 *   text('span', 'Loading...', 'text-class'),
 * ]),
 * ```
 */

// ========== Types ==========

export interface LoadingElement {
  tag: string;
  class?: string;
  children?: LoadingElement[];
  text?: string;
}

export interface LoadingConfig {
  type: string;
  part: string;
  class: string;
  elements: LoadingElement[];
}

// ========== Helper Functions ==========

/**
 * Creates an element
 * @param tag - HTML tag name (e.g., 'div', 'span')
 * @param className - Optional CSS class name
 * @param children - Optional child elements
 * @example
 * el('div', 'my-class')                    // <div class="my-class"></div>
 * el('div', 'outer', [el('div', 'inner')]) // <div class="outer"><div class="inner"></div></div>
 */
const el = (tag: string, className?: string, children?: LoadingElement[]): LoadingElement => ({
  tag,
  ...(className && { class: className }),
  ...(children && { children }),
});

/**
 * Creates a text element
 * @param tag - HTML tag name
 * @param content - Text content
 * @param className - Optional CSS class name
 * @example
 * text('span', 'Hello')              // <span>Hello</span>
 * text('span', 'Hello', 'my-class')  // <span class="my-class">Hello</span>
 */
const text = (tag: string, content: string, className?: string): LoadingElement => ({
  tag,
  text: content,
  ...(className && { class: className }),
});

/**
 * Creates repeated elements
 * @param count - Number of elements to create
 * @param fn - Function that receives index and returns element
 * @example
 * repeat(3, i => el('div', `item-${i + 1}`))
 * // Creates: [
 * //   <div class="item-1"></div>,
 * //   <div class="item-2"></div>,
 * //   <div class="item-3"></div>
 * // ]
 */
const repeat = (count: number, fn: (index: number) => LoadingElement): LoadingElement[] =>
  Array(count)
    .fill(null)
    .map((_, i) => fn(i));

/**
 * Creates a complete loading configuration
 * Automatically sets type, part, and class to the same value
 * @param name - The loading type name
 * @param elements - Array of child elements
 * @example
 * config('spinner', [el('div', 'circle')])
 */
const config = (name: string, elements: LoadingElement[]): LoadingConfig => ({
  type: name,
  part: name,
  class: name,
  elements,
});

// ========== Loading Configurations ==========

export const LOADING_CONFIGS: Record<string, LoadingConfig> = {
  // ===== Simple (No Children) =====
  'rotate': config('rotate', []),
  'scale-out': config('scale-out', []),
  'circle-turn': config('circle-turn', []),

  // ===== Simple Repeated Items =====
  'stretch': config('stretch', repeat(5, i => el('div', `rect${i + 1}`))),
  'double-bounce': config('double-bounce', repeat(2, i => el('div', `double-bounce${i + 1}`))),
  'cube': config('cube', repeat(2, i => el('div', `cube${i + 1}`))),
  'dot': config('dot', repeat(2, i => el('div', `dot${i + 1}`))),
  'triple-bounce': config('triple-bounce', repeat(3, i => el('div', `triple-bounce${i + 1}`))),
  'pulse': config('pulse', repeat(3, i => el('div', `pulse-bubble pulse-bubble-${i + 1}`))),
  'cube-fold': config('cube-fold', repeat(4, i => el('div', `cube-fold-item cube-fold-item-${i + 1}`))),
  'circle-fold': config('circle-fold', repeat(12, i => el('div', `circle-fold-item circle-fold-item-${i + 1}`))),
  'cube-grid': config('cube-grid', repeat(9, i => el('div', `cube-grid-item cube-grid-item-${i + 1}`))),
  'dot-bar': config('dot-bar', repeat(5, i => el('div', `dot-bar-item dot-bar-item-${i + 1}`))),
  'dot-circle': config('dot-circle', repeat(5, i => el('div', `dot-circle-item dot-circle-item-${i + 1}`))),
  'pacman': config('pacman', repeat(5, () => el('div'))),

  // ===== Repeated Without Index =====
  'cube-dim': config('cube-dim', repeat(9, () => el('div', 'cube-dim-item'))),
  'line-scale': config('line-scale', repeat(5, () => el('div', 'line-scale-item'))),
  'line': config('line', repeat(3, () => el('div', 'line-item'))),

  // ===== Text-Based =====
  'text': config(
    'text',
    'Loading'.split('').map(char => text('span', char, 'text-item'))
  ),

  // ===== Nested Structures =====
  'circle': config(
    'circle',
    repeat(3, containerIndex =>
      el(
        'div',
        `circle-container container${containerIndex + 1}`,
        repeat(4, i => el('div', `circle${i + 1}`))
      )
    )
  ),

  'circle-line': config('circle-line', [el('div', 'circle-line-border', [el('div', 'circle-line-core')])]),

  'square': config('square', [
    el('div', 'square-box1', [el('div', 'square-core')]),
    el('div', 'square-box2', [el('div', 'square-core')]),
  ]),

  'solar': config('solar', [
    el('div', 'earth-orbit orbit', [
      el('div', 'planet earth'),
      el('div', 'venus-orbit orbit', [
        el('div', 'planet venus'),
        el('div', 'mercury-orbit orbit', [el('div', 'planet mercury'), el('div', 'sun')]),
      ]),
    ]),
  ]),

  'circle-rotate': config('circle-rotate', [el('div', 'circle-rotate-outer'), el('div', 'circle-rotate-inner')]),

  'circle-spin': config('circle-spin', [el('div', 'circle-spin-outer'), el('div', 'circle-spin-inner')]),

  'dot-line': config(
    'dot-line',
    repeat(2, () => el('div', 'dot-line-item', [el('div', 'dot-line-item-circle')]))
  ),

  'dot-pulse': config(
    'dot-pulse',
    repeat(5, i =>
      el('div', 'dot-pulse-item', [
        el('div', `dot-pulse-item-dot dot-pulse-item-dot-${i + 1}`),
        el('div', `dot-pulse-item-ball dot-pulse-item-ball-${i + 1}`),
      ])
    )
  ),

  // ===== With Text Content =====
  'arc': config('arc', [el('div', 'arc-item'), el('h1', '', [text('span', 'LOADING')])]),

  'drop': config('drop', [
    el('div', 'drop-item', [
      el('div', 'drop-item-bg', [text('span', 'LOADING')]),
      el('div', 'drop-dot', [el('div', 'drop-dot-1'), el('div', 'drop-dot-2')]),
    ]),
    el('div', 'drop-dot', [el('div', 'drop-dot-1'), el('div', 'drop-dot-2')]),
  ]),
};

// ========== Example: How to Add a New Loading Type ==========
/*

// 1. Simple spinner with 3 dots
'dots': config('dots', repeat(3, i => el('div', `dot-${i + 1}`))),

// 2. Nested structure with custom classes
'fancy-loader': config('fancy-loader', [
  el('div', 'outer-ring', [
    el('div', 'inner-ring', [
      el('div', 'core'),
    ]),
  ]),
]),

// 3. With dynamic text
'custom-text': config('custom-text',
  'WAIT'.split('').map(char => text('span', char, 'letter'))
),

// 4. Mixed content
'complex': config('complex', [
  el('div', 'spinner'),
  text('p', 'Loading...', 'label'),
  repeat(4, i => el('div', `bar-${i + 1}`)),
]),

*/
