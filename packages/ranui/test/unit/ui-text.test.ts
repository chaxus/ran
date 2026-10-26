import { afterEach, describe, expect, it } from 'vitest';
import { createI18n, useI18n } from '@/utils/i18n';
import { defineText } from '@/utils/ui-text';
import '@/components/loading';
import '@/components/modal';
import '@/components/player';
import '@/components/token-meter';
import '@/components/math';
import '@/components/mermaid';
import '@/components/theme-switch';
import { describeMediaError } from '@/components/player/core/error';

const shadow = (el: Element): ShadowRoot => (el as unknown as { _shadowDom: ShadowRoot })._shadowDom;
const names = (el: Element, selector: string): (string | null)[] =>
  [...shadow(el).querySelectorAll(selector)].map((node) => node.getAttribute('aria-label'));

const closeName = (modal: HTMLElement) =>
  (modal as unknown as { _closeBtn: HTMLButtonElement })._closeBtn.getAttribute('aria-label');

describe('built-in component text', () => {
  afterEach(() => {
    useI18n()?.destroy();
    document.documentElement.removeAttribute('lang');
    document.body.innerHTML = '';
  });

  it('is English when nothing says otherwise', () => {
    const loading = document.createElement('r-loading');
    document.body.append(loading);
    expect(loading.getAttribute('aria-label')).toBe('Loading');
  });

  it('refuses a table with a language missing a key', () => {
    const en = { 'demo.label': 'Label' };
    // @ts-expect-error zh lacks `demo.label`, so the table does not type-check.
    const table = defineText({ en, zh: {}, ja: en, ko: en, es: en, pt: en, de: en, fa: en });
    expect(table.en['demo.label']).toBe('Label');
  });

  it("follows the page's language when the app runs no i18n", () => {
    document.documentElement.lang = 'zh-CN';
    const loading = document.createElement('r-loading');
    const modal = document.createElement('r-modal');
    document.body.append(loading, modal);
    expect(loading.getAttribute('aria-label')).toBe('加载中');
    expect(closeName(modal)).toBe('关闭对话框');
  });

  it('never overrides an attribute the author set', () => {
    document.documentElement.lang = 'zh-CN';
    const loading = document.createElement('r-loading');
    loading.setAttribute('label', 'Saving');
    document.body.append(loading);
    expect(loading.getAttribute('aria-label')).toBe('Saving');
  });

  it('names the player controls and explains its errors in the page language', () => {
    document.documentElement.lang = 'zh-CN';
    const player = document.createElement('r-player');
    document.body.append(player);
    const labelled = names(player, '[role="slider"], [role="button"]');
    expect(labelled).toEqual(expect.arrayContaining(['播放进度', '播放', '画中画', '投屏', '全屏']));
    expect((player as unknown as { labelError: string }).labelError).toBe('播放失败');
    expect(describeMediaError({ code: 2 } as MediaError, player)).toBe('加载视频时网络出错。');
  });

  it("keeps the player's label-error attribute over the built-in text", () => {
    document.documentElement.lang = 'zh-CN';
    const player = document.createElement('r-player');
    player.setAttribute('label-error', 'Video unavailable');
    document.body.append(player);
    expect((player as unknown as { labelError: string }).labelError).toBe('Video unavailable');
  });

  it('labels the token meter in the page language', () => {
    document.documentElement.lang = 'zh-CN';
    const meter = document.createElement('r-token-meter');
    meter.setAttribute('limit', '1000');
    meter.setAttribute('used', '950');
    document.body.append(meter);
    const internals = meter as unknown as { _text: HTMLElement; _flag: HTMLElement; _root: HTMLElement };
    expect(internals._text.textContent).toMatch(/^上下文 /);
    expect(internals._flag.textContent).toBe('接近上限');
    expect(internals._root.getAttribute('title')).toBe('上下文：950 / 1,000\n即将达到上限');
  });

  it('names the renderer toolbars in the page language', () => {
    document.documentElement.lang = 'zh-CN';
    const math = document.createElement('r-math');
    math.setAttribute('copy', '');
    math.setAttribute('download', '');
    const mermaid = document.createElement('r-mermaid');
    mermaid.setAttribute('copy', '');
    mermaid.setAttribute('fullscreen', '');
    document.body.append(math, mermaid);
    expect(names(math, 'button')).toEqual(['复制 LaTeX', '下载']);
    expect(names(mermaid, 'button')).toEqual(['复制源码', '全屏']);
  });

  it('names the theme switch in the page language, attributes still winning', () => {
    document.documentElement.lang = 'zh-CN';
    const toggle = document.createElement('r-theme-switch');
    toggle.setAttribute('label-dark', 'Night');
    document.body.append(toggle);
    expect(names(toggle, '[role="radiogroup"], [role="group"], button')).toEqual([
      '主题',
      '跟随系统',
      '浅色模式',
      'Night',
    ]);
  });

  it('keeps every converted component in English when the page is English', () => {
    document.documentElement.lang = 'en';
    const player = document.createElement('r-player');
    const meter = document.createElement('r-token-meter');
    const toggle = document.createElement('r-theme-switch');
    const math = document.createElement('r-math');
    math.setAttribute('copy', '');
    document.body.append(player, meter, toggle, math);
    expect(names(player, '.ran-player-controller-progress')).toEqual(['Seek']);
    expect((meter as unknown as { _text: HTMLElement })._text.textContent).toMatch(/^Context /);
    expect(names(toggle, 'button')).toEqual(['System theme', 'Light theme', 'Dark theme']);
    expect(names(math, 'button')).toEqual(['Copy LaTeX']);
    expect(describeMediaError(null, player)).toBe('An unknown playback error occurred.');
  });

  it('speaks English to a Traditional Chinese reader rather than Simplified', () => {
    document.documentElement.lang = 'zh-TW';
    const loading = document.createElement('r-loading');
    document.body.append(loading);
    expect(loading.getAttribute('aria-label')).toBe('Loading');
  });

  it('renames the play button when the player moves into another language', () => {
    const ja = document.createElement('div');
    ja.lang = 'ja';
    const zh = document.createElement('div');
    zh.lang = 'zh-CN';
    document.body.append(ja, zh);
    const player = document.createElement('r-player');
    ja.append(player);
    zh.append(player);
    expect(names(player, '[role="button"]')).toContain('播放');
    expect(names(player, '[role="button"]')).not.toContain('再生');
  });

  it('names the modal close button before the modal is connected', () => {
    document.documentElement.lang = 'zh-CN';
    expect(closeName(document.createElement('r-modal') as HTMLElement)).toBe('关闭对话框');
  });

  // Last: `destroy()` does not unregister the i18n singleton, so its locale outlives this test.
  it("uses the app's own ranui.* message before the built-in table", () => {
    document.documentElement.lang = 'zh-CN';
    createI18n({ messages: { zh: { 'ranui.loading.label': '正在获取发票' } }, fallbackLocale: 'zh' });
    useI18n()!.setLocale('zh');
    const loading = document.createElement('r-loading');
    document.body.append(loading);
    expect(loading.getAttribute('aria-label')).toBe('正在获取发票');
  });

  it('does not let an override written only for another locale replace the built-in text', () => {
    createI18n({ messages: { en: { 'ranui.loading.label': 'Fetching invoices' }, ja: {} }, fallbackLocale: 'en' });
    useI18n()!.setLocale('ja');
    const loading = document.createElement('r-loading');
    document.body.append(loading);
    expect(loading.getAttribute('aria-label')).toBe('読み込み中');
  });
});
