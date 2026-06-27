import home from '@/assets/icons/home.svg?raw';
import setting from '@/assets/icons/setting.svg?raw';
import loading from '@/assets/icons/loading.svg?raw';
import lock from '@/assets/icons/lock.svg?raw';
import search from '@/assets/icons/search.svg?raw';
import { registerIcons } from '@/components/icon/index';
import message from '@/components/message';
import { getTheme, initTheme, setTheme } from '@/utils/theme';
import { applyLanguage, getLang, setLang } from './i18n';
import type { Lang } from './i18n';
import '../style';
import '../index';

registerIcons({ home, setting, loading, lock, search });
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

// ── Language switch (EN / 中文) ────────────────────────────────────────
let lang: Lang = getLang();

const syncLangToggle = (): void => {
  const btn = document.getElementById('lang-toggle');
  if (btn) btn.textContent = lang === 'zh' ? '中文' : 'EN';
};

applyLanguage(lang);
syncLangToggle();

document.getElementById('lang-toggle')?.addEventListener('click', () => {
  lang = lang === 'zh' ? 'en' : 'zh';
  setLang(lang);
  applyLanguage(lang);
  syncLangToggle();
});

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
