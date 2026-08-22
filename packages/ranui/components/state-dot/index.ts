import componentCss from './index.less?inline';
import { Div } from '@/utils/builder';
import { RanElement } from '@/utils/index';
import {
  ensureShadowElement,
  ensureShadowRoot,
  getStringAttribute,
  setStringAttribute,
  syncSheetAttribute,
} from '@/utils/component';
import { defineSSR } from '@/utils/ssr-registry';

/** Lifecycle a dot can stand for. */
export type StateDotState = 'idle' | 'running' | 'success' | 'warning' | 'error';

/**
 * `<r-state-dot>` — an 8px lifecycle indicator.
 *
 * A halo and a core in one element, both `currentColor`, so a state is one colour rule
 * rather than two tokens. `running` pulses the core: at this size a spinner is a smudge,
 * and the halo is what gives the pulse room to breathe into.
 *
 * **It is never the only carrier.** Colour alone does not say what happened — the row that
 * owns the dot states the outcome in words. This is the glance, not the report.
 *
 * ```html
 * <r-state-dot state="running"></r-state-dot>
 * ```
 *
 * Attributes: `state`, `label`, `sheet`.
 */
export class StateDot extends RanElement {
  _shadowDom!: ShadowRoot;

  static get observedAttributes(): string[] {
    return ['state', 'label', 'sheet'];
  }

  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this, componentCss);
    ensureShadowElement(this._shadowDom, '.ran-state-dot', () =>
      Div().class('ran-state-dot').attr('part', 'dot').build(),
    );
  }

  /** Which lifecycle step to show. Unknown values render as `idle`. */
  get state(): StateDotState {
    const value = getStringAttribute(this, 'state', 'idle');
    return KNOWN.has(value) ? (value as StateDotState) : 'idle';
  }
  set state(value: StateDotState) {
    setStringAttribute(this, 'state', value);
  }

  /**
   * Accessible name.
   *
   * A dot with no name is decoration, and is exposed as such: a screen reader announcing
   * "running" beside a row that already says so is noise. Set it only where the dot is the
   * sole statement of the state.
   */
  get label(): string {
    return getStringAttribute(this, 'label');
  }
  set label(value: string) {
    setStringAttribute(this, 'label', value);
  }

  get sheet(): string {
    return getStringAttribute(this, 'sheet');
  }
  set sheet(value: string) {
    setStringAttribute(this, 'sheet', value);
  }

  connectedCallback(): void {
    this.handlerExternalCss();
    this._syncRole();
  }

  attributeChangedCallback(name: string, old: string | null, next: string | null): void {
    if (old === next) return;
    if (name === 'sheet') this.handlerExternalCss();
    if (name === 'label') this._syncRole();
  }

  handlerExternalCss = (): void => {
    syncSheetAttribute(this, this._shadowDom, 'sheet', null, this.sheet);
  };

  private _syncRole(): void {
    const label = this.label;
    if (label === '') {
      this.setAttribute('aria-hidden', 'true');
      this.removeAttribute('role');
      this.removeAttribute('aria-label');
      return;
    }
    this.removeAttribute('aria-hidden');
    this.setAttribute('role', 'img');
    this.setAttribute('aria-label', label);
  }
}

/** States with their own rendering; anything else is `idle`. */
const KNOWN = new Set(['idle', 'running', 'success', 'warning', 'error']);

defineSSR('r-state-dot', StateDot as unknown as new () => HTMLElement);
export default StateDot;
