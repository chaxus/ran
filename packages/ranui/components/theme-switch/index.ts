import themeSwitchCss from './index.less?inline';
import { EventManager, View } from '@/utils/builder';
import { RanElement } from '@/utils/index';
import { ensureShadowRoot, getStringAttribute, setStringAttribute, syncSheetAttribute } from '@/utils/component';
import { defineSSR } from '@/utils/ssr-registry';
import { getTheme, setTheme } from '@/utils/theme';
import type { RanThemeName } from '@/utils/theme';
import { uiText } from '@/utils/ui-text';
import { themeSwitchText } from './text';
// Side-effect registration for `r-select` / `r-option`. Keep the class binding so
// bundlers that honour package.json `sideEffects` still evaluate defineSSR.
import { Select } from '@/components/select';
void Select;

const CHOICES: RanThemeName[] = ['system', 'light', 'dark'];

const SYNC_EVENT = 'ran-theme-switch-sync';

const TEXT_KEY: Record<RanThemeName, `themeSwitch.${RanThemeName}`> = {
  system: 'themeSwitch.system',
  light: 'themeSwitch.light',
  dark: 'themeSwitch.dark',
};

/**
 * `<r-theme-switch>` — a select of color themes (system / light / dark) wired to
 * ranui's theme API. Orthogonal to surface/style (`r-surface-switch`). Multiple
 * instances stay in sync; `label-*` attributes localize option text. Emits a
 * composed `change` event with `{ theme }`.
 */
export class ThemeSwitch extends RanElement {
  static get observedAttributes(): string[] {
    return ['label', 'label-system', 'label-light', 'label-dark', 'sheet'];
  }

  _events = new EventManager();
  _shadowDom: ShadowRoot;
  _select: HTMLElement & { value: string };
  _options: Map<RanThemeName, HTMLElement> = new Map();

  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this, themeSwitchCss);

    const options = CHOICES.map((choice) => {
      const option = View('r-option').attr('value', choice).attr('part', `option ${choice}`).build() as HTMLElement;
      this._options.set(choice, option);
      return option;
    });

    // Portaled panel is outside this shadow tree — chrome menu vars land via dropdownclass.
    // Host `trigger` (e.g. docs header `hover click`) wins; default stays click.
    this._select = View('r-select')
      .class('ran-theme-switch')
      .attr('part', 'select')
      .attr('trigger', this.getAttribute('trigger') || 'click')
      .attr('dropdownclass', 'ran-chrome-menu')
      .attr('value', 'system')
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

  /** Current color theme; falls back to 'system' when nothing is forced. */
  get value(): RanThemeName {
    return getTheme() || 'system';
  }
  set value(v: RanThemeName) {
    if (CHOICES.includes(v)) this._selectChoice(v);
  }

  /** Forwarded to the inner `r-select` so hosts (e.g. docs header hover menus) can open/close it. */
  get open(): boolean {
    return Boolean((this._select as unknown as { open?: boolean }).open);
  }
  set open(value: boolean) {
    (this._select as unknown as { open: boolean }).open = Boolean(value);
  }

  _label(choice: RanThemeName): string {
    return this.getAttribute(`label-${choice}`) || uiText(themeSwitchText, TEXT_KEY[choice], this);
  }

  _groupLabel(): string {
    return this.getAttribute('label') || uiText(themeSwitchText, 'themeSwitch.label', this);
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

  _selectChoice(choice: RanThemeName): void {
    setTheme(choice);
    this._reflect();
    this._syncMeta(choice);
    document.dispatchEvent(new CustomEvent(SYNC_EVENT));
    this.dispatchEvent(new CustomEvent('change', { detail: { theme: choice }, bubbles: true, composed: true }));
  }

  /** Keep <meta name="theme-color"> in step with the resolved color theme. */
  _syncMeta(choice: RanThemeName): void {
    if (typeof requestAnimationFrame === 'undefined') return;
    const metas = document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]');
    if (!metas.length) return;
    requestAnimationFrame(() => {
      for (const meta of metas) {
        if (meta.dataset.ranOriginalContent === undefined) {
          meta.dataset.ranOriginalContent = meta.getAttribute('content') || '';
        }
        if (choice === 'system') {
          meta.setAttribute('content', meta.dataset.ranOriginalContent);
        } else {
          const bg =
            getComputedStyle(document.documentElement).getPropertyValue('--ran-color-bg').trim() ||
            getComputedStyle(document.body).backgroundColor;
          meta.setAttribute('content', bg);
        }
      }
    });
  }

  _handleSelectChange = (event: Event): void => {
    const detail = (event as CustomEvent<{ value?: string }>).detail;
    const choice = (detail?.value || this._select.value) as RanThemeName;
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

defineSSR('r-theme-switch', ThemeSwitch as unknown as new () => HTMLElement);
export default ThemeSwitch;
