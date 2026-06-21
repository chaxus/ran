import arrowDown from '@/assets/icons/arrow-down.svg?raw';
import home from '@/assets/icons/home.svg?raw';
import loading from '@/assets/icons/loading.svg?raw';
import lock from '@/assets/icons/lock.svg?raw';
import setting from '@/assets/icons/setting.svg?raw';
import { registerIcons } from '@/components/icon/index';
import { initTheme, setTheme, setThemePack } from '@/utils/theme';
import type { RanThemeName, RanThemePackName } from '@/utils/theme';
import { getLang, applyLanguage } from './i18n';
import type { Lang } from './i18n';
import '../components/router';
import '../components/route';
import '../components/link';
import '../style';
import '../theme-packs/pixel-retro';
import '../theme-packs/windows-98';
import '../theme-packs/windows-xp';
import '../theme-packs/system-6';
import '../theme-packs/wired';
import '../theme-packs/paper';
import '../theme-packs/neo-brutalism';
import '../theme-packs/transitions';
import '../theme-packs/dark-overrides';
import { syncWiredBordersForThemePack } from '../theme-packs/wired-overlay';

const PACK_NAMES: RanThemePackName[] = [
  'default',
  'pixel-retro',
  'windows-98',
  'windows-xp',
  'system-6',
  'wired',
  'paper',
  'neo-brutalism',
];

type DemoSelectElement = HTMLElement & {
  selectOptionElement?: (el: Element | null, dispatch?: boolean) => void;
};

const getStoredTheme = (): RanThemeName => {
  const value = typeof localStorage === 'undefined' ? '' : localStorage.getItem('ran-theme');
  return value === 'dark' || value === 'system' ? value : 'light';
};

const getStoredPack = (): RanThemePackName => {
  const value = typeof localStorage === 'undefined' ? '' : localStorage.getItem('ran-theme-pack');
  return PACK_NAMES.includes(value as RanThemePackName) ? (value as RanThemePackName) : 'default';
};

const selectStoredOption = (select: DemoSelectElement | null, value: string): void => {
  if (!select) return;
  const option = Array.from(select.querySelectorAll('r-option')).find((item) => item.getAttribute('value') === value);
  select.setAttribute('defaultValue', value);
  select.setAttribute('value', value);
  select.selectOptionElement?.(option || null, false);
};

const syncThemeControls = (themeSelect: DemoSelectElement | null, packSelect: DemoSelectElement | null): void => {
  selectStoredOption(themeSelect, getStoredTheme());
  selectStoredOption(packSelect, getStoredPack());
};

const setActivePackButton = (value: RanThemePackName): void => {
  document.querySelectorAll<HTMLElement>('.theme-pack-button').forEach((button) => {
    const isActive = button.dataset.packChoice === value;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
};

const bindThemePackButtons = (packSelect: DemoSelectElement | null): void => {
  setActivePackButton(getStoredPack());
  document.querySelectorAll<HTMLElement>('.theme-pack-button').forEach((button) => {
    button.addEventListener('click', () => {
      const value = button.dataset.packChoice as RanThemePackName | undefined;
      if (!value || !PACK_NAMES.includes(value)) return;
      setThemePack(value);
      selectStoredOption(packSelect, value);
      setActivePackButton(value);
      syncWiredBordersForThemePack();
    });
  });
};

initTheme();

// SPA navigation: intercept clicks on elements with data-spa-link attribute
document.addEventListener('click', (e: Event) => {
  const a = (e.target as HTMLElement).closest('[data-spa-link]');
  if (!a) return;
  const href = (a as HTMLElement).getAttribute('href');
  if (!href) return;
  const router = document.querySelector('r-router') as (HTMLElement & { navigate: (path: string) => void }) | null;
  if (!router?.navigate) return;
  e.preventDefault();
  router.navigate(href);
  window.scrollTo({ top: 0, behavior: 'instant' });
});

// Activate wired borders if wired pack is already stored from a previous visit
if (typeof localStorage !== 'undefined' && localStorage.getItem('ran-theme-pack') === 'wired') {
  syncWiredBordersForThemePack();
}

registerIcons({
  'arrow-down': arrowDown,
  home,
  loading,
  lock,
  setting,
});

const updateThemeToggleIcon = (theme: RanThemeName): void => {
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
};

// Theme toggle button (moon/sun icon in nav)
const themeToggle = document.getElementById('theme-toggle');
themeToggle?.addEventListener('click', () => {
  const next: RanThemeName = getStoredTheme() === 'dark' ? 'light' : 'dark';
  setTheme(next);
  updateThemeToggleIcon(next);
});

// Register icons first, then bootstrap all components/examples.
import('../index').then(() => {
  // No nav selects for theme/pack — controls live in hero pack pills
  syncThemeControls(null, null);
  bindThemePackButtons(null);

  updateThemeToggleIcon(getStoredTheme());

  // ── i18n ──────────────────────────────────────────────────────────
  const langSelect = document.getElementById('lang-select') as DemoSelectElement | null;
  const initLang = getLang();
  selectStoredOption(langSelect, initLang);
  applyLanguage(initLang);

  langSelect?.addEventListener('change', (e: Event) => {
    const value = (e as CustomEvent<{ value: string }>).detail.value as Lang;
    applyLanguage(value);
  });
});
