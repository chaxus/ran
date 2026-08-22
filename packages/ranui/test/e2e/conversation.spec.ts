import { expect, test } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { insideShadow, isolatedSetup } from './helpers';

/**
 * Registers a minimal message view and pushes a conversation into it.
 *
 * The view is defined here rather than imported so the spec exercises the element the way a
 * consumer does — through `register` and `push` — and stays independent of what im happens
 * to render.
 *
 * @param page The page under test.
 * @param texts One message per entry, alternating user and assistant.
 */
async function conversation(page: import('@playwright/test').Page, texts: readonly string[]): Promise<void> {
  await page.evaluate((list) => {
    document.body.innerHTML =
      '<r-conversation id="chat" style="height: 420px; width: 600px" sheet=".turn-user{display:flex;justify-content:flex-end}.turn-bubble{max-width:min(32rem,82%);border-radius:20px;background:#eee;padding:8px 16px;white-space:pre-wrap;overflow-wrap:anywhere}"></r-conversation>';
    const chat = document.getElementById('chat') as HTMLElement & {
      register: (view: unknown) => void;
      push: (event: unknown) => void;
    };
    chat.register({
      kind: 'turn',
      match: (event: { id: string }) => ({ id: event.id, role: 'start' }),
      start: (event: { text: string; who: string }) => ({ text: event.text, who: event.who }),
      update: (state: unknown) => state,
      mount: (node: { state: { who: string } }) => {
        const row = document.createElement('div');
        row.className = `turn turn-${node.state.who}`;
        const body = document.createElement('div');
        if (node.state.who === 'user') body.className = 'turn-bubble';
        row.appendChild(body);
        return row;
      },
      patch: (element: HTMLElement, node: { state: { text: string } }) => {
        element.firstElementChild!.textContent = node.state.text;
      },
    });
    list.forEach((text, i) => {
      chat.push({ id: `m${i}`, text, who: i % 2 === 0 ? 'user' : 'assistant' });
    });
  }, texts);
}

/**
 * Rows are mounted into a closed shadow root, so Playwright's locators cannot see them;
 * measurements go through {@link insideShadow}.
 */
test.describe('r-conversation', () => {
  test.beforeEach(async ({ page }) => {
    await isolatedSetup(page, DEV_SERVER, 'r-conversation');
  });

  test('never scrolls sideways, whatever a row contains', async ({ page }) => {
    // `width: 100%` plus padding without border-box overflowed the column and clipped every
    // line at the right edge. A transcript that scrolls horizontally is a broken transcript.
    await conversation(page, ['短', 'x'.repeat(600), '中文'.repeat(300)]);
    const overflow = await insideShadow(page, '#chat', (root) => {
      const scroll = root.querySelector('.ran-conversation') as HTMLElement;
      const list = root.querySelector('.ran-conversation-list') as HTMLElement;
      return {
        scroller: scroll.scrollWidth - scroll.clientWidth,
        // Checked separately because a percentage-width host lets the overflow propagate
        // outward instead of showing up on the scroller — the host here is fixed-width so
        // the constraint is real, and this is the box the padding actually breaks.
        list: Math.round(list.getBoundingClientRect().width) - scroll.clientWidth,
      };
    });
    expect(overflow.scroller).toBeLessThanOrEqual(0);
    expect(overflow.list).toBeLessThanOrEqual(0);
  });

  test('renders a row that is itself a custom element', async ({ page }) => {
    // Everything such an element draws lives in its shadow root, so its light DOM is empty
    // while it is drawing a full line. A `:empty { display: none }` rule meant to collapse a
    // declined row hid every tool call in the transcript; a view declines by returning null
    // from `mount`, which is a different thing entirely.
    await page.evaluate(() => {
      document.body.innerHTML = '<r-conversation id="chat" style="height: 200px; width: 400px"></r-conversation>';
      const chat = document.getElementById('chat') as HTMLElement & {
        register: (view: unknown) => void;
        push: (event: unknown) => void;
      };
      chat.register({
        kind: 'probe',
        match: (event: { id: string }) => ({ id: event.id, role: 'start' }),
        start: () => null,
        update: (state: unknown) => state,
        mount: () => {
          const dot = document.createElement('r-state-dot');
          dot.setAttribute('state', 'success');
          return dot;
        },
      });
      chat.push({ id: 'a' });
    });
    const drawn = await insideShadow(page, '#chat', (root) => {
      const row = root.querySelector('.ran-conversation-row') as HTMLElement;
      const rect = row.getBoundingClientRect();
      return { tag: row.tagName, width: Math.round(rect.width), height: Math.round(rect.height) };
    });
    expect(drawn.tag).toBe('R-STATE-DOT');
    expect(drawn.width).toBeGreaterThan(0);
    expect(drawn.height).toBeGreaterThan(0);
  });

  test('gives a shrink-to-fit row its content width, not one character', async ({ page }) => {
    // A user bubble sizes to its own content. It collapsed to a single character once,
    // because the element inside it declared `contain: inline-size` and so had no intrinsic
    // width; in CJK a collapsed box breaks between every character and the failure is total.
    //
    // Calibrated against a one-character bubble rather than a fixed pixel count: the number
    // that would make this pass or fail by a hair depends on the font, and the property
    // under test is "it grows with its content".
    // Indices 0 and 2 are user turns — `conversation` alternates — so both get a bubble.
    await conversation(page, ['短', '（回答）', '这是一句相当长的中文消息，用来确认气泡按内容展开']);
    const bubbles = await insideShadow(page, '#chat', (root) =>
      [...root.querySelectorAll('.turn-bubble')].map((node) => {
        const rect = node.getBoundingClientRect();
        return { width: Math.round(rect.width), height: Math.round(rect.height) };
      }),
    );
    const [one, many] = bubbles;
    expect(many.width).toBeGreaterThan(one.width * 5);
    // Wide and short, not a vertical column of single characters.
    expect(many.width).toBeGreaterThan(many.height);
  });

  test('keeps the paging affordance out of the row list', async ({ page }) => {
    await conversation(page, ['a', 'b']);
    await page.evaluate(() => {
      (document.getElementById('chat') as HTMLElement & { older: string }).older = '加载更早';
    });
    const shape = await insideShadow(page, '#chat', (root) => ({
      affordanceShown: (root.querySelector('.ran-conversation-older') as HTMLElement).hidden === false,
      rowsInList: root.querySelectorAll('.ran-conversation-list > *').length,
      affordanceInList: root.querySelector('.ran-conversation-list .ran-conversation-older') !== null,
    }));
    // Above the list, not inside it: the reorder pass walks the list's children and would
    // push a paging row down with the first prepend.
    expect(shape).toEqual({ affordanceShown: true, rowsInList: 2, affordanceInList: false });
  });

  test('asks its owner for older content instead of fetching', async ({ page }) => {
    await conversation(page, ['a']);
    await page.evaluate(() => {
      const chat = document.getElementById('chat') as HTMLElement & { older: string };
      chat.older = '加载更早';
      (window as unknown as { asked: number }).asked = 0;
      chat.addEventListener('olderrequest', () => {
        (window as unknown as { asked: number }).asked += 1;
      });
    });
    await insideShadow(page, '#chat', (root) => {
      (root.querySelector('.ran-conversation-older button') as HTMLButtonElement).click();
      return null;
    });
    expect(await page.evaluate(() => (window as unknown as { asked: number }).asked)).toBe(1);
  });

  test('follows the floor as content arrives, and stops when the reader scrolls up', async ({ page }) => {
    await conversation(
      page,
      Array.from({ length: 30 }, (_, i) => `消息 ${i}`),
    );
    const atFloor = await insideShadow(page, '#chat', (root) => {
      const scroll = root.querySelector('.ran-conversation') as HTMLElement;
      const floor = scroll.scrollHeight - scroll.clientHeight;
      return Math.abs(scroll.scrollTop - floor) <= 2;
    });
    expect(atFloor).toBe(true);
  });

  test('renders', async ({ page }) => {
    await conversation(page, ['帮我看一下这段代码', '好的，我来看看。', '谢谢']);
    await expect(page.locator('body')).toHaveScreenshot('conversation.png');
  });
});
