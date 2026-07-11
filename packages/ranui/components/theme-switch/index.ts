import themeSwitchCss from './index.less?inline';
import { EventManager } from '@/utils/builder';
import { RanElement } from '@/utils/index';
import { ensureShadowRoot, ensureShadowElement, getStringAttribute, setStringAttribute } from '@/utils/component';
import { syncSheetAttribute } from '@/utils/component';
import { defineSSR } from '@/utils/ssr-registry';
import { getTheme, setTheme } from '@/utils/theme';
import type { RanThemeName } from '@/utils/theme';

const CHOICES: RanThemeName[] = ['system', 'light', 'dark'];

/* 16px stroke glyphs (currentColor): monitor / sun / moon. */
const ICONS: Record<RanThemeName, string> = {
  system:
    '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="1.5" y="2.5" width="13" height="9" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M5.5 14h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  light:
    '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="3" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 1v1.8M8 13.2V15M15 8h-1.8M2.8 8H1m11.4-4.4-1.3 1.3M4.9 11.1l-1.3 1.3m9.8 0-1.3-1.3M4.9 4.9 3.6 3.6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  dark: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M13.5 9.5A6 6 0 0 1 6.5 2.5a6 6 0 1 0 7 7z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
};

const SYNC_EVENT = 'ran-theme-switch-sync';

/**
 * `<r-theme-switch>` — a three-state (system / light / dark) segmented control
 * wired to ranui's theme API (`setTheme`/`getTheme`, localStorage `ran-theme`).
 * Multiple instances on one page stay in sync; `label-*` attributes localize
 * the aria-labels. Emits a composed `change` event with `{ theme }`.
 */
export class ThemeSwitch extends RanElement {
  static get observedAttributes(): string[] {
    return ['label-system', 'label-light', 'label-dark', 'sheet'];
  }

  _events = new EventManager();
  _shadowDom: ShadowRoot;
  _group: HTMLDivElement;

  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this, themeSwitchCss);
    this._group = ensureShadowElement(this._shadowDom, '.ran-theme-switch', () => {
      const group = document.createElement('div');
      group.className = 'ran-theme-switch';
      group.setAttribute('part', 'switch');
      group.setAttribute('role', 'group');
      for (const choice of CHOICES) {
        const button = document.createElement('button');
        button.type = 'button';
        button.dataset.choice = choice;
        button.setAttribute('part', `button ${choice}`);
        button.setAttribute('aria-pressed', 'false');
        button.innerHTML = ICONS[choice];
        group.appendChild(button);
      }
      return group;
    }) as HTMLDivElement;
  }

  get sheet(): string {
    return getStringAttribute(this, 'sheet');
  }
  set sheet(v: string) {
    setStringAttribute(this, 'sheet', v);
  }

  /** Current selection; falls back to 'system' when nothing is forced. */
  get value(): RanThemeName {
    return getTheme() || 'system';
  }
  set value(v: RanThemeName) {
    if (CHOICES.includes(v)) this._select(v);
  }

  _label(choice: RanThemeName): string {
    const fallback = { system: 'System theme', light: 'Light theme', dark: 'Dark theme' }[choice];
    return this.getAttribute(`label-${choice}`) || fallback;
  }

  _syncLabels(): void {
    this._group.setAttribute('aria-label', this.getAttribute('label') || 'Theme');
    for (const button of this._group.querySelectorAll<HTMLButtonElement>('button')) {
      button.setAttribute('aria-label', this._label(button.dataset.choice as RanThemeName));
    }
  }

  _reflect(): void {
    const current = this.value;
    for (const button of this._group.querySelectorAll<HTMLButtonElement>('button')) {
      button.setAttribute('aria-pressed', button.dataset.choice === current ? 'true' : 'false');
    }
  }

  _select(choice: RanThemeName): void {
    setTheme(choice);
    this._reflect();
    this._syncMeta(choice);
    // keep sibling instances (e.g. header + footer) in step
    document.dispatchEvent(new CustomEvent(SYNC_EVENT));
    this.dispatchEvent(new CustomEvent('change', { detail: { theme: choice }, bubbles: true, composed: true }));
  }

  /** Keep <meta name="theme-color"> (browser/PWA chrome) in step. Forced
   * themes get the page's resolved background (no hardcoded colors); 'system'
   * restores each meta's original — possibly media-qualified — content. */
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
          // token layer first (body backgrounds are often transparent)
          const bg =
            getComputedStyle(document.documentElement).getPropertyValue('--ran-color-bg').trim() ||
            getComputedStyle(document.body).backgroundColor;
          meta.setAttribute('content', bg);
        }
      }
    });
  }

  _handleClick = (event: MouseEvent): void => {
    const button = (event.target as HTMLElement).closest?.('button');
    const choice = button?.dataset.choice as RanThemeName | undefined;
    if (choice && CHOICES.includes(choice)) this._select(choice);
  };

  _handleSync = (): void => this._reflect();

  handlerExternalCss = (): void => {
    syncSheetAttribute(this, this._shadowDom, 'sheet', null, this.sheet);
  };

  connectedCallback(): void {
    this.handlerExternalCss();
    this._syncLabels();
    this._reflect();
    this._events.on(this._group, 'click', this._handleClick as EventListener);
    document.addEventListener(SYNC_EVENT, this._handleSync);
    // cross-tab sync: another tab flipping the theme updates this control too
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
