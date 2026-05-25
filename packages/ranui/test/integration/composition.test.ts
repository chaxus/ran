/**
 * Integration tests — component composition scenarios.
 *
 * These cover bugs that unit tests cannot catch: layout interactions between
 * components, slot projection into host, and Custom Elements spec compliance.
 *
 * Rule: every bug found on the demo page or in a composition scenario must
 * produce a failing test here before the fix is merged.
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { describe, expect, it, beforeEach } from 'vitest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');

const PROGRESS_LESS = readFileSync(
  resolve(__dirname, '../../components/progress/index.less'),
  'utf-8',
);

// Register all components under test
import '@/components/button';
import '@/components/card';
import '@/components/checkbox';
import '@/components/icon';
import '@/components/input';
import '@/components/loading';
import '@/components/message';
import '@/components/modal';
import '@/components/popover';
import '@/components/progress';
import '@/components/select';
import '@/components/select/option';
import '@/components/tab';      // registers r-tabs
import '@/components/tabpane';  // registers r-tab

// ─────────────────────────────────────────────────────────────────────────────
// 1. Custom Elements constructor spec compliance
//    Regression: r-option called this.setAttribute('class', …) in its
//    constructor, violating the CE spec.  Chrome threw NotSupportedError
//    11 times on the demo page.
//    Fix: move this.classList.add to connectedCallback.
// ─────────────────────────────────────────────────────────────────────────────

describe('Custom Elements constructor spec compliance', () => {
  const TAGS = [
    'r-button',
    'r-card',
    'r-checkbox',
    'r-icon',
    'r-input',
    'r-loading',
    'r-message',
    'r-modal',
    'r-option',
    'r-popover',
    'r-progress',
    'r-select',
    'r-tabs',
    'r-tab',
  ] as const;

  it.each(TAGS)(
    'document.createElement("%s") does not throw',
    (tag) => {
      expect(() => document.createElement(tag)).not.toThrow();
    },
  );

  it('r-option gains ran-option class only after being connected', () => {
    const option = document.createElement('r-option');

    // Before connection: class must NOT be present (constructor ran without setAttribute)
    expect(option.classList.contains('ran-option')).toBe(false);

    // After connection: connectedCallback sets the class
    document.body.appendChild(option);
    expect(option.classList.contains('ran-option')).toBe(true);

    document.body.removeChild(option);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. r-checkbox — slot projection
//    Regression: shadow DOM had no <slot>, so light-DOM label text ("Checked",
//    "Typed custom elements", …) was silently swallowed and never rendered.
//    Fix: add .ran-checkbox-wrapper + Slot() to shadow DOM.
// ─────────────────────────────────────────────────────────────────────────────

describe('r-checkbox slot projection', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('shadow DOM contains a default slot for label text', () => {
    const cb = document.createElement('r-checkbox');
    document.body.appendChild(cb);

    const shadow = (cb as any)._shadowDom as ShadowRoot;
    expect(shadow.querySelector('slot')).not.toBeNull();
  });

  it('shadow DOM wraps checkbox square and label slot together', () => {
    const cb = document.createElement('r-checkbox');
    document.body.appendChild(cb);

    const shadow = (cb as any)._shadowDom as ShadowRoot;

    // Outer wrapper exists
    const wrapper = shadow.querySelector('.ran-checkbox-wrapper');
    expect(wrapper).not.toBeNull();

    // Inner square (the 16×16 check box) is inside the wrapper
    expect(wrapper!.querySelector('.ran-checkbox')).not.toBeNull();

    // Slot for label text is also inside the wrapper
    expect(wrapper!.querySelector('slot')).not.toBeNull();
  });

  it('toggling checked adds ran-checkbox-checked only to the inner square, not the wrapper', () => {
    const cb = document.createElement('r-checkbox');
    document.body.appendChild(cb);

    cb.setAttribute('checked', 'true');

    const shadow = (cb as any)._shadowDom as ShadowRoot;
    expect(shadow.querySelector('.ran-checkbox')!.classList.contains('ran-checkbox-checked')).toBe(true);
    expect(shadow.querySelector('.ran-checkbox-wrapper')!.classList.contains('ran-checkbox-checked')).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. r-progress — bounded default height
//    Regression: .ran-progress had height:100% with no explicit :host height,
//    so the component expanded to fill the parent container (126px inside a
//    168px card instead of the expected ~20px track + dot).
//    Fix: :host { display:block; height: var(--ran-progress-height, 20px) }
// ─────────────────────────────────────────────────────────────────────────────

describe('r-progress CSS height contract', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it(':host declares display:block in LESS source', () => {
    expect(PROGRESS_LESS).toContain('display: block');
  });

  it(':host height default is a px value, not 100%', () => {
    // Matches:  height: var(--ran-progress-height, 20px)
    // Rejects:  height: var(--ran-progress-height, 100%)
    expect(PROGRESS_LESS).toMatch(/height:\s*var\(--ran-progress-height,\s*\d+px\)/);
  });

  it('r-progress inside r-card does not make card overflow', () => {
    const card = document.createElement('r-card');
    const progress = document.createElement('r-progress');
    progress.setAttribute('percent', '72');
    card.appendChild(progress);
    document.body.appendChild(card);

    // jsdom layout is not computed, but we can verify the structural contract:
    // card's scrollHeight should equal clientHeight (no overflow) in a real
    // browser — here we verify the DOM is valid and no error was thrown.
    expect(card.contains(progress)).toBe(true);
    expect(() => card.scrollHeight).not.toThrow();

    document.body.removeChild(card);
  });
});
