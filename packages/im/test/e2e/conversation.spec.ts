import { expect, test } from '@playwright/test';
import { freshApp, insideShadow, rows, send } from './helpers';

test.describe('a conversation, end to end', () => {
  test.beforeEach(async ({ page }) => {
    await freshApp(page);
  });

  test('says it is answering from the built-in sample', async ({ page }) => {
    // The notice is how someone knows they are not talking to a model before they type.
    await expect(page.locator('#notice')).toBeVisible();
  });

  test('streams an answer into the transcript', async ({ page }) => {
    await send(page, '你好');
    const drawn = await rows(page);
    expect(drawn.map((row) => row.kind)).toEqual(['turn', 'turn']);
    expect(drawn[0].text).toContain('你好');
    expect(drawn[1].text.length).toBeGreaterThan(10);
  });

  test('puts the question in a bubble and the answer in the flow', async ({ page }) => {
    // The whole visual language: a user turn is identified by its bubble and its side, an
    // assistant turn is the answer with nothing drawn around it.
    await send(page, '你好');
    const shape = await insideShadow(page, '#chat', (root) => {
      const [user, assistant] = [...root.querySelectorAll('.ran-conversation-row')];
      return {
        userHasBubble: user.querySelector('.turn-bubble') !== null,
        assistantHasBubble: assistant.querySelector('.turn-bubble') !== null,
        assistantHasMarkdown: assistant.querySelector('r-markdown') !== null,
      };
    });
    expect(shape).toEqual({ userHasBubble: true, assistantHasBubble: false, assistantHasMarkdown: true });
  });

  test('never scrolls sideways, at desktop or phone width', async ({ page }) => {
    await send(page, 'x'.repeat(300));
    for (const size of [
      { width: 1440, height: 900 },
      { width: 390, height: 780 },
    ]) {
      await page.setViewportSize(size);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `horizontal overflow at ${size.width}px`).toBeLessThanOrEqual(0);
    }
  });

  test('offers edit on what was asked and regenerate on what was answered', async ({ page }) => {
    await send(page, '你好');
    const actions = await insideShadow(page, '#chat', (root) =>
      [...root.querySelectorAll('.ran-conversation-row')].map((row) =>
        [...row.querySelectorAll('.turn-action')]
          .filter((button) => !(button as HTMLElement).hidden)
          .map((button) => (button as HTMLElement).dataset.action),
      ),
    );
    expect(actions).toEqual([['edit'], ['regenerate']]);
  });

  test('counts what the conversation carries and what it cost', async ({ page }) => {
    await send(page, '你好');
    const meter = await insideShadow(page, '#tokens', (root) =>
      (root.querySelector('.ran-token-meter-text')?.textContent ?? '').trim(),
    );
    expect(meter).toMatch(/上下文/);
    expect(await page.locator('#tokens').isVisible()).toBe(true);
  });
});

test.describe('conversations that outlive the page', () => {
  test.beforeEach(async ({ page }) => {
    await freshApp(page);
  });

  test('comes back to the conversation it was left in', async ({ page }) => {
    // A reload landing on a blank page with the last conversation a click away is not the
    // same as landing back in it.
    await send(page, '记住这句话');
    await page.reload({ waitUntil: 'load' });
    await page.waitForFunction(() => customElements.get('r-conversation') !== undefined);
    await expect.poll(async () => (await rows(page)).length, { timeout: 10_000 }).toBeGreaterThan(0);
    expect((await rows(page))[0].text).toContain('记住这句话');
  });

  test('starts a new conversation without disturbing the old one', async ({ page }) => {
    await send(page, '第一段对话');
    await page.locator('#new-session').click();
    await expect.poll(async () => (await rows(page)).length).toBe(0);

    await send(page, '第二段对话');
    const listed = await page.locator('.session-title').allTextContents();
    expect(listed).toEqual(['第二段对话', '第一段对话']);

    // Going back must bring the whole transcript with it, not just the title.
    await page.locator('.session', { hasText: '第一段对话' }).click();
    await expect.poll(async () => (await rows(page))[0]?.text ?? '').toContain('第一段对话');
  });
});
