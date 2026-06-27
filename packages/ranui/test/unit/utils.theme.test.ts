import { beforeEach, describe, expect, it } from 'vitest';
import { clearThemeToken, getTheme, initTheme, setTheme, setThemeToken, setThemeTokens } from '@/utils/theme';

describe('utils/theme', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('theme');
    document.documentElement.removeAttribute('data-ran-theme');
    document.documentElement.removeAttribute('style');
    localStorage.clear();
  });

  it('setTheme writes both the namespaced and legacy theme attributes', () => {
    setTheme('dark');

    expect(document.documentElement.getAttribute('data-ran-theme')).toBe('dark');
    expect(document.documentElement.getAttribute('theme')).toBe('dark');
  });

  it('getTheme prefers data-ran-theme over the legacy theme attribute', () => {
    document.documentElement.setAttribute('theme', 'light');
    document.documentElement.setAttribute('data-ran-theme', 'dark');

    expect(getTheme()).toBe('dark');
  });

  it('setTheme can target a custom element', () => {
    const host = document.createElement('section');

    setTheme('light', host);

    expect(host.getAttribute('data-ran-theme')).toBe('light');
    expect(host.getAttribute('theme')).toBe('light');
    expect(getTheme(host)).toBe('light');
  });

  it('setThemeToken writes one CSS custom property', () => {
    setThemeToken('--ran-color-primary', '#6c47ff');

    expect(document.documentElement.style.getPropertyValue('--ran-color-primary')).toBe('#6c47ff');
  });

  it('setThemeTokens writes multiple tokens and removes nullish values', () => {
    document.documentElement.style.setProperty('--ran-radius-md', '6px');

    setThemeTokens({
      '--ran-color-primary': '#1677ff',
      '--ran-font-size': 14,
      '--ran-radius-md': null,
      '--ran-unused': undefined,
    });

    expect(document.documentElement.style.getPropertyValue('--ran-color-primary')).toBe('#1677ff');
    expect(document.documentElement.style.getPropertyValue('--ran-font-size')).toBe('14');
    expect(document.documentElement.style.getPropertyValue('--ran-radius-md')).toBe('');
    expect(document.documentElement.style.getPropertyValue('--ran-unused')).toBe('');
  });

  it('clearThemeToken removes a CSS custom property', () => {
    setThemeToken('--ran-color-primary', '#1677ff');

    clearThemeToken('--ran-color-primary');

    expect(document.documentElement.style.getPropertyValue('--ran-color-primary')).toBe('');
  });

  it('setTheme persists the choice to localStorage', () => {
    setTheme('dark');

    expect(localStorage.getItem('ran-theme')).toBe('dark');
  });

  it('setTheme light persists to localStorage', () => {
    setTheme('light');

    expect(localStorage.getItem('ran-theme')).toBe('light');
  });

  it('setTheme system writes a concrete dark or light attribute', () => {
    setTheme('system');

    const attr = document.documentElement.getAttribute('data-ran-theme');
    expect(['light', 'dark']).toContain(attr);
    expect(localStorage.getItem('ran-theme')).toBe('system');
  });

  it('initTheme restores theme from localStorage', () => {
    localStorage.setItem('ran-theme', 'dark');

    initTheme();

    expect(document.documentElement.getAttribute('data-ran-theme')).toBe('dark');
  });

  it('initTheme is a no-op when localStorage is empty', () => {
    initTheme();

    expect(document.documentElement.hasAttribute('data-ran-theme')).toBe(false);
  });
});
