import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { escapeHtml, loadScript } from 'ranuts/utils';
import { falseList, getMimeTypeFromExtension, isDisabled } from '@/utils/dom';

describe('utils/dom', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('treats only disabled values outside falseList as disabled', () => {
    const el = document.createElement('button');
    expect(falseList).toContain(false);
    expect(isDisabled(el)).toBe(false);

    el.setAttribute('disabled', '');
    expect(isDisabled(el)).toBe(true);

    el.setAttribute('disabled', 'false');
    expect(isDisabled(el)).toBe(false);
  });

  it('escapes unsafe HTML and stringifies non-string values', () => {
    expect(escapeHtml(`<img src="x" onerror='alert(1)'>&`)).toBe(
      '&lt;img src=&quot;x&quot; onerror=&#39;alert(1)&#39;&gt;&amp;',
    );
    expect(escapeHtml(null)).toBe('null');
    expect(escapeHtml(123)).toBe('123');
  });

  it('returns known MIME types and falls back for unknown extensions', () => {
    expect(getMimeTypeFromExtension('report.PDF')).toBe('application/pdf');
    expect(getMimeTypeFromExtension('avatar.jpeg')).toBe('image/jpeg');
    expect(getMimeTypeFromExtension('archive.unknown')).toBe('application/octet-stream');
    expect(getMimeTypeFromExtension('README')).toBe('application/octet-stream');
  });

  it('loads content scripts and reuses already loaded content', async () => {
    const originalAppend = document.body.append;
    const appendSpy = vi.spyOn(document.body, 'append').mockImplementation((node: Node | string) => {
      originalAppend.call(document.body, node);
      if (node instanceof HTMLScriptElement) node.onload?.(new Event('load'));
    });

    await expect(loadScript({ type: 'content', content: 'window.__ranuiLoaded = true;' })).resolves.toEqual({
      success: true,
    });
    await expect(loadScript({ type: 'content', content: 'window.__ranuiLoaded = true;' })).resolves.toEqual({
      success: true,
    });

    expect(appendSpy).toHaveBeenCalledTimes(1);
    expect(document.body.querySelector('script')?.textContent).toBe('window.__ranuiLoaded = true;');
  });

  it('rejects when a script fails to load', async () => {
    const error = new Event('error');
    vi.spyOn(document.body, 'append').mockImplementation((node: Node | string) => {
      if (node instanceof HTMLScriptElement) node.onerror?.(error);
    });

    await expect(loadScript({ type: 'url', content: '/missing.js' })).rejects.toEqual({
      success: false,
      error,
    });
  });
});
