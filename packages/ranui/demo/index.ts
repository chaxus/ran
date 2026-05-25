import arrowDown from '@/assets/icons/arrow-down.svg?raw';
import home from '@/assets/icons/home.svg?raw';
import loading from '@/assets/icons/loading.svg?raw';
import lock from '@/assets/icons/lock.svg?raw';
import setting from '@/assets/icons/setting.svg?raw';
import { registerIcons } from '@/components/icon/index';
import { initTheme, setTheme, setThemePack } from '@/utils/theme';
import type { RanThemeName, RanThemePackName } from '@/utils/theme';
import '../theme-packs/pixel-retro';
import '../theme-packs/windows-98';
import '../theme-packs/windows-xp';
import '../theme-packs/system-6';
import '../theme-packs/wired';
import '../theme-packs/paper';
import '../theme-packs/neo-brutalism';
import '../theme-packs/transitions';

initTheme();

registerIcons({
  'arrow-down': arrowDown,
  home,
  loading,
  lock,
  setting,
});

// Register icons first, then bootstrap all components/examples.
import('../index').then(() => {
  const themeSelect = document.getElementById('theme-select') as HTMLElement & { selectOptionElement?: (el: Element | null, dispatch?: boolean) => void };
  const packSelect = document.getElementById('pack-select') as HTMLElement & { selectOptionElement?: (el: Element | null, dispatch?: boolean) => void };

  themeSelect?.addEventListener('change', (e: Event) => {
    const value = (e as CustomEvent<{ value: string }>).detail.value as RanThemeName;
    setTheme(value === 'dark' ? 'dark' : 'light');
  });

  packSelect?.addEventListener('change', (e: Event) => {
    const value = (e as CustomEvent<{ value: string }>).detail.value;
    setThemePack((value === 'default' ? 'default' : value) as RanThemePackName);
  });
});
