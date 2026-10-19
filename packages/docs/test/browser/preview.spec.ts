import { test, expect, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const pdf = await readFile(new URL('./fixtures/two-pages.pdf', import.meta.url));
const longPdf = await readFile(new URL('./fixtures/thirty-pages.pdf', import.meta.url));

async function open(page: Page) {
  await page.goto('/src/ranui/preview/', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => customElements.get('r-preview'));
  await page.evaluate(() => {
    const preview = document.querySelector('r-preview')!;
    (window as any).previewEvents = [];
    preview.addEventListener('load', () => (window as any).previewEvents.push('load'));
    preview.addEventListener('error', () => (window as any).previewEvents.push('error'));
  });
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    // Keep background site warmup out of foreground compatibility measurements.
    Object.defineProperty(navigator, 'connection', {
      value: Object.assign(new EventTarget(), { saveData: true }),
      configurable: true,
    });
    const active = new Set<Worker>();
    const NativeWorker = Worker;
    window.Worker = class extends NativeWorker {
      constructor(url: string | URL, options?: WorkerOptions) {
        super(url, options);
        active.add(this);
      }
      terminate() {
        active.delete(this);
        super.terminate();
      }
    };
    (window as any).previewWorkers = () => active.size;
  });
  await page.route('**/preview-fixture.pdf', (route) => route.fulfill({ contentType: 'application/pdf', body: pdf }));
  await page.route('**/long-fixture.pdf', (route) => route.fulfill({ contentType: 'application/pdf', body: longPdf }));
});

test('ordinary documentation pages do not fetch preview or PDF resources', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/src/ranui/button/', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => customElements.get('r-button'));
  expect(await page.evaluate(() => Boolean(customElements.get('r-preview')))).toBe(false);
  expect(requests.filter((url) => /preview-0\.3\.0|\/pdf-|\/pdfjs\//.test(url))).toEqual([]);
});

test('built PDF preview paints both pages and uses deployed local font/cMap/WASM assets', async ({ page }) => {
  const fontResponses: number[] = [];
  const failures: string[] = [];
  page.on('response', (response) => {
    if (response.url().includes('/standard_fonts/')) fontResponses.push(response.status());
    if (response.url().includes('/pdfjs/') && response.status() >= 400) failures.push(response.url());
  });
  await open(page);
  await page.evaluate(() => document.querySelector('r-preview')!.setAttribute('src', '/preview-fixture.pdf'));
  await expect.poll(() => page.evaluate(() => (window as any).previewEvents)).toEqual(['load']);
  await expect(page.locator('canvas')).toHaveCount(2);
  const pixels = await page
    .locator('canvas')
    .evaluateAll((canvases: HTMLCanvasElement[]) =>
      canvases.map((canvas) =>
        Array.from(canvas.getContext('2d')!.getImageData(canvas.width / 2, canvas.height / 2, 1, 1).data),
      ),
    );
  expect(pixels).toEqual([
    [255, 0, 0, 255],
    [0, 0, 255, 255],
  ]);
  expect(failures).toEqual([]);
  expect(fontResponses.length).toBeGreaterThan(0);
  expect(fontResponses.every((status) => status === 200)).toBe(true);
  for (const file of [
    'cmaps/Adobe-Japan1-UCS2.bcmap',
    'wasm/openjpeg.wasm',
    'standard_fonts/LiberationSans-Regular.ttf',
  ]) {
    const response = await page.request.get('/assets/preview-0.3.0/pdfjs/' + file);
    expect(response.status()).toBe(200);
    expect((await response.body()).length).toBeGreaterThan(100);
    if (file.endsWith('.wasm')) expect(Array.from((await response.body()).subarray(0, 4))).toEqual([0, 97, 115, 109]);
  }
  expect(await page.evaluate(() => (window as any).previewWorkers())).toBe(0);
});

test('virtual PDF mode loads the first viewport, recycles pages and releases its worker on close', async ({ page }) => {
  await open(page);
  await page.evaluate(() => {
    const preview = document.querySelector('r-preview')!;
    preview.pdfMode = 'virtual';
    preview.src = '/long-fixture.pdf';
  });
  await expect.poll(() => page.evaluate(() => (window as any).previewEvents)).toEqual(['load']);
  await expect(page.locator('[data-pdf-page]')).toHaveCount(30);
  expect(await page.locator('canvas').count()).toBeLessThanOrEqual(6);
  await expect.poll(() => page.evaluate(() => (window as any).previewWorkers())).toBe(1);
  await page.locator('.r-preview-context-pdf').evaluate((element) => {
    element.scrollTop = element.scrollHeight;
  });
  await expect
    .poll(() =>
      page.locator('[data-pdf-page="30"] canvas').evaluateAll((canvases: HTMLCanvasElement[]) => {
        const canvas = canvases[0];
        return canvas
          ? Array.from(canvas.getContext('2d')!.getImageData(canvas.width / 2, canvas.height / 2, 1, 1).data)
          : [];
      }),
    )
    .toEqual([0, 0, 255, 255]);
  await expect(page.locator('[data-pdf-page="1"] canvas')).toHaveCount(0);
  await page.getByRole('button', { name: 'Close preview' }).click();
  await expect.poll(() => page.evaluate(() => (window as any).previewWorkers())).toBe(0);
  await expect(page.locator('canvas')).toHaveCount(0);
});

test('the documented file chooser opens PDFs, revokes replaced URLs and supports reopening', async ({ page }) => {
  await open(page);
  let previous = '';
  for (const name of ['first.pdf', 'second.pdf']) {
    const [chooser] = await Promise.all([
      page.waitForEvent('filechooser', { timeout: 5000 }),
      page.locator('[data-preview-upload="preview-demo"]').click({ timeout: 3000 }),
    ]);
    await chooser.setFiles({ name, mimeType: 'application/pdf', buffer: pdf });
    await expect(page.locator('canvas')).toHaveCount(2);
    if (previous)
      expect(
        await page.evaluate(async (url) => {
          try {
            await fetch(url);
            return false;
          } catch {
            return true;
          }
        }, previous),
      ).toBe(true);
    previous = (await page.locator('#preview-demo').getAttribute('src')) ?? '';
    await page.getByRole('button', { name: 'Close preview' }).click();
    expect(await page.evaluate(async (url) => (await fetch(url)).ok, previous)).toBe(true);
  }
  await page.evaluate(() => document.querySelector('r-preview')!.showPreview());
  await expect(page.locator('canvas')).toHaveCount(2);
  await page.evaluate(() => document.querySelector('r-preview')!.removeAttribute('src'));
  await expect
    .poll(() =>
      page.evaluate(async (url) => {
        try {
          await fetch(url);
          return false;
        } catch {
          return true;
        }
      }, previous),
    )
    .toBe(true);
});

test('Office messages preserve the iframe and edits across readonly and close-control changes', async ({ page }) => {
  await page.route('**/office-fixture.html', (route) =>
    route.fulfill({
      contentType: 'text/html',
      body: `<!doctype html><input aria-label="Document text"><script>
    let readonly = false; let opens = 0;
    addEventListener('message', async (event) => {
      const {id,type,payload} = event.data || {}; let reply;
      if(type==='document:get-state') reply = ['document:state',{readonly,hasDocument:opens>0}];
      if(type==='document:open-file') { opens++; readonly=payload.readonly; document.querySelector('input').value=await payload.file.text(); reply=['document:opened',{readonly}]; }
      if(type==='document:set-readonly') { readonly=payload.readonly; document.querySelector('input').readOnly=readonly; reply=['document:readonly-changed',{readonly}]; }
      if(reply) event.source.postMessage({id,type:reply[0],payload:reply[1]},event.origin);
    });
  </script>`,
    }),
  );
  await page.route('**/sample.docx', (route) =>
    route.fulfill({
      contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      body: 'Original Office file',
    }),
  );
  await open(page);
  await page.evaluate(() => {
    const preview = document.querySelector('r-preview')!;
    preview.baseUrl = location.origin + '/office-fixture.html';
    preview.src = '/sample.docx';
  });
  const input = page.frameLocator('iframe').getByRole('textbox');
  await expect(input).toHaveValue('Original Office file');
  await input.fill('Unsaved edit');
  await page.evaluate(() => {
    (window as any).originalFrame = document.querySelector('iframe');
    const preview = document.querySelector('r-preview')!;
    preview.closeable = 'false';
    preview.readonly = true;
  });
  await expect(input).toHaveAttribute('readonly', '');
  await expect(input).toHaveValue('Unsaved edit');
  await page.evaluate(() => {
    const preview = document.querySelector('r-preview')!;
    preview.closeable = 'true';
    preview.readonly = false;
  });
  await expect(input).not.toHaveAttribute('readonly');
  expect(await page.evaluate(() => document.querySelector('iframe') === (window as any).originalFrame)).toBe(true);
  expect(await page.evaluate(() => (window as any).previewEvents)).toEqual(['load']);
});
