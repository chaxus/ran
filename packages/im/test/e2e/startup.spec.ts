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

test('an early submission dispatches once and retains a later draft', async ({ page }) => {
  const requests: { messages: { role: string; content: unknown }[] }[] = [];
  page.on('request', (request) => {
    if (request.url().endsWith('/api/im/dialog') && request.method() === 'POST') requests.push(request.postDataJSON());
  });
  const disabledWhileWaiting = await page.evaluate(() => {
    const question = document.querySelector('#question') as HTMLElement & { value: string };
    const composer = document.querySelector('#composer') as HTMLFormElement;
    question.value = '现在几点';
    composer.requestSubmit();
    const disabled = document.querySelector('#send')!.hasAttribute('disabled');
    question.value = 'next draft';
    composer.requestSubmit();
    return disabled;
  });
  await page.evaluate(() => (window as unknown as { releaseSessionStore(): void }).releaseSessionStore());
  await expect.poll(() => requests[0]?.messages).toEqual([{ role: 'user', content: '现在几点' }]);
  await expect(page.locator('#send')).not.toHaveAttribute('disabled');
  expect(requests).toHaveLength(2);
  expect(disabledWhileWaiting).toBe(true);
  expect(await page.locator('#question').evaluate((node) => (node as HTMLElement & { value: string }).value)).toBe(
    'next draft',
  );
  expect((await rows(page)).map((row) => row.kind)).toEqual(['turn', 'turn', 'tool', 'turn']);
});

for (const fail of [false, true]) {
  test(`file preparation ${fail ? 'failure releases submission ownership for retry' : 'rejects a duplicate submission without losing its draft'}`, async ({
    page,
  }) => {
    const requests: { messages: { role: string; content: unknown }[] }[] = [];
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('request', (request) => {
      if (request.url().endsWith('/api/im/dialog') && request.method() === 'POST')
        requests.push(request.postDataJSON());
    });
    await page.evaluate(() => {
      const read = FileReader.prototype.readAsDataURL;
      const pending: ((fail: boolean) => void)[] = [];
      Object.assign(window, {
        releaseFileRead: (fail: boolean) => pending.splice(0).forEach((resume) => resume(fail)),
      });
      FileReader.prototype.readAsDataURL = function (file) {
        pending.push((fail) => (fail ? this.dispatchEvent(new Event('error')) : read.call(this, file)));
        document.documentElement.setAttribute('data-test-file-pending', '');
      };
      (window as unknown as { releaseSessionStore(): void }).releaseSessionStore();
      const attachments = document.querySelector('#attachments') as HTMLElement & { add(files: File[]): unknown };
      const data = Uint8Array.from(
        atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aXZkAAAAASUVORK5CYII='),
        (character) => character.charCodeAt(0),
      );
      attachments.add([new File([data], 'submitted.png', { type: 'image/png' })]);
      (document.querySelector('#question') as HTMLElement & { value: string }).value = '现在几点';
      (document.querySelector('#composer') as HTMLFormElement).requestSubmit();
    });
    await expect(page.locator('html')).toHaveAttribute('data-test-file-pending', '');
    if (!fail) {
      await page.evaluate(() => {
        (document.querySelector('#question') as HTMLElement & { value: string }).value = 'next draft';
        (document.querySelector('#composer') as HTMLFormElement).requestSubmit();
      });
    }
    if (!fail) await expect(page.locator('#send')).toHaveAttribute('disabled', '');
    await page.evaluate(
      (fail) => (window as unknown as { releaseFileRead(fail: boolean): void }).releaseFileRead(fail),
      fail,
    );
    await expect(page.locator('#send')).not.toHaveAttribute('disabled');
    if (fail) {
      expect(requests).toHaveLength(0);
      expect(await page.locator('#question').evaluate((node) => (node as HTMLElement & { value: string }).value)).toBe(
        '现在几点',
      );
      await page.locator('#attachments').evaluate((node) => {
        const attachments = node as HTMLElement & { attachments: { id: string }[]; detach(id: string): boolean };
        for (const attachment of attachments.attachments) attachments.detach(attachment.id);
      });
      await send(page, '现在几点');
      await expect(page.locator('#send')).not.toHaveAttribute('disabled');
    } else {
      expect(await page.locator('#question').evaluate((node) => (node as HTMLElement & { value: string }).value)).toBe(
        'next draft',
      );
      expect(requests[0].messages).toHaveLength(1);
    }
    expect(requests).toHaveLength(2);
    expect(errors).toEqual([]);
    expect((await rows(page)).map((row) => row.kind)).toEqual(['turn', 'turn', 'tool', 'turn']);
  });
}
