import home from '@/assets/icons/home.svg?raw';
import setting from '@/assets/icons/setting.svg?raw';
import loading from '@/assets/icons/loading.svg?raw';
import lock from '@/assets/icons/lock.svg?raw';
import search from '@/assets/icons/search.svg?raw';
import github from '@/assets/icons/github.svg?raw';
import issue from '@/assets/icons/issue.svg?raw';
import { registerIcons } from '@/components/icon/index';
import message from '@/components/message';
import { getTheme, initTheme, setTheme } from '@/utils/theme';
import { applyLanguage, getLang, setLang } from './i18n';
import type { Lang } from './i18n';
import '../style';
import '../index';

registerIcons({ home, setting, loading, lock, search, github, issue });
(window as unknown as { message: typeof message }).message = message;

initTheme();

// ── Light / dark toggle ───────────────────────────────────────────────
const currentTheme = (): 'light' | 'dark' => (getTheme() === 'dark' ? 'dark' : 'light');

const syncToggle = (): void => {
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = currentTheme() === 'dark' ? '☀  Light' : '☾  Dark';
};

document.getElementById('theme-toggle')?.addEventListener('click', () => {
  setTheme(currentTheme() === 'dark' ? 'light' : 'dark');
  syncToggle();
});
syncToggle();

// ── Language switch via <r-select> ─────────────────────────────────────
type DemoSelect = HTMLElement & {
  selectOptionElement?: (el: Element | null, dispatch?: boolean) => void;
};

const lang: Lang = getLang();
applyLanguage(lang);

const langSelect = document.getElementById('lang-select') as DemoSelect | null;
if (langSelect) {
  // Reflect the active locale in the select without dispatching a change.
  const active = Array.from(langSelect.querySelectorAll('r-option')).find((o) => o.getAttribute('value') === lang);
  langSelect.setAttribute('defaultValue', lang);
  langSelect.setAttribute('value', lang);
  langSelect.selectOptionElement?.(active ?? null, false);

  langSelect.addEventListener('change', (e: Event) => {
    const value = (e as CustomEvent<{ value: string }>).detail.value as Lang;
    setLang(value);
    applyLanguage(value);
  });
}

// ── Color palette swatches (read straight from the CSS custom properties) ──
const SCALES: Record<string, number[]> = {
  gray: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
  blue: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
  red: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
  amber: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
  green: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
};

const palette = document.getElementById('palette');
if (palette) {
  for (const [name, steps] of Object.entries(SCALES)) {
    const row = document.createElement('div');
    row.className = 'swatch-row';

    const label = document.createElement('div');
    label.className = 'swatch-label';
    label.textContent = name;
    row.appendChild(label);

    const track = document.createElement('div');
    track.className = 'swatch-track';
    for (const step of steps) {
      const chip = document.createElement('div');
      chip.className = 'swatch';
      chip.style.background = `var(--ran-${name}-${step})`;
      chip.title = `--ran-${name}-${step}`;
      const tag = document.createElement('span');
      tag.textContent = String(step);
      chip.appendChild(tag);
      track.appendChild(chip);
    }
    row.appendChild(track);
    palette.appendChild(row);
  }
}

// ── Radar demo data ───────────────────────────────────────────────────
const radar = document.querySelector('r-radar') as (HTMLElement & { abilitys: string }) | null;
if (radar) {
  radar.abilitys = JSON.stringify([
    { abilityName: 'Speed', scoreRate: 0.9 },
    { abilityName: 'Bundle', scoreRate: 0.75 },
    { abilityName: 'SSR', scoreRate: 0.85 },
    { abilityName: 'A11y', scoreRate: 0.7 },
    { abilityName: 'Theming', scoreRate: 0.95 },
    { abilityName: 'DX', scoreRate: 0.8 },
  ]);
}

// ── Modal open / close wiring ─────────────────────────────────────────
const modal = document.getElementById('demo-modal') as (HTMLElement & { open: boolean }) | null;
document.getElementById('open-modal')?.addEventListener('click', () => {
  if (modal) modal.open = true;
});
