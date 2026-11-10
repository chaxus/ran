import surfaceSwitchCss from './index.less?inline';
import { EventManager, View } from '@/utils/builder';
import { RanElement } from '@/utils/index';
import {
  ensureShadowRoot,
  getStringAttribute,
  mountShadowTree,
  setStringAttribute,
  syncSheetAttribute,
} from '@/utils/component';
import { defineSSR } from '@/utils/ssr-registry';
import { getSurface, setSurface } from '@/utils/surface';
import type { RanSurfaceName } from '@/utils/surface';
import { uiText } from '@/utils/ui-text';
import { surfaceSwitchText } from './text';
// Side-effect registration for `r-select` / `r-option`. Keep the class binding so
// bundlers that honour package.json `sideEffects` still evaluate defineSSR.
import { Select } from '@/components/select';
void Select;

const CHOICES: RanSurfaceName[] = ['solid', 'glass'];

const SYNC_EVENT = 'ran-surface-switch-sync';

const TEXT_KEY: Record<RanSurfaceName, `surfaceSwitch.${RanSurfaceName}`> = {
  solid: 'surfaceSwitch.solid',
  glass: 'surfaceSwitch.glass',
};

/**
 * `<r-surface-switch>` — a select of style languages (solid / liquid glass) wired to
 * `setSurface` / `getSurface`. Orthogonal to color theme (`r-theme-switch`): glass still
 * respects light / dark / system. Multiple instances stay in sync. Emits a composed
 * `change` event with `{ surface }`.
 */
export class SurfaceSwitch extends RanElement {
  static get observedAttributes(): string[] {
    return ['label', 'label-solid', 'label-glass', 'sheet'];
  }

  _events = new EventManager();
  _shadowDom: ShadowRoot;
  _select: HTMLElement & { value: string };
  _options: Map<RanSurfaceName, HTMLElement> = new Map();

  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this, surfaceSwitchCss);

    const options = CHOICES.map((choice) => {
      const option = View('r-option').attr('value', choice).attr('part', `option ${choice}`).build() as HTMLElement;
      this._options.set(choice, option);
      return option;
    });

    // Use the Select class directly so SSR builds a real select shadow tree
    // (View('r-select') is only an HTMLElementMock under Node and skips DSD chrome).
    // Portaled panel is outside this shadow tree — chrome menu vars land via dropdownclass.
    // Host `trigger` (e.g. docs header `hover click`) wins; default stays click.
    // DSD snapshot is paint-only: mountShadowTree replaceChildren it; refs stay from builder.
    const select = new Select() as HTMLElement & { value: string };
    select.classList.add('ran-surface-switch');
    select.setAttribute('part', 'select');
    select.setAttribute('trigger', this.getAttribute('trigger') || 'click');
    select.setAttribute('dropdownclass', 'ran-chrome-menu');
    select.setAttribute('value', 'solid');
    for (const option of options) select.appendChild(option);
    this._select = select;
    mountShadowTree(this._shadowDom, surfaceSwitchCss, this._select);
  }

  get sheet(): string {
    return getStringAttribute(this, 'sheet');
  }
  set sheet(v: string) {
    setStringAttribute(this, 'sheet', v);
  }

  get value(): RanSurfaceName {
    return getSurface();
  }
  set value(v: RanSurfaceName) {
    if (CHOICES.includes(v)) this._selectChoice(v);
  }

  /** Forwarded to the inner `r-select` so hosts (e.g. docs header hover menus) can open/close it. */
  get open(): boolean {
    return Boolean((this._select as unknown as { open?: boolean }).open);
  }
  set open(value: boolean) {
    (this._select as unknown as { open: boolean }).open = Boolean(value);
  }

  _label(choice: RanSurfaceName): string {
    return this.getAttribute(`label-${choice}`) || uiText(surfaceSwitchText, TEXT_KEY[choice], this);
  }

  _groupLabel(): string {
    return this.getAttribute('label') || uiText(surfaceSwitchText, 'surfaceSwitch.label', this);
  }

  _syncLabels(): void {
    this._select.setAttribute('aria-label', this._groupLabel());
    for (const [choice, option] of this._options) {
      option.textContent = this._label(choice);
    }
  }

  _reflect(): void {
    const current = this.value;
    if (this._select.value !== current) this._select.value = current;
  }

  _selectChoice(choice: RanSurfaceName): void {
    setSurface(choice);
    this._reflect();
    document.dispatchEvent(new CustomEvent(SYNC_EVENT));
    this.dispatchEvent(new CustomEvent('change', { detail: { surface: choice }, bubbles: true, composed: true }));
  }

  _handleSelectChange = (event: Event): void => {
    const detail = (event as CustomEvent<{ value?: string }>).detail;
    const choice = (detail?.value || this._select.value) as RanSurfaceName;
    if (CHOICES.includes(choice) && choice !== this.value) this._selectChoice(choice);
  };

  _handleSync = (): void => this._reflect();

  handlerExternalCss = (): void => {
    syncSheetAttribute(this, this._shadowDom, 'sheet', null, this.sheet);
  };

  connectedCallback(): void {
    this.handlerExternalCss();
    this._syncLabels();
    this._reflect();
    this._events.on(this._select, 'change', this._handleSelectChange as EventListener);
    document.addEventListener(SYNC_EVENT, this._handleSync);
    if (typeof window !== 'undefined') window.addEventListener('storage', this._handleSync);
  }

  disconnectedCallback(): void {
    this._events.abort();
    document.removeEventListener(SYNC_EVENT, this._handleSync);
    if (typeof window !== 'undefined') window.removeEventListener('storage', this._handleSync);
  }

  attributeChangedCallback(name: string, old: string, next: string): void {
    if (old === next) return;
    if (name === 'sheet') this.handlerExternalCss();
    if (name.startsWith('label')) this._syncLabels();
  }

  /**
   * SSR / Declarative Shadow DOM: fill option labels and the closed-state selection
   * before serialize so first paint shows Graphite / Liquid glass, not an empty trigger.
   */
  _preSerialize(): void {
    this._syncLabels();
    const current = this.value;
    this._select.setAttribute('value', current);
    const select = this._select as HTMLElement & { _preSerialize?: () => void };
    select._preSerialize?.();
  }
}

defineSSR('r-surface-switch', SurfaceSwitch as unknown as new () => HTMLElement);
export default SurfaceSwitch;
