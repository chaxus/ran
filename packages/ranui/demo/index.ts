import './register-icons'; // must run before any component module (see file)
import message from '@/components/message';
import { getTheme, initTheme, setTheme } from '@/utils/theme';
import { applyLanguage, getLang, setLang } from './i18n';
import type { Lang } from './i18n';
import '../style';
import '../index';

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

// ── Color state legend (Geist: each step maps to a fixed interface state) ──
const STATE_MAP: Array<[number, string]> = [
  [100, 'state.bg'],
  [200, 'state.bg-hover'],
  [300, 'state.bg-active'],
  [400, 'state.border'],
  [500, 'state.border-hover'],
  [600, 'state.border-active'],
  [700, 'state.solid'],
  [800, 'state.solid-hover'],
  [900, 'state.text-secondary'],
  [1000, 'state.text'],
];

const legend = document.getElementById('state-legend');
if (legend) {
  for (const [step, key] of STATE_MAP) {
    const item = document.createElement('div');
    item.className = 'state-item';

    const chip = document.createElement('div');
    chip.className = 'state-chip';
    chip.style.background = `var(--ran-gray-${step})`;

    const stepEl = document.createElement('span');
    stepEl.className = 'state-step';
    stepEl.textContent = String(step);

    const role = document.createElement('span');
    role.className = 'state-role';
    role.setAttribute('data-i18n', key);

    item.append(chip, stepEl, role);
    legend.appendChild(item);
  }
}

// ── Spacing scale (4px base; nine values) ─────────────────────────────
const SPACE_VALUES = [4, 8, 12, 16, 24, 32, 40, 64, 96];
const spaceScale = document.getElementById('space-scale');
if (spaceScale) {
  for (const v of SPACE_VALUES) {
    const item = document.createElement('div');
    item.className = 'space-item';

    const code = document.createElement('code');
    code.textContent = `${v}px`;

    const bar = document.createElement('div');
    bar.className = 'space-bar';
    bar.style.width = `${v}px`;

    item.append(code, bar);
    spaceScale.appendChild(item);
  }
}

// Re-translate any dynamically generated [data-i18n] nodes (state legend).
applyLanguage(getLang());

// ── Radar demo data ───────────────────────────────────────────────────
// The radar is canvas-based, so it must (re)draw while visible. We render it
// whenever the Components route becomes active (see routing wiring below).
const RADAR_DATA = JSON.stringify([
  { abilityName: 'Speed', scoreRate: 90 },
  { abilityName: 'Bundle', scoreRate: 75 },
  { abilityName: 'SSR', scoreRate: 85 },
  { abilityName: 'A11y', scoreRate: 70 },
  { abilityName: 'Theming', scoreRate: 95 },
  { abilityName: 'DX', scoreRate: 80 },
]);

const renderRadar = (): void => {
  const radar = document.querySelector('r-radar') as (HTMLElement & { abilitys: string }) | null;
  if (radar) radar.abilitys = RADAR_DATA;
};

// ── Modal open / close wiring ─────────────────────────────────────────
const modal = document.getElementById('demo-modal') as (HTMLElement & { open: boolean }) | null;
document.getElementById('open-modal')?.addEventListener('click', () => {
  if (modal) modal.open = true;
});

// ── Router chrome: link box model, active link, lazy radar render ───────
const LINK_SHEETS: Record<string, string> = {
  'route-link':
    'a{display:flex;align-items:center;padding:6px 12px;color:inherit;text-decoration:none;border-radius:inherit}',
  cta: 'a{display:flex;align-items:center;justify-content:center;gap:6px;width:100%;height:100%;padding:0 22px;line-height:1;box-sizing:border-box;color:inherit;text-decoration:none;border-radius:inherit}',
  'home-card':
    'a{display:flex;flex-direction:column;gap:8px;height:100%;padding:24px;color:inherit;text-decoration:none;border-radius:inherit}',
};
for (const [cls, sheet] of Object.entries(LINK_SHEETS)) {
  document.querySelectorAll(`r-link.${cls}`).forEach((el) => el.setAttribute('sheet', sheet));
}

const setActiveLink = (path: string): void => {
  document.querySelectorAll<HTMLElement>('r-link.route-link').forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === path);
  });
};

const onRoute = (path: string): void => {
  setActiveLink(path);
  if (path === '/components') requestAnimationFrame(renderRadar);
};

const router = document.querySelector('r-router');
router?.addEventListener('routechange', (e: Event) => {
  onRoute((e as CustomEvent<{ path: string }>).detail.path);
});

// Initial state (the router's first routechange fires before this listener binds).
onRoute(window.location.pathname || '/');
