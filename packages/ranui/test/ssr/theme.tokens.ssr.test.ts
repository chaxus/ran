import { describe, expect, it } from 'vitest';
import { getTheme, getThemePack, setTheme, setThemePack, setThemeTokens } from '@/utils/theme';

describe('theme utilities in SSR', () => {
  it('are safe when document is unavailable', () => {
    expect(() => setTheme('dark')).not.toThrow();
    expect(() => setThemePack('pixel-retro')).not.toThrow();
    expect(() => setThemeTokens({ '--ran-color-primary': '#1677ff' })).not.toThrow();
    expect(getTheme()).toBe('');
    expect(getThemePack()).toBe('');
  });
});
