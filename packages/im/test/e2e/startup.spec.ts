import { expect, test } from '@playwright/test';
import { rows, send } from './helpers';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const open = IDBFactory.prototype.open;
    const pending: (() => void)[] = [];
    Object.assign(window, { releaseSessionStore: () => pending.splice(0).forEach((resume) => resume()) });
    IDBFactory.prototype.open = function (...args: Parameters<typeof open>) {
      const request = open.apply(this, args);
      if (args[0] === 'ran-im') {
        request.addEventListener(
          'success',
          (event) => {
            event.stopImmediatePropagation();
            pending.push(() => request.dispatchEvent(new Event('success')));
            document.documentElement.setAttribute('data-test-store-pending', '');
          },
          { once: true },
        );
      }
      return request;
    };
  });
  await page.goto('/', { waitUntil: 'load' });
  await expect(page.locator('html')).toHaveAttribute('data-test-store-pending', '');
});

for (const action of ['send', 'new-session']) {
  test(`early ${action} waits for the session store to open`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    if (action === 'new-session') await page.locator('#new-session').click();
    else
      await page.evaluate(() => {
        (document.querySelector('#question') as HTMLElement & { value: string }).value = '现在几点';
        (document.querySelector('#composer') as HTMLFormElement).requestSubmit();
      });
    await page.evaluate(() => (window as unknown as { releaseSessionStore(): void }).releaseSessionStore());
    expect(errors).toEqual([]);
    if (action === 'new-session') await send(page, '现在几点');
    await expect
      .poll(async () => (await rows(page)).map((row) => row.kind), { timeout: 20_000 })
      .toEqual(['turn', 'turn', 'tool', 'turn']);
    await expect(page.locator('#stop')).toHaveAttribute('disabled', '');
    expect((await rows(page))[0].text).toContain('现在几点');
    expect(errors).toEqual([]);
  });
}

test('an early send owns only its submitted attachments', async ({ page }) => {
  const png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aXZkAAAAASUVORK5CYII=';
  const submitted = page.waitForRequest(
    (request) => request.url().endsWith('/api/im/dialog') && request.method() === 'POST',
  );
  await page.evaluate((png) => {
    const attachments = document.querySelector('#attachments') as HTMLElement & {
      add(files: File[]): { id: string }[];
      detach(id: string): boolean;
    };
    const data = Uint8Array.from(atob(png), (character) => character.charCodeAt(0));
    const [original] = attachments.add([new File([data], 'submitted.png', { type: 'image/png' })]);
    (document.querySelector('#question') as HTMLElement & { value: string }).value = '现在几点';
    (document.querySelector('#composer') as HTMLFormElement).requestSubmit();
    attachments.detach(original.id);
    attachments.add([new File(['later draft'], 'draft.txt', { type: 'text/plain' })]);
  }, png);
  await page.evaluate(() => (window as unknown as { releaseSessionStore(): void }).releaseSessionStore());
  const request = await submitted;
  expect(request.postDataJSON().messages[0].content).toEqual([
    { type: 'image_url', image_url: { url: `data:image/png;base64,${png}` } },
    { type: 'text', text: '现在几点' },
  ]);
  expect(
    await page
      .locator('#attachments')
      .evaluate((node) =>
        (node as HTMLElement & { attachments: { name: string }[] }).attachments.map((attachment) => attachment.name),
      ),
  ).toEqual(['draft.txt']);
  await expect
    .poll(async () => (await rows(page)).map((row) => row.kind), { timeout: 20_000 })
    .toEqual(['turn', 'turn', 'tool', 'turn']);
  await expect(page.locator('#stop')).toHaveAttribute('disabled', '');
});
