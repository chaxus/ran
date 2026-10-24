// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

let loadScript: typeof import('@/utils/script').loadScript;

beforeEach(async () => {
  vi.resetModules();
  ({ loadScript } = await import('@/utils/script'));
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('loadScript', () => {
  it('inserts identical inline source only once', async () => {
    const source = 'window.loaded = true;';
    await loadScript({ type: 'content', content: source });
    await loadScript({ type: 'content', content: source });

    expect(document.scripts).toHaveLength(1);
    expect(document.scripts[0].textContent).toBe(source);
  });

  it('keeps distinct line endings in separate script sources', async () => {
    const crlf = 'window.first = 1;\r\nwindow.second = 2;';
    const lf = 'window.first = 1;\nwindow.second = 2;';
    await loadScript({ type: 'content', content: crlf });
    await loadScript({ type: 'content', content: lf });

    expect(Array.from(document.scripts, (script) => script.textContent)).toEqual([crlf, lf]);
  });

  it('loads a URL even when identical text was already injected inline', async () => {
    const content = '//shared.js';
    await loadScript({ type: 'content', content });
    const pending = loadScript({ type: 'url', content });

    expect(document.scripts).toHaveLength(2);
    expect(document.scripts[0].textContent).toBe(content);
    expect(document.scripts[1].getAttribute('src')).toBe(content);
    document.scripts[1].dispatchEvent(new Event('load'));
    await expect(pending).resolves.toEqual({ success: true });

    await loadScript({ type: 'url', content });
    expect(document.scripts).toHaveLength(2);
  });

  it('shares one tag between calls made while the URL is still loading', async () => {
    const url = 'https://cdn.example.test/sdk.js';
    const first = loadScript({ type: 'url', content: url });
    const second = loadScript({ type: 'url', content: url });

    expect(document.scripts).toHaveLength(1);
    document.scripts[0].dispatchEvent(new Event('load'));
    await expect(Promise.all([first, second])).resolves.toEqual([{ success: true }, { success: true }]);
  });

  it('removes a failed tag so a later call retries the URL', async () => {
    const url = 'https://cdn.example.test/flaky.js';
    const failed = loadScript({ type: 'url', content: url });
    document.scripts[0].dispatchEvent(new Event('error'));
    await expect(failed).rejects.toMatchObject({ success: false });
    expect(document.scripts).toHaveLength(0);

    const retry = loadScript({ type: 'url', content: url });
    expect(document.scripts).toHaveLength(1);
    document.scripts[0].dispatchEvent(new Event('load'));
    await expect(retry).resolves.toEqual({ success: true });
  });
});
