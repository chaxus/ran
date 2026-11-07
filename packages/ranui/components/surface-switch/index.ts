import surfaceSwitchCss from './index.less?inline';
import { EventManager, View } from '@/utils/builder';
import { RanElement } from '@/utils/index';
import { ensureShadowRoot, getStringAttribute, setStringAttribute, syncSheetAttribute } from '@/utils/component';
import { defineSSR } from '@/utils/ssr-registry';
import { getSurface, setSurface } from '@/utils/surface';
import type { RanSurfaceName } from '@/utils/surface';
import { uiText } from '@/utils/ui-text';
import { surfaceSwitchText } from './text';
import '@/components/select';

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

    this._select = View('r-select')
      .class('ran-surface-switch')
      .attr('part', 'select')
      .attr('trigger', 'click')
      .attr('value', 'solid')
      .children(...options)
      .build() as HTMLElement & { value: string };

    this._shadowDom.appendChild(this._select);
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
}

defineSSR('r-surface-switch', SurfaceSwitch as unknown as new () => HTMLElement);
export default SurfaceSwitch;
