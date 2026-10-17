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
});
