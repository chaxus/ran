import { expect, test } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { insideShadow } from './helpers';

// Load the real source component/theme, leaving demo streaming and live media out of the
// isolated fixture. In particular, keep shiki cold for the delayed-highlight case.
test.beforeEach(async ({ page }) => {
  await page.route(
    (url) => url.origin === new URL(DEV_SERVER).origin && url.pathname === '/',
    async (route) => {
      const response = await route.fetch();
      const html = (await response.text())
        .replace(/<r-player\b[^>]*>/gi, (tag) => tag.replace(/\s+src=(["']).*?\1/gi, ''))
        .replace(/<r-markdown\b[^>]*>/gi, (tag) => tag.replace(/\s+highlight\b/gi, ''));
      await route.fulfill({ response, body: html });
    },
  );
  await page.goto(DEV_SERVER);
  await page.waitForFunction(() => !!customElements.get('r-markdown'));
  await page.evaluate(async () => {
    await document.fonts.ready;
    document.body.replaceChildren();
    document.body.style.cssText = 'margin:0;padding:24px';
  });
});

async function mount(page: import('@playwright/test').Page, source: string, attributes: Record<string, string> = {}) {
  await page.evaluate(
    async ({ source, attributes }) => {
      const element = document.createElement('r-markdown') as HTMLElement & {
        content: string;
        _pending: Promise<void>;
      };
      element.id = 'reader';
      element.style.width = '360px';
      for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
      document.body.append(element);
      element.content = source;
      await element._pending;
    },
    { source, attributes },
  );
}

async function clickCopy(page: import('@playwright/test').Page, index = 0) {
  const points = await insideShadow(page, '#reader', (root) =>
    [...root.querySelectorAll('[data-md-action="copy"]')].map((button) => {
      const box = button.getBoundingClientRect();
      return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
    }),
  );
  await page.mouse.click(points[index].x, points[index].y);
}

// Range geometry identifies glyphs; only the native pointer creates the selection.
async function selectCode(page: import('@playwright/test').Page, start: number, end: number, scroll = 0) {
  const points = await page.evaluate(
    ({ start, end, scroll }) => {
      const root = (document.querySelector('#reader') as HTMLElement & { _shadowDom: ShadowRoot })._shadowDom;
      const pre = root.querySelector('pre')!;
      const code = pre.querySelector('code')!;
      const text = code.querySelector('.line')!.firstChild!;
      pre.scrollLeft = scroll;
      const range = document.createRange();
      range.setStart(text, start);
      range.setEnd(text, end);
      const rect = range.getBoundingClientRect();
      (window as unknown as { markdownNodes: Node[] }).markdownNodes = [pre, code, text];
      return { x1: rect.left + 0.1, x2: rect.right + 0.1, y: rect.top + rect.height / 2 };
    },
    { start, end, scroll },
  );
  await page.mouse.move(points.x1, points.y);
  await page.mouse.down();
  await page.mouse.move(points.x2, points.y, { steps: 10 });
  await page.mouse.up();
  return insideShadow(page, '#reader', (root) => ({
    selection: (
      (root as ShadowRoot & { getSelection?(): Selection }).getSelection?.() ?? document.getSelection()!
    ).toString(),
    scroll: root.querySelector('pre')!.scrollLeft,
  }));
}

test('raw copy, concurrent feedback and local rejection use the current code source', async ({ page }) => {
  await page.evaluate(() => {
    const state = window as unknown as { clipboardValues: string[]; denyCopy: boolean };
    state.clipboardValues = [];
    state.denyCopy = false;
    // Transport fixture only: actual component buttons dispatch the writes.
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText(text: string) {
          state.clipboardValues.push(text);
          return state.denyCopy ? Promise.reject(new Error('clipboard denied')) : Promise.resolve();
        },
      },
    });
  });
  await mount(page, '```text\n\tfirst\n\nlast\n```\n\n```text\nsecond\n```', {
    copy: '',
    'label-copy-error': 'Copy failed. Try again.',
  });
  await clickCopy(page);
  await clickCopy(page, 1);
  expect(await page.evaluate(() => (window as unknown as { clipboardValues: string[] }).clipboardValues)).toEqual([
    '\tfirst\n\nlast\n',
    'second\n',
  ]);
  await expect
    .poll(() =>
      insideShadow(page, '#reader', (root) =>
        [...root.querySelectorAll('[data-md-action="copy"] r-icon')].map((icon) => icon.getAttribute('name')),
      ),
    )
    .toEqual(['copy', 'copy']);
  await page.evaluate(() => {
    (window as unknown as { denyCopy: boolean }).denyCopy = true;
  });
  await clickCopy(page);
  await expect
    .poll(() => insideShadow(page, '#reader', (root) => root.querySelector('[part="copy-status"]')?.textContent))
    .toBe('Copy failed. Try again.');
  await page.evaluate(() => {
    (window as unknown as { denyCopy: boolean }).denyCopy = false;
  });
  await clickCopy(page);
  await expect
    .poll(() => insideShadow(page, '#reader', (root) => root.querySelector('[part="copy-status"]')?.textContent))
    .toBe('');
});

test('stream growth preserves native selection, PRE/CODE identity and horizontal reading position', async ({
  page,
}) => {
  await mount(page, '```text\n' + 'selectable long line '.repeat(40) + '\nsecond line');
  const before = await selectCode(page, 30, 40, 180);
  expect(before.selection).not.toBe('');
  expect(before.scroll).toBeGreaterThan(0);
  await page.locator('#reader').evaluate(async (node) => {
    const element = node as HTMLElement & { content: string; _pending: Promise<void> };
    element.content += '\nthird streamed line';
    await element._pending;
  });
  const after = await insideShadow(page, '#reader', (root) => {
    const [pre, code, text] = (window as unknown as { markdownNodes: Node[] }).markdownNodes;
    const selection =
      (root as ShadowRoot & { getSelection?(): Selection }).getSelection?.() ?? document.getSelection()!;
    return {
      same: root.querySelector('pre') === pre && pre.firstChild === code && code.firstChild?.firstChild === text,
      scroll: (pre as HTMLElement).scrollLeft,
      selection: selection.toString(),
    };
  });
  expect(after).toEqual({ same: true, scroll: before.scroll, selection: before.selection });
});

test('table row growth keeps its viewport and existing cells while exposing keyboard scroll', async ({ page }) => {
  const columns = Array.from({ length: 12 }, (_, i) => 'Quarter ' + (i + 1));
  await mount(
    page,
    '| ' +
      columns.join(' | ') +
      ' |\n| ' +
      columns.map(() => '---:').join(' | ') +
      ' |\n| ' +
      columns
        .map((_, i) => (i === 0 ? '[Example](https://example.test)' : i === 1 ? '$x^2$' : String(1000 + i)))
        .join(' | ') +
      ' |',
    { 'inline-math': '', 'link-target': '_blank' },
  );
  const before = await insideShadow(page, '#reader', (root) => {
    const wrap = root.querySelector<HTMLElement>('[part="table"]')!;
    wrap.scrollLeft = 100;
    (window as unknown as { markdownTable: Node[] }).markdownTable = [
      wrap,
      wrap.firstChild!,
      wrap.querySelector('td')!,
      wrap.querySelector('r-math')!,
    ];
    wrap.focus();
    return { scroll: wrap.scrollLeft, focus: root.activeElement === wrap };
  });
  expect(before.focus).toBe(true);
  expect(before.scroll).toBeGreaterThan(0);
  await page.locator('#reader').evaluate(async (node) => {
    const element = node as HTMLElement & { content: string; _pending: Promise<void> };
    element.content += '\n| [New](https://new.example.test) | $y^2$ |';
    await element._pending;
  });
  const after = await insideShadow(page, '#reader', (root) => {
    const [wrap, table, cell] = (window as unknown as { markdownTable: Node[] }).markdownTable;
    return {
      same:
        root.querySelector('[part="table"]') === wrap &&
        wrap.firstChild === table &&
        (wrap as Element).querySelector('td') === cell,
      scroll: (wrap as HTMLElement).scrollLeft,
      focus: root.activeElement === wrap,
    };
  });
  expect(after).toEqual({ same: true, scroll: before.scroll, focus: true });
  expect(
    await insideShadow(page, '#reader', (root) => {
      const math = (window as unknown as { markdownTable: Node[] }).markdownTable[3];
      return (
        root.querySelector('r-math') === math &&
        root.querySelectorAll('r-math').length === 2 &&
        !root.querySelector('[data-ran-math]') &&
        [...root.querySelectorAll('a')].every((link) => link.target === '_blank' && link.rel === 'noopener noreferrer')
      );
    }),
  ).toBe(true);
});

test('late real highlighting waits for native selection release and keeps its viewport', async ({ page }) => {
  let release!: () => void;
  const loading = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route(
    (url) => url.pathname.includes('shiki'),
    async (route) => {
      await loading;
      await route.continue();
    },
  );
  await mount(page, '```javascript\nconst selected = 1;\n```', { highlight: '' });
  const before = await selectCode(page, 0, 5);
  expect(before.selection).toBe('const');
  release();
  await page.waitForLoadState('networkidle');
  const held = await insideShadow(page, '#reader', (root) => {
    const [pre, code, text] = (window as unknown as { markdownNodes: Node[] }).markdownNodes;
    const selection =
      (root as ShadowRoot & { getSelection?(): Selection }).getSelection?.() ?? document.getSelection()!;
    return {
      same: root.querySelector('pre') === pre && pre.firstChild === code && code.firstChild?.firstChild === text,
      highlighted: (pre as Element).classList.contains('shiki'),
      selection: selection.toString(),
    };
  });
  expect(held).toEqual({ same: true, highlighted: false, selection: 'const' });
  await page.mouse.click(700, 100);
  await expect
    .poll(() => insideShadow(page, '#reader', (root) => root.querySelector('pre')?.classList.contains('shiki')))
    .toBe(true);
  expect(
    await insideShadow(
      page,
      '#reader',
      (root) => root.querySelector('pre') === (window as unknown as { markdownNodes: Node[] }).markdownNodes[0],
    ),
  ).toBe(true);
});

test('slow pending Copy retains native focus and does not dispatch duplicate clipboard writes', async ({ page }) => {
  await page.evaluate(() => {
    const state = window as unknown as { copyWrites: number; releaseCopy(): void };
    state.copyWrites = 0;
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText() {
          state.copyWrites++;
          return new Promise<void>((resolve) => {
            state.releaseCopy = resolve;
          });
        },
      },
    });
  });
  await mount(page, '```text\nfocused copy\n```', { copy: '' });
  // Safari's platform preference can skip buttons during Tab navigation. Focus the
  // actual native target, then exercise its real keyboard activation and pending state.
  await insideShadow(page, '#reader', (root) => {
    (root.querySelector('[data-md-action="copy"]') as HTMLElement).focus();
  });
  await page.keyboard.press('Enter');
  expect(
    await insideShadow(page, '#reader', (root) => root.activeElement === root.querySelector('[data-md-action="copy"]')),
  ).toBe(true);
  await page.keyboard.press('Enter');
  expect(await page.evaluate(() => (window as unknown as { copyWrites: number }).copyWrites)).toBe(1);
  await page.evaluate(async () => {
    (window as unknown as { releaseCopy(): void }).releaseCopy();
    await Promise.resolve();
  });
  expect(
    await insideShadow(page, '#reader', (root) => root.activeElement === root.querySelector('[data-md-action="copy"]')),
  ).toBe(true);
});
