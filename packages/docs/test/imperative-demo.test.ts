// @vitest-environment jsdom
import { expect, it, vi } from 'vitest';
import { mountComponents } from '../client/components';

vi.mock('ranui/message', () => {
  customElements.define('r-message', class extends HTMLElement {});
  (window as any).message = { info: () => {} };
  return {};
});

it('loads imperative Message only for a live handler, including an inserted demo', async () => {
  document.body.innerHTML = '<pre><code>&lt;button onclick="message.info(\'example\')"&gt;</code></pre>';
  const stop = mountComponents();
  try {
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(customElements.get('r-message')).toBeUndefined();
    document.body.insertAdjacentHTML('beforeend', '<button onclick="message.info(\'example\')">Show</button>');
    await vi.waitFor(() => expect(typeof (window as any).message?.info).toBe('function'));
  } finally {
    stop();
    document.body.replaceChildren();
  }
});
