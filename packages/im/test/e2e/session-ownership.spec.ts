import { expect, test } from '@playwright/test';
import { freshApp, rows, send } from './helpers';

const answer = 'data: {"choices":[{"index":0,"delta":{"content":"owned answer"}}]}\n\ndata: [DONE]\n\n';

for (const action of ['new', 'open', 'delete'] as const) {
  for (const fail of [false, true]) {
    test(`${action} session revokes a pending file submission (${fail ? 'failure' : 'success'})`, async ({ page }) => {
      const requests: unknown[] = [];
      await page.route('**/api/im/dialog', async (route) => {
        requests.push(route.request().postDataJSON());
        await route.fulfill({ contentType: 'text/event-stream', body: answer });
      });
      await freshApp(page);
      await send(page, 'stored conversation');
      await expect(page.locator('#send')).not.toHaveAttribute('disabled');
      if (action === 'open') {
        await page.locator('#new-session').click();
        await expect.poll(async () => (await rows(page)).length).toBe(0);
      }
      requests.length = 0;
      await page.evaluate(() => {
        const read = FileReader.prototype.readAsDataURL;
        let release!: (fail: boolean) => void;
        Object.assign(window, { releaseFileRead: (fail: boolean) => release(fail) });
        FileReader.prototype.readAsDataURL = function (file) {
          release = (fail) => {
            if (fail) {
              this.dispatchEvent(new Event('error'));
              document.documentElement.setAttribute('data-test-file-finished', '');
            } else {
              this.addEventListener('loadend', () =>
                document.documentElement.setAttribute('data-test-file-finished', ''),
              );
              read.call(this, file);
            }
          };
          document.documentElement.setAttribute('data-test-file-pending', '');
        };
        const attachments = document.querySelector('#attachments') as HTMLElement & {
          add(files: File[]): { id: string }[];
          detach(id: string): boolean;
        };
        const bytes = Uint8Array.from(
          atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aXZkAAAAASUVORK5CYII='),
          (character) => character.charCodeAt(0),
        );
        const [file] = attachments.add([new File([bytes], 'old.png', { type: 'image/png' })]);
        (document.querySelector('#question') as HTMLElement & { value: string }).value = 'cancelled old prompt';
        (document.querySelector('#composer') as HTMLFormElement).requestSubmit();
        attachments.detach(file.id);
      });
      await expect(page.locator('html')).toHaveAttribute('data-test-file-pending', '');
      if (action === 'new') await page.locator('#new-session').click();
      if (action === 'open') await page.locator('.session-title', { hasText: 'stored conversation' }).click();
      if (action === 'delete') {
        await page.locator('.session').hover();
        await page.locator('.session-delete').click();
      }
      if (action !== 'open') await expect.poll(async () => (await rows(page)).length).toBe(0);
      await expect(page.locator('#send')).not.toHaveAttribute('disabled');
      await send(page, 'new owner prompt');
      const expected = await rows(page);
      await page.evaluate((fail) => {
        (document.querySelector('#question') as HTMLElement & { value: string }).value = 'retained draft';
        (window as unknown as { releaseFileRead(fail: boolean): void }).releaseFileRead(fail);
      }, fail);
      await expect(page.locator('html')).toHaveAttribute('data-test-file-finished', '');
      expect(await page.locator('#question').evaluate((node) => (node as HTMLElement & { value: string }).value)).toBe(
        'retained draft',
      );
      expect(requests).toHaveLength(1);
      // The next exchange must still belong to the selected session.
      await send(page, 'next owner prompt');
      expect(requests).toHaveLength(2);
      expect(JSON.stringify(requests)).not.toContain('cancelled old prompt');
      expect((await rows(page)).slice(0, expected.length)).toEqual(expected);
      await page.reload({ waitUntil: 'load' });
      await expect.poll(async () => (await rows(page)).at(-2)?.text).toContain('next owner prompt');
      expect(JSON.stringify(await rows(page))).not.toContain('cancelled old prompt');
    });
  }
}

test('aborted stream callbacks cannot populate a new session', async ({ page }) => {
  await freshApp(page);
  let release!: () => void;
  const held = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route('**/api/im/dialog', async (route) => {
    await held;
    await route.fulfill({ contentType: 'text/event-stream', body: answer });
  });
  const requested = page.waitForRequest('**/api/im/dialog');
  await page.evaluate(() => {
    (document.querySelector('#question') as HTMLElement & { value: string }).value = 'old stream';
    (document.querySelector('#composer') as HTMLFormElement).requestSubmit();
  });
  await requested;
  await page.locator('#new-session').click();
  release();
  await expect(page.locator('#send')).not.toHaveAttribute('disabled');
  await send(page, 'new stream');
  expect((await rows(page)).map((row) => row.text)).toEqual(['new stream', 'owned answer']);
});

for (const action of ['delete-other', 'delete-target', 'return-current'] as const) {
  test(`pending navigation preserves latest intent: ${action}`, async ({ page }) => {
    const requests: { messages: { content: unknown }[] }[] = [];
    await page.route('**/api/im/dialog', async (route) => {
      requests.push(route.request().postDataJSON());
      await route.fulfill({ contentType: 'text/event-stream', body: answer });
    });
    await freshApp(page);
    for (const title of ['third session', 'target session', 'current session']) {
      await page.locator('#new-session').click();
      await expect.poll(async () => (await rows(page)).length).toBe(0);
      await send(page, title);
      await expect(page.locator('#send')).not.toHaveAttribute('disabled');
    }
    requests.length = 0;
    await page.evaluate(() => {
      const get = IDBObjectStore.prototype.get;
      IDBObjectStore.prototype.get = function (key) {
        const request = get.call(this, key);
        if (this.name === 'sessions')
          request.addEventListener(
            'success',
            (event) => {
              event.stopImmediatePropagation();
              Object.assign(window, { releaseSessionRead: () => request.dispatchEvent(new Event('success')) });
              document.documentElement.setAttribute('data-test-navigation-pending', '');
            },
            { once: true },
          );
        return request;
      };
    });
    await page.locator('.session-title', { hasText: 'target session' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-test-navigation-pending', '');
    if (action === 'return-current') await page.locator('.session-title', { hasText: 'current session' }).click();
    else {
      const row = page.locator('.session', { hasText: action === 'delete-other' ? 'third session' : 'target session' });
      await row.hover();
      await row.locator('.session-delete').click();
      await expect(row).toHaveCount(0);
    }
    await page.evaluate(() => {
      (document.querySelector('#question') as HTMLElement & { value: string }).value = 'navigation owned prompt';
      (document.querySelector('#composer') as HTMLFormElement).requestSubmit();
    });
    await page.evaluate(() => (window as unknown as { releaseSessionRead(): void }).releaseSessionRead());
    await expect(page.locator('#send')).not.toHaveAttribute('disabled');
    await expect.poll(() => requests.length).toBe(1);
    expect(requests[0].messages[0].content).toBe(action === 'delete-other' ? 'target session' : 'current session');
    expect((await rows(page))[0].text).toBe(action === 'delete-other' ? 'target session' : 'current session');
    if (action === 'delete-target')
      await expect(page.locator('.session-title', { hasText: 'target session' })).toHaveCount(0);
  });
}

for (const operation of ['put', 'delete'] as const) {
  test(`session changes respect pending ${operation} completion`, async ({ page }) => {
    const requests: { messages: { content: unknown }[] }[] = [];
    await page.route('**/api/im/dialog', async (route) => {
      requests.push(route.request().postDataJSON());
      await route.fulfill({ contentType: 'text/event-stream', body: answer });
    });
    await freshApp(page);
    await send(page, 'original session');
    await expect(page.locator('#send')).not.toHaveAttribute('disabled');
    requests.length = 0;
    await page.evaluate((operation) => {
      const original = IDBObjectStore.prototype[operation];
      Object.defineProperty(IDBObjectStore.prototype, operation, {
        configurable: true,
        writable: true,
        value: function (this: IDBObjectStore, ...args: unknown[]) {
          const request = Reflect.apply(original, this, args) as IDBRequest;
          if (this.name === 'sessions') {
            Object.defineProperty(IDBObjectStore.prototype, operation, {
              configurable: true,
              writable: true,
              value: original,
            });
            request.addEventListener(
              'success',
              (event) => {
                event.stopImmediatePropagation();
                Object.assign(window, { releaseWrite: () => request.dispatchEvent(new Event('success')) });
                document.documentElement.setAttribute('data-test-write-pending', '');
              },
              { once: true },
            );
          }
          return request;
        },
      });
    }, operation);
    if (operation === 'put') {
      await page.evaluate(() => {
        (document.querySelector('#question') as HTMLElement & { value: string }).value = 'old persisted prompt';
        (document.querySelector('#composer') as HTMLFormElement).requestSubmit();
      });
      await expect(page.locator('html')).toHaveAttribute('data-test-write-pending', '');
      await page.locator('#new-session').click();
    } else {
      await page.locator('.session').hover();
      await page.locator('.session-delete').click();
      await expect(page.locator('html')).toHaveAttribute('data-test-write-pending', '');
      await page.locator('.session-title', { hasText: 'original session' }).click();
    }
    await page.evaluate(() => {
      (document.querySelector('#question') as HTMLElement & { value: string }).value = 'current persisted prompt';
      (document.querySelector('#composer') as HTMLFormElement).requestSubmit();
    });
    await page.evaluate(() => (window as unknown as { releaseWrite(): void }).releaseWrite());
    await expect.poll(() => requests.length).toBe(1);
    await expect(page.locator('#send')).not.toHaveAttribute('disabled');
    expect(requests[0].messages).toEqual([{ role: 'user', content: 'current persisted prompt' }]);
    expect((await rows(page)).map((row) => row.text)).toEqual(['current persisted prompt', 'owned answer']);
  });
}

for (const fail of [false, true]) {
  test(`late ${fail ? 'failed' : 'completed'} preparation cannot unlock a newer submission`, async ({ page }) => {
    const requests: unknown[] = [];
    await page.route('**/api/im/dialog', async (route) => {
      requests.push(route.request().postDataJSON());
      await route.fulfill({ contentType: 'text/event-stream', body: answer });
    });
    await freshApp(page);
    await page.evaluate(() => {
      const read = FileReader.prototype.readAsDataURL;
      const pending: ((fail: boolean) => void)[] = [];
      Object.assign(window, { releaseRead: (index: number, fail: boolean) => pending[index](fail) });
      FileReader.prototype.readAsDataURL = function (file) {
        pending.push((fail) => {
          if (fail) {
            this.dispatchEvent(new Event('error'));
            document.documentElement.setAttribute('data-test-old-finished', '');
          } else {
            this.addEventListener('loadend', () => document.documentElement.setAttribute('data-test-old-finished', ''));
            read.call(this, file);
          }
        });
        document.documentElement.setAttribute('data-test-read-count', String(pending.length));
      };
    });
    for (const text of ['old preparation', 'new preparation']) {
      await page.evaluate((text) => {
        const attachments = document.querySelector('#attachments') as HTMLElement & {
          add(files: File[]): { id: string }[];
          detach(id: string): boolean;
        };
        const bytes = Uint8Array.from(
          atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aXZkAAAAASUVORK5CYII='),
          (character) => character.charCodeAt(0),
        );
        const [file] = attachments.add([new File([bytes], 'image.png', { type: 'image/png' })]);
        (document.querySelector('#question') as HTMLElement & { value: string }).value = text;
        (document.querySelector('#composer') as HTMLFormElement).requestSubmit();
        attachments.detach(file.id);
      }, text);
      await expect(page.locator('html')).toHaveAttribute(
        'data-test-read-count',
        text === 'old preparation' ? '1' : '2',
      );
      if (text === 'old preparation') await page.locator('#new-session').click();
    }
    await page.evaluate(
      (fail) => (window as unknown as { releaseRead(index: number, fail: boolean): void }).releaseRead(0, fail),
      fail,
    );
    await expect(page.locator('html')).toHaveAttribute('data-test-old-finished', '');
    await expect(page.locator('#send')).toHaveAttribute('disabled', '');
    await page.evaluate(() => {
      (document.querySelector('#question') as HTMLElement & { value: string }).value = 'retained draft';
      (document.querySelector('#composer') as HTMLFormElement).requestSubmit();
      (window as unknown as { releaseRead(index: number, fail: boolean): void }).releaseRead(1, false);
    });
    await expect.poll(() => requests.length).toBe(1);
    await expect(page.locator('#send')).not.toHaveAttribute('disabled');
    expect((await rows(page))[0].text).toBe('new preparation');
    expect(await page.locator('#question').evaluate((node) => (node as HTMLElement & { value: string }).value)).toBe(
      'retained draft',
    );
  });
}
